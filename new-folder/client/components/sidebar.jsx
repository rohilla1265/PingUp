import React from 'react';
import { assets, dummyUserData } from '../src/assets/assets';
import { useNavigate, Link } from 'react-router-dom';
import { CirclePlus, LogOut } from 'lucide-react';
import MenuItems from './Menuitems';
import { UserButton, useClerk } from '@clerk/clerk-react';
const Sidebar = ({ sidebarOpen, setSidebarOpen }) => {
    const navigate = useNavigate();
    const user = dummyUserData;
    const { signOut } = useClerk();

    return (
        <div className={`
            fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-lg transform transition-transform duration-300 ease-in-out
            ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
            lg:translate-x-0 lg:static lg:inset-0
        `}>
            <div className="flex flex-col h-full p-4">
                {/* Logo */}
                <div className="flex items-center space-x-3 mb-6 cursor-pointer" onClick={() => navigate('/')}>
                    <img src={assets.logo} alt="Logo" />
                    {/* <span className="text-xl font-bold text-gray-800">Your App</span> */}
                </div>
                
                <hr className="mb-6 border-gray-200" />
                
                {/* Menu Items */}
                <div className="flex-1">
                    <MenuItems setSidebarOpen={setSidebarOpen} />
                </div>
                
                {/* Create Post Button with Gradient */}
                <Link 
                    to="/create-post" 
                    className="flex items-center justify-center space-x-3 px-4 py-3 bg-gradient-to-r from-indigo-500 to-indigo-800 text-white rounded-lg hover:from-blue-600 hover:to-indigo-700 transition-all duration-200 mb-6 shadow-md hover:shadow-lg"
                    onClick={() => setSidebarOpen && setSidebarOpen(false)}
                >
                    <CirclePlus size={20} />
                    <span className="font-medium">Create Post</span>
                </Link>

                {/* User Account Section - Moved to Bottom */}
                <div className="mt-auto border-t border-gray-200 pt-4">
                    <div className="flex items-center space-x-3 mb-3">
                        <UserButton />
                        <div className="flex-1">
                            <h1 className="text-sm font-semibold text-gray-800">{user.full_name}</h1>
                            <p className="text-xs text-gray-500">@{user.username}</p>
                        </div>
                    </div>
                    <button 
                        onClick={() => signOut()} 
                        className="flex items-center space-x-2 w-full p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors duration-200"
                    >
                        <LogOut size={18} />
                        <span className="text-sm font-medium">Log Out</span>
                    </button>
                </div>
            </div>
        </div>
    );
}

export default Sidebar;