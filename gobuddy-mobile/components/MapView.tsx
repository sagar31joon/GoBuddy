import React, { useState, useEffect, useMemo, useRef } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    Image,
    Dimensions,
    Switch,
    Modal,
    ScrollView,
    Platform
} from 'react-native';
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import { Ionicons } from '@expo/vector-icons';
import * as Location from 'expo-location';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Post } from '../types';
import { SPORTS_LIST } from '../constants';
import SportDropdown from './SportDropdown';
import ChatWindow from './ChatWindow';

interface MapViewComponentProps {
    posts: Post[];
    onConnect?: (userName: string) => void;
}

const { width } = Dimensions.get('window');

const SPORT_ICONS: Record<string, string> = {
    'Badminton': '🏸',
    'Tennis': '🎾',
    'Cricket': '🏏',
    'Soccer': '⚽',
    'Gym': '💪',
    'Hiking': '🥾',
    'Boxing': '🥊',
    'Football': '🏈',
    'Running': '🏃',
    'Core': '🏋️',
    'Yoga': '🧘',
    'Cycling': '🚴',
};

const getSportIcon = (sport: string) => SPORT_ICONS[sport] || '🏅';

const SKILL_LEVELS = ['All', 'Beginner', 'Intermediate', 'Advanced', 'Pro'];
const GENDERS = ['All', 'Male', 'Female', 'Other'];
const AGE_RANGES = ['All', '18-25', '26-35', '36-45', '45+'];

const MapViewComponent: React.FC<MapViewComponentProps> = ({ posts }) => {
    const mapRef = useRef<MapView>(null);
    const insets = useSafeAreaInsets();

    // State
    const [selectedPin, setSelectedPin] = useState<string | null>(null);
    const [isAvailable, setIsAvailable] = useState(false);
    const [userLocation, setUserLocation] = useState<{ latitude: number; longitude: number } | null>(null);
    const [isFilterOpen, setIsFilterOpen] = useState(false);
    const [chatUser, setChatUser] = useState<any | null>(null);

    // Filters
    const [selectedSport, setSelectedSport] = useState<string>('All');
    const [selectedSkill, setSelectedSkill] = useState<string>('All');
    const [selectedGender, setSelectedGender] = useState<string>('All');
    const [selectedAge, setSelectedAge] = useState<string>('All');
    const [splitBillOnly, setSplitBillOnly] = useState(false);

    // Get user location
    useEffect(() => {
        (async () => {
            try {
                const { status } = await Location.requestForegroundPermissionsAsync();
                if (status !== 'granted') return;

                const location = await Location.getCurrentPositionAsync({});
                setUserLocation({
                    latitude: location.coords.latitude,
                    longitude: location.coords.longitude,
                });
            } catch (e) {
                console.log('Location error', e);
                setUserLocation({ latitude: 28.6139, longitude: 77.2090 });
            }
        })();
    }, []);

    // Helper: Check Age Range
    const checkAge = (age: number | undefined, range: string) => {
        if (!age) return false;
        if (range === 'All') return true;
        if (range === '18-25') return age >= 18 && age <= 25;
        if (range === '26-35') return age >= 26 && age <= 35;
        if (range === '36-45') return age >= 36 && age <= 45;
        if (range === '45+') return age > 45;
        return true;
    };

    const filteredPosts = useMemo(() => {
        return posts.filter(post => {
            // Only live location posts
            if (post.locationType !== 'live' || !post.coordinates) return false;

            if (selectedSport !== 'All' && post.sport !== selectedSport) return false;

            if (selectedSkill !== 'All' && post.skillLevel && post.skillLevel !== selectedSkill) return false;

            if (selectedGender !== 'All' && post.user.gender && post.user.gender !== selectedGender) return false;

            if (selectedAge !== 'All' && !checkAge(post.user.age, selectedAge)) return false;

            if (splitBillOnly && !post.splitBill) return false;

            return true;
        });
    }, [posts, selectedSport, selectedSkill, selectedGender, selectedAge, splitBillOnly]);

    const selectedPost = selectedPin ? filteredPosts.find(p => p.id === selectedPin) : null;



    return (
        <View style={styles.container}>
            {/* Map */}
            <MapView
                ref={mapRef}
                style={styles.map}
                initialRegion={{
                    latitude: 28.6139,
                    longitude: 77.2090,
                    latitudeDelta: 0.1,
                    longitudeDelta: 0.1,
                }}
                provider={Platform.OS === 'android' ? PROVIDER_GOOGLE : undefined}
                showsUserLocation={isAvailable}
                showsMyLocationButton={false}
                zoomEnabled={true}
                scrollEnabled={true}
                customMapStyle={[
                    {
                        "featureType": "poi",
                        "elementType": "labels.text",
                        "stylers": [{ "visibility": "off" }]
                    }
                ]}
                onPress={() => {
                    // Optional: Handle map press if needed, but avoiding conflict with markers
                    if (selectedPin) setSelectedPin(null);
                }}
            >
                {filteredPosts.map(post => {
                    const icon = getSportIcon(post.sport);
                    return (
                        <Marker
                            key={post.id}
                            coordinate={post.coordinates!}
                            onPress={(e) => {
                                e.stopPropagation();
                                setSelectedPin(post.id);
                            }}
                            tracksViewChanges={false} // Optimization
                        >
                            <View style={[styles.markerContainer, selectedPin === post.id && styles.markerActive]}>
                                <Text style={styles.markerIcon}>{icon}</Text>
                            </View>
                        </Marker>
                    );
                })}
            </MapView>

            {/* Top Bar: Availablity Toggle & Filter Btn */}
            <View style={[styles.topBar, { top: insets.top + 16 }]}>
                <View style={styles.availableToggle}>
                    <Text style={[styles.availText, isAvailable && styles.availTextOn]}>
                        {isAvailable ? 'Available Now' : 'Invisible'}
                    </Text>
                    <Switch
                        value={isAvailable}
                        onValueChange={setIsAvailable}
                        trackColor={{ false: '#D1D5DB', true: '#2563EB' }}
                        thumbColor="#fff"
                    />
                </View>

                <TouchableOpacity
                    style={styles.filterBtn}
                    onPress={() => setIsFilterOpen(true)}
                >
                    <Ionicons name="options" size={20} color="#111827" />
                </TouchableOpacity>
            </View>

            {/* Player Card Modal (Bottom Sheet) */}
            <Modal
                visible={!!selectedPost}
                transparent={true}
                animationType="slide"
                onRequestClose={() => setSelectedPin(null)}
            >
                <TouchableOpacity
                    style={styles.modalOverlay}
                    activeOpacity={1}
                    onPress={() => setSelectedPin(null)}
                >
                    <TouchableOpacity activeOpacity={1} style={styles.playerCard} onPress={() => { }}>
                        {selectedPost && (
                            <>
                                <View style={styles.handle} />
                                <View style={styles.pcHeader}>
                                    <Image source={{ uri: selectedPost.user.avatar }} style={styles.pcAvatar} />
                                    <View style={styles.pcInfo}>
                                        <Text style={styles.pcName}>{selectedPost.user.name}</Text>
                                        <Text style={styles.pcSub}>
                                            {selectedPost.user.age ? `${selectedPost.user.age} yrs • ` : ''}
                                            {selectedPost.user.gender}
                                        </Text>
                                    </View>
                                    <TouchableOpacity
                                        style={styles.pcChatBtn}
                                        onPress={() => {
                                            setSelectedPin(null);
                                            setChatUser({
                                                name: selectedPost.user.name,
                                                avatar: selectedPost.user.avatar,
                                                sport: selectedPost.sport
                                            });
                                        }}
                                    >
                                        <Ionicons name="chatbubble-ellipses" size={24} color="#fff" />
                                    </TouchableOpacity>
                                </View>

                                <View style={styles.pcDetails}>
                                    <View style={styles.pcRow}>
                                        <View style={styles.pcTag}>
                                            <Text style={styles.pcTagText}>{selectedPost.sport}</Text>
                                        </View>
                                        <View style={[styles.pcTag, { backgroundColor: '#F3F4F6' }]}>
                                            <Text style={[styles.pcTagText, { color: '#374151' }]}>{selectedPost.skillLevel || 'All Levels'}</Text>
                                        </View>
                                        <Text style={styles.pcDist}>~2.5 km away</Text>
                                    </View>
                                    <Text style={styles.pcBio}>{selectedPost.user.bio || 'Ready to play!'}</Text>
                                </View>

                                <View style={styles.pcActions}>
                                    <TouchableOpacity style={styles.pcActionBtnSec}>
                                        <Text style={styles.pcActionTextSec}>View Profile</Text>
                                    </TouchableOpacity>
                                </View>
                            </>
                        )}
                    </TouchableOpacity>
                </TouchableOpacity>
            </Modal>

            {/* Filter Drawer Modal */}
            <Modal
                visible={isFilterOpen}
                animationType="slide"
                transparent={true}
                onRequestClose={() => setIsFilterOpen(false)}
            >
                <View style={styles.modalOverlay}>
                    <View style={styles.drawer}>
                        <View style={styles.drawerHeader}>
                            <Text style={styles.drawerTitle}>Filters</Text>
                            <TouchableOpacity onPress={() => setIsFilterOpen(false)}>
                                <Ionicons name="close" size={24} color="#111827" />
                            </TouchableOpacity>
                        </View>

                        <ScrollView style={styles.drawerContent} contentContainerStyle={{ paddingBottom: 40 }}>
                            {/* Sport */}
                            <Text style={styles.filterLabel}>Sport</Text>
                            <SportDropdown
                                selectedSport={selectedSport}
                                onSelect={setSelectedSport}
                                includeAll={true}
                            />

                            {/* Skill */}
                            <Text style={styles.filterLabel}>Skill Level</Text>
                            <View style={styles.wrapGrid}>
                                {SKILL_LEVELS.map(skill => (
                                    <TouchableOpacity
                                        key={skill}
                                        style={[styles.chip, selectedSkill === skill && styles.chipActive]}
                                        onPress={() => setSelectedSkill(skill)}
                                    >
                                        <Text style={[styles.chipText, selectedSkill === skill && styles.chipTextActive]}>{skill}</Text>
                                    </TouchableOpacity>
                                ))}
                            </View>

                            {/* Gender */}
                            <Text style={styles.filterLabel}>Gender</Text>
                            <View style={styles.wrapGrid}>
                                {GENDERS.map(g => (
                                    <TouchableOpacity
                                        key={g}
                                        style={[styles.chip, selectedGender === g && styles.chipActive]}
                                        onPress={() => setSelectedGender(g)}
                                    >
                                        <Text style={[styles.chipText, selectedGender === g && styles.chipTextActive]}>{g}</Text>
                                    </TouchableOpacity>
                                ))}
                            </View>

                            {/* Age */}
                            <Text style={styles.filterLabel}>Age Range</Text>
                            <View style={styles.wrapGrid}>
                                {AGE_RANGES.map(a => (
                                    <TouchableOpacity
                                        key={a}
                                        style={[styles.chip, selectedAge === a && styles.chipActive]}
                                        onPress={() => setSelectedAge(a)}
                                    >
                                        <Text style={[styles.chipText, selectedAge === a && styles.chipTextActive]}>{a}</Text>
                                    </TouchableOpacity>
                                ))}
                            </View>

                            {/* Bill Split */}
                            <View style={styles.switchRow}>
                                <Text style={styles.filterLabel}>Bill Split Only</Text>
                                <Switch
                                    value={splitBillOnly}
                                    onValueChange={setSplitBillOnly}
                                    trackColor={{ false: '#D1D5DB', true: '#2563EB' }}
                                    thumbColor="#fff"
                                />
                            </View>

                        </ScrollView>

                        <View style={styles.drawerFooter}>
                            <TouchableOpacity
                                style={styles.applyBtn}
                                onPress={() => setIsFilterOpen(false)}
                            >
                                <Text style={styles.applyBtnText}>Apply Filters</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>

            {/* Chat Window Overlay */}
            {chatUser && (
                <ChatWindow
                    user={chatUser}
                    onClose={() => setChatUser(null)}
                />
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#fff' },
    map: { width: '100%', height: '100%' },
    markerContainer: {
        backgroundColor: '#fff',
        padding: 10,
        borderRadius: 24,
        borderWidth: 1,
        borderColor: '#E5E7EB',
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowOffset: { width: 0, height: 2 },
        elevation: 2,
    },
    markerActive: {
        backgroundColor: '#111827',
        borderColor: '#111827',
        transform: [{ scale: 1.2 }],
    },
    markerIcon: { fontSize: 20 },
    topBar: {
        position: 'absolute',
        left: 20,
        right: 20,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        zIndex: 10,
    },
    availableToggle: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#fff',
        paddingLeft: 16,
        paddingRight: 8,
        paddingVertical: 8,
        borderRadius: 30,
        gap: 8,
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowOffset: { width: 0, height: 2 },
        elevation: 4,
    },
    availText: { fontWeight: '600', fontSize: 14, color: '#6B7280' },
    availTextOn: { color: '#111827' },
    filterBtn: {
        width: 44,
        height: 44,
        backgroundColor: '#fff',
        borderRadius: 22,
        alignItems: 'center',
        justifyContent: 'center',
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowOffset: { width: 0, height: 2 },
        elevation: 4,
    },
    modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-end' },
    playerCard: {
        backgroundColor: '#fff',
        borderTopLeftRadius: 32,
        borderTopRightRadius: 32,
        padding: 24,
        paddingBottom: 40,
        alignItems: 'center'
    },
    handle: { width: 40, height: 4, backgroundColor: '#E5E7EB', borderRadius: 2, marginBottom: 24 },
    pcHeader: { flexDirection: 'row', alignItems: 'center', width: '100%', marginBottom: 20 },
    pcAvatar: { width: 64, height: 64, borderRadius: 32 },
    pcInfo: { flex: 1, marginLeft: 16 },
    pcName: { fontSize: 20, fontWeight: '800', color: '#111827' },
    pcSub: { fontSize: 14, color: '#6B7280', marginTop: 4 },
    pcChatBtn: {
        width: 48,
        height: 48,
        borderRadius: 24,
        backgroundColor: '#2563EB',
        alignItems: 'center',
        justifyContent: 'center',
        shadowColor: '#2563EB',
        shadowOpacity: 0.3,
        shadowOffset: { width: 0, height: 4 },
        shadowRadius: 8
    },
    pcDetails: { width: '100%', marginBottom: 24 },
    pcRow: { flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 12 },
    pcTag: { paddingHorizontal: 12, paddingVertical: 6, backgroundColor: '#EFF6FF', borderRadius: 12 },
    pcTagText: { fontSize: 12, fontWeight: '700', color: '#2563EB' },
    pcDist: { fontSize: 12, color: '#9CA3AF', marginLeft: 'auto' },
    pcBio: { fontSize: 14, color: '#4B5563', lineHeight: 20 },
    pcActions: { width: '100%', flexDirection: 'row', gap: 12 },
    pcActionBtnSec: { flex: 1, paddingVertical: 14, borderRadius: 16, borderWidth: 1, borderColor: '#E5E7EB', alignItems: 'center' },
    pcActionTextSec: { fontSize: 14, fontWeight: '700', color: '#374151' },

    // Drawer Styles
    drawer: {
        backgroundColor: '#fff',
        borderTopLeftRadius: 24,
        borderTopRightRadius: 24,
        height: '75%',
        paddingTop: 20,
    },
    drawerHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 20,
        marginBottom: 20,
        paddingBottom: 20,
        borderBottomWidth: 1,
        borderBottomColor: '#F3F4F6',
    },
    drawerTitle: { fontSize: 18, fontWeight: '700' },
    drawerContent: { paddingHorizontal: 20 },
    filterLabel: { fontSize: 14, fontWeight: '700', color: '#374151', marginTop: 16, marginBottom: 12 },
    wrapGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
    chip: {
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 20,
        backgroundColor: '#F3F4F6',
        borderWidth: 1,
        borderColor: '#F3F4F6',
    },
    chipActive: { backgroundColor: '#111827', borderColor: '#111827' },
    chipText: { fontSize: 14, color: '#374151', fontWeight: '500' },
    chipTextActive: { color: '#fff' },
    switchRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: 16 },
    drawerFooter: { padding: 20, borderTopWidth: 1, borderTopColor: '#F3F4F6' },
    applyBtn: { backgroundColor: '#111827', paddingVertical: 16, borderRadius: 16, alignItems: 'center' },
    applyBtnText: { color: '#fff', fontSize: 16, fontWeight: '700' },
});

export default MapViewComponent;
