import React, { useState, useEffect, useRef } from 'react';
import { Send, File, Paperclip, MoreVertical, Smilies, User as UserIcon } from 'lucide-react';
import axios from 'axios';
import clsx from 'clsx';
import { format } from 'date-fns';

export default function ChatWindow({ currentUser, activeUser, onlineUsers }) {
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const [remoteTyping, setRemoteTyping] = useState(false);

    const messagesEndRef = useRef(null);
    const typingTimeoutRef = useRef(null);

    useEffect(() => {
        if (!activeUser) return;

        // Fetch existing messages
        axios.get(`/api/messages/${activeUser.id}`)
            .then(res => setMessages(res.data.messages));

        // Listen for new messages & typing events
        const channel = window.Echo.private(`chat.${currentUser.id}`)
            .listen('MessageSent', (e) => {
                if (e.message.sender_id === activeUser.id || e.message.receiver_id === activeUser.id) {
                    setMessages(prev => [...prev, e.message]);
                }
            })
            .listen('UserTyping', (e) => {
                if (e.senderId === activeUser.id) {
                    setRemoteTyping(true);
                    clearTimeout(typingTimeoutRef.current);
                    typingTimeoutRef.current = setTimeout(() => setRemoteTyping(false), 3000);
                }
            });

        return () => {
            channel.stopListening('MessageSent');
            channel.stopListening('UserTyping');
        };
    }, [activeUser, currentUser.id]);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages, remoteTyping]);

    const handleTyped = (e) => {
        setNewMessage(e.target.value);
        if (!isTyping) {
            setIsTyping(true);
            // In a real app we'd dispatch a generic hit to a small endpoint or use client events
        }
    };

    const sendMessage = async (e) => {
        e.preventDefault();
        if (!newMessage.trim()) return;

        const dummyMsg = {
            id: Date.now(),
            sender_id: currentUser.id,
            receiver_id: activeUser.id,
            body: newMessage,
            created_at: new Date().toISOString()
        };

        setMessages(prev => [...prev, dummyMsg]);
        setNewMessage('');
        setIsTyping(false);

        await axios.post('/api/messages', {
            receiver_id: activeUser.id,
            body: dummyMsg.body
        });
    };

    if (!activeUser) {
        return (
            <div className="flex-1 flex flex-col items-center justify-center bg-gray-950/80">
                <div className="w-16 h-16 bg-gray-800 rounded-2xl flex items-center justify-center mb-4 text-gray-500 shadow-xl">
                    <Send className="w-8 h-8" />
                </div>
                <h2 className="text-xl font-semibold text-gray-300">Select a chat to start messaging</h2>
            </div>
        );
    }

    const isOnline = onlineUsers.includes(activeUser.id);

    return (
        <div className="flex-1 flex flex-col bg-gray-950">
            {/* Header */}
            <div className="h-16 flex items-center justify-between px-6 border-b border-gray-800 bg-gray-900 backdrop-blur-sm z-10 flex-shrink-0">
                <div className="flex items-center gap-4">
                    <div className="relative">
                        {activeUser.avatar ? (
                            <img src={activeUser.avatar} className="w-10 h-10 rounded-full object-cover" />
                        ) : (
                            <div className="w-10 h-10 bg-gray-700 rounded-full flex items-center justify-center text-gray-300">
                                <UserIcon className="w-5 h-5" />
                            </div>
                        )}
                        {isOnline && <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 border-2 border-gray-900 rounded-full"></span>}
                    </div>
                    <div>
                        <h2 className="text-sm font-semibold text-white">{activeUser.name}</h2>
                        <p className="text-xs text-gray-400">
                            {isOnline ? <span className="text-green-400">Online</span> : 'Offline'}
                        </p>
                    </div>
                </div>
                <button className="text-gray-400 hover:text-white transition-colors">
                    <MoreVertical className="w-5 h-5" />
                </button>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-6 space-y-4">
                {messages.map((msg, idx) => {
                    const isMe = msg.sender_id === currentUser.id;
                    return (
                        <div key={msg.id || idx} className={clsx("flex flex-col max-w-[75%]", isMe ? "ml-auto items-end" : "mr-auto items-start")}>
                            <div className={clsx(
                                "px-4 py-2.5 rounded-2xl shadow-sm text-sm",
                                isMe ? "bg-brand-600 text-white rounded-tr-sm" : "bg-gray-800 text-gray-100 rounded-tl-sm border border-gray-700"
                            )}>
                                {msg.body}
                                {msg.attachments?.map(att => (
                                    <div key={att.id} className="mt-2 text-xs opacity-80 flex items-center gap-1 bg-black/20 p-2 rounded">
                                        <File className="w-4 h-4" />
                                        {att.file_name}
                                    </div>
                                ))}
                            </div>
                            <span className="text-[10px] text-gray-500 mt-1 px-1">
                                {format(new Date(msg.created_at), 'HH:mm')}
                            </span>
                        </div>
                    );
                })}
                {remoteTyping && (
                    <div className="flex mr-auto items-start max-w-[75%]">
                        <div className="bg-gray-800 px-4 py-3 rounded-2xl rounded-tl-sm border border-gray-700 flex gap-1">
                            <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce"></span>
                            <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce [animation-delay:0.2s]"></span>
                            <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce [animation-delay:0.4s]"></span>
                        </div>
                    </div>
                )}
                <div ref={messagesEndRef} />
            </div>

            {/* Input Form */}
            <div className="p-4 bg-gray-900 border-t border-gray-800">
                <form onSubmit={sendMessage} className="flex items-end gap-2 max-w-4xl mx-auto">
                    <button type="button" className="p-2.5 text-gray-400 hover:text-white hover:bg-gray-800 rounded-full transition-colors">
                        <Paperclip className="w-5 h-5" />
                    </button>
                    <div className="flex-1 min-h-[44px] bg-gray-800 border border-gray-700 rounded-2xl flex items-center px-4 relative">
                        <input
                            type="text"
                            value={newMessage}
                            onChange={handleTyped}
                            placeholder="Type a message..."
                            className="w-full bg-transparent border-none focus:ring-0 text-sm text-white placeholder-gray-500 py-3"
                        />
                    </div>
                    <button
                        type="submit"
                        disabled={!newMessage.trim()}
                        className="p-2.5 text-white bg-brand-600 hover:bg-brand-500 rounded-full transition-colors shadow-lg shadow-brand-600/20 disabled:opacity-50 disabled:shadow-none"
                    >
                        <Send className="w-5 h-5 ml-0.5" />
                    </button>
                </form>
            </div>
        </div>
    );
}
