"use client";

import { useState, useEffect } from 'react';
import BottomNav from '@/components/BottomNav';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';
import { ArrowRight, History } from 'lucide-react';
import Link from 'next/link';

export default function StatsPage() {
    const [currentStreak, setCurrentStreak] = useState(0);
    const [urgesWon, setUrgesWon] = useState(0);
    const [streakBroken, setStreakBroken] = useState(0);
    const [progressData, setProgressData] = useState<any[]>([]);
    const [relapseData, setRelapseData] = useState<any[]>([]);
    const [streakHeatmapData, setStreakHeatmapData] = useState<any[]>([]);
    const [urgesHeatmapData, setUrgesHeatmapData] = useState<any[]>([]);
    const [topTriggers, setTopTriggers] = useState<any[]>([]);
    const [activeSlide, setActiveSlide] = useState(0);

    useEffect(() => {
        const loadData = async () => {
            const userId = localStorage.getItem('userId');
            if (!userId) return;

            try {
                const res = await fetch('/api/user', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ userId }),
                });

                if (res.ok) {
                    const user = await res.json();
                    processStats(user);
                }
            } catch (error) {
                console.error("Error loading stats:", error);
            }
        };

        loadData();
    }, []);

    const processStats = (user: any) => {
        // 1. Summary Stats
        setUrgesWon(user.urges?.length || 0);
        setStreakBroken(user.relapses?.length || 0);

        if (user.streakStartDate) {
            const now = new Date().getTime();
            const start = new Date(user.streakStartDate).getTime();
            const diff = now - start;
            const days = Math.floor(diff / (1000 * 60 * 60 * 24));
            setCurrentStreak(days);
        } else {
            setCurrentStreak(0);
        }

        // 2. Progress Graph (Last 7 Days)
        const last7Days = [];
        const now = new Date();
        for (let i = 6; i >= 0; i--) {
            const d = new Date(now);
            d.setDate(d.getDate() - i);
            const dateStr = d.toISOString().split('T')[0];
            const dayName = d.toLocaleDateString('en-US', { weekday: 'short' });

            const count = user.urges?.filter((u: any) => u.date.startsWith(dateStr)).length || 0;
            last7Days.push({ name: dayName, value: count });
        }
        setProgressData(last7Days);

        // 3. Relapse Graph (Last 7 Days)
        const relapse7Days = [];
        for (let i = 6; i >= 0; i--) {
            const d = new Date(now);
            d.setDate(d.getDate() - i);
            const dateStr = d.toISOString().split('T')[0];
            const dayName = d.toLocaleDateString('en-US', { weekday: 'short' });

            const count = user.relapses?.filter((r: any) => r.date.startsWith(dateStr)).length || 0;
            relapse7Days.push({ name: dayName, value: count });
        }
        setRelapseData(relapse7Days);

        // 4. Top Triggers
        const triggerCounts: { [key: string]: number } = {};
        user.urges?.forEach((u: any) => {
            const trigger = u.trigger.trim();
            if (trigger) {
                triggerCounts[trigger] = (triggerCounts[trigger] || 0) + 1;
            }
        });
        const sortedTriggers = Object.entries(triggerCounts)
            .sort(([, a], [, b]) => b - a)
            .slice(0, 4)
            .map(([category, count]) => ({ category, count }));
        setTopTriggers(sortedTriggers);

        // 5. Urges Heatmap (Simplified for web)
        // We'll skip complex heatmap implementation for now and focus on the main charts
    };

    return (
        <div className="min-h-screen bg-black text-white p-4 pb-24">
            <h1 className="text-3xl font-bold mb-8">Your Progress</h1>

            {/* Summary Cards */}
            <div className="grid grid-cols-3 gap-3 mb-8">
                <div className="bg-zinc-900 rounded-2xl p-4 flex flex-col items-center">
                    <span className="text-2xl font-bold mb-1">{currentStreak}</span>
                    <span className="text-xs text-zinc-500 text-center">Current Streak</span>
                </div>
                <div className="bg-zinc-900 rounded-2xl p-4 flex flex-col items-center">
                    <span className="text-2xl font-bold mb-1">{urgesWon}</span>
                    <span className="text-xs text-zinc-500 text-center">Urges Won</span>
                </div>
                <div className="bg-zinc-900 rounded-2xl p-4 flex flex-col items-center">
                    <span className="text-2xl font-bold mb-1">{streakBroken}</span>
                    <span className="text-xs text-zinc-500 text-center">Streak Broken</span>
                </div>
            </div>

            {/* Carousel / Charts */}
            <div className="space-y-8 mb-8">
                {/* Weekly Progress */}
                <div>
                    <h2 className="text-xl font-semibold mb-4">Weekly Progress</h2>
                    <div className="bg-zinc-900 rounded-2xl p-4 h-64 w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={progressData}>
                                <defs>
                                    <linearGradient id="colorProgress" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                                        <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <XAxis dataKey="name" stroke="#52525b" fontSize={12} tickLine={false} axisLine={false} />
                                <Tooltip
                                    contentStyle={{ backgroundColor: '#18181b', border: 'none', borderRadius: '8px' }}
                                    itemStyle={{ color: '#fff' }}
                                />
                                <Area type="monotone" dataKey="value" stroke="#10b981" strokeWidth={2} fillOpacity={1} fill="url(#colorProgress)" />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Streak Restarts */}
                <div>
                    <h2 className="text-xl font-semibold mb-4">Streak Restarts</h2>
                    <div className="bg-zinc-900 rounded-2xl p-4 h-64 w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={relapseData}>
                                <defs>
                                    <linearGradient id="colorRelapse" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#ef4444" stopOpacity={0.3} />
                                        <stop offset="95%" stopColor="#ef4444" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <XAxis dataKey="name" stroke="#52525b" fontSize={12} tickLine={false} axisLine={false} />
                                <Tooltip
                                    contentStyle={{ backgroundColor: '#18181b', border: 'none', borderRadius: '8px' }}
                                    itemStyle={{ color: '#fff' }}
                                />
                                <Area type="monotone" dataKey="value" stroke="#ef4444" strokeWidth={2} fillOpacity={1} fill="url(#colorRelapse)" />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>

            {/* Top Triggers */}
            <div className="mb-8">
                <h2 className="text-xl font-semibold mb-4">Top Triggers</h2>
                {topTriggers.length > 0 ? (
                    <div className="space-y-3">
                        {topTriggers.map((trigger, index) => (
                            <div key={index} className="bg-zinc-900 rounded-xl p-4">
                                <div className="flex justify-between items-center mb-2">
                                    <span className="font-medium">{trigger.category}</span>
                                    <span className="font-bold">{trigger.count}</span>
                                </div>
                                <div className="h-1.5 bg-zinc-800 rounded-full overflow-hidden">
                                    <div
                                        className="h-full bg-white rounded-full"
                                        style={{ width: `${(trigger.count / Math.max(...topTriggers.map(t => t.count))) * 100}%` }}
                                    />
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <p className="text-zinc-500 text-center py-4">No triggers logged yet</p>
                )}
            </div>

            {/* Action Buttons */}
            <Link href="/buddy" className="block w-full bg-white text-black rounded-full py-4 text-center font-bold mb-4 hover:bg-zinc-200 transition-colors">
                Analyse with buddy
            </Link>

            <Link href="/history" className="block w-full bg-zinc-900 text-white rounded-full py-4 text-center font-bold hover:bg-zinc-800 transition-colors">
                View History
            </Link>

            <BottomNav />
        </div>
    );
}
