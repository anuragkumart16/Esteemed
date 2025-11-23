import React from 'react';

export default function UrgePreview() {
    return (
        <div className="flex flex-col items-center gap-6 pointer-events-none grayscale">
            {/* Trigger Button */}
            <div className="w-full max-w-md bg-slate-900 text-white py-4 rounded-2xl font-medium text-center shadow-lg">
                I had an urge!
            </div>

            {/* Arrow pointing down */}
            <div className="text-zinc-500 text-2xl">↓</div>

            {/* Modal Preview */}
            <div className="w-full max-w-md bg-zinc-900 rounded-3xl p-6 border border-zinc-800 shadow-2xl">
                <h2 className="text-2xl font-bold text-white mb-6 text-center">Urge Conquered?</h2>

                <label className="block text-zinc-400 text-sm mb-2 ml-1">What triggered it?</label>
                <div className="w-full bg-zinc-800 rounded-xl p-4 text-zinc-500 mb-4 h-[80px]">
                    e.g., Instagram, Boredom...
                </div>

                <label className="block text-zinc-400 text-sm mb-2 ml-1">How did you win?</label>
                <div className="w-full bg-zinc-800 rounded-xl p-4 text-zinc-500 mb-6 h-[80px]">
                    e.g., Went for a walk...
                </div>

                <div className="flex gap-4">
                    <div className="flex-1 bg-zinc-800 text-white py-4 rounded-2xl font-semibold text-center">
                        Cancel
                    </div>
                    <div className="flex-1 bg-white text-black py-4 rounded-2xl font-bold text-center">
                        Log Victory
                    </div>
                </div>
            </div>
        </div>
    );
}
