import React, { useEffect, useState } from 'react';
import { useParams, Link } from "react-router-dom";
import { dummyPostsData, dummyUserData } from '../src/assets/assets';
import UserProfileInfo from '../components/UserProfileInfo';
import PostCard from '../components/postCard';
import moment from 'moment';
import ProfileModal from '../components/ProfileModal';

export default function Profiles() {
    const { profileId } = useParams();
    const [user, setUser] = useState(null);
    const [posts, setPosts] = useState([]);
    const [activeTab, setActiveTab] = useState('posts');
    const [showEdit, setShowEdit] = useState(false);

    const fetchUser = () => {
        setUser(dummyUserData);
        setPosts(dummyPostsData);
    }

    useEffect(() => {
        fetchUser();
    }, []);

    // Filter posts with images for media tab
    const mediaPosts = posts.filter(post => post.image_urls && post.image_urls.length > 0);

    return user ? (
        <div className='relative h-full overflow-y-auto bg-gray-50 p-6'>
            <div className='max-w-3xl mx-auto'>
                {/* Profile Card */}
                <div className='bg-white rounded-2xl shadow overflow-hidden'>
                    {/* Cover Photo */}
                    <div className='h-40 md:h-56 bg-gradient-to-r from-indigo-200 via-purple-200 to-pink-200'>
                        {user.cover_photo && (
                            <img 
                                src={user.cover_photo} 
                                alt={`${user.full_name}'s cover`}
                                className='w-full h-full object-cover'
                            />
                        )}
                    </div>
                    <UserProfileInfo 
                        user={user} 
                        posts={posts} 
                        profileId={profileId} 
                        setShowEdit={setShowEdit}
                    />
                </div>

                {/* Tabs */}
                <div className='mt-6'>
                    <div className='bg-white rounded-xl shadow p-1 flex max-w-md mx-auto'>
                        {["posts", "media", "likes"].map((tab) => (
                            <button 
                                onClick={() => setActiveTab(tab)}
                                key={tab}
                                className={`flex-1 px-4 py-2 text-sm font-medium rounded-lg transition-colors cursor-pointer ${
                                    activeTab === tab 
                                        ? "bg-indigo-600 text-white" 
                                        : "text-gray-600 hover:text-gray-900"
                                }`}
                            >
                                {tab.charAt(0).toUpperCase() + tab.slice(1)}
                            </button>
                        ))}
                    </div>

                    {/* Posts Tab */}
                    {activeTab === 'posts' && (
                        <div className='mt-6 space-y-6'>
                            {posts.map((post) => (
                                <PostCard key={post._id} post={post} />
                            ))}
                        </div>
                    )}

                    {/* Media Tab */}
                    {activeTab === 'media' && (
                        <div className='mt-6'>
                            {mediaPosts.length > 0 ? (
                                <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'>
                                    {mediaPosts.map((post) => (
                                        <div key={post._id} className='relative group'>
                                            {post.image_urls.map((image, index) => (
                                                <Link 
                                                    to={`/post/${post._id}`}
                                                    key={`${post._id}-${index}`}
                                                    className='block relative overflow-hidden rounded-lg'
                                                >
                                                    <img 
                                                        src={image} 
                                                        className='w-full h-48 object-cover rounded-lg transition-transform duration-300 group-hover:scale-105'
                                                        alt={`Post media ${index + 1}`}
                                                    />
                                                    {/* Hover Overlay with Timestamp */}
                                                    <div className='absolute inset-0 bg-opacity-0 group-hover:bg-opacity-50 transition-all duration-300 flex items-end justify-start p-3'>
                                                        <p className='text-white text-sm font-medium opacity-0 group-hover:opacity-100 transform translate-y-2 group-hover:translate-y-0 transition-all duration-300'>
                                                            Posted {moment(post.createdAt).fromNow()}
                                                        </p>
                                                    </div>
                                                </Link>
                                            ))}
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className='text-center py-8 text-gray-500'>
                                    No media found
                                </div>
                            )}
                        </div>
                    )}

                    {/* Likes Tab */}
                    {activeTab === 'likes' && (
                        <div className='mt-6 text-center py-8 text-gray-500'>
                            Liked posts will appear here
                        </div>
                    )}
                </div>
                {
                    showEdit && <ProfileModal setShowEdit={setShowEdit} />
                }
            </div>
        </div>
    ) : (
        <div className='flex items-center justify-center h-full'>
            <div className='text-gray-500'>Loading profile...</div>
        </div>
    );
}