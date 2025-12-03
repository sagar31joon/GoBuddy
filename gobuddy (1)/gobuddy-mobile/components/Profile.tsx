import React, { useState } from 'react';
import {
    View,
    Text,
    ScrollView,
    Image,
    TouchableOpacity,
    StyleSheet,
    TextInput,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { MOCK_USER } from '../constants';

interface ProfileProps {
    onLogout: () => void;
}

const Profile: React.FC<ProfileProps> = ({ onLogout }) => {
    const [isEditing, setIsEditing] = useState(false);
    const [name, setName] = useState(MOCK_USER.name);
    const [bio, setBio] = useState(MOCK_USER.bio || '');
    const [location, setLocation] = useState('Mumbai, India');

    const handleSave = () => {
        setIsEditing(false);
    };

    return (
        <ScrollView style={styles.container} contentContainerStyle={styles.content}>
            {/* Cover Image */}
            <View style={styles.coverContainer}>
                <Image
                    source={{ uri: 'https://images.unsplash.com/photo-1541534741688-6078c6bfb5c5?auto=format&fit=crop&w=800&q=80' }}
                    style={styles.coverImage}
                />
                <TouchableOpacity style={styles.settingsButton} onPress={onLogout}>
                    <Ionicons name="settings" size={20} color="#fff" />
                </TouchableOpacity>
            </View>

            {/* Profile Info */}
            <View style={styles.profileSection}>
                <View style={styles.profileHeader}>
                    <View style={styles.avatarContainer}>
                        <Image source={{ uri: MOCK_USER.avatar }} style={styles.avatar} />
                    </View>

                    {isEditing ? (
                        <View style={styles.editButtons}>
                            <TouchableOpacity onPress={() => setIsEditing(false)} style={styles.cancelButton}>
                                <Text style={styles.cancelButtonText}>Cancel</Text>
                            </TouchableOpacity>
                            <TouchableOpacity onPress={handleSave} style={styles.saveButton}>
                                <Text style={styles.saveButtonText}>Save</Text>
                            </TouchableOpacity>
                        </View>
                    ) : (
                        <TouchableOpacity onPress={() => setIsEditing(true)} style={styles.editButton}>
                            <Ionicons name="create" size={14} color="#374151" />
                            <Text style={styles.editButtonText}>Edit Profile</Text>
                        </TouchableOpacity>
                    )}
                </View>

                {isEditing ? (
                    <View style={styles.editForm}>
                        <View style={styles.formGroup}>
                            <Text style={styles.label}>FULL NAME</Text>
                            <TextInput
                                style={styles.nameInput}
                                value={name}
                                onChangeText={setName}
                            />
                        </View>
                        <View style={styles.formGroup}>
                            <Text style={styles.label}>LOCATION</Text>
                            <View style={styles.locationInput}>
                                <Ionicons name="location" size={18} color="#9CA3AF" />
                                <TextInput
                                    style={styles.locationTextInput}
                                    value={location}
                                    onChangeText={setLocation}
                                />
                            </View>
                        </View>
                        <View style={styles.formGroup}>
                            <Text style={styles.label}>BIO</Text>
                            <TextInput
                                style={styles.bioInput}
                                value={bio}
                                onChangeText={setBio}
                                multiline
                                numberOfLines={4}
                                textAlignVertical="top"
                            />
                        </View>
                    </View>
                ) : (
                    <View style={styles.profileInfo}>
                        <Text style={styles.name}>{name}</Text>
                        <View style={styles.locationRow}>
                            <Ionicons name="location" size={14} color="#2563EB" />
                            <Text style={styles.locationText}>{location}</Text>
                        </View>
                        <Text style={styles.bio}>{bio}</Text>
                    </View>
                )}

                {/* Stats */}
                <View style={styles.stats}>
                    <View style={styles.statCard}>
                        <Text style={styles.statValue}>24</Text>
                        <Text style={styles.statLabel}>MATCHES</Text>
                    </View>
                    <View style={styles.statCard}>
                        <Text style={styles.statValue}>142</Text>
                        <Text style={styles.statLabel}>FRIENDS</Text>
                    </View>
                    <View style={styles.statCard}>
                        <Text style={styles.statValue}>4.9</Text>
                        <Text style={styles.statLabel}>RATING</Text>
                    </View>
                </View>

                {/* Sports */}
                <View style={styles.sportsSection}>
                    <Text style={styles.sectionTitle}>SPORTS & INTERESTS</Text>
                    <View style={styles.sportsContainer}>
                        {(MOCK_USER.sports || []).map((sport) => (
                            <View key={sport} style={styles.sportTag}>
                                <Text style={styles.sportTagText}>{sport}</Text>
                            </View>
                        ))}
                    </View>
                </View>

                {/* Recent Activity */}
                <View style={styles.activitySection}>
                    <Text style={styles.sectionTitle}>RECENT ACTIVITY</Text>
                    <View style={styles.activityCard}>
                        <View style={[styles.activityIcon, { backgroundColor: '#FFF7ED' }]}>
                            <Ionicons name="trophy" size={24} color="#F59E0B" />
                        </View>
                        <View>
                            <Text style={styles.activityTitle}>Won a Tennis Match</Text>
                            <Text style={styles.activitySubtitle}>Yesterday vs Srinjoy</Text>
                        </View>
                    </View>
                    <View style={styles.activityCard}>
                        <View style={[styles.activityIcon, { backgroundColor: '#F5F3FF' }]}>
                            <Ionicons name="fitness" size={24} color="#8B5CF6" />
                        </View>
                        <View>
                            <Text style={styles.activityTitle}>Completed 5km Run</Text>
                            <Text style={styles.activitySubtitle}>2 days ago</Text>
                        </View>
                    </View>
                </View>

                {/* Logout Button */}
                <TouchableOpacity onPress={onLogout} style={styles.logoutButton}>
                    <Ionicons name="log-out" size={20} color="#EF4444" />
                    <Text style={styles.logoutText}>Log Out</Text>
                </TouchableOpacity>
            </View>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    content: {
        paddingBottom: 100,
    },
    coverContainer: {
        height: 176,
        position: 'relative',
    },
    coverImage: {
        width: '100%',
        height: '100%',
    },
    settingsButton: {
        position: 'absolute',
        top: 50,
        right: 24,
        backgroundColor: 'rgba(255, 255, 255, 0.2)',
        padding: 10,
        borderRadius: 20,
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.2)',
    },
    profileSection: {
        paddingHorizontal: 24,
    },
    profileHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-end',
        marginTop: -64,
        marginBottom: 16,
    },
    avatarContainer: {
        borderWidth: 5,
        borderColor: '#fff',
        borderRadius: 32,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 8,
        elevation: 8,
    },
    avatar: {
        width: 128,
        height: 128,
        borderRadius: 32,
    },
    editButtons: {
        flexDirection: 'row',
        gap: 12,
        marginBottom: 8,
    },
    cancelButton: {
        paddingHorizontal: 16,
        paddingVertical: 8,
        backgroundColor: '#F3F4F6',
        borderRadius: 12,
    },
    cancelButtonText: {
        fontSize: 12,
        fontWeight: '700',
        color: '#6B7280',
    },
    saveButton: {
        paddingHorizontal: 16,
        paddingVertical: 8,
        backgroundColor: '#111827',
        borderRadius: 12,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 8,
        elevation: 4,
    },
    saveButtonText: {
        fontSize: 12,
        fontWeight: '700',
        color: '#fff',
    },
    editButton: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        paddingHorizontal: 20,
        paddingVertical: 10,
        backgroundColor: '#fff',
        borderWidth: 1,
        borderColor: '#E5E7EB',
        borderRadius: 12,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 2,
        elevation: 2,
        marginBottom: 8,
    },
    editButtonText: {
        fontSize: 12,
        fontWeight: '700',
        color: '#374151',
    },
    editForm: {
        gap: 16,
        marginBottom: 32,
    },
    formGroup: {
        gap: 8,
    },
    label: {
        fontSize: 10,
        fontWeight: '700',
        color: '#9CA3AF',
        letterSpacing: 1,
        marginLeft: 4,
    },
    nameInput: {
        fontSize: 24,
        fontWeight: '700',
        color: '#111827',
        borderBottomWidth: 2,
        borderBottomColor: '#E5E7EB',
        paddingVertical: 8,
    },
    locationInput: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        borderBottomWidth: 2,
        borderBottomColor: '#E5E7EB',
        paddingVertical: 8,
    },
    locationTextInput: {
        flex: 1,
        fontSize: 14,
        fontWeight: '500',
        color: '#374151',
    },
    bioInput: {
        fontSize: 14,
        color: '#6B7280',
        borderWidth: 2,
        borderColor: '#E5E7EB',
        borderRadius: 16,
        padding: 16,
        minHeight: 112,
        backgroundColor: '#F9FAFB',
    },
    profileInfo: {
        marginBottom: 32,
    },
    name: {
        fontSize: 32,
        fontWeight: '900',
        color: '#111827',
        letterSpacing: -0.5,
    },
    locationRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
        marginTop: 8,
    },
    locationText: {
        fontSize: 12,
        fontWeight: '700',
        color: '#6B7280',
        textTransform: 'uppercase',
        letterSpacing: 1,
    },
    bio: {
        fontSize: 15,
        lineHeight: 22,
        color: '#6B7280',
        marginTop: 20,
        maxWidth: 320,
    },
    stats: {
        flexDirection: 'row',
        gap: 16,
        marginBottom: 40,
    },
    statCard: {
        flex: 1,
        backgroundColor: '#F9FAFB',
        padding: 16,
        borderRadius: 24,
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#F3F4F6',
    },
    statValue: {
        fontSize: 24,
        fontWeight: '900',
        color: '#111827',
        marginBottom: 4,
    },
    statLabel: {
        fontSize: 10,
        fontWeight: '700',
        color: '#9CA3AF',
        letterSpacing: 1,
    },
    sportsSection: {
        marginBottom: 40,
    },
    sectionTitle: {
        fontSize: 13,
        fontWeight: '700',
        color: '#111827',
        letterSpacing: 1,
        marginBottom: 16,
    },
    sportsContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 10,
    },
    sportTag: {
        paddingHorizontal: 20,
        paddingVertical: 10,
        backgroundColor: '#fff',
        borderWidth: 1,
        borderColor: '#E5E7EB',
        borderRadius: 16,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 2,
        elevation: 2,
    },
    sportTagText: {
        fontSize: 12,
        fontWeight: '700',
        color: '#374151',
    },
    activitySection: {
        marginBottom: 32,
    },
    activityCard: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 16,
        padding: 16,
        borderRadius: 24,
        borderWidth: 1,
        borderColor: '#F3F4F6',
        backgroundColor: '#fff',
        marginBottom: 16,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.02,
        shadowRadius: 20,
        elevation: 1,
    },
    activityIcon: {
        padding: 14,
        borderRadius: 16,
    },
    activityTitle: {
        fontSize: 14,
        fontWeight: '700',
        color: '#111827',
    },
    activitySubtitle: {
        fontSize: 12,
        color: '#6B7280',
        fontWeight: '500',
        marginTop: 2,
    },
    logoutButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 12,
        padding: 16,
        borderRadius: 16,
        borderWidth: 1,
        borderColor: '#FEE2E2',
        backgroundColor: '#FEF2F2',
        marginTop: 16,
    },
    logoutText: {
        fontSize: 14,
        fontWeight: '700',
        color: '#EF4444',
    },
});

export default Profile;
