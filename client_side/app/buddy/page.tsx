"use client";

import { useState, useEffect, useRef } from 'react';
import BottomNav from '@/components/BottomNav';
import { ChevronLeft, Send } from 'lucide-react';
import Link from 'next/link';

interface Message {
    id: string;
    text: string;
    sender: 'user' | 'ai';
    timestamp: Date;
}

export default function BuddyPage() {
    const [inputText, setInputText] = useState('');
    const [messages, setMessages] = useState<Message[]>([
        {
            id: 'old_1',
            text: "I almost gave in yesterday.",
            sender: 'user',
            timestamp: new Date(Date.now() - 86400000 * 2),
        },
        {
            id: 'old_2',
            text: "That's okay. What matters is that you're here now. What triggered it?",
            sender: 'ai',
            timestamp: new Date(Date.now() - 86400000 * 2 + 60000),
        },
        {
            id: 'yesterday_1',
            text: "Feeling much better today!",
            sender: 'user',
            timestamp: new Date(Date.now() - 86400000),
        },
        {
            id: '1',
            text: "Hey there! I'm here to help you navigate your urges. How are you feeling right now?",
            sender: 'ai',
            timestamp: new Date(),
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
            sender: 'user',
            timestamp: new Date(),
        };

        setMessages((prev) => [...prev, newUserMessage]);
        setInputText('');

        setTimeout(() => {
            const aiResponse: Message = {
                id: (Date.now() + 1).toString(),
                text: "I hear you. It's great that you're acknowledging how you feel. Remember, this urge is temporary. What can we do to distract you for the next 10 minutes?",
                sender: 'ai',
                timestamp: new Date(),
            };
            setMessages((prev) => [...prev, aiResponse]);
        }, 1000);
    };

    const formatDateHeader = (date: Date) => {
        const now = new Date();
        const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        const yesterday = new Date(today);
        yesterday.setDate(yesterday.getDate() - 1);
        const messageDate = new Date(date.getFullYear(), date.getMonth(), date.getDate());

        if (messageDate.getTime() === today.getTime()) {
            return 'Today';
        } else if (messageDate.getTime() === yesterday.getTime()) {
            return 'Yesterday';
        } else {
            return messageDate.toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' });
        }
    };

    return (
        <div className="min-h-screen bg-black text-white flex flex-col">
            {/* Header */}
            <div className="bg-black border-b border-zinc-900 p-4 flex justify-between items-center sticky top-0 z-10">
                <Link href="/landing" className="p-2">
                    <ChevronLeft size={24} />
                </Link>
                <h1 className="text-lg font-bold">Buddy AI</h1>
                <div className="w-8" /> {/* Spacer */}
            </div>

            {/* Chat Content */}
            <div className="flex-1 p-4 pb-24 overflow-y-auto">
                <div className="space-y-4 max-w-md mx-auto">
                    {messages.map((msg, index) => {
                        const isUser = msg.sender === 'user';
                        const showDateHeader = index === 0 ||
                            formatDateHeader(messages[index - 1].timestamp) !== formatDateHeader(msg.timestamp);

                        return (
                            <div key={msg.id}>
                                {showDateHeader && (
                                    <div className="flex justify-center my-4">
                                        <span className="bg-zinc-900 text-zinc-500 text-xs px-3 py-1 rounded-full font-medium">
                                            {formatDateHeader(msg.timestamp)}
                                        </span>
                                    </div>
                                )}
                                <div className={`flex ${isUser ? 'justify-end' : 'justify-start'}`}>
                                    <div className={`max-w-[80%] p-3 rounded-2xl ${isUser ? 'bg-slate-900 text-white rounded-br-sm' : 'bg-zinc-800 text-white rounded-bl-sm'}`}>
                                        <p className="text-sm leading-relaxed">{msg.text}</p>
                                        <p className="text-[10px] text-white/50 text-right mt-1">
                                            {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                        </p>
                                    </div>
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

            {/* <BottomNav /> */}
        </div>
    );
}
