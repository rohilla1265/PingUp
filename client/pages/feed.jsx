import React, { useEffect, useState } from 'react';
import { dummyPostsData } from '../src/assets/assets';
import StoriesBar from '../components/StoriesBar';
import PostCard from '../components/postCard';
import { assets } from '../src/assets/assets';
import RecentMessages from '../components/recentMessages';

export default function Feed() {
    const [feed, setFeed] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchFeed = async () => {
        try {
            setLoading(true);
            // Simulate API call delay
            await new Promise(resolve => setTimeout(resolve, 1000));
            setFeed(dummyPostsData);
        } catch (err) {
            setError('Failed to load feed');
            console.error('Error fetching feed:', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchFeed();
    }, []);

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
                    <h1 className="text-xl font-semibold text-gray-700">Loading your feed...</h1>
                    <p className="text-gray-500 mt-2">Getting the latest posts ready for you</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
                <div className="text-center bg-white p-8 rounded-2xl shadow-lg max-w-md">
                    <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <span className="text-2xl">⚠️</span>
                    </div>
                    <h2 className="text-xl font-bold text-gray-800 mb-2">Oops! Something went wrong</h2>
                    <p className="text-red-600 mb-6">{error}</p>
                    <button 
                        onClick={fetchFeed}
                        className="px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold rounded-xl hover:from-blue-600 hover:to-purple-700 transition-all duration-300 shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
                    >
                        Try Again
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
            <div className="max-w-6xl mx-auto flex gap-8 pb-8 hide-scrollbar">
                {/* Main Content Column */}
                <div className="flex-1 max-w-2xl">
                    {/* Stories Section */}
                    <div className="sticky top-0 z-10 bg-gradient-to-b from-white via-white to-transparent pb-4 pt-4">
                        <div className="hide-scrollbar">
                            <StoriesBar />
                        </div>
                    </div>
                    
                    {/* Posts Section */}
                    <div className="px-4 space-y-6">
                        {feed.map((post) => (
                            <PostCard key={post._id} post={post} />
                        ))}
                    </div>
                    
                    {/* Empty State */}
                    {feed.length === 0 && (
                        <div className="text-center py-16 px-4">
                            <div className="max-w-md mx-auto">
                                <div className="w-24 h-24 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-6">
                                    <span className="text-3xl">📝</span>
                                </div>
                                <h3 className="text-2xl font-bold text-gray-700 mb-2">No posts yet</h3>
                                <p className="text-gray-500 mb-6">Be the first to share something amazing!</p>
                                <button className="px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold rounded-xl hover:from-blue-600 hover:to-purple-700 transition-all duration-300">
                                    Create Post
                                </button>
                            </div>
                        </div>
                    )}
                    
                    {/* End of Feed Message */}
                    {feed.length > 0 && (
                        <div className="text-center py-8 px-4">
                            <div className="inline-flex items-center space-x-2 text-gray-400">
                                <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
                                <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
                                <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
                            </div>
                            <p className="text-gray-500 mt-3 text-sm">You're all caught up! 🎉</p>
                        </div>
                    )}
                </div>
                
                {/* Sponsored Sidebar */}
                <div className="w-80 hidden lg:block">
                    <div className="sticky top-4">
                        <div className="bg-white rounded-2xl shadow-md overflow-hidden">
                            <h3 className="px-4 py-3 font-semibold text-gray-700 border-b">Sponsored</h3>
                            <img 
                                src={assets.sponsored_img} 
                                alt="Sponsored content" 
                                className="w-full h-auto"
                            />
                            <div className="p-4">
                                <p className="text-sm text-slate-600">
                                    Email Marketing 
                                </p>
                                <p class='text-slate-400'>Supercharge your Marketing with a powerful, easy to use platform built for results</p>
                            </div>
                            <RecentMessages/>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}