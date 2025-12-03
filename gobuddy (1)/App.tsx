import React, { useState, useEffect } from 'react';
import { Tab, Post, CreatePostPayload } from './types';
import { MOCK_POSTS, MOCK_USER } from './constants';
import BottomNav from './components/BottomNav';
import MapView from './components/MapView';
import Feed from './components/Feed';
import CreatePostModal from './components/CreatePostModal';
import Profile from './components/Profile';
import AuthScreen from './components/AuthScreen';
import ChatWindow from './components/ChatWindow';
import { Send } from 'lucide-react';

const App: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [activeTab, setActiveTab] = useState<Tab>(Tab.NEAR_ME);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [chatPartner, setChatPartner] = useState<string | null>(null);

  // Check Local Storage for Auth
  useEffect(() => {
    const isAuth = localStorage.getItem('gobuddy_auth');
    if (isAuth === 'true') {
        setIsAuthenticated(true);
    }
  }, []);

  const handleLogin = () => {
      localStorage.setItem('gobuddy_auth', 'true');
      setIsAuthenticated(true);
  };

  const handleLogout = () => {
      localStorage.removeItem('gobuddy_auth');
      setIsAuthenticated(false);
      setActiveTab(Tab.NEAR_ME);
  };
  
  // Initialize posts from localStorage if available, otherwise use MOCK_POSTS
  const [posts, setPosts] = useState<Post[]>(() => {
    const savedPosts = localStorage.getItem('gobuddy_posts');
    if (savedPosts) {
      return JSON.parse(savedPosts);
    }
    return MOCK_POSTS;
  });

  // Save to localStorage whenever posts change
  useEffect(() => {
    localStorage.setItem('gobuddy_posts', JSON.stringify(posts));
  }, [posts]);

  const handleCreatePost = (payload: CreatePostPayload) => {
    const newPost: Post = {
      id: Date.now().toString(),
      user: { ...MOCK_USER, isOnline: true },
      content: payload.content,
      sport: 'General', 
      date: payload.date,
      locationType: payload.isLiveLocation ? 'live' : 'manual',
      locationName: payload.isLiveLocation ? 'Current Location' : payload.manualLocation,
      splitBill: payload.splitBill,
      isPaid: payload.isPaid,
      price: payload.price,
      likes: 0,
      comments: 0,
      coordinates: payload.isLiveLocation ? { x: 50, y: 50 } : undefined,
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

  return (
    <div className="bg-gray-200 min-h-screen flex justify-center items-start overflow-hidden font-sans">
      
      {/* Chat Window Overlay */}
      {chatPartner && (
          <ChatWindow partnerName={chatPartner} onClose={() => setChatPartner(null)} />
      )}

      {/* Mobile Container */}
      <div className="w-full max-w-md h-[100dvh] bg-gray-50 shadow-2xl relative flex flex-col overflow-hidden sm:rounded-3xl sm:my-4 sm:h-[95dvh] border-gray-200 sm:border-4">
        
        {/* Render Login Screen inside container if not authenticated */}
        {!isAuthenticated ? (
            <AuthScreen onLogin={handleLogin} />
        ) : (
            <>
                {/* Main Content Area */}
                <div className="flex-1 overflow-y-auto no-scrollbar relative bg-gray-50 pb-28">
                {activeTab === Tab.NEAR_ME && <MapView posts={posts} onConnect={handleConnect} />}
                {activeTab === Tab.FEED && <Feed posts={posts} onConnect={handleConnect} />}
                {activeTab === Tab.PROFILE && <Profile onLogout={handleLogout} />}
                
                {/* Placeholders for Coach tab */}
                {activeTab === Tab.COACH && (
                    <div className="flex flex-col items-center justify-center h-full p-8 text-center bg-gray-50 animate-fade-in-up">
                        <div className="bg-blue-100 p-8 rounded-[2rem] mb-8 shadow-sm rotate-3 transform hover:rotate-0 transition-all duration-500">
                            <span className="text-7xl drop-shadow-md">🏆</span>
                        </div>
                        <h2 className="text-3xl font-black text-gray-900 mb-3 tracking-tight">Find a Coach</h2>
                        <p className="text-gray-500 text-base leading-relaxed max-w-xs mx-auto font-medium">
                            Professional coaching sessions coming soon. Improve your game with expert guidance nearby.
                        </p>
                        <button className="mt-10 px-8 py-4 bg-gray-900 text-white font-bold rounded-2xl shadow-xl shadow-gray-300 hover:bg-black hover:scale-105 active:scale-95 transition-all">
                            Notify Me
                        </button>
                    </div>
                )}
                </div>

                {/* Bottom Navigation */}
                <BottomNav 
                activeTab={activeTab} 
                setActiveTab={setActiveTab} 
                onOpenCreate={() => setIsCreateModalOpen(true)}
                />

                {/* Create Post Modal */}
                <CreatePostModal 
                isOpen={isCreateModalOpen} 
                onClose={() => setIsCreateModalOpen(false)}
                onSubmit={handleCreatePost}
                />
            </>
        )}

      </div>
    </div>
  );
};

export default App;