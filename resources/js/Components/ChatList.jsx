import React from 'react';
import { Search, User as UserIcon } from 'lucide-react';
import clsx from 'clsx';
import { format } from 'date-fns';

export default function ChatList({ users, activeUser, setActiveUser, onlineUsers }) {
    return (
        <div className="w-80 md:w-96 flex-shrink-0 bg-gray-900 backdrop-blur-xl border-r border-gray-800 flex flex-col h-screen">
            <div className="p-4 flex-shrink-0 border-b border-gray-800">
                <h1 className="text-xl font-bold text-white mb-4">Messages</h1>
                <div className="relative">
                    <Search className="w-5 h-5 absolute left-3 top-2.5 text-gray-500" />
                    <input
                        type="text"
                        placeholder="Search or start new chat"
                        className="w-full bg-gray-800 border-none rounded-xl pl-10 pr-4 py-2.5 text-sm text-white placeholder-gray-500 focus:ring-2 focus:ring-brand-500"
                    />
                </div>
            </div>

            <div className="flex-1 overflow-y-auto overflow-x-hidden">
                {users.map((user) => {
                    const isActive = activeUser?.id === user.id;
                    const isOnline = onlineUsers.includes(user.id);

                    return (
                        <button
                            key={user.id}
                            onClick={() => setActiveUser(user)}
                            className={clsx(
                                "w-full flex items-center gap-4 p-4 hover:bg-gray-800 transition-colors border-b border-gray-800/50 text-left relative",
                                isActive && "bg-gray-800"
                            )}
                        >
                            {isActive && (
                                <div className="absolute left-0 top-0 bottom-0 w-1 bg-brand-500 rounded-r-md"></div>
                            )}
                            <div className="relative flex-shrink-0">
                                {user.avatar ? (
                                    <img src={user.avatar} alt={user.name} className="w-12 h-12 rounded-full object-cover" />
                                ) : (
                                    <div className="w-12 h-12 bg-gray-700 rounded-full flex items-center justify-center text-gray-300">
                                        <UserIcon className="w-6 h-6" />
                                    </div>
                                )}
                                {isOnline && (
                                    <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-gray-900 rounded-full"></span>
                                )}
                            </div>
                            <div className="flex-1 min-w-0">
                                <div className="flex justify-between items-baseline mb-0.5">
                                    <h3 className="text-sm font-semibold text-white truncate">{user.name}</h3>
                                    <span className="text-xs text-gray-500 flex-shrink-0">Just now</span>
                                </div>
                                <p className="text-sm text-gray-400 truncate">
                                    Start a conversation...
                                </p>
                            </div>
                        </button>
                    );
                })}
                {users.length === 0 && (
                    <div className="p-8 text-center text-gray-500 text-sm">
                        No users found
                    </div>
                )}
            </div>
        </div>
    );
}
