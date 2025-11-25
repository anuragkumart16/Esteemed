import React from 'react';

const DesktopWarning = () => (
    <div className="hidden md:flex fixed inset-0 z-50 flex-col items-center justify-center bg-zinc-950 text-zinc-50 p-8 text-center">
        <div className="absolute top-[-10%] left-[-20%] w-[140%] h-[50%] bg-zinc-100 rounded-b-[100%] z-0 opacity-5"></div>
        <div className="z-10 flex flex-col items-center max-w-md">
            <h1 className="text-4xl font-serif font-bold mb-6">Mobile View Only</h1>
            <p className="text-zinc-400 text-lg leading-relaxed">
                Esteemed is designed to be experienced on a mobile device.
                <br /><br />
                Please switch to mobile view or open this page on your phone to continue your journey.
            </p>
        </div>
    </div>
);

export default DesktopWarning;
