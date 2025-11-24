import React, { useState } from 'react';
import { Users, UserCheck, UserPlus, UserRoundPen, MessageSquare, User, UserMinus } from "lucide-react";
import { 
    dummyConnectionsData as connection,
    dummyFollowersData as followers,
    dummyFollowingData as following,
    dummyPendingConnectionsData as pendingConnections
} from '../src/assets/assets';
import { useNavigate } from 'react-router-dom';

export default function Connection(){
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState('connections');
    
    const tabs = [
        { id: 'followers', label: 'Followers', data: followers, icon: Users, count: followers.length },
        { id: 'following', label: 'Following', data: following, icon: UserCheck, count: following.length },
        { id: 'pending', label: 'Pending', data: pendingConnections, icon: UserRoundPen, count: pendingConnections.length },
        { id: 'connections', label: 'Connections', data: connection, icon: UserPlus, count: connection.length }
    ];

    const currentData = tabs.find(tab => tab.id === activeTab)?.data || [];

    const handleUnfollow = (userId) => {
        // Add unfollow logic here
        console.log('Unfollow user:', userId);
    };

    return(
        <div class="min-h-screen bg-gray-50 p-6">
            <div class="max-w-4xl mx-auto">
                <h1 class="text-3xl font-bold text-gray-900 mb-2">Connections</h1>
                <p class="text-gray-600 mb-8">Manage your Networks and Discover new Connections</p>
                
                {/* Stats Numbers */}
                <div class="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                    {tabs.map((item,index)=>(
                        <div key={index} class="bg-white p-4 rounded-lg shadow border text-center">
                            <b class="text-2xl font-bold text-gray-900 block">{item.count}</b>
                            <p class="text-gray-600 capitalize">{item.label}</p>
                        </div>
                    ))}
                </div>

                {/* Tabs */}
                <div class="bg-white rounded-lg shadow border">
                    <div class="flex border-b">
                        {tabs.map((tab) => {
                            const IconComponent = tab.icon;
                            return (
                                <button
                                    key={tab.id}
                                    onClick={() => setActiveTab(tab.id)}
                                    class={`flex items-center space-x-2 px-6 py-4 border-b-2 transition-colors ${
                                        activeTab === tab.id 
                                            ? 'border-blue-500 text-blue-600 bg-blue-50' 
                                            : 'border-transparent text-gray-600 hover:bg-gray-50'
                                    }`}
                                >
                                    <IconComponent size={18} />
                                    <span>{tab.label}</span>
                                </button>
                            );
                        })}
                    </div>
                    
                    {/* Tab Content */}
                    <div class="p-6">
                        {currentData.map((user) => (
                            <div key={user._id} class="flex items-center justify-between p-4 border-b last:border-b-0 hover:bg-gray-50">
                                <div class="flex items-center space-x-4">
                                    <img 
                                        src={user.profile_picture} 
                                        alt={user.full_name}
                                        class="w-12 h-12 rounded-full object-cover border"
                                    />
                                    <div>
                                        <h3 class="font-semibold text-gray-900">{user.full_name}</h3>
                                        <p class="text-gray-500">@{user.username}</p>
                                    </div>
                                </div>
                                
                                <div class="flex space-x-2">
                                    <button 
                                        onClick={() => navigate(`/profile/${user._id}`)}
                                        class="flex items-center space-x-2 bg-gray-200 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-300"
                                    >
                                        <User size={16} />
                                        <span>View Profile</span>
                                    </button>
                                    
                                    {activeTab === 'following' && (
                                        <button 
                                            onClick={() => handleUnfollow(user._id)}
                                            class="flex items-center space-x-2 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700"
                                        >
                                            <UserMinus size={16} />
                                            <span>Unfollow</span>
                                        </button>
                                    )}
                                    
                                    {activeTab !== 'following' && (
                                        <button 
                                            onClick={() => navigate(`/messages/${user._id}`)}
                                            class="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
                                        >
                                            <MessageSquare size={16} />
                                            <span>Message</span>
                                        </button>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    )
}