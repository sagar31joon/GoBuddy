import React, { useState, useEffect, useMemo, useRef } from 'react';
import {
    View,
    Text,
    TextInput,
    StyleSheet,
    TouchableOpacity,
    ScrollView,
    ActivityIndicator,
    Image,
    Dimensions,
} from 'react-native';
import MapView, { Marker, PROVIDER_GOOGLE, Region } from 'react-native-maps';
import { Ionicons } from '@expo/vector-icons';
import * as Location from 'expo-location';
import { Post } from '../types';

interface MapViewComponentProps {
    posts: Post[];
    onConnect: (userName: string) => void;
}

const { width } = Dimensions.get('window');

const MapViewComponent: React.FC<MapViewComponentProps> = ({ posts, onConnect }) => {
    const mapRef = useRef<MapView>(null);
    const [selectedPin, setSelectedPin] = useState<string | null>(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [activeFilter, setActiveFilter] = useState<'all' | 'free' | 'paid' | 'tennis' | 'gym'>('all');
    const [userLocation, setUserLocation] = useState<{ latitude: number; longitude: number } | null>(null);
    const [isLoadingLoc, setIsLoadingLoc] = useState(false);
    const [isRefreshing, setIsRefreshing] = useState(false);
    const [mapType, setMapType] = useState<'standard' | 'satellite'>('standard');

    // Filter posts
    const filteredPosts = useMemo(() => {
        return posts.filter(post => {
            const matchesSearch =
                post.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
                post.sport.toLowerCase().includes(searchQuery.toLowerCase()) ||
                post.locationName.toLowerCase().includes(searchQuery.toLowerCase());

            if (!matchesSearch) return false;

            if (activeFilter === 'free') return !post.isPaid;
            if (activeFilter === 'paid') return post.isPaid;
            if (activeFilter === 'tennis') return post.sport.toLowerCase() === 'tennis';
            if (activeFilter === 'gym') return post.sport.toLowerCase() === 'gym';

            return true;
        });
    }, [posts, searchQuery, activeFilter]);

    // Get user location
    const handleLocateMe = async (force: boolean = false) => {
        if (!force && userLocation) return;

        setIsLoadingLoc(true);
        try {
            const { status } = await Location.requestForegroundPermissionsAsync();
            if (status !== 'granted') {
                alert('Permission to access location was denied');
                setIsLoadingLoc(false);
                return;
            }

            const location = await Location.getCurrentPositionAsync({
                accuracy: Location.Accuracy.High,
            });
            const newLoc = {
                latitude: location.coords.latitude,
                longitude: location.coords.longitude,
            };
            setUserLocation(newLoc);

            if (mapRef.current) {
                mapRef.current.animateToRegion({
                    ...newLoc,
                    latitudeDelta: 0.01,
                    longitudeDelta: 0.01,
                }, 1000);
            }
        } catch (error) {
            console.error('Error getting location:', error);
            // Default to Delhi coordinates
            const defaultLoc = { latitude: 28.6139, longitude: 77.2090 };
            setUserLocation(defaultLoc);
        } finally {
            setIsLoadingLoc(false);
        }
    };

    useEffect(() => {
        handleLocateMe(false);
    }, []);

    const handleRefresh = () => {
        setIsRefreshing(true);
        setTimeout(() => {
            setIsRefreshing(false);
        }, 1500);
    };

    const toggleMapType = () => {
        setMapType(prev => prev === 'standard' ? 'satellite' : 'standard');
    };

    const FilterButton = ({ label, id }: { label: string; id: typeof activeFilter }) => (
        <TouchableOpacity
            onPress={() => setActiveFilter(id)}
            style={[
                styles.filterButton,
                activeFilter === id ? styles.filterButtonActive : styles.filterButtonInactive,
            ]}
        >
            <Text style={[
                styles.filterButtonText,
                activeFilter === id ? styles.filterButtonTextActive : styles.filterButtonTextInactive,
            ]}>
                {label}
            </Text>
        </TouchableOpacity>
    );

    const selectedPost = selectedPin ? filteredPosts.find(p => p.id === selectedPin) : null;
    const livePosts = filteredPosts.filter(p => p.locationType === 'live' && p.coordinates);

    const initialRegion: Region = {
        latitude: userLocation?.latitude || 28.6139,
        longitude: userLocation?.longitude || 77.2090,
        latitudeDelta: 0.02,
        longitudeDelta: 0.02,
    };

    return (
        <View style={styles.container}>
            {/* Map */}
            <MapView
                ref={mapRef}
                style={styles.map}
                initialRegion={initialRegion}
                mapType={mapType}
                provider={PROVIDER_GOOGLE}
                showsUserLocation
                showsMyLocationButton={false}
            >
                {/* User location marker */}
                {userLocation && (
                    <Marker coordinate={userLocation} anchor={{ x: 0.5, y: 0.5 }}>
                        <View style={styles.userMarker}>
                            <View style={styles.userMarkerPulse} />
                            <View style={styles.userMarkerDot} />
                        </View>
                    </Marker>
                )}

                {/* Post markers */}
                {livePosts.map((post) => (
                    <Marker
                        key={post.id}
                        coordinate={post.coordinates!}
                        onPress={() => {
                            setSelectedPin(post.id);
                            if (mapRef.current && post.coordinates) {
                                mapRef.current.animateToRegion({
                                    latitude: post.coordinates.latitude + 0.002,
                                    longitude: post.coordinates.longitude,
                                    latitudeDelta: 0.01,
                                    longitudeDelta: 0.01,
                                }, 500);
                            }
                        }}
                    >
                        <View style={styles.markerContainer}>
                            <View style={[
                                styles.markerPulse,
                                { backgroundColor: post.isPaid ? '#f59e0b' : '#3b82f6' }
                            ]} />
                            <View style={[
                                styles.markerPin,
                                { backgroundColor: post.isPaid ? '#f59e0b' : '#3b82f6' }
                            ]}>
                                <Image source={{ uri: post.user.avatar }} style={styles.markerImage} />
                            </View>
                        </View>
                    </Marker>
                ))}
            </MapView>

            {/* Search Bar */}
            <View style={styles.searchContainer}>
                <View style={styles.searchBar}>
                    <Ionicons name="search" size={20} color="#9CA3AF" />
                    <TextInput
                        style={styles.searchInput}
                        placeholder="Search sport, coach, or place..."
                        placeholderTextColor="#9CA3AF"
                        value={searchQuery}
                        onChangeText={setSearchQuery}
                    />
                </View>

                <ScrollView
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    style={styles.filterScroll}
                    contentContainerStyle={styles.filterContainer}
                >
                    <FilterButton label="All" id="all" />
                    <FilterButton label="Free" id="free" />
                    <FilterButton label="Paid" id="paid" />
                    <FilterButton label="Tennis" id="tennis" />
                    <FilterButton label="Gym" id="gym" />
                </ScrollView>
            </View>

            {/* Map Controls */}
            <View style={styles.controls}>
                <TouchableOpacity style={styles.controlButton} onPress={handleRefresh}>
                    <Ionicons
                        name="refresh"
                        size={24}
                        color="#2563EB"
                        style={isRefreshing && { transform: [{ rotate: '360deg' }] }}
                    />
                </TouchableOpacity>

                <TouchableOpacity style={styles.controlButton} onPress={toggleMapType}>
                    <Ionicons
                        name="layers"
                        size={24}
                        color={mapType === 'satellite' ? '#2563EB' : '#6B7280'}
                    />
                </TouchableOpacity>

                <TouchableOpacity style={styles.controlButton} onPress={() => handleLocateMe(true)}>
                    {isLoadingLoc ? (
                        <ActivityIndicator color="#2563EB" />
                    ) : (
                        <Ionicons name="locate" size={24} color="#2563EB" />
                    )}
                </TouchableOpacity>
            </View>

            {/* Selected Post Card */}
            {selectedPost && (
                <View style={styles.postCard}>
                    <TouchableOpacity
                        style={styles.closeButton}
                        onPress={() => setSelectedPin(null)}
                    >
                        <Ionicons name="close" size={20} color="#6B7280" />
                    </TouchableOpacity>

                    <View style={styles.postContent}>
                        <View style={styles.postHeader}>
                            <View style={styles.avatarContainer}>
                                <Image source={{ uri: selectedPost.user.avatar }} style={styles.avatar} />
                                {selectedPost.user.isOnline && <View style={styles.onlineBadge} />}
                            </View>

                            <View style={styles.postInfo}>
                                <View style={styles.postTitleRow}>
                                    <Text style={styles.userName} numberOfLines={1}>{selectedPost.user.name}</Text>
                                    <Text style={styles.timestamp}>{selectedPost.createdAt}</Text>
                                </View>
                                <Text style={styles.postText} numberOfLines={2}>{selectedPost.content}</Text>

                                <View style={styles.tags}>
                                    <View style={styles.sportTag}>
                                        <Text style={styles.sportTagText}>{selectedPost.sport}</Text>
                                    </View>
                                    {selectedPost.isPaid ? (
                                        <View style={styles.priceTag}>
                                            <Text style={styles.priceTagText}>₹ {selectedPost.price}</Text>
                                        </View>
                                    ) : (
                                        <View style={styles.freeTag}>
                                            <Text style={styles.freeTagText}>Free</Text>
                                        </View>
                                    )}
                                </View>
                            </View>

                            <TouchableOpacity
                                style={styles.connectButton}
                                onPress={() => onConnect(selectedPost.user.name)}
                            >
                                <Ionicons name="send" size={20} color="#fff" />
                                <Text style={styles.connectText}>Connect</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    map: {
        flex: 1,
    },
    searchContainer: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        paddingTop: 16,
        paddingHorizontal: 16,
        backgroundColor: 'rgba(255, 255, 255, 0.9)',
        paddingBottom: 12,
    },
    searchBar: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#fff',
        borderRadius: 16,
        paddingHorizontal: 16,
        paddingVertical: 14,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 4,
        borderWidth: 1,
        borderColor: '#F3F4F6',
        marginBottom: 12,
    },
    searchInput: {
        flex: 1,
        marginLeft: 12,
        fontSize: 14,
        fontWeight: '500',
        color: '#111827',
    },
    filterScroll: {
        flexGrow: 0,
    },
    filterContainer: {
        gap: 8,
        paddingBottom: 4,
    },
    filterButton: {
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 2,
        elevation: 2,
    },
    filterButtonActive: {
        backgroundColor: '#2563EB',
    },
    filterButtonInactive: {
        backgroundColor: '#fff',
        borderWidth: 1,
        borderColor: '#F3F4F6',
    },
    filterButtonText: {
        fontSize: 12,
        fontWeight: '700',
    },
    filterButtonTextActive: {
        color: '#fff',
    },
    filterButtonTextInactive: {
        color: '#374151',
    },
    controls: {
        position: 'absolute',
        bottom: 160,
        right: 16,
        gap: 12,
    },
    controlButton: {
        backgroundColor: '#fff',
        width: 56,
        height: 56,
        borderRadius: 16,
        alignItems: 'center',
        justifyContent: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.15,
        shadowRadius: 8,
        elevation: 6,
        borderWidth: 1,
        borderColor: '#F3F4F6',
    },
    userMarker: {
        width: 20,
        height: 20,
        alignItems: 'center',
        justifyContent: 'center',
    },
    userMarkerPulse: {
        position: 'absolute',
        width: 20,
        height: 20,
        borderRadius: 10,
        backgroundColor: '#2563EB',
        opacity: 0.3,
    },
    userMarkerDot: {
        width: 12,
        height: 12,
        borderRadius: 6,
        backgroundColor: '#2563EB',
        borderWidth: 2,
        borderColor: '#fff',
    },
    markerContainer: {
        width: 40,
        height: 40,
        alignItems: 'center',
        justifyContent: 'center',
    },
    markerPulse: {
        position: 'absolute',
        width: 40,
        height: 40,
        borderRadius: 20,
        opacity: 0.2,
    },
    markerPin: {
        width: 36,
        height: 36,
        borderRadius: 18,
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 3,
        borderColor: '#fff',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 4,
        elevation: 4,
    },
    markerImage: {
        width: 28,
        height: 28,
        borderRadius: 14,
    },
    postCard: {
        position: 'absolute',
        bottom: 112,
        left: 16,
        right: 16,
        backgroundColor: 'rgba(255, 255, 255, 0.95)',
        borderRadius: 24,
        padding: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.2,
        shadowRadius: 16,
        elevation: 10,
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.5)',
    },
    closeButton: {
        position: 'absolute',
        top: 8,
        right: 8,
        backgroundColor: '#F3F4F6',
        borderRadius: 12,
        padding: 4,
        zIndex: 10,
    },
    postContent: {
        gap: 12,
    },
    postHeader: {
        flexDirection: 'row',
        gap: 14,
    },
    avatarContainer: {
        position: 'relative',
    },
    avatar: {
        width: 56,
        height: 56,
        borderRadius: 16,
        borderWidth: 2,
        borderColor: '#fff',
    },
    onlineBadge: {
        position: 'absolute',
        bottom: -2,
        right: -2,
        width: 16,
        height: 16,
        borderRadius: 8,
        backgroundColor: '#10B981',
        borderWidth: 2,
        borderColor: '#fff',
    },
    postInfo: {
        flex: 1,
    },
    postTitleRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 4,
    },
    userName: {
        fontSize: 18,
        fontWeight: '700',
        color: '#111827',
        flex: 1,
    },
    timestamp: {
        fontSize: 10,
        fontWeight: '700',
        color: '#9CA3AF',
        backgroundColor: '#F9FAFB',
        paddingHorizontal: 8,
        paddingVertical: 2,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: '#F3F4F6',
    },
    postText: {
        fontSize: 14,
        color: '#6B7280',
        lineHeight: 20,
        fontWeight: '500',
        marginBottom: 12,
    },
    tags: {
        flexDirection: 'row',
        gap: 8,
    },
    sportTag: {
        backgroundColor: '#DBEAFE',
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 8,
    },
    sportTagText: {
        fontSize: 10,
        fontWeight: '700',
        color: '#1E40AF',
        textTransform: 'uppercase',
        letterSpacing: 0.5,
    },
    priceTag: {
        backgroundColor: '#FEF3C7',
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 8,
    },
    priceTagText: {
        fontSize: 10,
        fontWeight: '700',
        color: '#92400E',
    },
    freeTag: {
        backgroundColor: '#D1FAE5',
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 8,
    },
    freeTagText: {
        fontSize: 10,
        fontWeight: '700',
        color: '#065F46',
    },
    connectButton: {
        backgroundColor: '#2563EB',
        width: 56,
        height: 56,
        borderRadius: 16,
        alignItems: 'center',
        justifyContent: 'center',
        shadowColor: '#2563EB',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 6,
    },
    connectText: {
        color: '#fff',
        fontSize: 9,
        fontWeight: '700',
        marginTop: 2,
    },
});

export default MapViewComponent;
