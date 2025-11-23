"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { BarChart2, Home, User, Users, Heart, History } from 'lucide-react';

export default function BottomNav() {
    const pathname = usePathname();

    const isActive = (path: string) => pathname === path;

    return (
        <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 pb-safe pt-2 px-6 rounded-t-3xl shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.1)] z-50">
            <div className="flex justify-between items-center max-w-md mx-auto h-16">
                <Link href="/stats" className={`flex flex-col items-center gap-1 ${isActive('/stats') ? 'text-black' : 'text-gray-400'}`}>
                    <BarChart2 size={24} strokeWidth={isActive('/stats') ? 2.5 : 2} />
                    <span className="text-[10px] font-medium">Stats</span>
                </Link>

                <Link href="/account" className={`flex flex-col items-center gap-1 ${isActive('/account') ? 'text-black' : 'text-gray-400'}`}>
                    <User size={24} strokeWidth={isActive('/account') ? 2.5 : 2} />
                    <span className="text-[10px] font-medium">Account</span>
                </Link>

                <Link href="/landing" className={`flex flex-col items-center gap-1 ${isActive('/landing') ? 'text-black' : 'text-gray-400'}`}>
                    <Home size={24} strokeWidth={isActive('/landing') ? 2.5 : 2} />
                    <span className="text-[10px] font-medium">Home</span>
                </Link>



                {/* Hidden in mobile app but requested by user to be visible? 
            The user said "I can't see the bottom navigation for stats, community , buddy , home and account page"
            So I will include them.


        */}

                <Link href="/history" className={`flex flex-col items-center gap-1 ${isActive('/history') ? 'text-black' : 'text-gray-400'}`}>
                    <History size={24} strokeWidth={isActive('/history') ? 2.5 : 2} />
                    <span className="text-[10px] font-medium">History</span>
                </Link>

                <Link href="/community" className={`flex flex-col items-center gap-1 ${isActive('/community') ? 'text-black' : 'text-gray-400'}`}>
                    <Users size={24} strokeWidth={isActive('/community') ? 2.5 : 2} />
                    <span className="text-[10px] font-medium">Community</span>
                </Link>


                {/* <Link href="/buddy" className={`flex flex-col items-center gap-1 ${isActive('/buddy') ? 'text-black' : 'text-gray-400'}`}>
                    <Heart size={24} strokeWidth={isActive('/buddy') ? 2.5 : 2} />
                    <span className="text-[10px] font-medium">Buddy</span>
                </Link> */}
            </div>
        </div>
    );
}
