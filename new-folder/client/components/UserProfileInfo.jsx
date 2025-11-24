import { Calendar, Edit, MapPin } from 'lucide-react';
import React from 'react';
import moment from "moment"

const Verified = ({ className }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 24 24">
    <path d="M23 12l-2.44-2.78.34-3.68-3.61-.82-1.89-3.18L12 3 8.6 1.54 6.71 4.72l-3.61.81.34 3.68L1 12l2.44 2.78-.34 3.69 3.61.82 1.89 3.18L12 21l3.4 1.46 1.89-3.18 3.61-.82-.34-3.68L23 12zm-10 5h-2v-2h2v2zm0-4h-2V7h2v6z"/>
  </svg>
);

const UserProfileInfo = ({ user, posts, profileId, setShowEdit }) => {
  return (
    <div className='relative py-4 px-6 md:px-8 bg-white'>
      <div className='flex flex-col md:flex-row items-start gap-6'>
        {/* Profile Picture */}
        <div className='w-32 h-32 border-4 border-white shadow-lg absolute -top-16 rounded-full'>
          <img 
            src={user.profile_picture} 
            alt={`${user.full_name}'s profile`} 
            className='w-full h-full object-cover rounded-full'
          />
        </div>
        
        <div className='w-full pt-16 md:pt-0 md:pl-36'>
          {/* Name and Edit Button */}
          <div className='flex flex-col md:flex-row items-start md:items-center justify-between gap-4'>
            <div className='flex-1'>
              <div className='flex items-center gap-3 mb-1'>
                <h1 className='text-2xl font-bold text-gray-900'>
                  {user.full_name}
                </h1>
                <Verified className='w-6 h-6 text-blue-500'/>
              </div>
              <p className='text-gray-600 text-lg'>
                {user.username ? `@${user.username}` : 'Add a username'}
              </p>
            </div>
            
            {setShowEdit && (
              <button 
                onClick={() => setShowEdit(true)}
                className='flex items-center gap-2 px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors duration-200'
              >
                <Edit className='w-4 h-4'/>
                <span>Edit Profile</span>
              </button>
            )}
          </div>

          {/* Bio */}
          {user.bio && (
            <div className='mt-4'>
              <p className='text-gray-800 text-lg leading-relaxed'>{user.bio}</p>
            </div>
          )}

          {/* Location and Join Date */}
          <div className='mt-4 flex flex-wrap items-center gap-6 text-gray-600'>
            {user.location && (
              <div className='flex items-center gap-2'>
                <MapPin className='w-4 h-4'/>
                <span>{user.location}</span>
              </div>
            )}
            
            <div className='flex items-center gap-2'>
              <Calendar className='w-4 h-4'/>
              <span>Joined {moment(user.createdAt).format('MMMM YYYY')}</span>
            </div>
          </div>

          {/* Stats - Followers, Following, Posts */}
          <div className='mt-6 flex items-center gap-8'>
            <div className='text-center'>
              <span className='block text-xl font-bold text-gray-900'>{posts.length}</span>
              <span className='text-sm text-gray-500'>Posts</span>
            </div>
            
            <div className='text-center'>
              <span className='block text-xl font-bold text-gray-900'>{user.followers?.length || 0}</span>
              <span className='text-sm text-gray-500'>Followers</span>
            </div>
            
            <div className='text-center'>
              <span className='block text-xl font-bold text-gray-900'>{user.following?.length || 0}</span>
              <span className='text-sm text-gray-500'>Following</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfileInfo;