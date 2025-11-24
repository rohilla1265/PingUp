import React, { useState } from 'react';
import { dummyConnectionsData } from '../src/assets/assets';
import { Search } from 'lucide-react';
import UserCard from '../components/userCard';

export default function Discover(){
    const [input, setInput] = useState('')
    const [Users, setUsers] = useState(dummyConnectionsData);
    const [loading,setLoading] = useState(false);
    
    const handleSearch=async(e)=>{
       if(e.key==='Enter'){
        setUsers([]);
        setLoading(true)
        setTimeout(() => {
            setUsers(dummyConnectionsData);
            setLoading(false);
        }, 1000);
       }
    }
    
    return(
        <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto">
                <h1 className="text-3xl font-bold text-gray-900 mb-3 text-center">Discover People</h1>
                <p className="text-lg text-gray-600 text-center mb-8">Connect with amazing people and grow your Network</p>
                
                <div className="max-w-2xl mx-auto mb-8">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20}/>
                        <input 
                            type='text' 
                            placeholder='search by name,username and location' 
                            onChange={(e)=>setInput(e.target.value)} 
                            value={input} 
                            onKeyUp={handleSearch}
                            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                    </div>
                </div>

                {/* Horizontal Scroll Container */}
                <div className="flex overflow-x-auto pb-4 gap-6 scrollbar-hide">
                    {Users.map((user) => (
                        <div key={user._id} className="flex-shrink-0 w-80">
                            <UserCard user={user} />
                        </div>
                    ))}
                </div>

                {/* Loading State */}
                {loading && (
                    <div className="text-center py-8">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
                        <p className="text-gray-600 mt-4">Searching...</p>
                    </div>
                )}

                {/* No Results State */}
                {!loading && Users.length === 0 && (
                    <div className="text-center py-8">
                        <p className="text-gray-600">No users found. Try a different search.</p>
                    </div>
                )}
            </div>
        </div>
    )
}