import React, { useState, useRef, useEffect } from 'react';
import { X, MapPin, Calendar, IndianRupee, Sparkles, Loader2, Coins } from 'lucide-react';
import { MOCK_USER } from '../constants';
import { CreatePostPayload } from '../types';
import { enhancePostContent } from '../services/geminiService';

interface CreatePostModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (post: CreatePostPayload) => void;
}

const CreatePostModal: React.FC<CreatePostModalProps> = ({ isOpen, onClose, onSubmit }) => {
  const [content, setContent] = useState('');
  const [isLiveLocation, setIsLiveLocation] = useState(true);
  const [manualLocation, setManualLocation] = useState('');
  const [splitBill, setSplitBill] = useState(false);
  const [isPaid, setIsPaid] = useState(false);
  const [price, setPrice] = useState('');
  const [date, setDate] = useState('');
  const [isEnhancing, setIsEnhancing] = useState(false);
  const [aiError, setAiError] = useState('');

  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isPaid && scrollRef.current) {
        setTimeout(() => {
            scrollRef.current?.scrollTo({
                top: scrollRef.current.scrollHeight,
                behavior: 'smooth'
            });
        }, 100);
    }
  }, [isPaid]);

  if (!isOpen) return null;

  const handleEnhance = async () => {
    if (!content) return;
    setIsEnhancing(true);
    setAiError('');
    try {
      const newContent = await enhancePostContent(content);
      setContent(newContent);
    } catch (err) {
      console.warn("Using fallback polish due to error");
      const fallbacks = [
        `Looking for a partner for ${content.split(' ')[2] || 'sports'}! 🎾 Anyone interested?`,
        `Let's play! 🏆 ${content} - join me?`,
        `${content} ⚡ Ready to sweat?`
      ];
      setContent(fallbacks[0]);
    } finally {
      setIsEnhancing(false);
    }
  };

  const handlePriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    if (val === '' || /^\d+$/.test(val)) {
        setPrice(val);
    }
  };

  const handleSubmit = () => {
    if (!content) return;
    onSubmit({
      content,
      isLiveLocation,
      manualLocation,
      splitBill,
      isPaid,
      price: isPaid ? parseInt(price) || 0 : undefined,
      date: date || new Date().toISOString(),
    });
    setContent('');
    setIsLiveLocation(true);
    setManualLocation('');
    setIsPaid(false);
    setPrice('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[2000] flex items-end sm:items-center justify-center font-sans">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-gray-900/60 backdrop-blur-sm transition-opacity" 
        onClick={onClose}
      />

      {/* Modal Content - Increased Z-index and Height for Mobile */}
      <div className="bg-white w-full max-w-md h-[90dvh] sm:h-auto sm:max-h-[85vh] flex flex-col sm:rounded-[2rem] rounded-t-[2.5rem] shadow-2xl relative z-[2010] animate-slide-up">
        
        {/* Sticky Header */}
        <div className="flex justify-between items-center p-6 pb-2 border-b border-gray-50 bg-white rounded-t-[2.5rem] z-20 shrink-0">
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full transition-colors -ml-2">
            <X size={24} className="text-gray-500" />
          </button>
          <span className="font-extrabold text-xl text-gray-900">New Activity</span>
          <button 
            onClick={handleSubmit}
            className="px-6 py-2 bg-blue-600 text-white font-bold rounded-full text-sm hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg shadow-blue-200"
            disabled={!content.trim()}
          >
            Post
          </button>
        </div>

        {/* Scrollable Content with Extra Bottom Padding */}
        <div ref={scrollRef} className="flex-1 overflow-y-auto p-6 pt-2 pb-64">
            
            {/* User Info */}
            <div className="flex items-center gap-3 mb-6">
            <img 
                src={MOCK_USER.avatar} 
                alt="User" 
                className="w-12 h-12 rounded-2xl object-cover border border-gray-100 shadow-sm"
            />
            <div>
                <h3 className="font-bold text-gray-900">{MOCK_USER.name}</h3>
                <div className="flex items-center text-xs text-gray-500 gap-1.5 font-medium">
                <span className={`w-2 h-2 rounded-full ${isLiveLocation ? 'bg-green-500 animate-pulse' : 'bg-gray-300'}`}></span>
                {isLiveLocation ? 'Live Location ON' : 'Manual Location'}
                </div>
            </div>
            </div>

            {/* Content Input */}
            <div className="relative min-h-[120px] mb-4">
            <textarea
                className="w-full h-full text-lg text-gray-800 placeholder-gray-400 focus:outline-none resize-none bg-transparent leading-relaxed"
                placeholder="What's the plan? e.g., Tennis match at Central Park, need a partner..."
                value={content}
                onChange={(e) => setContent(e.target.value)}
                rows={4}
            />
            
            {/* AI Enhance Button */}
            {content.length > 5 && (
                <div className="absolute bottom-0 right-0 flex items-center gap-2">
                {aiError && <span className="text-xs text-red-500 bg-red-50 px-2 py-1 rounded-md">{aiError}</span>}
                <button 
                    onClick={handleEnhance}
                    disabled={isEnhancing}
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-gradient-to-r from-violet-600 to-indigo-600 text-white rounded-full text-xs font-bold shadow-md hover:shadow-lg transition-all hover:-translate-y-0.5 active:translate-y-0"
                >
                    {isEnhancing ? <Loader2 size={12} className="animate-spin" /> : <Sparkles size={12} />}
                    {isEnhancing ? 'Polishing...' : 'AI Polish'}
                </button>
                </div>
            )}
            </div>

            {/* Options / Filters */}
            <div className="space-y-4">
            {/* Location Toggle */}
            <div className="flex items-center justify-between p-3.5 bg-gray-50 rounded-2xl border border-gray-100">
                <div className="flex items-center gap-3">
                <div className="bg-white p-2 rounded-xl text-blue-600 shadow-sm border border-gray-100">
                    <MapPin size={20} />
                </div>
                <div className="flex flex-col">
                    <span className="text-sm font-bold text-gray-800">Location</span>
                    <span className="text-[11px] text-gray-500 font-medium">{isLiveLocation ? 'Sharing precise location' : 'Not sharing precise location'}</span>
                </div>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" checked={isLiveLocation} onChange={() => setIsLiveLocation(!isLiveLocation)} className="sr-only peer" />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                </label>
            </div>

            {!isLiveLocation && (
                <input 
                type="text" 
                placeholder="Enter location manually..."
                className="w-full p-4 border border-gray-200 rounded-2xl text-sm focus:border-blue-500 focus:outline-none bg-gray-50 font-medium transition-all focus:ring-2 focus:ring-blue-100"
                value={manualLocation}
                onChange={(e) => setManualLocation(e.target.value)}
                />
            )}

            {/* Date Picker */}
            <div className="flex items-center gap-3 p-3.5 border border-gray-200 rounded-2xl hover:bg-gray-50 transition-colors">
                <Calendar size={20} className="text-gray-500 ml-1" />
                <input 
                type="date" 
                className="flex-1 bg-transparent text-sm focus:outline-none text-gray-700 font-bold"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                />
            </div>

            {/* Money Options */}
            <div className="flex gap-3">
                <button 
                onClick={() => { setSplitBill(!splitBill); if(!splitBill) setIsPaid(false); }}
                className={`flex-1 py-3 px-3 rounded-2xl border flex items-center justify-center gap-2 text-sm font-bold transition-all ${splitBill ? 'bg-purple-50 border-purple-200 text-purple-700 shadow-sm ring-1 ring-purple-100' : 'border-gray-200 text-gray-600 hover:bg-gray-50'}`}
                >
                    <span className="text-lg">½</span> Split Bill
                </button>

                <button 
                onClick={() => { setIsPaid(!isPaid); if(!isPaid) setSplitBill(false); }}
                className={`flex-1 py-3 px-3 rounded-2xl border flex items-center justify-center gap-2 text-sm font-bold transition-all ${isPaid ? 'bg-amber-50 border-amber-200 text-amber-700 shadow-sm ring-1 ring-amber-100' : 'border-gray-200 text-gray-600 hover:bg-gray-50'}`}
                >
                    <Coins size={16} /> Paid Entry
                </button>
            </div>

            {/* Price Input (Only if Paid) */}
            {isPaid && (
                <div className="animate-slide-down flex items-center border border-amber-200 bg-amber-50 rounded-2xl px-4 py-3">
                <IndianRupee size={18} className="text-amber-700 mr-2" />
                <input 
                    type="text" 
                    inputMode="numeric"
                    placeholder="Enter amount (e.g. 500)"
                    className="flex-1 bg-transparent text-amber-900 font-bold placeholder-amber-400/70 focus:outline-none"
                    value={price}
                    onChange={handlePriceChange}
                />
                </div>
            )}
            </div>
        </div>

      </div>
    </div>
  );
};

export default CreatePostModal;