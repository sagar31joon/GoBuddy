import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Image, Dimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Post } from '../types';

interface PlayProps {
    onNavigate: (tab: 'near_me' | 'feed' | 'create' | 'profile') => void;
    upcomingMatch?: Post;
}

export default function Play({ onNavigate, upcomingMatch }: PlayProps) {
    const insets = useSafeAreaInsets();

    return (
        <View style={[styles.container, { paddingTop: insets.top }]}>
            {/* Header */}
            <View style={styles.header}>
                <View>
                    <Text style={styles.greeting}>Ready to play, Count?</Text>
                    <Text style={styles.title}>GoBuddy</Text>
                </View>
                <TouchableOpacity style={styles.profileButton} onPress={() => onNavigate('profile')}>
                    <Ionicons name="person-circle-outline" size={40} color="#111827" />
                </TouchableOpacity>
            </View>

            <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
                {/* Next Match Card */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Your Next Match</Text>
                    {upcomingMatch ? (
                        <TouchableOpacity style={styles.matchCard}>
                            <View style={styles.matchHeader}>
                                <View style={[styles.sportTag, { backgroundColor: '#EFF6FF' }]}>
                                    <Text style={[styles.sportText, { color: '#2563EB' }]}>{upcomingMatch.sport}</Text>
                                </View>
                                <Text style={styles.matchTime}>{new Date(upcomingMatch.date).toLocaleDateString()} • {new Date(upcomingMatch.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</Text>
                            </View>

                            <View style={styles.matchDetails}>
                                <View style={styles.row}>
                                    <Ionicons name="location-outline" size={16} color="#6B7280" />
                                    <Text style={styles.detailText}>{upcomingMatch.locationName}</Text>
                                </View>
                                <View style={styles.row}>
                                    <Ionicons name="people-outline" size={16} color="#6B7280" />
                                    <Text style={styles.detailText}>{upcomingMatch.user.name}</Text>
                                </View>
                            </View>

                            <TouchableOpacity style={styles.chatButton}>
                                <Text style={styles.chatButtonText}>Chat with Group</Text>
                            </TouchableOpacity>
                        </TouchableOpacity>
                    ) : (
                        <View style={styles.emptyCard}>
                            <Ionicons name="calendar-outline" size={48} color="#D1D5DB" />
                            <Text style={styles.emptyText}>No upcoming matches</Text>
                            <Text style={styles.emptySubtext}>Find a game nearby or schedule one!</Text>
                        </View>
                    )}
                </View>

                {/* Action Grid */}
                <View style={styles.grid}>
                    <TouchableOpacity
                        style={[styles.actionCard, { backgroundColor: '#EEF2FF' }]}
                        onPress={() => onNavigate('near_me')}
                    >
                        <View style={[styles.iconCircle, { backgroundColor: '#C7D2FE' }]}>
                            <Ionicons name="location" size={24} color="#3730A3" />
                        </View>
                        <Text style={styles.actionTitle}>Find Now</Text>
                        <Text style={styles.actionDesc}>Join live games nearby instantly</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={[styles.actionCard, { backgroundColor: '#ECFDF5' }]}
                        onPress={() => onNavigate('create')}
                    >
                        <View style={[styles.iconCircle, { backgroundColor: '#A7F3D0' }]}>
                            <Ionicons name="calendar" size={24} color="#065F46" />
                        </View>
                        <Text style={styles.actionTitle}>Schedule</Text>
                        <Text style={styles.actionDesc}>Plan a match for later</Text>
                    </TouchableOpacity>
                </View>

                {/* Featured Section */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Trending Sports</Text>
                    <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.hScroll}>
                        {['Badminton', 'Tennis', 'Soccer', 'Cricket'].map((sport, index) => (
                            <TouchableOpacity key={index} style={styles.trendCard}>
                                <Text style={styles.trendText}>{sport}</Text>
                            </TouchableOpacity>
                        ))}
                    </ScrollView>
                </View>
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F9FAFB',
        // paddingTop: 60, // REMOVED
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 24,
        paddingBottom: 24, // Maintained
        paddingTop: 12, // Added small buffer
    },
    greeting: {
        fontSize: 14,
        color: '#6B7280',
        fontWeight: '600',
    },
    title: {
        fontSize: 28,
        fontWeight: '900',
        color: '#111827',
        letterSpacing: -1,
    },
    profileButton: {
        padding: 4,
    },
    content: {
        flex: 1,
        paddingHorizontal: 24,
    },
    section: {
        marginBottom: 32,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: '700',
        color: '#111827',
        marginBottom: 16,
    },
    matchCard: {
        backgroundColor: '#fff',
        borderRadius: 24,
        padding: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.05,
        shadowRadius: 12,
        elevation: 4,
    },
    matchHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 16,
    },
    sportTag: {
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 12,
    },
    sportText: {
        fontSize: 12,
        fontWeight: '700',
    },
    matchTime: {
        fontSize: 12,
        color: '#6B7280',
        fontWeight: '500',
    },
    matchDetails: {
        gap: 8,
        marginBottom: 20,
    },
    row: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    detailText: {
        fontSize: 14,
        color: '#374151',
        fontWeight: '500',
    },
    chatButton: {
        backgroundColor: '#111827',
        paddingVertical: 12,
        borderRadius: 16,
        alignItems: 'center',
    },
    chatButtonText: {
        color: '#fff',
        fontWeight: '600',
        fontSize: 14,
    },
    emptyCard: {
        backgroundColor: '#fff',
        borderRadius: 24,
        padding: 32,
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 1,
        borderColor: '#E5E7EB',
        borderStyle: 'dashed',
    },
    emptyText: {
        marginTop: 16,
        fontSize: 16,
        fontWeight: '600',
        color: '#374151',
    },
    emptySubtext: {
        fontSize: 12,
        color: '#9CA3AF',
        marginTop: 4,
    },
    grid: {
        flexDirection: 'row',
        gap: 16,
        marginBottom: 32,
    },
    actionCard: {
        flex: 1,
        borderRadius: 24,
        padding: 20,
        justifyContent: 'space-between',
        height: 160,
    },
    iconCircle: {
        width: 48,
        height: 48,
        borderRadius: 24,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 16,
    },
    actionTitle: {
        fontSize: 18,
        fontWeight: '700',
        color: '#111827',
        marginBottom: 4,
    },
    actionDesc: {
        fontSize: 12,
        color: '#4B5563',
        lineHeight: 16,
    },
    hScroll: {
        overflow: 'visible',
    },
    trendCard: {
        backgroundColor: '#fff',
        paddingHorizontal: 20,
        paddingVertical: 12,
        borderRadius: 16,
        marginRight: 12,
        borderWidth: 1,
        borderColor: '#F3F4F6',
    },
    trendText: {
        fontSize: 14,
        fontWeight: '600',
        color: '#374151',
    }
});
