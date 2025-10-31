import toast from "react-hot-toast"
import React, { useState } from 'react';
import { dummyUserData } from '../src/assets/assets';
import { Images, X } from 'lucide-react';

export default function Createpost(){
    const [images, setImages] = useState([]);
    const [content, setContent] = useState('');
    const [loading, setLoading] = useState(false);
    const user = dummyUserData;

    const removeImage = (indexToRemove) => {
        setImages(images.filter((_, i) => i !== indexToRemove));
    };

    const handleSubmit = async () => {
        setLoading(true);
        try {
            // Simulate API call - replace with your actual API call
            await new Promise(resolve => setTimeout(resolve, 2000));
            
            // Your actual submission logic would go here
            console.log('Submitting:', { content, images });
            
            // Reset form after successful submission
            setContent('');
            setImages([]);
            
            return true; // Return true for success
        } catch (error) {
            throw error; // Throw error for toast to catch
        } finally {
            setLoading(false);
        }
    };

    const handlePost = async () => {
        if (!content.trim() && images.length === 0) {
            toast.error('Please add some content or images');
            return;
        }

        toast.promise(
            handleSubmit(),
            {
                loading: "Publishing your post...",
                success: "Post published successfully!",
                error: "Failed to publish post"
            }
        );
    };

    return (
        <div className='min-h-screen bg-gradient-to-b from-slate-50 to-white'>
            <div className='max-w-6xl mx-auto p-6'>
                {/* Title */}
                <div className='mb-8'>
                    <h1 className='text-3xl font-bold text-slate-900 mb-2'>Create Post</h1>
                    <p className="text-slate-600">Share your thoughts with the world</p>
                </div>
                
                {/* Form */}
                <div className='max-w-xl bg-white p-4 sm:p-8 sm:pb-3 rounded-xl shadow-md space-y-4'>
                    {/* Header */}
                    <div className='flex items-center gap-3'>
                        <img src={user.profile_picture} alt="" className='w-12 h-12 rounded-full shadow'/>
                        <div>
                            <h2 className='font-semibold'>{user.full_name}</h2>
                            <p className='text-sm text-gray-500'>@{user.username}</p>
                        </div>
                    </div>
                    
                    <textarea 
                        placeholder='What is happening today???' 
                        onChange={(e) => setContent(e.target.value)} 
                        value={content}
                        className='w-full p-3 border border-gray-300 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent'
                        rows="4"
                    ></textarea>

                    {/* Image Upload Section */}
                    <label className='flex items-center gap-2 cursor-pointer p-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors'>
                        <Images className='w-5 h-5 text-gray-600'/>
                        <span className='text-gray-700'>Add Photos</span>
                        <input 
                            type='file' 
                            multiple 
                            accept='image/*' 
                            onChange={(e) => setImages([...images, ...Array.from(e.target.files)])} 
                            className='hidden'
                        />
                    </label>

                    {images.length > 0 && (
                        <div className='grid grid-cols-2 gap-3'>
                            {images.map((image, index) => (
                                <div key={index} className='relative group'>
                                    <img 
                                        src={URL.createObjectURL(image)} 
                                        alt={`Upload ${index + 1}`} 
                                        className='w-full h-32 object-cover rounded-lg'
                                    />
                                    <button 
                                        type="button"
                                        onClick={() => removeImage(index)}
                                        className='absolute inset-0 bg-neutral-600 bg-opacity-0 group-hover:bg-opacity-50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 cursor-pointer rounded-lg'
                                    >
                                        <X className='w-8 h-8 text-white'/>
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
                
                <button 
                    onClick={handlePost}
                    disabled={loading}
                    className='w-full max-w-xl mt-4 bg-blue-500 text-white py-3 rounded-lg font-semibold hover:bg-blue-600 disabled:bg-blue-300 disabled:cursor-not-allowed transition-colors'
                >
                    {loading ? "Publishing..." : "Post"}
                </button>
            </div>
        </div>
    );
}