import React, { useState, useEffect, useRef } from 'react';
import { Send, Phone, Video, X, MoreVertical, Image, Mic } from 'lucide-react';

interface ChatWindowProps {
  partnerName: string;
  onClose: () => void;
}

interface Message {
  id: number;
  text: string;
  sender: 'me' | 'them';
  time: string;
}

const ChatWindow: React.FC<ChatWindowProps> = ({ partnerName, onClose }) => {
  const [messages, setMessages] = useState<Message[]>([
    { id: 1, text: `Hey! I saw your post about sports.`, sender: 'me', time: 'Just now' }
  ]);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  // Simulate initial reply
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsTyping(false);
      setMessages(prev => [
        ...prev, 
        { id: 2, text: `Hi! Yes, I'm still looking for a partner. Are you interested?`, sender: 'them', time: 'Just now' }
      ]);
    }, 2000);
    return () => clearTimeout(timer);
  }, []);

  const handleSend = () => {
    if (!inputText.trim()) return;
    
    const newMsg: Message = {
      id: Date.now(),
      text: inputText,
      sender: 'me',
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, newMsg]);
    setInputText('');
    
    // Simulate reply
    setIsTyping(true);
    setTimeout(() => {
      setIsTyping(false);
      setMessages(prev => [
        ...prev,
        { 
          id: Date.now() + 1, 
          text: "Sounds great! Let's connect at the venue.", 
          sender: 'them', 
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) 
        }
      ]);
    }, 2500);
  };

  return (
    <div className="fixed inset-0 z-[2000] flex items-center justify-center bg-black/20 backdrop-blur-sm sm:p-4 font-sans">
      <div className="w-full h-full sm:max-w-md sm:h-[85vh] bg-white sm:rounded-[2rem] shadow-2xl flex flex-col overflow-hidden animate-slide-up ring-1 ring-black/5">
        
        {/* Header */}
        <div className="bg-white px-4 py-3 border-b border-gray-100 flex items-center justify-between shadow-sm z-10">
          <div className="flex items-center gap-3">
            <button onClick={onClose} className="p-1 -ml-1 hover:bg-gray-100 rounded-full text-blue-600">
               <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M15 18l-6-6 6-6"/></svg>
            </button>
            <div className="relative">
              <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-blue-400 to-blue-600 flex items-center justify-center text-white font-bold text-lg">
                {partnerName.charAt(0)}
              </div>
              <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></div>
            </div>
            <div>
              <h3 className="font-bold text-gray-900 leading-tight">{partnerName}</h3>
              <p className="text-[11px] text-gray-500 font-medium">Active now</p>
            </div>
          </div>
          <div className="flex items-center gap-4 text-blue-600">
            <Phone size={22} className="cursor-pointer hover:opacity-70" />
            <Video size={24} className="cursor-pointer hover:opacity-70" />
            <MoreVertical size={22} className="text-gray-400 cursor-pointer" />
          </div>
        </div>

        {/* Messages Area */}
        <div className="flex-1 overflow-y-auto p-4 bg-gray-50 space-y-4">
          <div className="text-center text-xs text-gray-400 font-medium my-4">
            Today
          </div>
          
          {messages.map((msg) => (
            <div 
              key={msg.id} 
              className={`flex w-full ${msg.sender === 'me' ? 'justify-end' : 'justify-start'}`}
            >
              {msg.sender === 'them' && (
                 <div className="w-7 h-7 rounded-full bg-gradient-to-tr from-blue-400 to-blue-600 flex-shrink-0 mr-2 flex items-center justify-center text-white text-xs font-bold mt-auto">
                    {partnerName.charAt(0)}
                 </div>
              )}
              <div 
                className={`max-w-[75%] px-4 py-2.5 rounded-2xl text-[15px] leading-relaxed shadow-sm ${
                  msg.sender === 'me' 
                    ? 'bg-blue-600 text-white rounded-br-none' 
                    : 'bg-white text-gray-800 border border-gray-100 rounded-bl-none'
                }`}
              >
                {msg.text}
              </div>
            </div>
          ))}

          {isTyping && (
             <div className="flex justify-start w-full">
                <div className="w-7 h-7 rounded-full bg-gradient-to-tr from-blue-400 to-blue-600 flex-shrink-0 mr-2 mt-auto"></div>
                <div className="bg-white border border-gray-100 px-4 py-3 rounded-2xl rounded-bl-none shadow-sm flex items-center gap-1">
                  <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce"></span>
                  <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce delay-75"></span>
                  <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce delay-150"></span>
                </div>
             </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <div className="p-3 bg-white border-t border-gray-100 flex items-center gap-3 pb-6">
           <div className="flex gap-3 text-blue-600">
             <div className="p-2 bg-blue-50 rounded-full cursor-pointer hover:bg-blue-100">
                <Image size={20} />
             </div>
             <div className="p-2 bg-blue-50 rounded-full cursor-pointer hover:bg-blue-100">
                <Mic size={20} />
             </div>
           </div>
           
           <div className="flex-1 relative">
             <input 
               type="text" 
               className="w-full bg-gray-100 rounded-full pl-4 pr-10 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-100 transition-all text-gray-800 placeholder-gray-500 font-medium"
               placeholder="Type a message..."
               value={inputText}
               onChange={(e) => setInputText(e.target.value)}
               onKeyDown={(e) => e.key === 'Enter' && handleSend()}
               autoFocus
             />
           </div>

           <button 
             onClick={handleSend}
             disabled={!inputText.trim()}
             className="p-2.5 bg-blue-600 text-white rounded-full hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all active:scale-95 shadow-lg shadow-blue-200"
           >
             <Send size={18} className={inputText.trim() ? "ml-0.5" : ""} />
           </button>
        </div>

      </div>
    </div>
  );
};

export default ChatWindow;