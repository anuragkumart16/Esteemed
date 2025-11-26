'use client';

import React, { useState, useEffect } from 'react';
import { CheckCircle, ArrowRight, Shield, Lock, Activity, Users, Trophy } from 'lucide-react';

export default function EarlyAccess() {
    const [email, setEmail] = useState('');
    const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
    const [message, setMessage] = useState('');
    const [visitorId, setVisitorId] = useState('');

    useEffect(() => {
        // Generate or retrieve visitor ID
        let vid = localStorage.getItem('esteemed_visitor_id');
        if (!vid) {
            vid = crypto.randomUUID();
            localStorage.setItem('esteemed_visitor_id', vid);
        }
        setVisitorId(vid);

        // Track visit
        const trackVisit = async () => {
            try {
                await fetch('/api/track-visit', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ visitorId: vid }),
                });
            } catch (error) {
                console.error('Failed to track visit', error);
            }
        };

        trackVisit();
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!email) return;

        setStatus('loading');
        try {
            const res = await fetch('/api/early-access', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ userId: visitorId, email }),
            });

            const data = await res.json();

            if (res.ok) {
                setStatus('success');
                setMessage('Welcome to the inner circle. We will contact you soon.');
                setEmail('');
            } else {
                setStatus('error');
                setMessage(data.error || 'Something went wrong. Please try again.');
            }
        } catch (error) {
            setStatus('error');
            setMessage('Failed to connect. Please check your internet.');
        }
    };

    return (
        <div className="min-h-screen bg-black text-gray-200 font-sans selection:bg-green-500/30">
            <div className="max-w-4xl mx-auto px-6 py-12 md:py-20 flex flex-col items-center">

                {/* Header */}
                <div className="text-center mb-12 space-y-4">
                    <h1 className="text-5xl md:text-7xl font-bold tracking-tighter text-white">
                        ESTEEMED
                    </h1>
                    <p className="text-lg md:text-xl text-gray-400 max-w-2xl mx-auto leading-relaxed">
                        Reclaim your mind. A purely <span className="text-green-500 font-semibold">Android</span> solution to break free from addiction.
                    </p>
                </div>

                {/* Features Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full mb-16">
                    <FeatureCard icon={<Lock className="w-6 h-6 text-green-500" />} title="Panic Mode" desc="Blocks all navigation during vulnerable moments." />
                    <FeatureCard icon={<Shield className="w-6 h-6 text-green-500" />} title="Smart Blocking" desc="App blocking during your specific vulnerable hours." />
                    <FeatureCard icon={<Activity className="w-6 h-6 text-green-500" />} title="Relapse Tracking" desc="Detailed stats and streak tracking to monitor progress." />
                    <FeatureCard icon={<Users className="w-6 h-6 text-green-500" />} title="Community" desc="Connect with fellow warriors on the same path." />
                </div>

                {/* Pricing & CTA */}
                <div className="w-full max-w-md bg-zinc-900/50 border border-zinc-800 rounded-2xl p-8 backdrop-blur-sm relative overflow-hidden group">
                    <div className="absolute inset-0 bg-linear-to-b from-green-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                    <div className="relative z-10 flex flex-col items-center gap-6">
                        <div className="text-center space-y-2">
                            <p className="text-sm uppercase tracking-widest text-green-500 font-medium">Early Access</p>
                            <p className="text-3xl font-bold text-white">$1.5<span className="text-lg text-gray-500 font-normal">/mo</span></p>
                            <p className="text-sm text-gray-400">Limited spots available for the pilot program.</p>
                        </div>

                        {status === 'success' ? (
                            <div className="flex flex-col items-center gap-3 text-green-500 bg-green-500/10 p-4 rounded-xl w-full animate-in fade-in zoom-in duration-300">
                                <CheckCircle className="w-8 h-8" />
                                <p className="text-center font-medium">{message}</p>
                            </div>
                        ) : (
                            <form onSubmit={handleSubmit} className="w-full space-y-3">
                                <div className="relative">
                                    <input
                                        type="email"
                                        placeholder="Enter your email address"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        className="w-full bg-black border border-zinc-700 rounded-xl px-4 py-3 text-white placeholder-zinc-500 focus:outline-none focus:border-green-500 focus:ring-1 focus:ring-green-500 transition-all"
                                        required
                                    />
                                </div>
                                <button
                                    type="submit"
                                    disabled={status === 'loading'}
                                    className="w-full bg-green-600 hover:bg-green-500 text-white font-medium py-3 rounded-xl transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed group"
                                >
                                    {status === 'loading' ? 'Joining...' : 'Join Early Access'}
                                    {!status && <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />}
                                </button>
                                {status === 'error' && (
                                    <p className="text-red-400 text-sm text-center">{message}</p>
                                )}
                            </form>
                        )}
                    </div>
                </div>

                <p className="mt-12 text-zinc-600 text-sm">© 2024 Esteemed. All rights reserved.</p>
            </div>
        </div>
    );
}

function FeatureCard({ icon, title, desc }: { icon: React.ReactNode, title: string, desc: string }) {
    return (
        <div className="bg-zinc-900/30 border border-zinc-800/50 p-6 rounded-xl flex flex-col gap-3 hover:border-zinc-700 transition-colors">
            <div className="bg-zinc-950 w-fit p-3 rounded-lg border border-zinc-800">
                {icon}
            </div>
            <h3 className="font-semibold text-white text-lg">{title}</h3>
            <p className="text-zinc-400 text-sm leading-relaxed">{desc}</p>
        </div>
    );
}