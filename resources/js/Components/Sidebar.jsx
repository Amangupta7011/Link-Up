import React, { useState, useEffect } from 'react';
import { Head } from '@inertiajs/react';
import { LogOut, Settings, User as UserIcon, MessageSquare, X } from 'lucide-react';

export default function Sidebar({ user, onLogout }) {
    const [isSettingsOpen, setIsSettingsOpen] = useState(false);
    const [isDarkMode, setIsDarkMode] = useState(true);
    const userInitial = user?.name ? user.name.charAt(0).toUpperCase() : '?';

    useEffect(() => {
        const storedTheme = localStorage.getItem('theme');
        const wantsLight = storedTheme === 'light';
        setIsDarkMode(!wantsLight);
        document.documentElement.classList.toggle('light-mode', wantsLight);
    }, []);

    const toggleTheme = () => {
        const newValue = !isDarkMode;
        setIsDarkMode(newValue);
        localStorage.setItem('theme', newValue ? 'dark' : 'light');
        document.documentElement.classList.toggle('light-mode', !newValue);
    };

    return (
        <div className="w-16 lg:w-20 bg-gray-900 border-r border-gray-800 flex flex-col items-center py-6 h-screen flex-shrink-0 z-20 relative transition-colors duration-300">
            <div className="w-10 h-10 bg-brand-600 rounded-xl flex items-center justify-center shadow-lg shadow-brand-600/30 mb-8" title="Link-Up">
                <MessageSquare className="w-5 h-5 text-white" />
            </div>

            <div className="flex flex-col gap-6 w-full items-center flex-1 mt-4">
                <button className="text-gray-400 hover:text-brand-400 transition-colors bg-gray-800 p-3 rounded-xl relative group">
                    <MessageSquare className="w-6 h-6" />
                    <span className="absolute left-16 top-1/2 -translate-y-1/2 bg-gray-800 border border-gray-700 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-50 pointer-events-none">
                        Messages
                    </span>
                </button>
            </div>

            <div className="flex flex-col gap-6 items-center">
                <button className="text-gray-400 hover:text-white transition-colors relative group">
                    {user?.avatar ? (
                        <img src={user.avatar} alt="Profile" className="w-10 h-10 rounded-full object-cover ring-2 ring-transparent group-hover:ring-brand-500 transition-all" />
                    ) : (
                        <div className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center text-white font-bold ring-2 ring-transparent group-hover:ring-brand-500 transition-all">
                            {userInitial}
                        </div>
                    )}
                    <span className="absolute left-14 top-1/2 -translate-y-1/2 bg-gray-800 border border-gray-700 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-50 pointer-events-none">
                        Profile ({user?.name || 'User'})
                    </span>
                </button>
                <button
                    onClick={() => setIsSettingsOpen(!isSettingsOpen)}
                    className={`transition-colors relative group ${isSettingsOpen ? 'text-white' : 'text-gray-400 hover:text-white'}`}
                >
                    <Settings className={`w-6 h-6 ${isSettingsOpen ? 'animate-spin-slow text-brand-500' : ''}`} />
                    <span className="absolute left-14 top-1/2 -translate-y-1/2 bg-gray-800 border border-gray-700 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-50 pointer-events-none">
                        Settings
                    </span>
                </button>
                <button
                    onClick={onLogout}
                    className="text-gray-400 hover:text-red-400 transition-colors mt-2 relative group"
                >
                    <LogOut className="w-6 h-6" />
                    <span className="absolute left-14 top-1/2 -translate-y-1/2 bg-gray-800 border border-gray-700 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-50 pointer-events-none">
                        Logout
                    </span>
                </button>
            </div>

            {/* Quick Settings Panel */}
            {isSettingsOpen && (
                <div className="absolute bottom-20 left-20 w-64 bg-gray-900 border border-gray-800 rounded-2xl shadow-xl flex flex-col p-4 z-50 transition-colors duration-300">
                    <div className="flex justify-between items-center mb-4">
                        <h3 className="text-gray-100 font-semibold">Settings</h3>
                        <button onClick={() => setIsSettingsOpen(false)} className="text-gray-400 hover:text-gray-100 transition-colors">
                            <X className="w-5 h-5" />
                        </button>
                    </div>
                    <div className="space-y-4">
                        <div>
                            <label className="text-xs text-gray-400 uppercase tracking-wider font-semibold">Account</label>
                            <p className="text-sm text-gray-200 mt-1 truncate">{user?.name}</p>
                            <p className="text-xs text-gray-500 truncate">{user?.email}</p>
                        </div>
                        <div className="border-t border-gray-800 pt-3">
                            <label className="text-xs text-gray-400 uppercase tracking-wider font-semibold">Preferences</label>
                            <div className="mt-2 flex items-center justify-between">
                                <span className="text-sm text-gray-300">Dark Mode</span>
                                <div
                                    onClick={toggleTheme}
                                    className={`w-10 h-5 rounded-full relative cursor-pointer transition-colors duration-300 flex items-center px-1 ${isDarkMode ? 'bg-brand-500' : 'bg-gray-400'}`}
                                >
                                    <div className={`w-3.5 h-3.5 bg-white rounded-full absolute transition-all duration-300 shadow-sm ${isDarkMode ? 'right-1' : 'left-1'}`}></div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
