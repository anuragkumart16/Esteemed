"use client";

import Link from 'next/link';
import { ChevronLeft, User } from 'lucide-react';
import { usePathname } from 'next/navigation';

interface HeaderProps {
    title?: string;
    showBack?: boolean;
    backLink?: string;
    children?: React.ReactNode;
}

export default function Header({ title, showBack = false, backLink = '/', children }: HeaderProps) {
    const pathname = usePathname();
    const isLanding = pathname === '/landing' || pathname === '/';

    return (
        <div className="flex justify-between items-center w-full py-2 px-6 bg-white text-black sticky top-0 z-10 border-b border-gray-200 rounded-b-3xl shadow-sm">
            <div className="flex items-center gap-4">
                {showBack && (
                    <Link href={backLink} className="p-2 -ml-2 hover:bg-gray-100 rounded-full transition-colors">
                        <ChevronLeft size={24} />
                    </Link>
                )}

                {title ? (
                    <h1 className="text-xl ">{title}</h1>
                ) : isLanding ? (
                    <h1 className="text-xl">Hello Warrior!</h1>
                ) : null}
            </div>

            <div className="flex items-center gap-4">
                {children}
                <Link href="/account" className="p-1 hover:bg-gray-100 rounded-full transition-colors">
                    <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center border border-gray-200">
                        <User size={20} className="text-gray-600" />
                    </div>
                </Link>
            </div>
        </div>
    );
}
