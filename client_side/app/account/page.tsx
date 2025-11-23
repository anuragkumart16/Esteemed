"use client";

import { useState, useEffect } from 'react';
import BottomNav from '@/components/BottomNav';
import { UserCircle, Mail, Copy, Check, Trash2, ChevronRight } from 'lucide-react';

export default function AccountPage() {
    const [userId, setUserId] = useState<string | null>(null);
    const [copySuccess, setCopySuccess] = useState(false);

    // Feedback State
    const [showFeedbackModal, setShowFeedbackModal] = useState(false);
    const [feedbackText, setFeedbackText] = useState('');

    useEffect(() => {
        const storedUserId = localStorage.getItem('userId');
        if (storedUserId) {
            setUserId(storedUserId);
        }
    }, []);

    const handleCopyUserId = async () => {
        if (userId) {
            try {
                await navigator.clipboard.writeText(userId);
                setCopySuccess(true);
                setTimeout(() => setCopySuccess(false), 2000);
            } catch (err) {
                console.error('Failed to copy text: ', err);
            }
        }
    };

    const handleDeleteAllData = () => {
        if (confirm('This will permanently delete all your data including streaks, urge logs, and account information. This action cannot be undone.')) {
            localStorage.clear();
            setUserId(null);
            alert('All data has been deleted');
            window.location.reload();
        }
    };

    const handleFeedbackSubmit = async () => {
        if (!feedbackText.trim()) return;

        try {
            const res = await fetch('/api/feedback', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ userId, feedback: feedbackText }),
            });

            if (res.ok) {
                alert('Thank you for your feedback!');
                setFeedbackText('');
                setShowFeedbackModal(false);
            } else {
                alert('Failed to submit feedback. Please try again.');
            }
        } catch (error) {
            console.error('Error submitting feedback:', error);
            alert('An error occurred. Please try again.');
        }
    };

    return (
        <div className="min-h-screen bg-zinc-950 text-zinc-50 p-4 pb-24">
            <h1 className="text-xl font-bold text-center mb-8">Account</h1>

            <div className="max-w-md mx-auto space-y-6">
                {/* User ID Section */}
                <div className="bg-zinc-100 rounded-3xl p-8 flex flex-col items-center text-zinc-900 shadow-lg shadow-white/5">
                    <UserCircle size={80} className="text-zinc-300 mb-4" />
                    <h2 className="text-2xl font-bold mb-2">Anonymous User</h2>
                    <p className="text-zinc-500 text-center mb-6 text-sm">
                        This ID is auto-generated to keep your data private.
                    </p>

                    <div className="w-full bg-white rounded-2xl p-4 flex items-center justify-between border border-zinc-200">
                        <div className="flex-1 overflow-hidden mr-4">
                            <p className="text-xs text-zinc-400 uppercase tracking-wider mb-1">User ID</p>
                            <p className="font-mono text-sm truncate select-all">{userId || 'Loading...'}</p>
                        </div>
                        <button
                            onClick={handleCopyUserId}
                            className="p-2 hover:bg-zinc-100 rounded-xl transition-colors text-zinc-500"
                        >
                            {copySuccess ? <Check size={20} className="text-green-500" /> : <Copy size={20} />}
                        </button>
                    </div>
                </div>

                {/* Settings */}
                <div>
                    <h2 className="text-lg font-semibold mb-3 ml-1">Settings</h2>
                    <div className="bg-zinc-100 rounded-2xl overflow-hidden text-zinc-900">
                        <button
                            onClick={() => setShowFeedbackModal(true)}
                            className="w-full p-5 flex items-center justify-between hover:bg-zinc-200 transition-colors"
                        >
                            <div className="flex items-center gap-4">
                                <Mail className="text-zinc-900" size={20} />
                                <span className="font-medium">Send Feedback</span>
                            </div>
                            <ChevronRight className="text-zinc-400" size={20} />
                        </button>
                    </div>
                </div>

                {/* Danger Zone */}
                <div>
                    <h2 className="text-lg font-semibold mb-3 ml-1 text-red-500">Danger Zone</h2>
                    <button
                        onClick={handleDeleteAllData}
                        className="w-full bg-zinc-100 text-red-500 rounded-2xl p-4 flex items-center justify-center gap-2 font-semibold hover:bg-red-50 transition-colors mb-2"
                    >
                        <Trash2 size={20} />
                        Delete All Data
                    </button>
                    <p className="text-xs text-zinc-500 text-center">This will permanently delete all your data</p>
                </div>
            </div>

            {/* Feedback Modal */}
            {showFeedbackModal && (
                <div className="fixed inset-0 bg-black/90 backdrop-blur-sm flex justify-center items-center p-4 z-50 animate-in fade-in duration-200">
                    <div className="bg-zinc-900 rounded-3xl p-6 w-full max-w-md border border-zinc-800 shadow-2xl">
                        <h2 className="text-2xl font-bold text-white mb-4 text-center">Send Feedback</h2>
                        <p className="text-zinc-400 text-center mb-6">We'd love to hear your thoughts! Let us know how we can improve.</p>

                        <textarea
                            value={feedbackText}
                            onChange={(e) => setFeedbackText(e.target.value)}
                            placeholder="Type your feedback here..."
                            className="w-full bg-zinc-800 rounded-xl p-4 text-white mb-6 min-h-[120px] resize-none focus:outline-none focus:ring-1 focus:ring-white transition-all"
                        />

                        <div className="flex gap-4">
                            <button
                                onClick={() => setShowFeedbackModal(false)}
                                className="flex-1 bg-zinc-800 text-white py-4 rounded-2xl font-semibold hover:bg-zinc-700 transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleFeedbackSubmit}
                                className="flex-1 bg-zinc-100 text-zinc-900 py-4 rounded-2xl font-bold hover:bg-zinc-200 transition-colors"
                            >
                                Send
                            </button>
                        </div>
                    </div>
                </div>
            )}

            <BottomNav />
        </div>
    );
}
