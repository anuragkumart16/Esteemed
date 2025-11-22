"use client";

import { useState, useEffect } from 'react';
import BottomNav from '@/components/BottomNav';
import { UserCircle, Mail, Calendar, Key, LogOut, Trash2, ChevronRight } from 'lucide-react';

export default function AccountPage() {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [userEmail, setUserEmail] = useState('');
    const [joinDate, setJoinDate] = useState('');

    // Login State
    const [showLoginModal, setShowLoginModal] = useState(false);
    const [loginEmail, setLoginEmail] = useState('');
    const [loginPassword, setLoginPassword] = useState('');

    // Password State
    const [showPasswordModal, setShowPasswordModal] = useState(false);
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    useEffect(() => {
        // Check local storage for mock login
        const email = localStorage.getItem('userEmail');
        if (email) {
            setIsLoggedIn(true);
            setUserEmail(email);
            setJoinDate(new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }));
        }
    }, []);

    const handleLogin = () => {
        if (!loginEmail || !loginPassword) return;
        localStorage.setItem('userEmail', loginEmail);
        setIsLoggedIn(true);
        setUserEmail(loginEmail);
        setJoinDate(new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }));
        setShowLoginModal(false);
    };

    const handleLogout = () => {
        if (confirm('Are you sure you want to logout?')) {
            localStorage.removeItem('userEmail');
            setIsLoggedIn(false);
            setUserEmail('');
        }
    };

    const handleDeleteAllData = () => {
        if (confirm('This will permanently delete all your data including streaks, urge logs, and account information. This action cannot be undone.')) {
            localStorage.clear();
            setIsLoggedIn(false);
            setUserEmail('');
            alert('All data has been deleted');
        }
    };

    const handleChangePassword = () => {
        if (!currentPassword || !newPassword || !confirmPassword) return;
        if (newPassword !== confirmPassword) {
            alert('New passwords do not match');
            return;
        }
        alert('Password changed successfully');
        setShowPasswordModal(false);
        setCurrentPassword('');
        setNewPassword('');
        setConfirmPassword('');
    };

    if (!isLoggedIn) {
        return (
            <div className="min-h-screen bg-black text-white p-4 pb-24">
                <h1 className="text-xl font-bold text-center mb-8">Account</h1>

                <div className="bg-white rounded-3xl p-8 flex flex-col items-center text-black max-w-md mx-auto">
                    <UserCircle size={80} className="text-zinc-300 mb-4" />
                    <h2 className="text-2xl font-bold mb-2">Not Logged In</h2>
                    <p className="text-zinc-500 text-center mb-8">Login to view your account details and sync your progress</p>
                    <button
                        onClick={() => setShowLoginModal(true)}
                        className="w-full bg-slate-900 text-white rounded-2xl py-4 font-semibold hover:bg-slate-800 transition-colors"
                    >
                        Login
                    </button>
                </div>

                {/* Login Modal */}
                {showLoginModal && (
                    <div className="fixed inset-0 bg-black/90 backdrop-blur-sm flex justify-center items-center p-4 z-50 animate-in fade-in duration-200">
                        <div className="bg-zinc-900 rounded-3xl p-6 w-full max-w-md border border-zinc-800 shadow-2xl">
                            <h2 className="text-2xl font-bold text-white mb-6 text-center">Login</h2>

                            <label className="block text-zinc-400 text-sm mb-2 ml-1">Email</label>
                            <input
                                type="email"
                                value={loginEmail}
                                onChange={(e) => setLoginEmail(e.target.value)}
                                placeholder="Enter your email"
                                className="w-full bg-zinc-800 rounded-xl p-4 text-white mb-4 focus:outline-none focus:ring-1 focus:ring-white transition-all"
                            />

                            <label className="block text-zinc-400 text-sm mb-2 ml-1">Password</label>
                            <input
                                type="password"
                                value={loginPassword}
                                onChange={(e) => setLoginPassword(e.target.value)}
                                placeholder="Enter your password"
                                className="w-full bg-zinc-800 rounded-xl p-4 text-white mb-6 focus:outline-none focus:ring-1 focus:ring-white transition-all"
                            />

                            <div className="flex gap-4">
                                <button
                                    onClick={() => setShowLoginModal(false)}
                                    className="flex-1 bg-zinc-800 text-white py-4 rounded-2xl font-semibold hover:bg-zinc-700 transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleLogin}
                                    className="flex-1 bg-white text-black py-4 rounded-2xl font-bold hover:bg-zinc-200 transition-colors"
                                >
                                    Login
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                <BottomNav />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-black text-white p-4 pb-24">
            <h1 className="text-xl font-bold text-center mb-8">Account</h1>

            <div className="max-w-md mx-auto space-y-6">
                {/* Account Info */}
                <div>
                    <h2 className="text-lg font-semibold mb-3 ml-1">Account Information</h2>
                    <div className="bg-zinc-900 rounded-2xl p-5 space-y-4">
                        <div className="flex items-center gap-4">
                            <Mail className="text-zinc-500" size={20} />
                            <div>
                                <p className="text-xs text-zinc-500">Email</p>
                                <p className="font-medium">{userEmail}</p>
                            </div>
                        </div>
                        <div className="h-px bg-zinc-800" />
                        <div className="flex items-center gap-4">
                            <Calendar className="text-zinc-500" size={20} />
                            <div>
                                <p className="text-xs text-zinc-500">Joined</p>
                                <p className="font-medium">{joinDate}</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Settings */}
                <div>
                    <h2 className="text-lg font-semibold mb-3 ml-1">Settings</h2>
                    <div className="bg-zinc-900 rounded-2xl overflow-hidden">
                        <button
                            onClick={() => setShowPasswordModal(true)}
                            className="w-full p-5 flex items-center justify-between hover:bg-zinc-800 transition-colors"
                        >
                            <div className="flex items-center gap-4">
                                <Key className="text-white" size={20} />
                                <span className="font-medium">Change Password</span>
                            </div>
                            <ChevronRight className="text-zinc-500" size={20} />
                        </button>
                        <div className="h-px bg-zinc-800 mx-5" />
                        <button
                            onClick={handleLogout}
                            className="w-full p-5 flex items-center justify-between hover:bg-zinc-800 transition-colors"
                        >
                            <div className="flex items-center gap-4">
                                <LogOut className="text-white" size={20} />
                                <span className="font-medium">Logout</span>
                            </div>
                            <ChevronRight className="text-zinc-500" size={20} />
                        </button>
                    </div>
                </div>

                {/* Danger Zone */}
                <div>
                    <h2 className="text-lg font-semibold mb-3 ml-1 text-red-500">Danger Zone</h2>
                    <button
                        onClick={handleDeleteAllData}
                        className="w-full bg-white text-black rounded-2xl p-4 flex items-center justify-center gap-2 font-semibold hover:bg-zinc-200 transition-colors mb-2"
                    >
                        <Trash2 size={20} />
                        Delete All Data
                    </button>
                    <p className="text-xs text-zinc-500 text-center">This will permanently delete all your data</p>
                </div>
            </div>

            {/* Change Password Modal */}
            {showPasswordModal && (
                <div className="fixed inset-0 bg-black/90 backdrop-blur-sm flex justify-center items-center p-4 z-50 animate-in fade-in duration-200">
                    <div className="bg-zinc-900 rounded-3xl p-6 w-full max-w-md border border-zinc-800 shadow-2xl">
                        <h2 className="text-2xl font-bold text-white mb-6 text-center">Change Password</h2>

                        <label className="block text-zinc-400 text-sm mb-2 ml-1">Current Password</label>
                        <input
                            type="password"
                            value={currentPassword}
                            onChange={(e) => setCurrentPassword(e.target.value)}
                            placeholder="Enter current password"
                            className="w-full bg-zinc-800 rounded-xl p-4 text-white mb-4 focus:outline-none focus:ring-1 focus:ring-white transition-all"
                        />

                        <label className="block text-zinc-400 text-sm mb-2 ml-1">New Password</label>
                        <input
                            type="password"
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                            placeholder="Enter new password"
                            className="w-full bg-zinc-800 rounded-xl p-4 text-white mb-4 focus:outline-none focus:ring-1 focus:ring-white transition-all"
                        />

                        <label className="block text-zinc-400 text-sm mb-2 ml-1">Confirm New Password</label>
                        <input
                            type="password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            placeholder="Confirm new password"
                            className="w-full bg-zinc-800 rounded-xl p-4 text-white mb-6 focus:outline-none focus:ring-1 focus:ring-white transition-all"
                        />

                        <div className="flex gap-4">
                            <button
                                onClick={() => setShowPasswordModal(false)}
                                className="flex-1 bg-zinc-800 text-white py-4 rounded-2xl font-semibold hover:bg-zinc-700 transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleChangePassword}
                                className="flex-1 bg-white text-black py-4 rounded-2xl font-bold hover:bg-zinc-200 transition-colors"
                            >
                                Change
                            </button>
                        </div>
                    </div>
                </div>
            )}

            <BottomNav />
        </div>
    );
}
