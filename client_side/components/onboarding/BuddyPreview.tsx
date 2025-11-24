import React from 'react';
import { MessageSquare } from 'lucide-react';

export default function BuddyPreview() {
    return (
        <div className="flex flex-col items-center gap-6 pointer-events-none grayscale">
            {/* Header */}
            <div className="w-full max-w-md bg-zinc-900 rounded-2xl p-4 flex items-center gap-3 shadow-lg border border-zinc-800">
                <div className="w-8 h-8 bg-zinc-800 rounded-full flex items-center justify-center">
                    <MessageSquare size={16} className="text-white" />
                </div>
                <span className="text-white font-semibold">Buddy AI</span>
            </div>

            {/* Arrow pointing down */}
            <div className="text-zinc-500 text-2xl">↓</div>

            {/* Chat Preview */}
            <div className="w-full max-w-md bg-zinc-900 rounded-3xl p-6 border border-zinc-800 shadow-2xl space-y-4">

                {/* User Message */}
                <div className="flex justify-end">
                    <div className="bg-zinc-800 text-white px-4 py-3 rounded-2xl rounded-br-sm max-w-[80%]">
                        <p className="text-sm">I feel like giving up...</p>
                    </div>
                </div>

                {/* AI Message */}
                <div className="flex justify-start">
                    <div className="bg-zinc-950 border border-zinc-800 text-zinc-300 px-4 py-3 rounded-2xl rounded-bl-sm max-w-[90%]">
                        <p className="text-sm">
                            Take a deep breath. Remember why you started. What triggered this feeling?
                        </p>
                    </div>
                </div>

                {/* Input Placeholder */}
                <div className="mt-4 pt-4 border-t border-zinc-800 flex gap-2">
                    <div className="flex-1 bg-zinc-950 h-10 rounded-full border border-zinc-800" />
                    <div className="w-10 h-10 bg-zinc-800 rounded-full" />
                </div>
            </div>
        </div>
    );
}
