import { Plus } from 'lucide-react';
import React, { useState, useEffect } from 'react';
import { dummyStoriesData, dummyUserData } from '../src/assets/assets';
import moment from 'moment';
import StoryModal from './storyModal';
import StoryViewer from './storyViewer';

export default function StoriesBar({ stories = [] }){
    const [storyData, setStoryData] = useState([]);
    const [viewStories, setviewStories] = useState(null);
    const [showModal, setShowModal] = useState(false); // Fixed: changed showModel to showModal

    const fetchStories = async () => {
        try {
            setStoryData(dummyStoriesData);
        } catch (error) {
            console.error('Error fetching stories:', error);
        }
    }

    useEffect(() => {
        fetchStories();
    }, []);

    const displayStories = stories.length > 0 ? stories : storyData;

    return(
        <div className="relative">
            {/* Scroll container with hidden scrollbar */}
            <div 
                className="flex space-x-4 p-4 overflow-x-auto"
                style={{
                    msOverflowStyle: 'none',
                    scrollbarWidth: 'none',
                }}
            >
                <div className="flex-shrink-0">
                    <div className='relative border-2 border-dashed border-blue-500 rounded-xl h-40 w-28 flex flex-col items-center justify-center bg-white cursor-pointer hover:bg-blue-50 transition-all duration-200 p-2 group' onClick={()=>setShowModal(true)}> {/* Fixed: setShowModel to setShowModal */}
                        <div className="absolute inset-0 rounded-xl overflow-hidden opacity-20">
                            <img 
                                src={dummyUserData.profile_picture} 
                                alt="Your profile" 
                                className="w-full h-full object-cover"
                            />
                        </div>
                        
                        <div className="relative bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full p-2 mb-2 shadow-sm z-10">
                            <Plus className="w-5 h-5 text-white" />
                        </div>
                        
                        <p className="text-xs text-gray-700 font-medium text-center z-10">Create Story</p>
                    </div>
                </div>

                {/* User Stories */}
                {displayStories.map((story, index) => (
                    <div key={story.id || index} className="flex-shrink-0">
                        <div onClick={()=>setviewStories(story)} className="relative border-2 border-blue-400 rounded-xl h-40 w-28 overflow-hidden cursor-pointer group">
                            {/* Media Content - Image or Video */}
                            {story.media_type !== "text" && (
                                <div className="w-full h-full">
                                    {story.media_type === "image" ? (
                                        <img 
                                            src={story.media_url} 
                                            alt={story.content || 'Story image'} 
                                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                                        />
                                    ) : story.media_type === "video" ? (
                                        <video 
                                            src={story.media_url}
                                            className="w-full h-full object-cover"
                                            muted
                                            playsInline
                                        />
                                    ) : null}
                                </div>
                            )}
                            
                            {/* Text-only Story */}
                            {story.media_type === "text" && (
                                <div className="w-full h-full flex items-center justify-center p-2 bg-gradient-to-br from-purple-500 to-pink-500">
                                    <p className="text-white text-sm font-medium text-center line-clamp-3">
                                        {story.content}
                                    </p>
                                </div>
                            )}
                            
                            {/* Gradient overlay for better text readability */}
                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
                            
                            {/* User profile circle */}
                            <div className="absolute top-2 left-2 w-8 h-8 border-2 border-white rounded-full overflow-hidden">
                                <img 
                                    src={story.user?.profile_picture || dummyUserData.profile_picture} 
                                    alt={story.user?.username || 'User'}
                                    className="w-full h-full object-cover"
                                />
                            </div>
                            
                            {/* Content */}
                            <div className="absolute bottom-0 left-0 right-0 p-2 text-white">
                                <p className="text-xs font-semibold truncate">
                                    {story.user?.username || 'User'}
                                </p>
                                {story.content && story.media_type !== "text" && (
                                    <p className="text-xs truncate opacity-90 mt-1">{story.content}</p>
                                )}
                                <p className="text-xs opacity-75 mt-1">
                                    {moment(story.createdAt).fromNow()}
                                </p>
                            </div>
                        </div>
                    </div>
                ))}

                {/* Empty state */}
                {displayStories.length === 0 && (
                    <div className="flex-shrink-0">
                        <div className="border-2 border-gray-200 rounded-xl h-40 w-28 flex items-center justify-center bg-gray-50">
                            <p className="text-xs text-gray-500 text-center px-2">No stories available</p>
                        </div>
                    </div>
                )}
            </div>
            
            {/* Fixed: changed setShowModel to setShowModal */}
            {showModal && <StoryModal setShowModal={setShowModal} fetchStories={fetchStories} />}
            {viewStories && <StoryViewer setviewStories={setviewStories} viewstories={viewStories} />}
        </div>
    );
}