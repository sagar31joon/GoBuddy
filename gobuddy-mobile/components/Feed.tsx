import React, { useState } from 'react';
import {
    View,
    Text,
    ScrollView,
    Image,
    TouchableOpacity,
    StyleSheet,
    Dimensions
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Post } from '../types';

interface FeedProps {
    posts: Post[];
    onConnect: (userName: string) => void;
}

const { width } = Dimensions.get('window');

const SPORT_ICONS: Record<string, string> = {
    'Badminton': '🏸',
    'Tennis': '🎾',
    'Cricket': '🏏',
    'Soccer': '⚽',
    'Gym': '💪',
    'General': '🏃'
};

const Feed: React.FC<FeedProps> = ({ posts, onConnect }) => {
    const insets = useSafeAreaInsets();

    return (
        <View style={[styles.container, { paddingTop: insets.top }]}>
            <View style={styles.header}>
                <Text style={styles.headerTitle}>Upcoming Games</Text>
                <View style={styles.headerActions}>
                    <TouchableOpacity style={styles.iconBtn}>
                        <Ionicons name="people-outline" size={24} color="#111827" />
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.iconBtn}>
                        <Ionicons name="filter" size={24} color="#111827" />
                    </TouchableOpacity>
                </View>
            </View>

            <ScrollView contentContainerStyle={styles.list}>
                {posts.map(post => (
                    <View key={post.id} style={styles.card}>
                        {/* Header: User & Sport */}
                        <View style={styles.cardHeader}>
                            <View style={styles.userRow}>
                                <Image source={{ uri: post.user.avatar }} style={styles.avatar} />
                                <View>
                                    <Text style={styles.userName}>{post.user.name}</Text>
                                    <Text style={styles.timestamp}>Posted {post.createdAt}</Text>
                                </View>
                            </View>
                            <View style={styles.sportBadge}>
                                <Text style={styles.sportIcon}>{SPORT_ICONS[post.sport] || '🏃'}</Text>
                                <Text style={styles.sportName}>{post.sport}</Text>
                            </View>
                        </View>

                        {/* Content */}
                        <Text style={styles.content}>{post.content}</Text>

                        {/* Details Grid */}
                        <View style={styles.detailsGrid}>
                            <View style={styles.detailItem}>
                                <Ionicons name="calendar-outline" size={16} color="#6B7280" />
                                <Text style={styles.detailText}>
                                    {new Date(post.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })} • {new Date(post.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                </Text>
                            </View>
                            <View style={styles.detailItem}>
                                <Ionicons name="bar-chart-outline" size={16} color="#6B7280" />
                                <Text style={styles.detailText}>{post.skillLevel || 'All Levels'}</Text>
                            </View>
                            {post.splitBill && (
                                <View style={[styles.detailItem, { backgroundColor: '#ECFDF5' }]}>
                                    <Ionicons name="wallet-outline" size={16} color="#059669" />
                                    <Text style={[styles.detailText, { color: '#059669' }]}>Split Bill</Text>
                                </View>
                            )}
                        </View>

                        {/* Location Mini Map (Placeholder) */}
                        <View style={styles.locationContainer}>
                            <View style={styles.mapPlaceholder}>
                                <Ionicons name="map" size={24} color="#9CA3AF" />
                            </View>
                            <View style={styles.locationTextContainer}>
                                <Text style={styles.locationTitle}>{post.locationName}</Text>
                                <Text style={styles.locationSub}>Tap to view on map</Text>
                            </View>
                        </View>

                        {/* Actions Row */}
                        <View style={styles.actionsRow}>
                            <View style={styles.socialActions}>
                                <TouchableOpacity style={styles.socialBtn}>
                                    <Ionicons name="heart-outline" size={20} color="#6B7280" />
                                </TouchableOpacity>
                                <TouchableOpacity style={styles.socialBtn}>
                                    <Ionicons name="chatbubble-outline" size={20} color="#6B7280" />
                                </TouchableOpacity>
                            </View>

                            <TouchableOpacity style={styles.chatButton} onPress={() => onConnect(post.user.name)}>
                                <Text style={styles.chatText}>Chat</Text>
                                <Ionicons name="chatbubbles" size={16} color="#fff" />
                            </TouchableOpacity>
                        </View>

                    </View>
                ))}
            </ScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#F9FAFB' },
    header: {
        // paddingTop: 60, // REMOVED
        paddingTop: 12,
        paddingHorizontal: 20,
        paddingBottom: 20,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    headerTitle: { fontSize: 28, fontWeight: '800', color: '#111827' },
    headerActions: { flexDirection: 'row', gap: 12 },
    iconBtn: { padding: 8, backgroundColor: '#fff', borderRadius: 20, borderWidth: 1, borderColor: '#F3F4F6' },
    list: { padding: 20, gap: 24, paddingBottom: 100 },
    card: {
        backgroundColor: '#fff',
        borderRadius: 24,
        padding: 20,
        shadowColor: '#000',
        shadowOpacity: 0.05,
        shadowOffset: { width: 0, height: 4 },
        shadowRadius: 10,
        elevation: 3,
    },
    cardHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 16,
    },
    userRow: { flexDirection: 'row', alignItems: 'center', gap: 12 },
    avatar: { width: 40, height: 40, borderRadius: 20 },
    userName: { fontSize: 16, fontWeight: '700', color: '#111827' },
    timestamp: { fontSize: 12, color: '#9CA3AF' },
    sportBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 10,
        paddingVertical: 6,
        backgroundColor: '#EFF6FF',
        borderRadius: 12,
        gap: 6,
    },
    sportIcon: { fontSize: 14 },
    sportName: { fontSize: 12, fontWeight: '700', color: '#2563EB' },
    content: { fontSize: 14, color: '#4B5563', lineHeight: 22, marginBottom: 16 },
    detailsGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 12,
        marginBottom: 16,
    },
    detailItem: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
        paddingHorizontal: 10,
        paddingVertical: 6,
        backgroundColor: '#F3F4F6',
        borderRadius: 8,
    },
    detailText: { fontSize: 12, fontWeight: '600', color: '#374151' },
    locationContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
        backgroundColor: '#F9FAFB',
        padding: 12,
        borderRadius: 16,
        marginBottom: 16,
        borderWidth: 1,
        borderColor: '#F3F4F6',
    },
    mapPlaceholder: {
        width: 48,
        height: 48,
        borderRadius: 12,
        backgroundColor: '#E5E7EB',
        alignItems: 'center',
        justifyContent: 'center',
    },
    locationTextContainer: { flex: 1 },
    locationTitle: { fontSize: 14, fontWeight: '700', color: '#111827' },
    locationSub: { fontSize: 12, color: '#6B7280' },
    actionsRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
    socialActions: { flexDirection: 'row', gap: 12 },
    socialBtn: { padding: 8 },
    chatButton: {
        backgroundColor: '#111827',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 16,
        gap: 8,
    },
    chatText: { color: '#fff', fontSize: 14, fontWeight: '600' },
});

export default Feed;
