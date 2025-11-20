"use client";

import { useState, useEffect } from "react";

declare global {
  interface Window {
    ReactNativeWebView: {
      postMessage: (message: string) => void;
    };
  }
}

export default function Home() {
  const [showSplash, setShowSplash] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowSplash(false);
    }, 3000); // Show splash for 3 seconds

    return () => clearTimeout(timer);
  }, []);

  const handleContinue = () => {
    if (window.ReactNativeWebView) {
      window.ReactNativeWebView.postMessage("onboarding_complete");
    } else {
      console.log("Onboarding complete (Web Mode)");
    }
  };

  if (showSplash) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-black text-white relative overflow-hidden">
        {/* Top Curve */}
        <div className="absolute top-[-10%] left-[-20%] w-[140%] h-[50%] bg-white rounded-b-[100%] z-0"></div>

        {/* Bottom Curve */}
        <div className="absolute bottom-[-10%] left-[-20%] w-[140%] h-[50%] bg-white rounded-t-[100%] z-0"></div>

        <div className="z-10 flex flex-col items-center">
          <p className="text-sm font-light tracking-widest uppercase mb-2">Delusion</p>
          <p className="text-xs font-light tracking-widest lowercase mb-6">presents</p>
          <h1 className="text-5xl font-serif font-bold tracking-tight">Esteemed</h1>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-between bg-black text-white relative overflow-hidden px-6 py-12">
      {/* Top Curve */}
      <div className="absolute top-[-15%] left-[-20%] w-[140%] h-[45%] bg-white rounded-b-[100%] z-0"></div>

      <div className="z-10 flex-1 flex flex-col items-center justify-center text-center mt-20">
        <p className="text-xl mb-2">You will quit</p>
        <h1 className="text-6xl font-serif font-bold mb-4">Fap</h1>
        <p className="text-xl mb-1">and we will help</p>
        <p className="text-xl mb-4">you</p>
        <h1 className="text-6xl font-serif font-bold">do it.</h1>
      </div>

      <div className="z-10 w-full max-w-md mb-8">
        <button
          onClick={handleContinue}
          className="w-full rounded-full bg-white py-4 text-black font-bold text-lg hover:bg-gray-200 transition-colors"
        >
          Continue
        </button>
      </div>
    </div>
  );
}
