import React from 'react';

export default function RelapsePreview() {
    return (
        <div className="flex flex-col items-center gap-6 pointer-events-none grayscale">
            {/* Trigger Button */}
            <div className="w-full max-w-md bg-slate-900 text-white py-4 rounded-2xl font-medium text-center shadow-lg">
                I gave in!
            </div>

            {/* Arrow pointing down */}
            <div className="text-zinc-500 text-2xl">↓</div>

            {/* Modal Preview */}
            <div className="w-full max-w-md bg-zinc-900 rounded-3xl p-6 border border-zinc-800 shadow-2xl">
                <h2 className="text-2xl font-bold text-white mb-4 text-center">What happened?</h2>
                <p className="text-zinc-400 text-center mb-6">Breaking the streak is part of the journey. What triggered you to give in?</p>

                <div className="w-full bg-zinc-800 rounded-xl p-4 text-zinc-500 mb-6 h-[80px]">
                    e.g. Triggered by instagram...
                </div>

                <div className="flex gap-4">
                    <div className="flex-1 bg-zinc-800 text-white py-4 rounded-2xl font-semibold text-center">
                        Cancel
                    </div>
                    <div className="flex-1 bg-white text-black py-4 rounded-2xl font-bold text-center">
                        Reset Streak
                    </div>
                </div>
            </div>
        </div>
    );
}
