import React, { useState } from 'react';
import {
    View,
    Text,
    ScrollView,
    Image,
    TouchableOpacity,
    StyleSheet,
    TextInput,
    StatusBar,
    SafeAreaView
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { MOCK_USER } from '../constants';

interface ProfileProps {
    onLogout: () => void;
}

const Profile: React.FC<ProfileProps> = ({ onLogout }) => {
    const insets = useSafeAreaInsets();
    const [name, setName] = useState(MOCK_USER.name);
    const [location, setLocation] = useState('Mumbai, India');

    return (
        <ScrollView style={styles.container} contentContainerStyle={styles.content}>
            <StatusBar barStyle="light-content" />

            {/* Banner */}
            <View style={styles.bannerContainer}>
                <Image
                    source={{ uri: 'https://images.unsplash.com/photo-1579546929518-9e396f3cc809?auto=format&fit=crop&w=1000&q=80' }}
                    style={styles.banner}
                />
                <View style={styles.bannerOverlay} />

                <TouchableOpacity
                    style={[styles.settingsBtn, { top: insets.top + 16 }]}
                    onPress={onLogout}
                >
                    <Ionicons name="settings-outline" size={24} color="#fff" />
                </TouchableOpacity>
            </View>

            {/* Profile Header (Overlapping Banner) */}
            <View style={styles.profileHeader}>
                <View style={styles.avatarContainer}>
                    <Image source={{ uri: MOCK_USER.avatar }} style={styles.avatar} />
                    <View style={styles.onlineBadge} />
                </View>

                <View style={styles.headerInfo}>
                    <Text style={styles.name}>{name}</Text>
                    <View style={styles.locationRow}>
                        <Ionicons name="location-outline" size={14} color="#6B7280" />
                        <Text style={styles.location}>{location}</Text>
                    </View>
                </View>
            </View>

            {/* Stats Row */}
            <View style={styles.statsRow}>
                <View style={styles.statItem}>
                    <Text style={styles.statValue}>24</Text>
                    <Text style={styles.statLabel}>Matches</Text>
                </View>
                <View style={styles.divider} />
                <View style={styles.statItem}>
                    <Text style={styles.statValue}>142</Text>
                    <Text style={styles.statLabel}>Friends</Text>
                </View>
                <View style={styles.divider} />
                <View style={styles.statItem}>
                    <Text style={styles.statValue}>4.9</Text>
                    <Text style={styles.statLabel}>Rating</Text>
                </View>
            </View>

            {/* Sports & Skills */}
            <View style={styles.section}>
                <Text style={styles.sectionTitle}>Sports & Skills</Text>
                <View style={styles.skillsGrid}>
                    {(MOCK_USER.sports || []).map((item: any, index: number) => (
                        <View key={index} style={styles.skillCard}>
                            <View style={styles.skillDot} />
                            <View>
                                <Text style={styles.skillSport}>{item.sport}</Text>
                                <Text style={styles.skillLevel}>{item.level}</Text>
                            </View>
                        </View>
                    ))}
                </View>
            </View>

            {/* My Groups (New Section) */}
            <View style={styles.section}>
                <View style={styles.sectionHeader}>
                    <Text style={styles.sectionTitle}>My Groups</Text>
                    <TouchableOpacity>
                        <Text style={styles.seeAll}>See All</Text>
                    </TouchableOpacity>
                </View>
                <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.groupsScroll}>
                    {/* Placeholder Group 1 */}
                    <View style={styles.groupCard}>
                        <Image
                            source={{ uri: 'https://images.unsplash.com/photo-1546519638-68e109498ffc?auto=format&fit=crop&w=300&q=80' }}
                            style={styles.groupImage}
                        />
                        <View style={styles.groupInfo}>
                            <Text style={styles.groupName}>Sunday Hoops</Text>
                            <Text style={styles.groupMembers}>12 Members</Text>
                        </View>
                    </View>

                    {/* Placeholder Group 2 */}
                    <View style={styles.groupCard}>
                        <Image
                            source={{ uri: 'https://images.unsplash.com/photo-1626248986877-e075e7a9b0c6?auto=format&fit=crop&w=300&q=80' }}
                            style={styles.groupImage}
                        />
                        <View style={styles.groupInfo}>
                            <Text style={styles.groupName}>Mumbai Trekkers</Text>
                            <Text style={styles.groupMembers}>8 Members</Text>
                        </View>
                    </View>

                    {/* Create Group */}
                    <TouchableOpacity style={styles.createGroupCard}>
                        <Ionicons name="add-circle-outline" size={32} color="#2563EB" />
                        <Text style={styles.createGroupText}>Create Group</Text>
                    </TouchableOpacity>
                </ScrollView>
            </View>

            {/* Recent Activity */}
            <View style={styles.section}>
                <Text style={styles.sectionTitle}>Recent Activity</Text>

                <View style={styles.activityCard}>
                    <View style={[styles.activityIcon, { backgroundColor: '#FEF3C7' }]}>
                        <Text style={{ fontSize: 20 }}>🏆</Text>
                    </View>
                    <View style={styles.activityInfo}>
                        <Text style={styles.activityTitle}>Won a Tennis Match</Text>
                        <Text style={styles.activitySub}>Doubles with Srinjoy • Yesterday</Text>
                    </View>
                </View>

                <View style={styles.activityCard}>
                    <View style={[styles.activityIcon, { backgroundColor: '#DBEAFE' }]}>
                        <Text style={{ fontSize: 20 }}>🏸</Text>
                    </View>
                    <View style={styles.activityInfo}>
                        <Text style={styles.activityTitle}>Badminton Practice</Text>
                        <Text style={styles.activitySub}>City Sports Complex • 3 days ago</Text>
                    </View>
                </View>
            </View>

            <TouchableOpacity style={styles.logoutButton} onPress={onLogout}>
                <Text style={styles.logoutText}>Log Out</Text>
            </TouchableOpacity>

        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#fff' },
    content: { paddingBottom: 100 },
    bannerContainer: { height: 180, position: 'relative' },
    banner: { width: '100%', height: '100%' },
    bannerOverlay: { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(0,0,0,0.1)' },
    settingsBtn: {
        position: 'absolute',
        // top: 50, // REMOVED - calculated in component
        right: 20,
        padding: 8,
        backgroundColor: 'rgba(0,0,0,0.3)',
        borderRadius: 20
    },
    profileHeader: { paddingHorizontal: 24, marginTop: -50, marginBottom: 24 },
    avatarContainer: { alignSelf: 'flex-start', position: 'relative', marginBottom: 12 },
    avatar: { width: 100, height: 100, borderRadius: 30, borderWidth: 4, borderColor: '#fff' },
    onlineBadge: { position: 'absolute', bottom: 0, right: 0, width: 20, height: 20, backgroundColor: '#10B981', borderRadius: 10, borderWidth: 3, borderColor: '#fff' },
    headerInfo: { gap: 4 },
    name: { fontSize: 24, fontWeight: '800', color: '#111827' },
    locationRow: { flexDirection: 'row', alignItems: 'center', gap: 4 },
    location: { fontSize: 14, color: '#6B7280', fontWeight: '500' },
    statsRow: { flexDirection: 'row', justifyContent: 'space-around', alignItems: 'center', marginHorizontal: 24, paddingVertical: 16, backgroundColor: '#F9FAFB', borderRadius: 20, marginBottom: 32 },
    statItem: { alignItems: 'center' },
    statValue: { fontSize: 20, fontWeight: '800', color: '#111827' },
    statLabel: { fontSize: 12, fontWeight: '600', color: '#9CA3AF', textTransform: 'uppercase', letterSpacing: 0.5, marginTop: 2 },
    divider: { width: 1, height: 24, backgroundColor: '#E5E7EB' },
    section: { paddingHorizontal: 24, marginBottom: 32 },
    sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 },
    sectionTitle: { fontSize: 18, fontWeight: '800', color: '#111827' },
    seeAll: { fontSize: 14, color: '#2563EB', fontWeight: '600' },
    skillsGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 12 },
    skillCard: { flexDirection: 'row', alignItems: 'center', gap: 12, paddingHorizontal: 16, paddingVertical: 12, backgroundColor: '#fff', borderRadius: 16, borderWidth: 1, borderColor: '#F3F4F6', flex: 1, minWidth: '45%', shadowColor: '#000', shadowOpacity: 0.03, shadowOffset: { width: 0, height: 2 }, shadowRadius: 8, elevation: 2 },
    skillDot: { width: 8, height: 8, borderRadius: 4, backgroundColor: '#2563EB' },
    skillSport: { fontSize: 14, fontWeight: '700', color: '#111827' },
    skillLevel: { fontSize: 12, color: '#6B7280', fontWeight: '500' },
    groupsScroll: { overflow: 'visible', flexDirection: 'row' },
    groupCard: { width: 140, marginRight: 16, backgroundColor: '#fff', borderRadius: 16, borderWidth: 1, borderColor: '#F3F4F6' },
    groupImage: { width: '100%', height: 100, borderTopLeftRadius: 16, borderTopRightRadius: 16 },
    groupInfo: { padding: 12 },
    groupName: { fontSize: 14, fontWeight: '700', color: '#111827', marginBottom: 4 },
    groupMembers: { fontSize: 12, color: '#6B7280' },
    createGroupCard: { width: 140, height: 148, marginRight: 16, backgroundColor: '#EFF6FF', borderRadius: 16, borderWidth: 1, borderColor: '#BFDBFE', borderStyle: 'dashed', alignItems: 'center', justifyContent: 'center', gap: 8 },
    createGroupText: { fontSize: 14, fontWeight: '600', color: '#2563EB' },
    activityCard: { flexDirection: 'row', alignItems: 'center', gap: 16, padding: 16, backgroundColor: '#F9FAFB', borderRadius: 20, marginBottom: 12 },
    activityIcon: { width: 48, height: 48, borderRadius: 16, alignItems: 'center', justifyContent: 'center' },
    activityInfo: { flex: 1 },
    activityTitle: { fontSize: 15, fontWeight: '700', color: '#111827' },
    activitySub: { fontSize: 12, color: '#6B7280', marginTop: 2 },
    logoutButton: { marginHorizontal: 24, paddingVertical: 16, backgroundColor: '#FEF2F2', borderRadius: 16, alignItems: 'center', borderWidth: 1, borderColor: '#FECACA' },
    logoutText: { color: '#EF4444', fontWeight: '700', fontSize: 14 },
});

export default Profile;
