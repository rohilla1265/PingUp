import React from 'react';
import { dummyConnectionsData } from '../src/assets/assets';
import { Eye, MessageSquare } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function Messages() {
    const navigate = useNavigate(); // Fixed typo: was "nsvigate"

    return (
        <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
            {/* Header Section */}
            <div className="max-w-4xl mx-auto mb-8">
                <h1 className="text-3xl font-bold text-gray-900 mb-2">Messages</h1>
                <p className="text-lg text-gray-600">Talk to your family and friends</p>
            </div>

            {/* Users List */}
            <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                {dummyConnectionsData.map((user) => (
                    <div 
                        key={user._id}
                        className="flex items-center p-4 border-b border-gray-100 last:border-b-0 hover:bg-gray-50 transition-colors duration-200"
                    >
                        {/* User Avatar */}
                        <img 
                            src={user.profile_picture} 
                            alt={user.full_name}
                            className="w-12 h-12 rounded-full object-cover border-2 border-gray-200"
                        />

                        {/* User Info */}
                        <div className="ml-4 flex-1 min-w-0">
                            <div className="flex items-baseline justify-between mb-1">
                                <h3 className="text-base font-semibold text-gray-900 truncate">
                                    {user.full_name}
                                </h3>
                                <p className="text-sm text-gray-500 ml-2">@{user.username}</p>
                            </div>
                            <p className="text-sm text-gray-600 truncate">
                                {user.bio}
                            </p>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex space-x-2 ml-4">
                            <button 
                                onClick={() => navigate(`/messages/${user._id}`)} // Fixed: use navigate function
                                className="flex items-center justify-center bg-blue-600 text-white p-2 rounded-lg hover:bg-blue-700 transition-colors duration-200"
                            >
                                <MessageSquare size={16} />
                            </button>
                            <button 
                                onClick={() => navigate(`/profile/${user._id}`)} // Fixed: use navigate function
                                className="flex items-center justify-center bg-gray-200 text-gray-700 p-2 rounded-lg hover:bg-gray-300 transition-colors duration-200"
                            >
                                <Eye size={16} />
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}