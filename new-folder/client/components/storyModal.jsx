import React, { useState, useRef, useEffect } from 'react';
import { X, Upload, Type, Image, Video, Palette } from 'lucide-react';
import toast from 'react-hot-toast';
import { dummyUserData } from '../src/assets/assets';

const backgroundColors = [
    '#8B5CF6', '#EC4899', '#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#6366F1'
];

export default function StoryModal({ setShowModal, fetchStories }) {
    const [storyType, setStoryType] = useState('text');
    const [content, setContent] = useState('');
    const [mediaFile, setMediaFile] = useState(null);
    const [mediaPreview, setMediaPreview] = useState(null);
    const [backgroundColor, setBackgroundColor] = useState('#8B5CF6');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const fileInputRef = useRef(null);

    // Cleanup on unmount
    useEffect(() => {
        return () => {
            if (mediaPreview) {
                URL.revokeObjectURL(mediaPreview);
            }
        };
    }, [mediaPreview]);

    const handleFileChange = (event) => {
        const file = event.target.files[0];
        if (!file) return;

        // File type validation
        if (storyType === 'image' && !file.type.startsWith('image/')) {
            toast.error('Please select a valid image file (JPEG, PNG, GIF, etc.)');
            return;
        }
        if (storyType === 'video' && !file.type.startsWith('video/')) {
            toast.error('Please select a valid video file (MP4, MOV, AVI, etc.)');
            return;
        }

        // File size validation
        if (storyType === 'image' && file.size > 10 * 1024 * 1024) {
            toast.error('Image size should be less than 10MB');
            return;
        }
        if (storyType === 'video' && file.size > 50 * 1024 * 1024) {
            toast.error('Video size should be less than 50MB');
            return;
        }

        // Cleanup previous preview
        if (mediaPreview) {
            URL.revokeObjectURL(mediaPreview);
        }

        setMediaFile(file);
        
        // Create preview URL
        const previewUrl = URL.createObjectURL(file);
        setMediaPreview(previewUrl);
        
        toast.success(`${storyType.charAt(0).toUpperCase() + storyType.slice(1)} selected successfully!`);
    };

    const handleCreateStory = async () => {
        if (isSubmitting) return;

        try {
            setIsSubmitting(true);

            // Validate required fields
            if (storyType === 'text' && !content.trim()) {
                toast.error('Please enter some text for your story');
                return;
            }

            if ((storyType === 'image' || storyType === 'video') && !mediaFile) {
                toast.error('Please select a file for your story');
                return;
            }

            // Show loading toast
            const toastId = toast.loading('Creating your story...');

            // Create story object
            const newStory = {
                id: Date.now() + Math.random(),
                user: dummyUserData,
                content: content.trim(),
                media_type: storyType,
                media_url: mediaPreview || null,
                background_color: storyType === 'text' ? backgroundColor : null,
                createdAt: new Date().toISOString(),
                expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString()
            };

            // Simulate API call delay
            await new Promise(resolve => setTimeout(resolve, 1000));

            // Add to local storage
            const existingStories = JSON.parse(localStorage.getItem('userStories') || '[]');
            existingStories.unshift(newStory);
            localStorage.setItem('userStories', JSON.stringify(existingStories));
            
            // Update toast to success
            toast.success('Story created successfully! 🎉', { id: toastId });
            
            // Cleanup
            if (mediaPreview) {
                URL.revokeObjectURL(mediaPreview);
            }
            
            setShowModal(false);
            fetchStories(); // Refresh stories
            
        } catch (error) {
            console.error('Error creating story:', error);
            toast.error('Failed to create story. Please try again.');
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleClose = () => {
        if (isSubmitting) {
            toast('Please wait while we finish creating your story...');
            return;
        }

        // Clean up preview URLs
        if (mediaPreview) {
            URL.revokeObjectURL(mediaPreview);
        }
        setShowModal(false);
    };

    // Add this function to handle backdrop click
    const handleBackdropClick = (e) => {
        if (e.target === e.currentTarget) {
            handleClose();
        }
    };

    const handleTypeChange = (type) => {
        if (isSubmitting) {
            toast('Please wait while we finish processing...');
            return;
        }

        setStoryType(type);
        
        // Reset media when switching types
        if (type === 'text') {
            if (mediaPreview) {
                URL.revokeObjectURL(mediaPreview);
            }
            setMediaFile(null);
            setMediaPreview(null);
        } else {
            // Reset content when switching to media types
            setContent('');
        }
    };

    const triggerFileInput = () => {
        if (isSubmitting) {
            toast('Please wait while we finish processing...');
            return;
        }
        fileInputRef.current?.click();
    };

    const removeMedia = () => {
        if (mediaPreview) {
            URL.revokeObjectURL(mediaPreview);
        }
        setMediaFile(null);
        setMediaPreview(null);
        toast.success('Media removed');
    };

    return (
        <div 
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
            onClick={handleBackdropClick} // Add backdrop click handler
        >
            <div className="bg-white rounded-2xl w-full max-w-md mx-auto max-h-[90vh] overflow-hidden flex flex-col">
                {/* Header */}
                <div className="flex items-center justify-between p-4 border-b border-gray-200 flex-shrink-0">
                    <h2 className="text-xl font-bold text-gray-900">
                        {isSubmitting ? 'Creating Story...' : 'Create Story'}
                    </h2>
                    <button 
                        onClick={handleClose} // This should work now
                        disabled={isSubmitting}
                        className="p-2 hover:bg-gray-100 rounded-full transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        <X className="w-5 h-5 text-gray-600" />
                    </button>
                </div>

                {/* Story Type Selection */}
                <div className="p-4 border-b border-gray-200 flex-shrink-0">
                    <div className="flex space-x-2">
                        <button
                            onClick={() => handleTypeChange('text')}
                            disabled={isSubmitting}
                            className={`flex-1 flex items-center justify-center space-x-2 py-3 px-4 rounded-lg border-2 transition-all ${
                                storyType === 'text' 
                                    ? 'border-blue-500 bg-blue-50 text-blue-700' 
                                    : 'border-gray-200 text-gray-600 hover:border-gray-300'
                            } disabled:opacity-50 disabled:cursor-not-allowed`}
                        >
                            <Type className="w-5 h-5" />
                            <span className="font-medium">Text</span>
                        </button>
                        
                        <button
                            onClick={() => {
                                handleTypeChange('image');
                                setTimeout(triggerFileInput, 100);
                            }}
                            disabled={isSubmitting}
                            className={`flex-1 flex items-center justify-center space-x-2 py-3 px-4 rounded-lg border-2 transition-all ${
                                storyType === 'image' 
                                    ? 'border-blue-500 bg-blue-50 text-blue-700' 
                                    : 'border-gray-200 text-gray-600 hover:border-gray-300'
                            } disabled:opacity-50 disabled:cursor-not-allowed`}
                        >
                            <Image className="w-5 h-5" />
                            <span className="font-medium">Image</span>
                        </button>
                        
                        <button
                            onClick={() => {
                                handleTypeChange('video');
                                setTimeout(triggerFileInput, 100);
                            }}
                            disabled={isSubmitting}
                            className={`flex-1 flex items-center justify-center space-x-2 py-3 px-4 rounded-lg border-2 transition-all ${
                                storyType === 'video' 
                                    ? 'border-blue-500 bg-blue-50 text-blue-700' 
                                    : 'border-gray-200 text-gray-600 hover:border-gray-300'
                            } disabled:opacity-50 disabled:cursor-not-allowed`}
                        >
                            <Video className="w-5 h-5" />
                            <span className="font-medium">Video</span>
                        </button>
                    </div>

                    {/* Hidden file input */}
                    <input
                        type="file"
                        ref={fileInputRef}
                        onChange={handleFileChange}
                        accept={storyType === 'image' ? 'image/*' : storyType === 'video' ? 'video/*' : ''}
                        className="hidden"
                        disabled={isSubmitting}
                    />
                </div>

                {/* Content Area */}
                <div className="p-4 flex-1 overflow-auto">
                    {storyType === 'text' && (
                        <div className="space-y-4">
                            {/* Background Color Picker */}
                            <div className="flex items-center space-x-2">
                                <Palette className="w-4 h-4 text-gray-600" />
                                <span className="text-sm text-gray-600">Background:</span>
                                <div className="flex space-x-1">
                                    {backgroundColors.map((color) => (
                                        <button
                                            key={color}
                                            onClick={() => setBackgroundColor(color)}
                                            disabled={isSubmitting}
                                            className={`w-6 h-6 rounded-full border-2 transition-all ${
                                                backgroundColor === color ? 'border-gray-800 scale-110' : 'border-gray-300 hover:scale-105'
                                            } disabled:opacity-50 disabled:cursor-not-allowed`}
                                            style={{ backgroundColor: color }}
                                            title={color}
                                        />
                                    ))}
                                </div>
                            </div>
                            
                            <div 
                                className="w-full h-48 rounded-lg flex items-center justify-center p-4 transition-colors duration-300"
                                style={{ backgroundColor }}
                            >
                                <textarea
                                    value={content}
                                    onChange={(e) => setContent(e.target.value)}
                                    placeholder="What's on your mind?"
                                    className="w-full h-full bg-transparent border-none resize-none text-white text-center placeholder-white/70 focus:ring-0 focus:outline-none text-lg font-medium"
                                    maxLength={200}
                                    disabled={isSubmitting}
                                    style={{ textShadow: '0 2px 4px rgba(0,0,0,0.3)' }}
                                />
                            </div>
                            <div className="flex justify-between text-sm text-gray-500">
                                <span>{content.length}/200 characters</span>
                                <span className={content.length > 180 ? 'text-orange-500' : ''}>
                                    {200 - content.length} left
                                </span>
                            </div>
                        </div>
                    )}

                    {(storyType === 'image' || storyType === 'video') && (
                        <div className="space-y-4">
                            {mediaPreview ? (
                                <div className="relative rounded-lg overflow-hidden border-2 border-gray-300 bg-gray-100">
                                    {storyType === 'image' ? (
                                        <img 
                                            src={mediaPreview} 
                                            alt="Preview" 
                                            className="w-full h-64 object-contain"
                                        />
                                    ) : (
                                        <video 
                                            src={mediaPreview}
                                            className="w-full h-64 object-contain"
                                            controls
                                        />
                                    )}
                                    <div className="absolute top-2 right-2 flex space-x-2">
                                        <button
                                            onClick={triggerFileInput}
                                            disabled={isSubmitting}
                                            className="bg-black/50 text-white p-2 rounded-full hover:bg-black/70 transition-colors disabled:opacity-50"
                                            title="Change file"
                                        >
                                            <Upload className="w-4 h-4" />
                                        </button>
                                        <button
                                            onClick={removeMedia}
                                            disabled={isSubmitting}
                                            className="bg-black/50 text-white p-2 rounded-full hover:bg-black/70 transition-colors disabled:opacity-50"
                                            title="Remove file"
                                        >
                                            <X className="w-4 h-4" />
                                        </button>
                                    </div>
                                </div>
                            ) : (
                                <div 
                                    onClick={triggerFileInput}
                                    className="border-2 border-dashed border-gray-300 rounded-lg h-64 flex flex-col items-center justify-center cursor-pointer hover:border-blue-400 hover:bg-blue-50 transition-all group"
                                >
                                    <Upload className="w-12 h-12 text-gray-400 mb-2 group-hover:text-blue-400 transition-colors" />
                                    <p className="text-gray-600 font-medium group-hover:text-blue-600">Upload {storyType}</p>
                                    <p className="text-sm text-gray-500 mt-1 group-hover:text-blue-500">
                                        Click to select {storyType === 'image' ? 'an image' : 'a video'}
                                    </p>
                                </div>
                            )}
                            
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Caption {!content && '(optional)'}
                                </label>
                                <textarea
                                    value={content}
                                    onChange={(e) => setContent(e.target.value)}
                                    placeholder="Add a caption to your story..."
                                    className="w-full h-20 p-3 border border-gray-300 rounded-lg resize-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:opacity-50"
                                    maxLength={100}
                                    disabled={isSubmitting}
                                />
                                <div className="text-right text-sm text-gray-500 mt-1">
                                    {content.length}/100
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                {/* Action Buttons */}
                <div className="flex space-x-3 p-4 border-t border-gray-200 flex-shrink-0">
                    <button
                        onClick={handleClose} // This should work now
                        disabled={isSubmitting}
                        className="flex-1 py-3 px-4 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleCreateStory}
                        disabled={
                            isSubmitting ||
                            (storyType === 'text' 
                                ? !content.trim() 
                                : storyType === 'image' || storyType === 'video'
                                ? !mediaFile
                                : false)
                        }
                        className="flex-1 py-3 px-4 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed disabled:hover:bg-gray-400 flex items-center justify-center"
                    >
                        {isSubmitting ? (
                            <>
                                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                                Creating...
                            </>
                        ) : (
                            'Create Story'
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
}