"use client";

import { useState, useEffect, useRef } from 'react';
import Header from '@/components/Header';
import BottomNav from '@/components/BottomNav';
import { ChevronLeft, Send } from 'lucide-react';
import Link from 'next/link';

interface Message {
    id: string;
    text: string;
    senderId: string;
    senderName: string;
    timestamp: Date;
    avatarColor?: string;
}

const MOCK_USERS = [
    { id: 'user1', name: 'Alice', color: '#FF6B6B' },
    { id: 'user2', name: 'Bob', color: '#4ECDC4' },
    { id: 'user3', name: 'Charlie', color: '#45B7D1' },
    { id: 'user4', name: 'David', color: '#96CEB4' },
];

export default function CommunityPage() {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [inputText, setInputText] = useState('');
    const [messages, setMessages] = useState<Message[]>([
        {
            id: '1',
            text: "Has anyone else felt the urge strong today?",
            senderId: 'user1',
            senderName: 'Alice',
            timestamp: new Date(Date.now() - 3600000),
            avatarColor: '#FF6B6B'
        },
        {
            id: '2',
            text: "Yeah, mornings are always tough for me. Stay strong!",
            senderId: 'user2',
            senderName: 'Bob',
            timestamp: new Date(Date.now() - 3500000),
            avatarColor: '#4ECDC4'
        },
        {
            id: '3',
            text: "I went for a run instead, really helped clear my mind.",
            senderId: 'user3',
            senderName: 'Charlie',
            timestamp: new Date(Date.now() - 3400000),
            avatarColor: '#45B7D1'
        },
        {
            id: '4',
            text: "That's a great idea. I might try meditation.",
            senderId: 'user1',
            senderName: 'Alice',
            timestamp: new Date(Date.now() - 3300000),
            avatarColor: '#FF6B6B'
        },
    ]);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const sendMessage = () => {
        if (!inputText.trim()) return;

        const newUserMessage: Message = {
            id: Date.now().toString(),
            text: inputText,
            senderId: 'me',
            senderName: 'Me',
            timestamp: new Date(),
        };

        setMessages((prev) => [...prev, newUserMessage]);
        setInputText('');

        setTimeout(() => {
            const randomUser = MOCK_USERS[Math.floor(Math.random() * MOCK_USERS.length)];
            const reply: Message = {
                id: (Date.now() + 1).toString(),
                text: "We are in this together! 💪",
                senderId: randomUser.id,
                senderName: randomUser.name,
                timestamp: new Date(),
                avatarColor: randomUser.color
            };
            setMessages((prev) => [...prev, reply]);
        }, 2000);
    };

    if (!isLoggedIn) {
        return (
            <div className="min-h-screen bg-black text-white p-4 flex flex-col justify-center items-center">
                <div className="bg-zinc-900 rounded-3xl p-8 w-full max-w-md border border-zinc-800 text-center">
                    <div className="w-24 h-24 bg-white rounded-full flex justify-center items-center mx-auto mb-6">
                        <UsersIcon size={40} className="text-black" />
                    </div>
                    <h1 className="text-2xl font-bold mb-2">Join the Community</h1>
                    <p className="text-zinc-400 mb-8">Connect with others on the same journey. Share your progress and get support.</p>
                    <button
                        onClick={() => setIsLoggedIn(true)}
                        className="w-full bg-white text-black rounded-full py-4 font-bold hover:bg-zinc-200 transition-colors"
                    >
                        Login to Join
                    </button>
                </div>
                <BottomNav />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-black text-white flex flex-col">
            {/* Header */}
            <Header title="Community Chat" showBack backLink="/landing">
                <div className="bg-zinc-900 px-3 py-1.5 rounded-full flex items-center gap-2">
                    <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse" />
                    <span className="text-xs text-zinc-400 font-medium">{MOCK_USERS.length + 12} online</span>
                </div>
            </Header>

            {/* Chat Content */}
            <div className="flex-1 p-4 pb-24 overflow-y-auto">
                <div className="space-y-4 max-w-md mx-auto">
                    {messages.map((msg) => {
                        const isMe = msg.senderId === 'me';
                        return (
                            <div key={msg.id} className={`flex ${isMe ? 'justify-end' : 'justify-start'} items-end gap-2`}>
                                {!isMe && (
                                    <div
                                        className="w-8 h-8 rounded-full flex justify-center items-center text-xs font-bold text-white shrink-0"
                                        style={{ backgroundColor: msg.avatarColor || '#ccc' }}
                                    >
                                        {msg.senderName[0]}
                                    </div>
                                )}
                                <div className={`max-w-[75%] p-3 rounded-2xl ${isMe ? 'bg-slate-900 text-white rounded-br-sm' : 'bg-zinc-800 text-white rounded-bl-sm'}`}>
                                    {!isMe && <p className="text-xs text-zinc-400 mb-1 font-medium">{msg.senderName}</p>}
                                    <p className="text-sm leading-relaxed">{msg.text}</p>
                                    <p className="text-[10px] text-white/50 text-right mt-1">
                                        {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                    </p>
                                </div>
                            </div>
                        );
                    })}
                    <div ref={messagesEndRef} />
                </div>
            </div>

            {/* Input Area */}
            <div className="fixed bottom-[70px] left-0 right-0 bg-black border-t border-zinc-900 p-4">
                <div className="max-w-md mx-auto flex gap-3 items-center">
                    <input
                        type="text"
                        value={inputText}
                        onChange={(e) => setInputText(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
                        placeholder="Type a message..."
                        className="flex-1 bg-zinc-900 text-white rounded-full px-6 py-3 focus:outline-none focus:ring-1 focus:ring-white transition-all"
                    />
                    <button
                        onClick={sendMessage}
                        className="w-12 h-12 bg-white rounded-full flex justify-center items-center hover:bg-zinc-200 transition-colors shrink-0"
                    >
                        <Send size={20} className="text-black ml-1" />
                    </button>
                </div>
            </div>

            <BottomNav />
        </div>
    );
}

function UsersIcon({ size, className }: { size: number, className?: string }) {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            width={size}
            height={size}
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className={className}
        >
            <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
            <circle cx="9" cy="7" r="4" />
            <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
            <path d="M16 3.13a4 4 0 0 1 0 7.75" />
        </svg>
    );
}
