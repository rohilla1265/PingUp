import React, { useState } from 'react';
import { dummyUserData } from '../src/assets/assets';
import { Pencil } from 'lucide-react';

const ProfileModal = ({ setShowEdit }) => {
    const user = dummyUserData;
    const [editForm, setEditForm] = useState({
        username: user.username,
        cover: user.cover_photo,
        bio: user.bio,
        full_name: user.full_name,
        profile_picture: null,
        location: user.location
    });

    const handleEditProfile = async (e) => {
        e.preventDefault();
        // Save logic here
        console.log('Saving profile:', editForm);
    }

    // Safe function to get image URL
    const getImageUrl = (file) => {
        if (!file) return null;
        if (typeof file === 'string') return file; // If it's already a URL string
        if (file instanceof File) {
            try {
                return URL.createObjectURL(file);
            } catch (error) {
                console.error('Error creating object URL:', error);
                return null;
            }
        }
        return null;
    }

    const handleFileChange = (field, e) => {
        const file = e.target.files[0];
        if (file) {
            setEditForm(prev => ({
                ...prev,
                [field]: file
            }));
        }
    }

    // Cleanup object URLs when component unmounts
    React.useEffect(() => {
        return () => {
            if (editForm.profile_picture instanceof File) {
                URL.revokeObjectURL(getImageUrl(editForm.profile_picture));
            }
            if (editForm.cover instanceof File) {
                URL.revokeObjectURL(getImageUrl(editForm.cover));
            }
        };
    }, [editForm.profile_picture, editForm.cover]);

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6 max-h-[90vh] overflow-y-auto">
                <h1 className="text-2xl font-bold text-gray-800 mb-6 text-center">Edit Profile</h1>
                
                <form onSubmit={handleEditProfile} className="space-y-6">
                    {/* Profile Picture Section */}
                    <div className="flex flex-col items-center space-y-4">
                        <div className="relative group">
                            <img 
                                src={getImageUrl(editForm.profile_picture) || user.profile_picture} 
                                alt="Profile" 
                                className="w-24 h-24 rounded-full border-4 border-white shadow-lg object-cover"
                            />
                            <label 
                                htmlFor='profile_picture'
                                className="absolute inset-0 bg-opacity-0 group-hover:bg-opacity-30 rounded-full transition-all duration-300 flex items-center justify-center cursor-pointer"
                            >
                                <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-white p-2 rounded-full shadow-lg">
                                    <Pencil className="w-4 h-4 text-gray-700" />
                                </div>
                            </label>
                        </div>
                        
                        <label 
                            htmlFor='profile_picture' 
                            className="flex items-center gap-2 text-sm text-blue-600 font-medium cursor-pointer hover:text-blue-700 transition-colors"
                        >
                            <Pencil className="w-4 h-4" />
                            Change Profile Picture
                        </label>
                        
                        <input 
                            type='file' 
                            accept='image/*' 
                            id='profile_picture' 
                            onChange={(e) => handleFileChange('profile_picture', e)}
                            className="hidden"
                        />
                    </div>

                    {/* Cover Photo Section */}
                    <div className="space-y-4">
                        <label className="block text-sm font-medium text-gray-700 mb-2">Cover Photo</label>
                        <div className="relative group">
                            <div className="h-32 rounded-lg overflow-hidden bg-gray-100">
                                <img 
                                    src={getImageUrl(editForm.cover) || user.cover_photo} 
                                    alt="Cover" 
                                    className="w-full h-full object-cover"
                                />
                            </div>
                            <label 
                                htmlFor='cover_photo'
                                className="absolute inset-0  bg-opacity-0 group-hover:bg-opacity-40 transition-all duration-300 flex items-center justify-center cursor-pointer"
                            >
                                <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-white p-2 rounded-full shadow-lg">
                                    <Pencil className="w-4 h-4 text-gray-700" />
                                </div>
                            </label>
                        </div>
                        
                        <label 
                            htmlFor='cover_photo' 
                            className="flex items-center gap-2 text-sm text-blue-600 font-medium cursor-pointer hover:text-blue-700 transition-colors"
                        >
                            <Pencil className="w-4 h-4" />
                            Change Cover Photo
                        </label>
                        
                        <input 
                            type='file' 
                            accept='image/*' 
                            id='cover_photo' 
                            onChange={(e) => handleFileChange('cover', e)}
                            className="hidden"
                        />
                    </div>

                    {/* Form Fields */}
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
                            <input 
                                type="text"
                                value={editForm.full_name}
                                onChange={(e) => setEditForm({...editForm, full_name: e.target.value})}
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Username</label>
                            <input 
                                type="text"
                                value={editForm.username}
                                onChange={(e) => setEditForm({...editForm, username: e.target.value})}
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Location</label>
                            <input 
                                type="text"
                                value={editForm.location}
                                onChange={(e) => setEditForm({...editForm, location: e.target.value})}
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Bio</label>
                            <textarea 
                                value={editForm.bio}
                                onChange={(e) => setEditForm({...editForm, bio: e.target.value})}
                                rows="3"
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none transition-all"
                            />
                        </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-3 pt-2">
                        <button 
                            onClick={() => setShowEdit(false)}
                            type="button" 
                            className="flex-1 bg-gray-300 text-gray-700 py-3 rounded-lg font-semibold hover:bg-gray-400 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
                        >
                            Cancel
                        </button>
                        <button 
                            type="submit" 
                            className="flex-1 bg-blue-500 text-white py-3 rounded-lg font-semibold hover:bg-blue-600 transition-colors duration-200 shadow focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                        >
                            Save Changes
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default ProfileModal;