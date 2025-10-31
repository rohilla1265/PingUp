import React from 'react';
import { dummyUserData } from '../src/assets/assets';
import { MapPin, MessageCircle, Plus, UserPlus } from 'lucide-react';

const UserCard = ({user}) => {
    const currentUser = dummyUserData;
    
    const handleFollow = () => {
        // Follow functionality implementation
    }

    const handleConnectionRequest = () => {
        // Connection request functionality implementation
    }

    return (
        <div className="max-w-sm mx-auto bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 border border-gray-200">
            <div className="p-6">
                {/* Profile Header */}
                <div className="flex items-center space-x-4 mb-4">
                    <img 
                        src={user.profile_picture} 
                        alt={`${user.full_name}'s profile`}
                        className="w-16 h-16 rounded-full object-cover border-2 border-gray-200"
                    />
                    <div className="flex-1 min-w-0">
                        <p className="text-lg font-semibold text-gray-900 truncate">
                            {user.fulll_name}
                        </p>
                        {user.username && (
                            <p className="text-sm text-gray-500 truncate">
                                @{user.username}
                            </p>
                        )}
                    </div>
                </div>

                {/* Bio */}
                {user.bio && (
                    <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                        {user.bio}
                    </p>
                )}

                {/* Location and Followers */}
                <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                    <div className="flex items-center space-x-2">
                        <MapPin className="w-4 h-4" />
                        <span>{user.location}</span>
                    </div>
                    <span className="font-medium">
                        {user.followers.length} followers
                    </span>
                </div>

                {/* Action Buttons - Horizontal Layout */}
                <div className="flex flex-row gap-3">
                    {/* Follow Button */}
                    <button 
                        onClick={handleFollow}
                        className={`flex-1 py-2 px-4 rounded-lg transition-colors duration-200 flex items-center justify-center space-x-2 font-medium ${
                            currentUser.following.includes(user._id)
                                ? "bg-gray-100 text-gray-700 hover:bg-gray-200 border border-gray-300"
                                : "bg-blue-500 hover:bg-blue-600 text-white"
                        }`}
                    >
                        <UserPlus className="w-4 h-4" />
                        <span>{currentUser.following.includes(user._id) ? "Following" : "Follow"}</span>
                    </button>

                    {/* Connection Button */}
                    <button 
                        onClick={handleConnectionRequest}
                        className={`p-3 rounded-lg transition-colors duration-200 flex items-center justify-center ${
                            currentUser.connections.includes(user._id)
                                ? "bg-green-100 text-green-700 hover:bg-green-200 border border-green-300"
                                : "bg-gray-100 text-gray-700 hover:bg-gray-200 border border-gray-300"
                        }`}
                    >
                        {currentUser.connections.includes(user._id) ? (
                            <MessageCircle className="w-5 h-5" />
                        ) : (
                            <Plus className="w-5 h-5" />
                        )}
                    </button>
                </div>
            </div>
            
        </div>
    )
}

export default UserCard;