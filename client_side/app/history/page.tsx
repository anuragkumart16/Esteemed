"use client";

import { useState, useEffect } from 'react';
import BottomNav from '@/components/BottomNav';
import { ArrowLeft, Trophy, AlertTriangle, Calendar } from 'lucide-react';
import Link from 'next/link';
import { format } from 'date-fns';

export default function HistoryPage() {
    const [historyItems, setHistoryItems] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadData = async () => {
            const userId = localStorage.getItem('userId');
            if (!userId) {
                setLoading(false);
                return;
            }

            try {
                const res = await fetch('/api/user', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ userId }),
                });

                if (res.ok) {
                    const user = await res.json();
                    processHistory(user);
                }
            } catch (error) {
                console.error("Error loading history:", error);
            } finally {
                setLoading(false);
            }
        };

        loadData();
    }, []);

    const processHistory = (user: any) => {
        const urges = user.urges?.map((u: any) => ({
            type: 'urge',
            date: new Date(u.date),
            trigger: u.trigger,
            victory: u.victory,
            id: u.id
        })) || [];

        const relapses = user.relapses?.map((r: any) => ({
            type: 'relapse',
            date: new Date(r.date),
            reason: r.reason,
            id: r.id
        })) || [];

        const combined = [...urges, ...relapses].sort((a, b) => b.date.getTime() - a.date.getTime());
        setHistoryItems(combined);
    };

    return (
        <div className="min-h-screen bg-black text-white p-4 pb-24">
            {/* Header */}
            <div className="flex items-center mb-8">
                <Link href="/stats" className="bg-zinc-900 p-3 rounded-full mr-4 hover:bg-zinc-800 transition-colors">
                    <ArrowLeft size={20} />
                </Link>
                <h1 className="text-2xl font-bold">History</h1>
            </div>

            {loading ? (
                <div className="flex justify-center py-12">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
                </div>
            ) : historyItems.length > 0 ? (
                <div className="space-y-4">
                    {historyItems.map((item) => (
                        <div key={`${item.type}-${item.id}`} className="bg-zinc-900 rounded-2xl p-5 border border-zinc-800">
                            <div className="flex justify-between items-start mb-3">
                                <div className="flex items-center gap-3">
                                    <div className={`p-2 rounded-full ${item.type === 'urge' ? 'bg-emerald-500/10 text-emerald-500' : 'bg-red-500/10 text-red-500'}`}>
                                        {item.type === 'urge' ? <Trophy size={18} /> : <AlertTriangle size={18} />}
                                    </div>
                                    <div>
                                        <h3 className={`font-bold ${item.type === 'urge' ? 'text-emerald-400' : 'text-red-400'}`}>
                                            {item.type === 'urge' ? 'Urge Defeated' : 'Streak Reset'}
                                        </h3>
                                        <div className="flex items-center text-zinc-500 text-xs mt-0.5">
                                            <Calendar size={12} className="mr-1" />
                                            {format(item.date, 'MMM d, yyyy • h:mm a')}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="pl-[52px]">
                                {item.type === 'urge' ? (
                                    <>
                                        <div className="mb-2">
                                            <span className="text-xs text-zinc-500 uppercase tracking-wider font-semibold">Trigger</span>
                                            <p className="text-zinc-300 text-sm mt-0.5">{item.trigger}</p>
                                        </div>
                                        <div>
                                            <span className="text-xs text-zinc-500 uppercase tracking-wider font-semibold">Victory Strategy</span>
                                            <p className="text-zinc-300 text-sm mt-0.5">{item.victory}</p>
                                        </div>
                                    </>
                                ) : (
                                    <div>
                                        <span className="text-xs text-zinc-500 uppercase tracking-wider font-semibold">Reason</span>
                                        <p className="text-zinc-300 text-sm mt-0.5">{item.reason}</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="text-center py-12 text-zinc-500">
                    <p>No history recorded yet.</p>
                </div>
            )}

            <BottomNav />
        </div>
    );
}
