import React, { useEffect, useState } from 'react';
import { X } from 'lucide-react';

export default function StoryViewer({ viewstories, setviewStories }) {
    const [progress, setProgress] = useState(0);
    const STORY_DURATION = 10000; // 5 seconds per story

    useEffect(() => {
        // Reset progress when story changes
        setProgress(0);
        
        const interval = setInterval(() => {
            setProgress(prev => {
                if (prev >= 100) {
                    clearInterval(interval);
                    handleClose();
                    return 100;
                }
                return prev + 1;
            });
        }, STORY_DURATION / 100);

        return () => clearInterval(interval);
    }, [viewstories]);

    const handleClose = () => {
        setviewStories(null);
    }

    const renderContent = () => {
        switch(viewstories.media_type) {
            case 'image':
                return (
                    <img 
                        src={viewstories.media_url} 
                        alt="Story" 
                        className="w-full h-full object-contain"
                    />
                )
            case 'video':
                return (
                    <video 
                        src={viewstories.media_url}
                        className="w-full h-full object-contain"
                        controls
                        autoPlay
                        muted
                        onEnded={handleClose} // Auto close when video ends
                    />
                )
            case 'text':
                return (
                    <div className="w-full h-full flex items-center justify-center p-8">
                        <p className="text-white text-2xl font-bold text-center">
                            {viewstories.content}
                        </p>
                    </div>
                )
            default:
                return (
                    <div className="text-white text-xl">Unsupported media type</div>
                )
        }
    }

    return (
        <div 
            className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
            onClick={handleClose}
        >
            <div 
                className="relative w-[80vw] h-[80vh] rounded-xl overflow-hidden shadow-2xl"
                style={{ 
                    backgroundColor: viewstories.media_type === "text" 
                        ? viewstories.background_color 
                        : "#000000" 
                }}
                onClick={(e) => e.stopPropagation()}
            >
                {/* Progress Bar */}
                <div className="absolute top-0 left-0 right-0 z-20 bg-gray-700 h-1">
                    <div 
                        className="bg-white h-full transition-all duration-100 ease-linear"
                        style={{ width: `${progress}%` }}
                    />
                </div>

                {/* Close Button */}
                <button 
                    className="absolute top-4 right-4 z-10 bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-70 transition-all"
                    onClick={handleClose}
                >
                    <X className="w-6 h-6" />
                </button>

                {/* User Info */}
                <div className="absolute top-4 left-4 z-10 flex items-center space-x-3">
                    <div className="w-10 h-10 border-2 border-white rounded-full overflow-hidden">
                        <img 
                            src={viewstories.user?.profile_picture} 
                            alt={viewstories.user?.username}
                            className="w-full h-full object-cover"
                        />
                    </div>
                    <div className="text-white">
                        <p className="font-semibold text-sm">{viewstories.user?.username}</p>
                    </div>
                </div>

                {/* Story Content */}
                <div className="w-full h-full pt-16 pb-4">
                    {renderContent()}
                </div>

                {/* Story Content (if any) */}
                {viewstories.content && viewstories.media_type !== 'text' && (
                    <div className="absolute bottom-4 left-4 right-4">
                        <p className="text-white text-sm bg-black bg-opacity-50 p-3 rounded-lg">
                            {viewstories.content}
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
}