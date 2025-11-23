"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import UrgePreview from "@/components/onboarding/UrgePreview";
import RelapsePreview from "@/components/onboarding/RelapsePreview";
import PanicPreview from "@/components/onboarding/PanicPreview";

declare global {
  interface Window {
    ReactNativeWebView: {
      postMessage: (message: string) => void;
    };
  }
}

export default function Home() {
  const [showSplash, setShowSplash] = useState(true);
  const [currentSlide, setCurrentSlide] = useState(0);
  const router = useRouter();

  useEffect(() => {
    const hasOnboarded = localStorage.getItem("hasOnboarded");
    if (hasOnboarded) {
      router.replace("/landing");
      return;
    }

    const timer = setTimeout(() => {
      setShowSplash(false);
    }, 3000); // Show splash for 3 seconds

    return () => clearTimeout(timer);
  }, [router]);

  const handleContinue = () => {
    if (currentSlide < 3) {
      setCurrentSlide(prev => prev + 1);
    } else {
      localStorage.setItem("hasOnboarded", "true");
      if (window.ReactNativeWebView) {
        window.ReactNativeWebView.postMessage("onboarding_complete");
      } else {
        router.push("/landing");
      }
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
      <div className="absolute top-[-15%] left-[-20%] w-[140%] h-[45%] bg-white rounded-b-[100%] z-0 transition-all duration-700 ease-in-out"
        style={{ transform: `translateY(${currentSlide * -10}%)` }}></div>

      <div className="z-10 flex-1 flex flex-col items-center justify-center text-center mt-20 w-full max-w-md relative">

        {/* Slide 0: Intro */}
        <div className={`absolute inset-0 flex flex-col items-center justify-center transition-opacity duration-500 ${currentSlide === 0 ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}>
          <p className="text-sm font-light tracking-widest uppercase mb-2 text-zinc-400">Delusion Presents</p>
          <h1 className="text-4xl font-serif font-bold mb-6">Esteemed</h1>
          <p className="text-xl text-zinc-300 max-w-xs leading-relaxed">
            An app to help you overcome chronic masturbation.
          </p>
        </div>

        {/* Slide 1: Urge Documentation */}
        <div className={`absolute inset-0 flex flex-col items-center justify-center transition-opacity duration-500 ${currentSlide === 1 ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-full scale-90 opacity-60 blur-[1px]">
            <UrgePreview />
          </div>
          <div className="z-20 bg-black/60 backdrop-blur-sm p-6 rounded-3xl border border-white/10 shadow-2xl">
            <h2 className="text-2xl font-bold mb-3">Document Urges</h2>
            <p className="text-zinc-300">
              Observe your patterns. Understand your triggers to conquer them.
            </p>
          </div>
        </div>

        {/* Slide 2: Relapse Documentation */}
        <div className={`absolute inset-0 flex flex-col items-center justify-center transition-opacity duration-500 ${currentSlide === 2 ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-full scale-90 opacity-60 blur-[1px]">
            <RelapsePreview />
          </div>
          <div className="z-20 bg-black/60 backdrop-blur-sm p-6 rounded-3xl border border-white/10 shadow-2xl">
            <h2 className="text-2xl font-bold mb-3">Rise from Ashes</h2>
            <p className="text-zinc-300">
              Document your give ups. Learn from every fall to build a stronger streak.
            </p>
          </div>
        </div>

        {/* Slide 3: Panic Button */}
        <div className={`absolute inset-0 flex flex-col items-center justify-center transition-opacity duration-500 ${currentSlide === 3 ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-full scale-90 opacity-60 blur-[1px]">
            <PanicPreview />
          </div>
          <div className="z-20 bg-black/60 backdrop-blur-sm p-6 rounded-3xl border border-white/10 shadow-2xl">
            <h2 className="text-2xl font-bold mb-3">Panic Button</h2>
            <p className="text-zinc-300">
              A tool to calm you down. Stop yourself from giving in when the urge hits hard.
            </p>
          </div>
        </div>

      </div>

      <div className="z-10 w-full max-w-md mb-8">
        {/* Progress Indicators */}
        <div className="flex justify-center gap-2 mb-6">
          {[0, 1, 2, 3].map((idx) => (
            <div
              key={idx}
              className={`h-1.5 rounded-full transition-all duration-300 ${idx === currentSlide ? 'w-8 bg-white' : 'w-2 bg-zinc-700'}`}
            />
          ))}
        </div>

        <button
          type="button"
          onClick={handleContinue}
          className="w-full rounded-full bg-white py-4 text-black font-bold text-lg hover:bg-gray-200 transition-colors shadow-lg shadow-white/10"
        >
          {currentSlide === 3 ? "Get Started" : "Continue"}
        </button>
      </div>
    </div>
  );
}
