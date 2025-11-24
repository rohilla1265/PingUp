import { Check, Heart, MessageCircle, Share } from 'lucide-react';
import React, { useState } from 'react';
import moment from 'moment';
import { assets, dummyUserData } from '../src/assets/assets';
import { Navigate, useNavigate } from 'react-router-dom';
export default function PostCard({ post, showSponsored = false }) {
  const [likes, setLikes] = useState(post.likes_count || 0);
  const [comments] = useState(post.comments_count || 0);
  const [shares] = useState(post.shares_count || 0);
  const [liked, setLiked] = useState(false);
  const currentUser = dummyUserData;
  const navigate = useNavigate();
  const handleLike = () => {
    if (liked) {
      setLikes(likes - 1);
    } else {
      setLikes(likes + 1);
    }
    setLiked(!liked);
  };

  const renderWithHashtags = (text) => {
    if (!text) return '';
    return text.replace(/(#\w+)/g, '<span class="text-indigo-500 hover:text-indigo-600 cursor-pointer font-medium">$1</span>');
  };

  const getImageLayout = (imageCount) => {
    switch (imageCount) {
      case 1:
        return {
          gridClass: 'grid-cols-1',
          imageClass: 'h-80 md:h-96'
        };
      case 2:
        return {
          gridClass: 'grid-cols-2',
          imageClass: 'h-64'
        };
      case 3:
        return {
          gridClass: 'grid-cols-2 md:grid-cols-3',
          imageClass: 'h-48 md:h-56'
        };
      case 4:
        return {
          gridClass: 'grid-cols-2',
          imageClass: 'h-48'
        };
      default:
        return {
          gridClass: 'grid-cols-2 md:grid-cols-3',
          imageClass: 'h-40'
        };
    }
  };

  const imageLayout = post.image_urls ? getImageLayout(post.image_urls.length) : null;

  return (
    <div className="flex gap-6">
      {/* Main Post Content */}
      <div className="flex-1 bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-all duration-300">
        {/* Post Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-4">
            <div className="relative" >
              <img 
                src={post.user.profile_picture} 
                alt={`${post.user.name}'s profile`}
                className="w-12 h-12 rounded-full object-cover border-2 border-gray-100 shadow-sm"
              />
              <button className="absolute -bottom-1 -right-1 bg-blue-500 text-white p-1.5 rounded-full shadow-md hover:bg-blue-600 transition-colors duration-200">
                <Check size={14} />
              </button>
            </div>
            
            <div className="flex flex-col" onClick={()=>navigate(`/profile/`+post.user._id)}>
              <span className="font-semibold text-gray-900 text-base">{post.user.full_name}</span>
              <span className="text-sm text-gray-500 font-medium">
                {moment(post.createdAt).fromNow()}
              </span>
            </div>
          </div>
        </div>

        {/* Post Content */}
        {post.content && (
          <div 
            className="prose prose-base max-w-none text-gray-700 mb-6 leading-relaxed"
            dangerouslySetInnerHTML={{ __html: renderWithHashtags(post.content) }} 
          />
        )}

        {/* Images Grid */}
        {post.image_urls && post.image_urls.length > 0 && (
          <div className={`mb-6 grid gap-3 ${imageLayout.gridClass}`}>
            {post.image_urls.map((img, index) => (
              <div key={index} className="relative overflow-hidden rounded-xl border border-gray-200 shadow-sm">
                <img 
                  src={img} 
                  alt={`Post image ${index + 1}`}
                  className={`w-full ${imageLayout.imageClass} object-cover transition-transform duration-300 hover:scale-105 cursor-pointer`}
                  onDoubleClick={handleLike}
                />
              </div>
            ))}
          </div>
        )}

        {/* Engagement Stats */}
        <div className="flex items-center justify-between py-4 border-t border-gray-200">
          <div className="flex items-center space-x-2 text-sm text-gray-600">
            <button onClick={handleLike} className="flex items-center space-x-2 hover:scale-110 transition-transform">
              <Heart 
                size={18} 
                className={`${liked ? 'text-red-500 fill-red-500' : 'text-gray-500'} transition-all duration-200`}
              />
            </button>
            <span className="font-medium">{likes} likes</span>
          </div>

          <div className="flex items-center space-x-4 text-sm text-gray-600">
            <span className="font-medium">{comments} comments</span>
            <span className="font-medium">{shares} shares</span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-between pt-3 border-t border-gray-200">
          <button 
            onClick={handleLike}
            className={`flex-1 flex items-center justify-center space-x-3 py-3 px-4 rounded-lg transition-colors duration-200 font-medium ${
              liked 
                ? 'text-red-500 bg-red-50 hover:bg-red-100' 
                : 'text-gray-600 hover:bg-gray-50'
            }`}
          >
            <Heart size={20} className={liked ? 'fill-red-500' : ''} />
            <span>{liked ? 'Liked' : 'Like'}</span>
          </button>

          <button className="flex-1 flex items-center justify-center space-x-3 py-3 px-4 rounded-lg hover:bg-gray-50 transition-colors duration-200 text-gray-600 font-medium">
            <MessageCircle size={20} />
            <span>Comment</span>
          </button>

          <button className="flex-1 flex items-center justify-center space-x-3 py-3 px-4 rounded-lg hover:bg-gray-50 transition-colors duration-200 text-gray-600 font-medium">
            <Share size={20} />
            <span>Share</span>
          </button>
        </div>
      </div>

      {/* Sticky Sponsored Section - Only shown when showSponsored is true */}
      {showSponsored && (
        <div className="w-80 flex-shrink-0">
          <div className="sticky top-6">
            <div className="bg-gradient-to-br from-blue-50 to-indigo-100 rounded-xl border border-blue-200 p-5 shadow-sm">
              <div className="flex flex-col">
                <div className="flex items-center space-x-2 mb-3">
                  <span className="px-2 py-1 bg-blue-100 text-blue-700 text-xs font-semibold rounded-full">
                    Sponsored
                  </span>
                  <span className="text-xs text-gray-500">• Ad</span>
                </div>
                
                <div className="mb-4">
                  <img 
                    src={assets.sponsored_img} 
                    alt="Sponsored Content"
                    className="w-full h-40 rounded-lg object-cover shadow-md mb-3"
                  />
                </div>
                
                <h3 className="font-bold text-gray-900 text-lg mb-2">
                  Email Marketing
                </h3>
                
                <p className="text-gray-600 text-sm leading-relaxed mb-4">
                  Supercharge your marketing with a powerful, easy to use platform built for results. 
                  Reach your audience effectively with our advanced email marketing tools.
                </p>
                
                <div className="flex items-center justify-between">
                  <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-semibold transition-colors duration-200 shadow-sm">
                    Learn More
                  </button>
                  
                  <span className="text-xs text-gray-500 flex items-center space-x-1">
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                    </svg>
                    <span>2 days ago</span>
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}