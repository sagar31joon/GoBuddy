import React, { useState } from 'react';
import { Post } from '../types';
import { Heart, MessageCircle, MoreHorizontal, Share2, MapPin, Calendar, IndianRupee, MessageSquareText, Send, User, CheckCircle, Info } from 'lucide-react';

interface FeedProps {
  posts: Post[];
  onConnect: (userName: string) => void;
}

const Feed: React.FC<FeedProps> = ({ posts, onConnect }) => {
  const [likedPosts, setLikedPosts] = useState<string[]>([]);
  const [expandedPosts, setExpandedPosts] = useState<string[]>([]);
  const [notification, setNotification] = useState<{msg: string, type: 'success' | 'info'} | null>(null);
  
  const showNotification = (msg: string, type: 'success' | 'info' = 'info') => {
    setNotification({msg, type});
    setTimeout(() => setNotification(null), 3000);
  };

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

  const handleShare = (post: Post) => {
    if (navigator.share) {
        navigator.share({
            title: `Join ${post.user.name} for ${post.sport}`,
            text: post.content,
            url: window.location.href,
        }).then(() => showNotification("Content shared!", 'success'))
          .catch(console.error);
    } else {
        navigator.clipboard.writeText(`Check out this sport activity: ${post.content}`);
        showNotification("Link copied to clipboard!", 'success');
    }
  };

  const handleComment = (postId: string) => {
      showNotification("Comments section loading...", 'info');
  };

  return (
    <div className="bg-gray-50 min-h-full pb-24 font-sans relative">
      {/* Toast Notification */}
      {notification && (
        <div className={`fixed top-24 left-1/2 transform -translate-x-1/2 px-6 py-3 rounded-2xl shadow-2xl z-[100] animate-fade-in-down flex items-center gap-3 ${notification.type === 'success' ? 'bg-green-600 text-white' : 'bg-gray-900 text-white'}`}>
            {notification.type === 'success' ? <CheckCircle size={20} /> : <Info size={20} />}
            <span className="text-sm font-bold">{notification.msg}</span>
        </div>
      )}

      <div className="bg-white/80 backdrop-blur-md px-4 py-4 sticky top-0 z-30 border-b border-gray-100 flex justify-between items-center shadow-sm">
        <div>
            <h1 className="text-2xl font-black text-gray-900 tracking-tight">Feed</h1>
            <p className="text-xs text-gray-500 font-bold uppercase tracking-wide">Activity Nearby</p>
        </div>
        <button className="bg-gray-100 p-2.5 rounded-full hover:bg-blue-50 hover:text-blue-600 transition-colors relative">
            <MessageSquareText size={22} />
            <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border border-white"></span>
        </button>
      </div>

      <div className="space-y-6 p-4">
        {posts.length === 0 ? (
            <div className="text-center py-20 opacity-50">
                <User size={48} className="mx-auto mb-4 text-gray-400" />
                <p className="text-gray-500 font-bold">No posts yet. Be the first!</p>
            </div>
        ) : posts.map((post) => (
          <div key={post.id} className="bg-white rounded-[2rem] p-5 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100 transition-all hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)]">
            {/* Header */}
            <div className="flex justify-between items-start mb-4">
              <div className="flex items-center gap-3.5">
                <div className="relative cursor-pointer">
                  <img src={post.user.avatar} alt={post.user.name} className="w-12 h-12 rounded-2xl object-cover ring-2 ring-gray-50" />
                  {post.user.isOnline && (
                    <div className="absolute -bottom-1 -right-1 w-3.5 h-3.5 bg-green-500 border-2 border-white rounded-full"></div>
                  )}
                </div>
                <div>
                  <h3 className="font-bold text-gray-900 text-[15px] leading-tight">{post.user.name}</h3>
                  <span className="text-xs text-gray-400 font-medium">{post.createdAt} • {post.sport}</span>
                </div>
              </div>
              <button className="text-gray-300 hover:text-gray-600 p-2 -mr-2">
                  <MoreHorizontal size={20} />
              </button>
            </div>

            {/* Content */}
            <div className="mb-4">
                <p className={`text-gray-600 text-[15px] leading-relaxed font-normal ${expandedPosts.includes(post.id) ? '' : 'line-clamp-3'}`}>
                {post.content}
                </p>
                {post.content.length > 120 && (
                    <button 
                        onClick={() => toggleExpand(post.id)}
                        className="text-blue-600 text-xs font-bold mt-1 hover:underline"
                    >
                        {expandedPosts.includes(post.id) ? 'Show less' : 'Read more'}
                    </button>
                )}
            </div>

            {/* Chips / Metadata */}
            <div className="flex flex-wrap gap-2 mb-5">
               {post.locationType === 'live' ? (
                   <span className="inline-flex items-center gap-1.5 text-[11px] font-bold bg-green-50 text-green-700 px-3 py-1.5 rounded-xl border border-green-100">
                     <span className="relative flex h-2 w-2">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                    </span>
                     Live Location
                   </span>
               ) : (
                   <span className="inline-flex items-center gap-1.5 text-[11px] font-bold bg-gray-50 text-gray-600 px-3 py-1.5 rounded-xl border border-gray-100">
                     <MapPin size={12} /> {post.locationName}
                   </span>
               )}

               <span className="inline-flex items-center gap-1.5 text-[11px] font-bold bg-blue-50 text-blue-700 px-3 py-1.5 rounded-xl border border-blue-100">
                 <Calendar size={12} /> {new Date(post.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
               </span>

               {post.isPaid ? (
                   <span className="inline-flex items-center gap-1 text-[11px] font-bold bg-amber-50 text-amber-700 px-3 py-1.5 rounded-xl border border-amber-100">
                    <IndianRupee size={10} strokeWidth={3} /> {post.price}
                   </span>
               ) : (
                    <span className="inline-flex items-center gap-1.5 text-[11px] font-bold bg-teal-50 text-teal-700 px-3 py-1.5 rounded-xl border border-teal-100">
                    Free
                   </span>
               )}
            </div>

            {/* Divider */}
            <div className="h-px bg-gray-50 mb-4" />

            {/* Actions */}
            <div className="flex items-center justify-between text-gray-500">
              <div className="flex items-center gap-4">
                <button 
                    onClick={() => toggleLike(post.id)}
                    className={`flex items-center gap-2 px-3 py-1.5 rounded-full transition-all active:scale-95 ${likedPosts.includes(post.id) ? 'bg-red-50 text-red-500' : 'hover:bg-gray-50'}`}
                >
                  <Heart size={20} className={likedPosts.includes(post.id) ? 'fill-red-500' : ''} />
                  <span className="text-sm font-bold">{post.likes + (likedPosts.includes(post.id) ? 1 : 0)}</span>
                </button>
                <button 
                    onClick={() => handleComment(post.id)}
                    className="flex items-center gap-2 hover:bg-gray-50 px-3 py-1.5 rounded-full transition-colors active:bg-gray-100"
                >
                  <MessageCircle size={20} />
                  <span className="text-sm font-bold">{post.comments}</span>
                </button>
              </div>
              
              <div className="flex gap-2">
                 <button 
                    onClick={() => handleShare(post)}
                    className="hover:text-gray-800 transition-colors p-2 hover:bg-gray-50 rounded-full active:bg-gray-200"
                 >
                    <Share2 size={20} />
                 </button>
                 <button 
                    onClick={() => onConnect(post.user.name)}
                    className="flex items-center gap-2 bg-gray-900 text-white px-4 py-2 rounded-full text-xs font-bold hover:bg-gray-800 active:scale-95 transition-all shadow-md"
                 >
                    <Send size={14} /> Connect
                 </button>
              </div>
            </div>
          </div>
        ))}

        <div className="text-center py-8">
            <div className="w-16 h-1 bg-gray-200 mx-auto rounded-full mb-4"></div>
            <p className="text-gray-400 text-xs font-bold uppercase tracking-widest">End of Feed</p>
        </div>
      </div>
    </div>
  );
};

export default Feed;