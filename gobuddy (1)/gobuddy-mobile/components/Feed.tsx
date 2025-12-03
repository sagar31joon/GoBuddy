import React, { useState } from 'react';
import {
    View,
    Text,
    ScrollView,
    Image,
    TouchableOpacity,
    StyleSheet,
    Share,
    Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Post } from '../types';

interface FeedProps {
    posts: Post[];
    onConnect: (userName: string) => void;
}

const Feed: React.FC<FeedProps> = ({ posts, onConnect }) => {
    const [likedPosts, setLikedPosts] = useState<string[]>([]);
    const [expandedPosts, setExpandedPosts] = useState<string[]>([]);

    const toggleLike = (id: string) => {
        if (likedPosts.includes(id)) {
            setLikedPosts(likedPosts.filter(p => p !== id));
        } else {
            setLikedPosts([...likedPosts, id]);
        }
    };

    const toggleExpand = (id: string) => {
        if (expandedPosts.includes(id)) {
            setExpandedPosts(expandedPosts.filter(p => p !== id));
        } else {
            setExpandedPosts([...expandedPosts, id]);
        }
    };

    const handleShare = async (post: Post) => {
        try {
            await Share.share({
                message: `Join ${post.user.name} for ${post.sport}: ${post.content}`,
                title: `GoBuddy - ${post.sport}`,
            });
        } catch (error) {
            console.error('Error sharing:', error);
        }
    };

    const handleComment = (postId: string) => {
        Alert.alert('Comments', 'Comments section coming soon!');
    };

    return (
        <View style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <View>
                    <Text style={styles.headerTitle}>Feed</Text>
                    <Text style={styles.headerSubtitle}>ACTIVITY NEARBY</Text>
                </View>
                <TouchableOpacity style={styles.messageButton}>
                    <Ionicons name="chatbubbles" size={22} color="#111827" />
                    <View style={styles.notificationDot} />
                </TouchableOpacity>
            </View>

            {/* Posts */}
            <ScrollView style={styles.scrollView} contentContainerStyle={styles.postsContainer}>
                {posts.length === 0 ? (
                    <View style={styles.emptyState}>
                        <Ionicons name="person" size={48} color="#9CA3AF" />
                        <Text style={styles.emptyText}>No posts yet. Be the first!</Text>
                    </View>
                ) : (
                    posts.map((post) => (
                        <View key={post.id} style={styles.postCard}>
                            {/* Header */}
                            <View style={styles.postHeader}>
                                <View style={styles.userInfo}>
                                    <View style={styles.avatarContainer}>
                                        <Image source={{ uri: post.user.avatar }} style={styles.avatar} />
                                        {post.user.isOnline && <View style={styles.onlineBadge} />}
                                    </View>
                                    <View>
                                        <Text style={styles.userName}>{post.user.name}</Text>
                                        <Text style={styles.postMeta}>
                                            {post.createdAt} • {post.sport}
                                        </Text>
                                    </View>
                                </View>
                                <TouchableOpacity style={styles.moreButton}>
                                    <Ionicons name="ellipsis-horizontal" size={20} color="#D1D5DB" />
                                </TouchableOpacity>
                            </View>

                            {/* Content */}
                            <View style={styles.contentContainer}>
                                <Text
                                    style={styles.content}
                                    numberOfLines={expandedPosts.includes(post.id) ? undefined : 3}
                                >
                                    {post.content}
                                </Text>
                                {post.content.length > 120 && (
                                    <TouchableOpacity onPress={() => toggleExpand(post.id)}>
                                        <Text style={styles.readMore}>
                                            {expandedPosts.includes(post.id) ? 'Show less' : 'Read more'}
                                        </Text>
                                    </TouchableOpacity>
                                )}
                            </View>

                            {/* Metadata Chips */}
                            <View style={styles.chipsContainer}>
                                {post.locationType === 'live' ? (
                                    <View style={[styles.chip, styles.liveChip]}>
                                        <View style={styles.liveDot} />
                                        <Text style={styles.liveChipText}>Live Location</Text>
                                    </View>
                                ) : (
                                    <View style={[styles.chip, styles.locationChip]}>
                                        <Ionicons name="location" size={12} color="#6B7280" />
                                        <Text style={styles.locationChipText}>{post.locationName}</Text>
                                    </View>
                                )}

                                <View style={[styles.chip, styles.dateChip]}>
                                    <Ionicons name="calendar" size={12} color="#1E40AF" />
                                    <Text style={styles.dateChipText}>
                                        {new Date(post.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                                    </Text>
                                </View>

                                {post.isPaid ? (
                                    <View style={[styles.chip, styles.priceChip]}>
                                        <Text style={styles.priceChipText}>₹ {post.price}</Text>
                                    </View>
                                ) : (
                                    <View style={[styles.chip, styles.freeChip]}>
                                        <Text style={styles.freeChipText}>Free</Text>
                                    </View>
                                )}
                            </View>

                            {/* Divider */}
                            <View style={styles.divider} />

                            {/* Actions */}
                            <View style={styles.actions}>
                                <View style={styles.leftActions}>
                                    <TouchableOpacity
                                        onPress={() => toggleLike(post.id)}
                                        style={[
                                            styles.actionButton,
                                            likedPosts.includes(post.id) && styles.likedButton,
                                        ]}
                                    >
                                        <Ionicons
                                            name={likedPosts.includes(post.id) ? 'heart' : 'heart-outline'}
                                            size={20}
                                            color={likedPosts.includes(post.id) ? '#EF4444' : '#6B7280'}
                                        />
                                        <Text
                                            style={[
                                                styles.actionText,
                                                likedPosts.includes(post.id) && styles.likedText,
                                            ]}
                                        >
                                            {post.likes + (likedPosts.includes(post.id) ? 1 : 0)}
                                        </Text>
                                    </TouchableOpacity>

                                    <TouchableOpacity
                                        onPress={() => handleComment(post.id)}
                                        style={styles.actionButton}
                                    >
                                        <Ionicons name="chatbubble-outline" size={20} color="#6B7280" />
                                        <Text style={styles.actionText}>{post.comments}</Text>
                                    </TouchableOpacity>
                                </View>

                                <View style={styles.rightActions}>
                                    <TouchableOpacity
                                        onPress={() => handleShare(post)}
                                        style={styles.shareButton}
                                    >
                                        <Ionicons name="share-outline" size={20} color="#6B7280" />
                                    </TouchableOpacity>

                                    <TouchableOpacity
                                        onPress={() => onConnect(post.user.name)}
                                        style={styles.connectButton}
                                    >
                                        <Ionicons name="send" size={14} color="#fff" />
                                        <Text style={styles.connectText}>Connect</Text>
                                    </TouchableOpacity>
                                </View>
                            </View>
                        </View>
                    ))
                )}

                <View style={styles.endOfFeed}>
                    <View style={styles.endLine} />
                    <Text style={styles.endText}>END OF FEED</Text>
                </View>
            </ScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F9FAFB',
    },
    header: {
        backgroundColor: 'rgba(255, 255, 255, 0.8)',
        paddingHorizontal: 16,
        paddingVertical: 16,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderBottomWidth: 1,
        borderBottomColor: '#F3F4F6',
    },
    headerTitle: {
        fontSize: 24,
        fontWeight: '900',
        color: '#111827',
        letterSpacing: -0.5,
    },
    headerSubtitle: {
        fontSize: 10,
        fontWeight: '700',
        color: '#6B7280',
        letterSpacing: 1,
    },
    messageButton: {
        backgroundColor: '#F3F4F6',
        padding: 10,
        borderRadius: 20,
        position: 'relative',
    },
    notificationDot: {
        position: 'absolute',
        top: 8,
        right: 8,
        width: 8,
        height: 8,
        backgroundColor: '#EF4444',
        borderRadius: 4,
        borderWidth: 1,
        borderColor: '#fff',
    },
    scrollView: {
        flex: 1,
    },
    postsContainer: {
        padding: 16,
        gap: 24,
        paddingBottom: 100,
    },
    emptyState: {
        alignItems: 'center',
        paddingVertical: 80,
        opacity: 0.5,
    },
    emptyText: {
        marginTop: 16,
        fontSize: 14,
        fontWeight: '700',
        color: '#6B7280',
    },
    postCard: {
        backgroundColor: '#fff',
        borderRadius: 32,
        padding: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.04,
        shadowRadius: 30,
        elevation: 2,
        borderWidth: 1,
        borderColor: '#F3F4F6',
    },
    postHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: 16,
    },
    userInfo: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 14,
    },
    avatarContainer: {
        position: 'relative',
    },
    avatar: {
        width: 48,
        height: 48,
        borderRadius: 16,
        borderWidth: 2,
        borderColor: '#F9FAFB',
    },
    onlineBadge: {
        position: 'absolute',
        bottom: -2,
        right: -2,
        width: 14,
        height: 14,
        backgroundColor: '#10B981',
        borderRadius: 7,
        borderWidth: 2,
        borderColor: '#fff',
    },
    userName: {
        fontSize: 15,
        fontWeight: '700',
        color: '#111827',
    },
    postMeta: {
        fontSize: 12,
        color: '#9CA3AF',
        fontWeight: '500',
    },
    moreButton: {
        padding: 8,
        marginRight: -8,
    },
    contentContainer: {
        marginBottom: 16,
    },
    content: {
        fontSize: 15,
        lineHeight: 22,
        color: '#6B7280',
    },
    readMore: {
        fontSize: 12,
        fontWeight: '700',
        color: '#2563EB',
        marginTop: 4,
    },
    chipsContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 8,
        marginBottom: 20,
    },
    chip: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 12,
        gap: 6,
    },
    liveChip: {
        backgroundColor: '#D1FAE5',
        borderWidth: 1,
        borderColor: '#A7F3D0',
    },
    liveDot: {
        width: 8,
        height: 8,
        borderRadius: 4,
        backgroundColor: '#10B981',
    },
    liveChipText: {
        fontSize: 11,
        fontWeight: '700',
        color: '#065F46',
    },
    locationChip: {
        backgroundColor: '#F9FAFB',
        borderWidth: 1,
        borderColor: '#F3F4F6',
    },
    locationChipText: {
        fontSize: 11,
        fontWeight: '700',
        color: '#6B7280',
    },
    dateChip: {
        backgroundColor: '#DBEAFE',
        borderWidth: 1,
        borderColor: '#BFDBFE',
    },
    dateChipText: {
        fontSize: 11,
        fontWeight: '700',
        color: '#1E40AF',
    },
    priceChip: {
        backgroundColor: '#FEF3C7',
        borderWidth: 1,
        borderColor: '#FDE68A',
    },
    priceChipText: {
        fontSize: 11,
        fontWeight: '700',
        color: '#92400E',
    },
    freeChip: {
        backgroundColor: '#D1FAE5',
        borderWidth: 1,
        borderColor: '#A7F3D0',
    },
    freeChipText: {
        fontSize: 11,
        fontWeight: '700',
        color: '#065F46',
    },
    divider: {
        height: 1,
        backgroundColor: '#F9FAFB',
        marginBottom: 16,
    },
    actions: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    leftActions: {
        flexDirection: 'row',
        gap: 16,
    },
    actionButton: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 20,
    },
    likedButton: {
        backgroundColor: '#FEE2E2',
    },
    actionText: {
        fontSize: 14,
        fontWeight: '700',
        color: '#6B7280',
    },
    likedText: {
        color: '#EF4444',
    },
    rightActions: {
        flexDirection: 'row',
        gap: 8,
    },
    shareButton: {
        padding: 8,
        borderRadius: 20,
    },
    connectButton: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        backgroundColor: '#111827',
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
        elevation: 4,
    },
    connectText: {
        fontSize: 12,
        fontWeight: '700',
        color: '#fff',
    },
    endOfFeed: {
        alignItems: 'center',
        paddingVertical: 32,
    },
    endLine: {
        width: 64,
        height: 4,
        backgroundColor: '#E5E7EB',
        borderRadius: 2,
        marginBottom: 16,
    },
    endText: {
        fontSize: 10,
        fontWeight: '700',
        color: '#9CA3AF',
        letterSpacing: 2,
    },
});

export default Feed;
