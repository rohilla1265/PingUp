import React, { useState } from 'react';
import Sidebar from '../components/sidebar';
import { Outlet } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import { dummyUserData } from '../src/assets/assets';

export default function Layout() {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const User = dummyUserData;

    const handleOverlayClick = (e) => {
        if (e.target === e.currentTarget) {
            setSidebarOpen(false);
        }
    };

    return User ? (
        <div className="flex min-h-screen bg-gray-50">
            {/* Mobile Sidebar Overlay */}
            {sidebarOpen && (
                <div 
                    className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
                    onClick={handleOverlayClick}
                />
            )}
            
            {/* Sidebar */}
            <div className={`
                fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-lg transform transition-transform duration-300 ease-in-out
                ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
                lg:translate-x-0 lg:static lg:inset-0
            `}>
                <Sidebar  sidebarOpen = {sidebarOpen} setSidebarOpen = {setSidebarOpen} />
            </div>

            {/* Main Content */}
            <main className="flex-1 flex flex-col min-h-screen lg:ml-0">
                {/* Header */}
                <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-30">
                    <div className="flex items-center justify-between px-4 py-3 lg:px-6">
                        <button 
                            className="lg:hidden p-2 rounded-md text-gray-600 hover:text-gray-900 hover:bg-gray-100 transition-colors"
                            onClick={() => setSidebarOpen(!sidebarOpen)}
                            aria-label="Toggle menu"
                        >
                            {sidebarOpen ? (
                                <X size={24} />
                            ) : (
                                <Menu size={24} />
                            )}
                        </button>
                        
                        {/* User Info/Header Content */}
                        <div className="flex-1 flex justify-end lg:justify-between">
                            <div className="hidden lg:block">
                                <h1 className="text-xl font-semibold text-gray-800">Dashboard</h1>
                            </div>
                            <div className="flex items-center space-x-4">
                                <span className="text-sm text-gray-600">Welcome back!</span>
                                {/* Add user avatar or other elements here */}
                            </div>
                        </div>
                    </div>
                </header>

                {/* Page Content */}
                <div className="flex-1 p-4 lg:p-6 overflow-auto">
                    <Outlet />
                </div>
            </main>
        </div>
    ) : (
        // Loading State
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
            <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
                <h1 className="mt-4 text-xl font-semibold text-gray-700">Loading...</h1>
            </div>
        </div>
    );
}