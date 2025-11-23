"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Play, Pause, RotateCcw } from 'lucide-react';

export default function TimerPage() {
    const router = useRouter();
    const [timeLeft, setTimeLeft] = useState(30);
    const [isActive, setIsActive] = useState(true);
    const [userId, setUserId] = useState<string | null>(null);

    // Urge Logging State
    const [showUrgeModal, setShowUrgeModal] = useState(false);
    const [urgeTrigger, setUrgeTrigger] = useState('');
    const [urgeVictory, setUrgeVictory] = useState('');

    const progress = (timeLeft / 30) * 100;

    useEffect(() => {
        const storedUserId = localStorage.getItem('userId');
        if (storedUserId && storedUserId !== userId) {
            // eslint-disable-next-line react-hooks/set-state-in-effect
            setUserId(storedUserId);
        }
    }, [userId]);

    useEffect(() => {
        let interval: NodeJS.Timeout;

        if (isActive) {
            interval = setInterval(() => {
                setTimeLeft((prevTime) => {
                    if (prevTime <= 1) {
                        setIsActive(false);
                        setShowUrgeModal(true);
                        return 0;
                    }
                    return prevTime - 1;
                });
            }, 1000);
        }

        return () => clearInterval(interval);
    }, [isActive]);

    const toggleTimer = () => {
        if (timeLeft === 0) {
            setTimeLeft(30);
            setIsActive(true);
            setShowUrgeModal(false);
        } else {
            setIsActive(!isActive);
        }
    };

    const resetTimer = () => {
        setIsActive(false);
        setTimeLeft(30);
        setShowUrgeModal(false);
    };

    const logUrge = async () => {
        if (!userId || !urgeTrigger || !urgeVictory) return;

        try {
            const res = await fetch('/api/urge', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ userId, trigger: urgeTrigger, victory: urgeVictory }),
            });

            if (res.ok) {
                // Redirect to landing page after successful log
                router.push('/landing');
            }
        } catch (error) {
            console.error('Failed to log urge:', error);
        }
    };

    return (
        <div className="min-h-screen bg-zinc-950 text-zinc-50 flex flex-col items-center justify-center p-6 relative overflow-hidden">
            {/* Background decoration */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
                <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-purple-900/20 rounded-full blur-3xl"></div>
                <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-blue-900/20 rounded-full blur-3xl"></div>
            </div>

            {/* Back Button */}
            <button
                onClick={() => router.back()}
                className="absolute top-6 left-6 p-2 bg-zinc-900 rounded-full text-white hover:bg-zinc-800 transition-colors z-10"
            >
                <ArrowLeft size={24} />
            </button>

            <div className="z-10 flex flex-col items-center w-full max-w-md">
                <h1 className="text-3xl font-light mb-12 tracking-wide">Breathe</h1>

                {/* Timer Display */}
                <div className="relative w-64 h-64 flex items-center justify-center mb-12">
                    {/* SVG Circle Background */}
                    <svg className="absolute top-0 left-0 w-full h-full transform -rotate-90">
                        <circle
                            cx="128"
                            cy="128"
                            r="120"
                            stroke="currentColor"
                            strokeWidth="8"
                            fill="transparent"
                            className="text-zinc-900"
                        />
                        <circle
                            cx="128"
                            cy="128"
                            r="120"
                            stroke="currentColor"
                            strokeWidth="8"
                            fill="transparent"
                            strokeDasharray={2 * Math.PI * 120}
                            strokeDashoffset={2 * Math.PI * 120 * (1 - progress / 100)}
                            className="text-zinc-50 transition-all duration-1000 ease-linear"
                            strokeLinecap="round"
                        />
                    </svg>

                    <div className="text-7xl font-thin tracking-tighter">
                        {timeLeft}
                    </div>
                </div>

                {/* Controls */}
                <div className="flex gap-6">
                    <button
                        onClick={toggleTimer}
                        className="w-16 h-16 bg-zinc-100 text-zinc-900 rounded-full flex items-center justify-center hover:bg-zinc-200 transition-all active:scale-95 shadow-lg shadow-white/10"
                    >
                        {isActive ? <Pause size={28} fill="currentColor" /> : <Play size={28} fill="currentColor" className="ml-1" />}
                    </button>

                    <button
                        onClick={resetTimer}
                        className="w-16 h-16 bg-zinc-900 text-zinc-50 rounded-full flex items-center justify-center hover:bg-zinc-800 transition-all active:scale-95 border border-zinc-800"
                    >
                        <RotateCcw size={24} />
                    </button>
                </div>

                <p className="mt-12 text-zinc-500 text-center max-w-xs">
                    Take 30 seconds to center yourself before making a decision.
                </p>
            </div>

            {/* Urge Modal */}
            {showUrgeModal && (
                <div className="fixed inset-0 bg-black/90 backdrop-blur-sm flex justify-center items-center p-4 z-50 animate-in fade-in duration-200">
                    <div className="bg-zinc-900 rounded-3xl p-6 w-full max-w-md border border-zinc-800 shadow-2xl">
                        <h2 className="text-2xl font-bold text-white mb-6 text-center">Urge Conquered?</h2>

                        <label className="block text-zinc-400 text-sm mb-2 ml-1">What triggered it?</label>
                        <textarea
                            value={urgeTrigger}
                            onChange={(e) => setUrgeTrigger(e.target.value)}
                            placeholder="e.g., Instagram, Boredom, Stress..."
                            className="w-full bg-zinc-800 rounded-xl p-4 text-white mb-4 min-h-[80px] resize-none focus:outline-none focus:ring-1 focus:ring-white transition-all"
                        />

                        <label className="block text-zinc-400 text-sm mb-2 ml-1">How did you win?</label>
                        <textarea
                            value={urgeVictory}
                            onChange={(e) => setUrgeVictory(e.target.value)}
                            placeholder="e.g., Went for a walk, Meditated, etc..."
                            className="w-full bg-zinc-800 rounded-xl p-4 text-white mb-6 min-h-[80px] resize-none focus:outline-none focus:ring-1 focus:ring-white transition-all"
                        />

                        <div className="flex gap-4">
                            <button
                                onClick={() => setShowUrgeModal(false)}
                                className="flex-1 bg-zinc-800 text-white py-4 rounded-2xl font-semibold hover:bg-zinc-700 transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={logUrge}
                                className="flex-1 bg-zinc-100 text-zinc-900 py-4 rounded-2xl font-bold hover:bg-zinc-200 transition-colors"
                            >
                                Log Victory
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
