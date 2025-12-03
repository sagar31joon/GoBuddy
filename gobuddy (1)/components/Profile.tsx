import React, { useState, useRef } from 'react';
import { Settings, Edit3, Award, Activity, MapPin, Check, X, Camera, Bell, Shield, HelpCircle, LogOut, ChevronRight, Image as ImageIcon, ArrowLeft, Send } from 'lucide-react';
import { MOCK_USER } from '../constants';

interface ProfileProps {
    onLogout: () => void;
}

const Profile: React.FC<ProfileProps> = ({ onLogout }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  
  // File Inputs Refs
  const avatarInputRef = useRef<HTMLInputElement>(null);
  const coverInputRef = useRef<HTMLInputElement>(null);
  
  // Profile State
  const [name, setName] = useState(MOCK_USER.name);
  const [bio, setBio] = useState(MOCK_USER.bio);
  const [location, setLocation] = useState('Mumbai, India');
  const [avatar, setAvatar] = useState(MOCK_USER.avatar);
  const [coverImage, setCoverImage] = useState('https://images.unsplash.com/photo-1541534741688-6078c6bfb5c5?auto=format&fit=crop&w=800&q=80');
  const [sports, setSports] = useState<string[]>(MOCK_USER.sports || []);
  const [newSport, setNewSport] = useState('');

  // Handle Image Uploads
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, type: 'avatar' | 'cover') => {
      const file = e.target.files?.[0];
      if (file) {
          const reader = new FileReader();
          reader.onloadend = () => {
              if (typeof reader.result === 'string') {
                  if (type === 'avatar') setAvatar(reader.result);
                  else setCoverImage(reader.result);
              }
          };
          reader.readAsDataURL(file);
      }
  };

  const handleSave = () => {
    setIsEditing(false);
    // In a real app, API call here
  };

  const handleAddSport = () => {
      if(newSport && !sports.includes(newSport)) {
          setSports([...sports, newSport]);
          setNewSport('');
      }
  };

  const removeSport = (s: string) => {
      setSports(sports.filter(sport => sport !== s));
  };

  const SettingsModal = () => {
    const [view, setView] = useState<'menu' | 'notifications' | 'privacy' | 'help'>('menu');
    const [chatMsg, setChatMsg] = useState('');
    const [chatHistory, setChatHistory] = useState([
        { text: 'Hello! How can we help you today?', sender: 'agent' }
    ]);
    const [notificationsEnabled, setNotificationsEnabled] = useState(true);
    const [privacyEnabled, setPrivacyEnabled] = useState(true);

    const handleSendSupport = () => {
        if(!chatMsg.trim()) return;
        const newHistory = [...chatHistory, { text: chatMsg, sender: 'me' }];
        setChatHistory(newHistory);
        setChatMsg('');
        
        setTimeout(() => {
            setChatHistory([...newHistory, { text: 'Thanks for your query. A support agent will respond shortly.', sender: 'agent' }]);
        }, 1500);
    };

    const Header = ({ title }: { title: string }) => (
        <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2">
                {view !== 'menu' && (
                    <button onClick={() => setView('menu')} className="p-1 rounded-full hover:bg-gray-100">
                        <ArrowLeft size={20} />
                    </button>
                )}
                <h3 className="text-xl font-bold text-gray-900">{title}</h3>
            </div>
            <button onClick={() => setShowSettings(false)} className="p-2 bg-gray-100 rounded-full hover:bg-gray-200">
                <X size={20} />
            </button>
        </div>
    );

    return (
      <div className="fixed inset-0 z-[600] flex items-center justify-center px-4 font-sans">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setShowSettings(false)}></div>
          <div className="bg-white w-full max-w-sm rounded-3xl p-6 relative animate-slide-up shadow-2xl h-[450px] flex flex-col">
              
              {view === 'menu' && (
                <>
                  <Header title="Settings" />
                  <div className="space-y-2">
                      <button onClick={() => setView('notifications')} className="w-full flex items-center justify-between p-4 rounded-2xl hover:bg-gray-50 transition-colors group">
                          <div className="flex items-center gap-3">
                              <div className="bg-blue-50 p-2 rounded-xl text-blue-600"><Bell size={20} /></div>
                              <span className="font-semibold text-gray-700">Notifications</span>
                          </div>
                          <ChevronRight size={18} className="text-gray-400 group-hover:text-gray-600" />
                      </button>
                      <button onClick={() => setView('privacy')} className="w-full flex items-center justify-between p-4 rounded-2xl hover:bg-gray-50 transition-colors group">
                          <div className="flex items-center gap-3">
                              <div className="bg-green-50 p-2 rounded-xl text-green-600"><Shield size={20} /></div>
                              <span className="font-semibold text-gray-700">Privacy & Security</span>
                          </div>
                          <ChevronRight size={18} className="text-gray-400 group-hover:text-gray-600" />
                      </button>
                      <button onClick={() => setView('help')} className="w-full flex items-center justify-between p-4 rounded-2xl hover:bg-gray-50 transition-colors group">
                          <div className="flex items-center gap-3">
                              <div className="bg-purple-50 p-2 rounded-xl text-purple-600"><HelpCircle size={20} /></div>
                              <span className="font-semibold text-gray-700">Help & Support</span>
                          </div>
                          <ChevronRight size={18} className="text-gray-400 group-hover:text-gray-600" />
                      </button>
                      <div className="h-px bg-gray-100 my-2"></div>
                      <button 
                        onClick={onLogout}
                        className="w-full flex items-center justify-between p-4 rounded-2xl hover:bg-red-50 transition-colors group text-red-600"
                      >
                          <div className="flex items-center gap-3">
                              <div className="bg-red-100 p-2 rounded-xl"><LogOut size={20} /></div>
                              <span className="font-semibold">Log Out</span>
                          </div>
                      </button>
                  </div>
                </>
              )}

              {view === 'notifications' && (
                  <>
                    <Header title="Notifications" />
                    <div className="space-y-4">
                        <div className="flex items-center justify-between p-2">
                            <span className="font-medium text-gray-700">Push Notifications</span>
                            <div 
                                onClick={() => setNotificationsEnabled(!notificationsEnabled)}
                                className={`w-12 h-6 rounded-full p-1 cursor-pointer transition-colors ${notificationsEnabled ? 'bg-blue-600' : 'bg-gray-300'}`}
                            >
                                <div className={`w-4 h-4 rounded-full bg-white shadow-sm transition-transform ${notificationsEnabled ? 'translate-x-6' : 'translate-x-0'}`} />
                            </div>
                        </div>
                        <p className="text-xs text-gray-500 px-2">Receive alerts about new matches, messages, and sport events near you.</p>
                    </div>
                  </>
              )}

              {view === 'privacy' && (
                  <>
                    <Header title="Privacy" />
                    <div className="space-y-4">
                        <div className="flex items-center justify-between p-2">
                            <span className="font-medium text-gray-700">Profile Visibility</span>
                            <div 
                                onClick={() => setPrivacyEnabled(!privacyEnabled)}
                                className={`w-12 h-6 rounded-full p-1 cursor-pointer transition-colors ${privacyEnabled ? 'bg-green-600' : 'bg-gray-300'}`}
                            >
                                <div className={`w-4 h-4 rounded-full bg-white shadow-sm transition-transform ${privacyEnabled ? 'translate-x-6' : 'translate-x-0'}`} />
                            </div>
                        </div>
                        <p className="text-xs text-gray-500 px-2">Allow others to find you by your name and phone number.</p>
                    </div>
                  </>
              )}

              {view === 'help' && (
                  <div className="flex flex-col h-full">
                    <Header title="Support Chat" />
                    <div className="flex-1 overflow-y-auto bg-gray-50 rounded-xl p-3 space-y-3 mb-3">
                        {chatHistory.map((m, i) => (
                            <div key={i} className={`flex ${m.sender === 'me' ? 'justify-end' : 'justify-start'}`}>
                                <div className={`max-w-[80%] p-2 rounded-xl text-sm ${m.sender === 'me' ? 'bg-blue-600 text-white' : 'bg-white text-gray-800 shadow-sm'}`}>
                                    {m.text}
                                </div>
                            </div>
                        ))}
                    </div>
                    <div className="flex gap-2">
                        <input 
                            type="text" 
                            className="flex-1 bg-gray-100 rounded-full px-4 text-sm focus:outline-none"
                            placeholder="Type your query..."
                            value={chatMsg}
                            onChange={(e) => setChatMsg(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && handleSendSupport()}
                        />
                        <button onClick={handleSendSupport} className="p-2 bg-blue-600 text-white rounded-full">
                            <Send size={16} />
                        </button>
                    </div>
                  </div>
              )}
          </div>
      </div>
    );
  };

  return (
    <div className="bg-white min-h-full pb-24 font-sans relative">
        {showSettings && <SettingsModal />}

        {/* Hidden File Inputs */}
        <input 
            type="file" 
            ref={avatarInputRef} 
            className="hidden" 
            accept="image/*"
            onChange={(e) => handleFileChange(e, 'avatar')}
        />
        <input 
            type="file" 
            ref={coverInputRef} 
            className="hidden" 
            accept="image/*"
            onChange={(e) => handleFileChange(e, 'cover')}
        />

        {/* Header Image */}
        <div 
            className="h-44 bg-cover bg-center relative transition-all duration-500 group"
            style={{ backgroundImage: `url('${coverImage}')` }}
        >
            <div className="absolute inset-0 bg-gradient-to-b from-black/30 to-transparent"></div>
            
            {/* Settings Button */}
            <button 
                onClick={() => setShowSettings(true)}
                className="absolute top-6 right-6 p-2.5 bg-white/20 backdrop-blur-md rounded-full text-white hover:bg-white/30 transition-colors border border-white/20 z-10"
            >
                <Settings size={20} />
            </button>

            {/* Change Cover Button - Prominently Displayed in Edit Mode */}
            {isEditing && (
                <button 
                    onClick={() => coverInputRef.current?.click()}
                    className="absolute top-6 left-6 bg-white/90 text-gray-900 px-4 py-2 rounded-full text-xs font-bold shadow-lg flex items-center gap-2 hover:bg-white transition-all z-20 active:scale-95"
                >
                    <ImageIcon size={16} className="text-blue-600" /> 
                    Change Cover
                </button>
            )}
        </div>

        {/* Profile Info */}
        <div className="px-6 relative">
            <div className="flex justify-between items-end -mt-16 mb-4">
                <div className="relative group">
                    <img 
                        src={avatar} 
                        className="w-32 h-32 rounded-[2rem] border-[5px] border-white shadow-xl object-cover bg-white" 
                    />
                    {isEditing && (
                        <button 
                            onClick={() => avatarInputRef.current?.click()}
                            className="absolute bottom-0 right-0 bg-blue-600 text-white p-2.5 rounded-2xl border-4 border-white shadow-md hover:bg-blue-700 transition-colors active:scale-90"
                        >
                            <Camera size={18} />
                        </button>
                    )}
                </div>
                
                {isEditing ? (
                    <div className="flex gap-3 mb-2">
                        <button onClick={() => setIsEditing(false)} className="px-4 py-2 bg-gray-100 text-gray-600 rounded-xl font-bold hover:bg-gray-200 transition-colors text-xs">
                            Cancel
                        </button>
                        <button onClick={handleSave} className="px-4 py-2 bg-gray-900 text-white rounded-xl font-bold hover:bg-black transition-colors shadow-lg shadow-gray-300 text-xs">
                            Save
                        </button>
                    </div>
                ) : (
                    <button 
                        onClick={() => setIsEditing(true)}
                        className="flex items-center gap-2 px-5 py-2.5 bg-white border border-gray-200 text-gray-800 rounded-xl text-xs font-bold hover:bg-gray-50 transition-all shadow-sm mb-2 active:scale-95"
                    >
                        <Edit3 size={14} /> Edit Profile
                    </button>
                )}
            </div>

            <div className="mb-8 animate-fade-in-down">
                {isEditing ? (
                    <div className="space-y-4">
                        <div>
                            <label className="text-xs font-bold text-gray-400 uppercase tracking-wider ml-1">Full Name</label>
                            <input 
                                type="text" 
                                value={name} 
                                onChange={(e) => setName(e.target.value)}
                                className="w-full text-2xl font-bold text-gray-900 border-b-2 border-gray-200 focus:border-blue-600 focus:outline-none py-2 bg-transparent transition-colors"
                            />
                        </div>
                        <div>
                            <label className="text-xs font-bold text-gray-400 uppercase tracking-wider ml-1">Location</label>
                            <div className="flex items-center gap-2 border-b-2 border-gray-200 focus-within:border-blue-600 py-2">
                                <MapPin size={18} className="text-gray-400" />
                                <input 
                                    type="text" 
                                    value={location} 
                                    onChange={(e) => setLocation(e.target.value)}
                                    className="w-full text-sm font-medium text-gray-700 focus:outline-none bg-transparent"
                                />
                            </div>
                        </div>
                        <div>
                            <label className="text-xs font-bold text-gray-400 uppercase tracking-wider ml-1">Bio</label>
                            <textarea 
                                value={bio} 
                                onChange={(e) => setBio(e.target.value)}
                                className="w-full text-sm text-gray-600 border-2 border-gray-200 rounded-2xl p-4 mt-1 focus:border-blue-600 focus:outline-none h-28 resize-none bg-gray-50"
                            />
                        </div>
                    </div>
                ) : (
                    <>
                        <h2 className="text-3xl font-black text-gray-900 tracking-tight">{name}</h2>
                        <div className="flex items-center gap-1.5 text-gray-500 text-xs font-bold mt-2 uppercase tracking-wide">
                            <MapPin size={14} className="text-blue-500" />
                            <span>{location}</span>
                        </div>
                        <p className="text-gray-600 mt-5 text-[15px] leading-relaxed font-normal max-w-sm">
                            {bio}
                        </p>
                    </>
                )}
            </div>

            {/* Stats Row */}
            <div className="grid grid-cols-3 gap-4 mb-10">
                <div className="bg-gray-50 p-4 rounded-3xl text-center border border-gray-100 shadow-[0_4px_20px_rgba(0,0,0,0.02)]">
                    <span className="block text-2xl font-black text-gray-900 mb-1">24</span>
                    <span className="text-[10px] uppercase font-bold text-gray-400 tracking-wider">Matches</span>
                </div>
                <div className="bg-gray-50 p-4 rounded-3xl text-center border border-gray-100 shadow-[0_4px_20px_rgba(0,0,0,0.02)]">
                    <span className="block text-2xl font-black text-gray-900 mb-1">142</span>
                    <span className="text-[10px] uppercase font-bold text-gray-400 tracking-wider">Friends</span>
                </div>
                <div className="bg-gray-50 p-4 rounded-3xl text-center border border-gray-100 shadow-[0_4px_20px_rgba(0,0,0,0.02)]">
                    <span className="block text-2xl font-black text-gray-900 mb-1">4.9</span>
                    <span className="text-[10px] uppercase font-bold text-gray-400 tracking-wider">Rating</span>
                </div>
            </div>

            {/* Sports Tags */}
            <div className="mb-10">
                <h3 className="font-bold text-gray-900 mb-4 text-[13px] uppercase tracking-wider">Sports & Interests</h3>
                <div className="flex flex-wrap gap-2.5">
                    {sports.map((sport) => (
                        <div key={sport} className="relative group">
                            <span className="px-5 py-2.5 bg-white border border-gray-200 text-gray-700 rounded-2xl text-xs font-bold shadow-sm flex items-center gap-2">
                                {sport}
                                {isEditing && (
                                    <button onClick={() => removeSport(sport)} className="text-red-400 hover:text-red-600">
                                        <X size={12} strokeWidth={3} />
                                    </button>
                                )}
                            </span>
                        </div>
                    ))}
                    {isEditing ? (
                        <div className="flex items-center gap-2">
                            <input 
                                type="text" 
                                value={newSport}
                                onChange={(e) => setNewSport(e.target.value)}
                                placeholder="Add sport..."
                                className="px-4 py-2.5 bg-gray-50 rounded-2xl text-xs font-bold w-28 focus:outline-none focus:ring-2 focus:ring-blue-100"
                                onKeyDown={(e) => e.key === 'Enter' && handleAddSport()}
                            />
                            <button onClick={handleAddSport} className="p-2.5 bg-gray-900 text-white rounded-xl">
                                <Check size={14} />
                            </button>
                        </div>
                    ) : (
                        <button className="px-5 py-2.5 border border-dashed border-gray-300 text-gray-400 rounded-2xl text-xs font-bold hover:bg-gray-50 hover:border-gray-400 transition-all">
                            + Add
                        </button>
                    )}
                </div>
            </div>

            {/* Recent Activity */}
            <div>
                <h3 className="font-bold text-gray-900 mb-4 text-[13px] uppercase tracking-wider flex items-center gap-2">
                     Recent Activity
                </h3>
                <div className="space-y-4">
                    <div className="flex items-center gap-4 p-4 rounded-3xl border border-gray-100 bg-white shadow-[0_4px_20px_rgba(0,0,0,0.02)]">
                        <div className="bg-orange-50 p-3.5 rounded-2xl text-orange-600">
                            <Award size={24} />
                        </div>
                        <div>
                            <p className="text-sm font-bold text-gray-900">Won a Tennis Match</p>
                            <p className="text-xs text-gray-500 font-medium mt-0.5">Yesterday vs Srinjoy</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-4 p-4 rounded-3xl border border-gray-100 bg-white shadow-[0_4px_20px_rgba(0,0,0,0.02)]">
                        <div className="bg-purple-50 p-3.5 rounded-2xl text-purple-600">
                            <Activity size={24} />
                        </div>
                        <div>
                            <p className="text-sm font-bold text-gray-900">Completed 5km Run</p>
                            <p className="text-xs text-gray-500 font-medium mt-0.5">2 days ago</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
  );
};

export default Profile;