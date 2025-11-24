"use client";

import { useState, useEffect } from 'react';
import { CheckCircle, AlertCircle, Sparkles, Lock } from 'lucide-react';
import Link from 'next/link';
import Header from '@/components/Header';
import BottomNav from '@/components/BottomNav';

export default function BuddyPage() {
    const [email, setEmail] = useState('');
    const [userId, setUserId] = useState<string | null>(null);
    const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
    const [errorMessage, setErrorMessage] = useState('');

    useEffect(() => {
        const storedUserId = localStorage.getItem('userId');
        if (storedUserId) {
            setUserId(storedUserId);
        }
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!email || !userId) return;

        setStatus('loading');
        setErrorMessage('');

        try {
            const res = await fetch('/api/early-access', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ userId, email }),
            });

            const data = await res.json();

            if (res.ok) {
                setStatus('success');
                setEmail('');
            } else {
                setStatus('error');
                setErrorMessage(data.error || 'Something went wrong. Please try again.');
            }
        } catch (error) {
            setStatus('error');
            setErrorMessage('Failed to connect. Please check your internet connection.');
        }
    };

    return (
        <div className="min-h-screen bg-zinc-950 text-zinc-50 pb-24 flex flex-col items-center">
            <Header title="Buddy AI" />

            <div className="w-full max-w-md p-4 flex-1 flex flex-col">

                {/* Premium Banner */}
                <div className="bg-gradient-to-r from-amber-200/10 to-yellow-500/10 border border-amber-500/20 rounded-2xl p-3 mb-6 flex items-center justify-center gap-2">
                    <Sparkles size={16} className="text-amber-400" />
                    <span className="text-amber-200 text-sm font-medium tracking-wide uppercase">Premium Feature Coming Soon</span>
                </div>

                <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700">

                    {/* Hero Section */}
                    <div className="text-center space-y-3">
                        <h1 className="text-3xl font-bold tracking-tight text-white">
                            Your Personal <br /> <span className="text-zinc-400">Anti-Urge Coach</span>
                        </h1>
                        <p className="text-zinc-400 text-sm leading-relaxed max-w-xs mx-auto">
                            Smarter support to help you stay in control — especially during your weakest moments.
                        </p>
                    </div>

                    {/* Features Grid */}
                    <div className="bg-zinc-900 rounded-3xl p-6 border border-zinc-800 shadow-xl shadow-black/20">
                        <div className="space-y-6">
                            <div>
                                <h2 className="text-lg font-semibold text-emerald-400 mb-3 flex items-center gap-2">
                                    <Lock size={18} className="text-emerald-500/80" />
                                    What Buddy AI Does
                                </h2>
                                <ul className="space-y-3 text-zinc-300 text-sm">
                                    <li className="flex gap-3 items-start">
                                        <div className="mt-1.5 w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0" />
                                        <span><strong>Predicts high-risk hours</strong> based on your behavior</span>
                                    </li>
                                    <li className="flex gap-3 items-start">
                                        <div className="mt-1.5 w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0" />
                                        <span><strong>Real-time guidance</strong> through urges with science-backed actions</span>
                                    </li>
                                    <li className="flex gap-3 items-start">
                                        <div className="mt-1.5 w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0" />
                                        <span><strong>Identifies triggers</strong> and shows you how to avoid them</span>
                                    </li>
                                    <li className="flex gap-3 items-start">
                                        <div className="mt-1.5 w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0" />
                                        <span><strong>Daily relapse-risk score</strong> to keep you alert</span>
                                    </li>
                                </ul>
                            </div>

                            <div className="h-px w-full bg-zinc-800" />

                            <div>
                                <h2 className="text-lg font-semibold text-emerald-400 mb-2">Why It Matters</h2>
                                <p className="text-zinc-300 text-sm leading-relaxed mb-3">
                                    Buddy AI learns from your habits, urges, and routines. It gives you the right intervention <strong>before</strong> a relapse happens.
                                </p>
                                <p className="text-zinc-500 text-xs italic border-l-2 border-zinc-700 pl-3">
                                    "Hundreds of early users already rely on predictive insights to stay in control every day."
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* CTA Section */}
                    <div className="bg-zinc-100 rounded-3xl p-6 shadow-xl shadow-white/5 text-zinc-900">
                        <div className="text-center mb-6">
                            <h2 className="text-xl font-bold mb-1">Get Early Access</h2>
                            <p className="text-zinc-600 text-sm">Be the first to try Buddy AI when it launches.</p>
                        </div>

                        {status === 'success' ? (
                            <div className="bg-emerald-100 border border-emerald-200 rounded-2xl p-6 text-center animate-in zoom-in duration-300">
                                <CheckCircle className="w-10 h-10 text-emerald-600 mx-auto mb-2" />
                                <h3 className="text-base font-bold text-emerald-800 mb-1">You're on the list!</h3>
                                <p className="text-emerald-700 text-xs">We'll notify you as soon as your spot opens up.</p>
                            </div>
                        ) : (
                            <form onSubmit={handleSubmit} className="space-y-3">
                                <div>
                                    <input
                                        type="email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        placeholder="Enter your email address"
                                        required
                                        className="w-full bg-white border border-zinc-200 rounded-xl px-4 py-3 text-zinc-900 placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-zinc-900 focus:border-transparent transition-all"
                                    />
                                </div>

                                {status === 'error' && (
                                    <div className="flex items-center gap-2 text-red-600 text-xs bg-red-50 p-3 rounded-lg border border-red-100">
                                        <AlertCircle size={14} />
                                        <span>{errorMessage}</span>
                                    </div>
                                )}

                                <button
                                    type="submit"
                                    disabled={status === 'loading'}
                                    className="w-full bg-zinc-900 text-white font-bold py-3 rounded-xl hover:bg-zinc-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all active:scale-[0.98]"
                                >
                                    {status === 'loading' ? 'Joining...' : '👉 Join the Early Access List'}
                                </button>

                                <p className="text-center text-[10px] text-zinc-500 mt-2">
                                    Your data stays private. Always.
                                </p>
                            </form>
                        )}
                    </div>

                </div>
            </div>
            <BottomNav />
        </div>
    );
}
