import React, { useState, useEffect } from 'react';
import { View, TouchableOpacity, StyleSheet, Text, ActivityIndicator, Animated } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider, useSafeAreaInsets } from 'react-native-safe-area-context';
import { Post, CreatePostPayload, Tab } from './types';
import { MOCK_POSTS, MOCK_USER } from './constants';
import { storage } from './utils/storage';

// Components
import AuthScreen from './components/AuthScreen';
import MapView from './components/MapView';
import Feed from './components/Feed';
import Profile from './components/Profile';
import CreatePostModal from './components/CreatePostModal';
import ChatWindow from './components/ChatWindow';
import Play from './components/Play';

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [activeTab, setActiveTab] = useState<Tab>(Tab.PLAY);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [chatPartner, setChatPartner] = useState<string | null>(null);
  const [posts, setPosts] = useState<Post[]>(MOCK_POSTS);
  const [isLoading, setIsLoading] = useState(true);

  // Animation for create button
  const spinValue = React.useRef(new Animated.Value(0)).current;
  const pulseValue = React.useRef(new Animated.Value(1)).current;

  useEffect(() => {
    // Pulse animation
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseValue, {
          toValue: 1.1,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(pulseValue, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, []);

  const spin = spinValue.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '45deg']
  });

  // Check authentication on mount
  useEffect(() => {
    initializeApp();
  }, []);

  // Save posts to storage whenever they change
  useEffect(() => {
    if (!isLoading) {
      savePosts();
    }
  }, [posts]);

  const initializeApp = async () => {
    try {
      // Check authentication
      const isAuth = await storage.getItem('gobuddy_auth');
      setIsAuthenticated(isAuth === 'true');

      // Load posts
      const savedPosts = await storage.getObject<Post[]>('gobuddy_posts');
      if (savedPosts && savedPosts.length > 0) {
        setPosts(savedPosts);
      }
    } catch (error) {
      console.error('Error initializing app:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const savePosts = async () => {
    try {
      await storage.setObject('gobuddy_posts', posts);
    } catch (error) {
      console.error('Error saving posts:', error);
    }
  };

  const handleLogin = async () => {
    try {
      await storage.setItem('gobuddy_auth', 'true');
      setIsAuthenticated(true);
    } catch (error) {
      console.error('Error logging in:', error);
    }
  };

  const handleLogout = async () => {
    try {
      await storage.removeItem('gobuddy_auth');
      setIsAuthenticated(false);
      setActiveTab(Tab.PLAY);
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  const handleCreatePost = (payload: CreatePostPayload) => {
    const newPost: Post = {
      id: Date.now().toString(),
      user: { ...MOCK_USER, isOnline: true },
      content: payload.content,
      sport: payload.sport || 'General',
      date: payload.date,
      locationType: payload.isLiveLocation ? 'live' : 'manual',
      locationName: payload.isLiveLocation ? 'Current Location' : payload.manualLocation,
      skillLevel: payload.skillLevel,
      splitBill: payload.splitBill,
      likes: 0,
      comments: 0,
      coordinates: payload.isLiveLocation
        ? { latitude: 28.6139 + Math.random() * 0.1, longitude: 77.2090 + Math.random() * 0.1 }
        : undefined,
      createdAt: 'Just now'
    };

    setPosts([newPost, ...posts]);

    // Auto switch to relevant tab
    if (payload.isLiveLocation) {
      setActiveTab(Tab.NEAR_ME);
    } else {
      setActiveTab(Tab.FEED);
    }
  };

  const handleConnect = (userName: string) => {
    setChatPartner(userName);
  };

  if (isLoading) {
    return (
      <View style={[styles.container, styles.loadingContainer]}>
        <ActivityIndicator size="large" color="#2563EB" />
        <Text style={styles.loadingText}>Loading GoBuddy...</Text>
      </View>
    );
  }

  if (!isAuthenticated) {
    return (
      <>
        <StatusBar style="dark" />
        <AuthScreen onLogin={handleLogin} />
      </>
    );
  }

  const handleCreatePress = () => {
    Animated.spring(spinValue, {
      toValue: 1,
      useNativeDriver: true,
    }).start();
    setIsCreateModalOpen(true);
  };

  const handleCloseModal = () => {
    Animated.spring(spinValue, {
      toValue: 0,
      useNativeDriver: true,
    }).start();
    setIsCreateModalOpen(false);
  };

  const handleNavFromPlay = (target: 'near_me' | 'feed' | 'create' | 'profile') => {
    if (target === 'create') {
      handleCreatePress();
    } else if (target === 'near_me') {
      setActiveTab(Tab.NEAR_ME);
    } else if (target === 'feed') {
      setActiveTab(Tab.FEED);
    } else if (target === 'profile') {
      setActiveTab(Tab.PROFILE);
    }
  };

  return (
    <SafeAreaProvider>
      <AppContent
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        isCreateModalOpen={isCreateModalOpen}
        setIsCreateModalOpen={setIsCreateModalOpen}
        posts={posts}
        onConnect={handleConnect}
        onCreatePost={handleCreatePost}
        onLogout={handleLogout}
        handleCreatePress={handleCreatePress}
        handleCloseModal={handleCloseModal}
        handleNavFromPlay={handleNavFromPlay}
        chatPartner={chatPartner}
        setChatPartner={setChatPartner}
        spin={spin}
        pulseValue={pulseValue}
      />
    </SafeAreaProvider>
  );
}

function AppContent({
  activeTab,
  setActiveTab,
  isCreateModalOpen,
  setIsCreateModalOpen,
  posts,
  onConnect,
  onCreatePost,
  onLogout,
  handleCreatePress,
  handleCloseModal,
  handleNavFromPlay,
  chatPartner,
  setChatPartner,
  spin,
  pulseValue,
}: any) {
  const insets = useSafeAreaInsets();

  return (
    <View style={styles.container}>
      <StatusBar style="dark" />

      {/* Main Content */}
      <View style={styles.content}>
        {activeTab === Tab.PLAY && <Play onNavigate={handleNavFromPlay} upcomingMatch={posts.find((p: Post) => p.skillLevel && new Date(p.date) > new Date())} />}
        {activeTab === Tab.NEAR_ME && <MapView posts={posts} onConnect={onConnect} />}
        {activeTab === Tab.FEED && <Feed posts={posts} onConnect={onConnect} />}
        {activeTab === Tab.PROFILE && <Profile onLogout={onLogout} />}
      </View>

      {/* Bottom Navigation */}
      <View style={[styles.bottomNav, { paddingBottom: Math.max(insets.bottom, 20) }]}>
        <TouchableOpacity
          style={styles.navItem}
          onPress={() => setActiveTab(Tab.PLAY)}
        >
          <Ionicons
            name={activeTab === Tab.PLAY ? 'home' : 'home-outline'}
            size={24}
            color={activeTab === Tab.PLAY ? '#2563EB' : '#9CA3AF'}
          />
          <Text style={[styles.navLabel, activeTab === Tab.PLAY && styles.navLabelActive]}>
            Play
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.navItem}
          onPress={() => setActiveTab(Tab.NEAR_ME)}
        >
          <Ionicons
            name={activeTab === Tab.NEAR_ME ? 'location' : 'location-outline'}
            size={24}
            color={activeTab === Tab.NEAR_ME ? '#2563EB' : '#9CA3AF'}
          />
          <Text style={[styles.navLabel, activeTab === Tab.NEAR_ME && styles.navLabelActive]}>
            Near Me
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.createButton}
          onPress={handleCreatePress}
          activeOpacity={0.9}
        >
          <Animated.View
            style={[
              styles.createButtonInner,
              {
                transform: [
                  { rotate: spin },
                  { scale: pulseValue }
                ]
              }
            ]}
          >
            <Ionicons name="add" size={32} color="#fff" />
          </Animated.View>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.navItem}
          onPress={() => setActiveTab(Tab.FEED)}
        >
          <Ionicons
            name={activeTab === Tab.FEED ? 'list' : 'list-outline'}
            size={24}
            color={activeTab === Tab.FEED ? '#2563EB' : '#9CA3AF'}
          />
          <Text style={[styles.navLabel, activeTab === Tab.FEED && styles.navLabelActive]}>
            Feed
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.navItem}
          onPress={() => setActiveTab(Tab.PROFILE)}
        >
          <Ionicons
            name={activeTab === Tab.PROFILE ? 'person' : 'person-outline'}
            size={24}
            color={activeTab === Tab.PROFILE ? '#2563EB' : '#9CA3AF'}
          />
          <Text style={[styles.navLabel, activeTab === Tab.PROFILE && styles.navLabelActive]}>
            Profile
          </Text>
        </TouchableOpacity>
      </View>

      {/* Create Post Modal */}
      <CreatePostModal
        isOpen={isCreateModalOpen}
        onClose={handleCloseModal}
        onSubmit={onCreatePost}
      />

      {/* Chat Window */}
      {chatPartner && (
        <ChatWindow
          user={{
            name: chatPartner,
            avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&h=150', // Fallback avatar
            sport: 'General'
          }}
          onClose={() => setChatPartner(null)}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  loadingContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    fontWeight: '600',
    color: '#6B7280',
  },
  content: {
    flex: 1,
  },
  bottomNav: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#F3F4F6',
    paddingTop: 12,
    paddingHorizontal: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 8,
    justifyContent: 'space-around',
  },
  navItem: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  navLabel: {
    fontSize: 10,
    fontWeight: '600',
    color: '#9CA3AF',
    marginTop: 4,
  },
  navLabelActive: {
    color: '#2563EB',
  },
  createButton: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginTop: -35,
    shadowColor: '#2563EB',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
    backgroundColor: 'transparent',
    zIndex: 10, // Ensure it's clickable
  },
  createButtonInner: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#111827', // Darker create button for contrast
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 4,
    borderColor: '#F9FAFB', // Match background to look floating
  },
});
