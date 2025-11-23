import React from 'react';
import { Pause, RotateCcw } from 'lucide-react';

export default function PanicPreview() {
    return (
        <div className="flex flex-col items-center gap-6 pointer-events-none grayscale">
            {/* Trigger Button */}
            <div className="w-full max-w-md bg-indigo-600 rounded-2xl p-4 flex justify-center items-center shadow-lg">
                <span className="text-white font-semibold text-lg">Panic Button (30s)</span>
            </div>

            {/* Arrow pointing down */}
            <div className="text-zinc-500 text-2xl">↓</div>

            {/* Timer Preview */}
            <div className="w-full max-w-md flex flex-col items-center bg-black/50 p-6 rounded-3xl border border-zinc-800">
                <h1 className="text-3xl font-light mb-8 tracking-wide text-white">Breathe</h1>

                {/* Timer Display */}
                <div className="relative w-48 h-48 flex items-center justify-center mb-8">
                    <svg className="absolute top-0 left-0 w-full h-full transform -rotate-90">
                        <circle
                            cx="96"
                            cy="96"
                            r="88"
                            stroke="currentColor"
                            strokeWidth="6"
                            fill="transparent"
                            className="text-zinc-900"
                        />
                        <circle
                            cx="96"
                            cy="96"
                            r="88"
                            stroke="currentColor"
                            strokeWidth="6"
                            fill="transparent"
                            strokeDasharray={2 * Math.PI * 88}
                            strokeDashoffset={2 * Math.PI * 88 * 0.25}
                            className="text-white"
                            strokeLinecap="round"
                        />
                    </svg>

                    <div className="text-5xl font-thin tracking-tighter text-white">
                        22
                    </div>
                </div>

                {/* Controls */}
                <div className="flex gap-6">
                    <div className="w-12 h-12 bg-white text-black rounded-full flex items-center justify-center shadow-lg shadow-white/10">
                        <Pause size={20} fill="currentColor" />
                    </div>

                    <div className="w-12 h-12 bg-zinc-900 text-white rounded-full flex items-center justify-center border border-zinc-800">
                        <RotateCcw size={18} />
                    </div>
                </div>

                <p className="mt-8 text-zinc-500 text-center max-w-xs text-sm">
                    Take 30 seconds to center yourself before making a decision.
                </p>
            </div>
        </div>
    );
}
