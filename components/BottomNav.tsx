import React from 'react';
import { Map, List, Plus, User, Trophy } from 'lucide-react';
import { Tab } from '../types';

interface BottomNavProps {
  activeTab: Tab;
  setActiveTab: (tab: Tab) => void;
  onOpenCreate: () => void;
}

const BottomNav: React.FC<BottomNavProps> = ({ activeTab, setActiveTab, onOpenCreate }) => {
  const getTabClass = (tab: Tab) => {
    return activeTab === tab 
      ? "relative text-blue-600 flex flex-col items-center justify-center transition-all duration-300 transform scale-105" 
      : "relative text-gray-400 flex flex-col items-center justify-center hover:text-gray-600 transition-all duration-300";
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 z-[500] max-w-md mx-auto">
      {/* SVG Background for Curve Effect */}
      <div className="absolute bottom-0 w-full h-[88px] drop-shadow-[0_-5px_10px_rgba(0,0,0,0.03)] pointer-events-none">
        <svg viewBox="0 0 375 88" fill="none" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none" className="w-full h-full">
            <path fillRule="evenodd" clipRule="evenodd" d="M0 24C0 10.7452 10.7452 0 24 0H129.5C136.634 0 142.924 3.99842 146.109 10.2743C148.868 15.7099 154.498 19.5 161.025 19.5H213.975C220.502 19.5 226.132 15.7099 228.891 10.2743C232.076 3.99842 238.366 0 245.5 0H351C364.255 0 375 10.7452 375 24V88H0V24Z" fill="white"/>
        </svg>
      </div>

      <div className="relative flex justify-between items-end px-2 pb-5 h-[88px]">
        {/* Left Icons */}
        <div className="flex-1 flex justify-around items-center mb-1">
          <button onClick={() => setActiveTab(Tab.NEAR_ME)} className={getTabClass(Tab.NEAR_ME)}>
            <Map size={24} strokeWidth={activeTab === Tab.NEAR_ME ? 2.5 : 2} />
            <span className={`text-[10px] font-bold mt-1 transition-opacity ${activeTab === Tab.NEAR_ME ? 'opacity-100' : 'opacity-70'}`}>Map</span>
            {activeTab === Tab.NEAR_ME && <span className="absolute -top-2 w-1 h-1 bg-blue-600 rounded-full" />}
          </button>

          <button onClick={() => setActiveTab(Tab.FEED)} className={getTabClass(Tab.FEED)}>
            <List size={24} strokeWidth={activeTab === Tab.FEED ? 2.5 : 2} />
            <span className={`text-[10px] font-bold mt-1 transition-opacity ${activeTab === Tab.FEED ? 'opacity-100' : 'opacity-70'}`}>Feed</span>
             {activeTab === Tab.FEED && <span className="absolute -top-2 w-1 h-1 bg-blue-600 rounded-full" />}
          </button>
        </div>

        {/* Floating Action Button (Center) */}
        <div className="relative -top-6 mx-2">
            <button 
                onClick={onOpenCreate}
                className="group relative bg-gray-900 text-white rounded-full w-16 h-16 flex items-center justify-center shadow-xl shadow-gray-400/40 hover:bg-black transition-all transform hover:scale-105 active:scale-95 z-50 overflow-hidden"
            >
                {/* Pulse Ring */}
                <div className="absolute inset-0 rounded-full border border-white/20 animate-ping opacity-20 group-hover:opacity-40"></div>
                <div className="absolute inset-0 bg-gradient-to-tr from-blue-600/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                <Plus size={32} strokeWidth={3} className="relative z-10 group-hover:rotate-90 transition-transform duration-300" />
            </button>
        </div>

        {/* Right Icons */}
        <div className="flex-1 flex justify-around items-center mb-1">
          <button onClick={() => setActiveTab(Tab.COACH)} className={getTabClass(Tab.COACH)}>
            <Trophy size={24} strokeWidth={activeTab === Tab.COACH ? 2.5 : 2} />
            <span className={`text-[10px] font-bold mt-1 transition-opacity ${activeTab === Tab.COACH ? 'opacity-100' : 'opacity-70'}`}>Coach</span>
             {activeTab === Tab.COACH && <span className="absolute -top-2 w-1 h-1 bg-blue-600 rounded-full" />}
          </button>

          <button onClick={() => setActiveTab(Tab.PROFILE)} className={getTabClass(Tab.PROFILE)}>
            <User size={24} strokeWidth={activeTab === Tab.PROFILE ? 2.5 : 2} />
            <span className={`text-[10px] font-bold mt-1 transition-opacity ${activeTab === Tab.PROFILE ? 'opacity-100' : 'opacity-70'}`}>Profile</span>
             {activeTab === Tab.PROFILE && <span className="absolute -top-2 w-1 h-1 bg-blue-600 rounded-full" />}
          </button>
        </div>
      </div>
    </div>
  );
};

export default BottomNav;