import React, { useState, useEffect } from 'react';
import { Head, router } from '@inertiajs/react';
import axios from 'axios';
import Sidebar from '../../Components/Sidebar';
import ChatList from '../../Components/ChatList';
import ChatWindow from '../../Components/ChatWindow';

export default function Index({ auth }) {
    const [users, setUsers] = useState([]);
    const [activeUser, setActiveUser] = useState(null);
    const [onlineUsers, setOnlineUsers] = useState([]);

    useEffect(() => {
        // Fetch all users for Demo
        axios.get('/api/users').then(res => {
            setUsers(res.data.users);
        });

        // Setup Presence Channel
        if (window.Echo) {
            window.Echo.join(`presence.chat`)
                .here((users) => {
                    setOnlineUsers(users.map(u => u.id));
                })
                .joining((user) => {
                    setOnlineUsers(prev => [...prev, user.id]);
                })
                .leaving((user) => {
                    setOnlineUsers(prev => prev.filter(id => id !== user.id));
                });
        }

        return () => {
            if (window.Echo) {
                window.Echo.leave('presence.chat');
            }
        };
    }, []);

    const handleLogout = () => {
        router.post('/logout');
    };

    return (
        <div className="flex h-screen bg-gray-950 overflow-hidden">
            <Head title="Chat" />
            <Sidebar user={auth.user} onLogout={handleLogout} />
            <ChatList
                users={users}
                activeUser={activeUser}
                setActiveUser={setActiveUser}
                onlineUsers={onlineUsers}
            />
            <ChatWindow
                currentUser={auth.user}
                activeUser={activeUser}
                onlineUsers={onlineUsers}
            />
        </div>
    );
}
