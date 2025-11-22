"use client";

import { useState, useEffect } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import { format } from 'date-fns';
import { X } from 'lucide-react';
import BottomNav from '@/components/BottomNav';

export default function LandingPage() {
  const [userId, setUserId] = useState<string | null>(null);
  const [streakStartDate, setStreakStartDate] = useState<Date | null>(null);
  const [urgesWon, setUrgesWon] = useState(0);
  const [lastRelapseReason, setLastRelapseReason] = useState('');
  const [elapsedTime, setElapsedTime] = useState({ days: 0, hours: 0, minutes: 0 });
  const [headerText, setHeaderText] = useState('you are goated!');

  // Modals
  const [showUrgeModal, setShowUrgeModal] = useState(false);
  const [showResetModal, setShowResetModal] = useState(false);

  // Form inputs
  const [urgeTrigger, setUrgeTrigger] = useState('');
  const [urgeVictory, setUrgeVictory] = useState('');
  const [relapseReason, setRelapseReason] = useState('');

  useEffect(() => {
    // Initialize User
    const initUser = async () => {
      let storedUserId = localStorage.getItem('userId');

      const res = await fetch('/api/user', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: storedUserId }),
      });

      if (res.ok) {
        const user = await res.json();
        if (!storedUserId) {
          localStorage.setItem('userId', user.id);
          setUserId(user.id);
        } else {
          setUserId(storedUserId);
        }

        if (user.streakStartDate) {
          setStreakStartDate(new Date(user.streakStartDate));
        }
        if (user.urges) {
          setUrgesWon(user.urges.length);
        }
        if (user.relapses && user.relapses.length > 0) {
          setLastRelapseReason(user.relapses[user.relapses.length - 1].reason);
        }
      }
    };

    initUser();
  }, []);

  // Timer
  useEffect(() => {
    if (!streakStartDate) return;

    const updateTimer = () => {
      const now = new Date();
      const diff = now.getTime() - new Date(streakStartDate).getTime();

      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

      setElapsedTime({ days, hours, minutes });
    };

    updateTimer();
    const interval = setInterval(updateTimer, 60000);
    return () => clearInterval(interval);
  }, [streakStartDate]);

  // Header rotation
  useEffect(() => {
    const texts = [
      'you are goated!',
      `Urges Won: ${urgesWon}`,
      lastRelapseReason ? `Last: ${lastRelapseReason}` : 'Keep pushing!'
    ];
    let index = 0;
    const interval = setInterval(() => {
      index = (index + 1) % texts.length;
      setHeaderText(texts[index]);
    }, 3000);
    return () => clearInterval(interval);
  }, [urgesWon, lastRelapseReason]);

  const startStreak = async () => {
    if (!userId) return;
    const now = new Date();
    const res = await fetch('/api/streak/start', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId, startDate: now }),
    });
    if (res.ok) {
      setStreakStartDate(now);
    }
  };

  const resetStreak = async () => {
    if (!userId) return;
    const res = await fetch('/api/streak/reset', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId, reason: relapseReason }),
    });
    if (res.ok) {
      setStreakStartDate(null);
      setLastRelapseReason(relapseReason);
      setRelapseReason('');
      setShowResetModal(false);
    }
  };

  const logUrge = async () => {
    if (!userId || !urgeTrigger || !urgeVictory) return;
    const res = await fetch('/api/urge', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId, trigger: urgeTrigger, victory: urgeVictory }),
    });
    if (res.ok) {
      setUrgesWon(prev => prev + 1);
      setUrgeTrigger('');
      setUrgeVictory('');
      setShowUrgeModal(false);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white p-4 pb-24 flex flex-col items-center">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="bg-white rounded-full py-4 px-6 mb-6 flex justify-center items-center shadow-lg shadow-white/10">
          <h1 className="text-black text-lg font-medium animate-fade-in">{headerText}</h1>
        </div>

        {/* Streak Status */}
        <div className="bg-zinc-900 rounded-xl p-4 mb-6 flex justify-between items-center border border-zinc-800">
          <span className="text-white text-sm font-medium">{streakStartDate ? 'Keep going!' : 'No active streak'}</span>
          {urgesWon > 0 && <span className="text-emerald-400 text-sm font-bold">Urges Won: {urgesWon}</span>}
        </div>

        {/* Timer / Start Button */}
        {streakStartDate ? (
          <div className="bg-white rounded-3xl p-6 mb-6 flex justify-around items-baseline text-black shadow-xl shadow-white/5">
            <div className="flex items-baseline">
              <span className="text-5xl font-light tracking-tighter">{elapsedTime.days.toString().padStart(2, '0')}</span>
              <span className="text-xs ml-1 font-medium text-zinc-500">Days</span>
            </div>
            <div className="flex items-baseline">
              <span className="text-5xl font-light tracking-tighter">{elapsedTime.hours.toString().padStart(2, '0')}</span>
              <span className="text-xs ml-1 font-medium text-zinc-500">Hours</span>
            </div>
            <div className="flex items-baseline">
              <span className="text-5xl font-light tracking-tighter">{elapsedTime.minutes.toString().padStart(2, '0')}</span>
              <span className="text-xs ml-1 font-medium text-zinc-500">Minutes</span>
            </div>
          </div>
        ) : (
          <button
            onClick={startStreak}
            className="w-full bg-white rounded-3xl py-8 mb-6 flex justify-center items-center hover:bg-zinc-200 transition-colors"
          >
            <span className="text-black text-2xl font-light">Start Streak</span>
          </button>
        )}

        {/* Calendar */}
        <div className="bg-zinc-900 rounded-xl p-4 mb-6 border border-zinc-800 overflow-hidden">
          <style jsx global>{`
            .react-calendar {
              background: transparent !important;
              border: none !important;
              width: 100% !important;
              font-family: inherit;
            }
            .react-calendar__tile {
              color: #fff;
            }
            .react-calendar__tile:enabled:hover,
            .react-calendar__tile:enabled:focus {
              background: #333;
              border-radius: 8px;
            }
            .react-calendar__tile--now {
              background: #222;
              border-radius: 8px;
            }
            .react-calendar__month-view__days__day--weekend {
              color: #ff5555;
            }
            .react-calendar__month-view__weekdays__weekday {
              color: #888;
              text-decoration: none;
            }
            .react-calendar__navigation button {
              color: #fff;
              font-size: 1.2em;
            }
            .react-calendar__navigation button:enabled:hover,
            .react-calendar__navigation button:enabled:focus {
              background: #333;
              border-radius: 8px;
            }
            .streak-day {
              background: #fff !important;
              color: #000 !important;
              border-radius: 50%;
            }
          `}</style>
          <Calendar
            className="bg-transparent text-white w-full border-none"
            tileClassName={({ date, view }) => {
              if (view === 'month' && streakStartDate && date >= streakStartDate && date <= new Date()) {
                return 'streak-day';
              }
              return null;
            }}
          />
        </div>

        {/* Actions */}
        <div className="bg-white rounded-3xl p-6 flex flex-col gap-4 shadow-xl shadow-white/5">
          <button
            onClick={() => setShowResetModal(true)}
            className="w-full bg-slate-900 text-white py-4 rounded-2xl font-medium hover:bg-slate-800 transition-colors"
          >
            I gave in!
          </button>
          <button
            onClick={() => setShowUrgeModal(true)}
            className="w-full bg-slate-900 text-white py-4 rounded-2xl font-medium hover:bg-slate-800 transition-colors"
          >
            I had an urge!
          </button>
        </div>
      </div>

      {/* Urge Modal */}
      {showUrgeModal && (
        <div className="fixed inset-0 bg-black/90 backdrop-blur-sm flex justify-center items-center p-4 z-50 animate-in fade-in duration-200">
          <div className="bg-zinc-900 rounded-3xl p-6 w-full max-w-md border border-zinc-800 shadow-2xl">
            <h2 className="text-2xl font-bold text-white mb-6 text-center">Urge Conquered?</h2>

            <label className="block text-zinc-400 text-sm mb-2 ml-1">What triggered it?</label>
            <textarea
              value={urgeTrigger}
              onChange={(e) => setUrgeTrigger(e.target.value)}
              placeholder="e.g., Boredom, Stress..."
              className="w-full bg-zinc-800 rounded-xl p-4 text-white mb-4 min-h-[80px] resize-none focus:outline-none focus:ring-1 focus:ring-white transition-all"
            />

            <label className="block text-zinc-400 text-sm mb-2 ml-1">How did you win?</label>
            <textarea
              value={urgeVictory}
              onChange={(e) => setUrgeVictory(e.target.value)}
              placeholder="e.g., Went for a walk, Meditated..."
              className="w-full bg-zinc-800 rounded-xl p-4 text-white mb-6 min-h-[80px] resize-none focus:outline-none focus:ring-1 focus:ring-white transition-all"
            />

            <div className="flex gap-4">
              <button
                onClick={() => setShowUrgeModal(false)}
                className="flex-1 bg-zinc-800 text-white py-4 rounded-2xl font-semibold hover:bg-zinc-700 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={logUrge}
                className="flex-1 bg-white text-black py-4 rounded-2xl font-bold hover:bg-zinc-200 transition-colors"
              >
                Log Victory
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Reset Modal */}
      {showResetModal && (
        <div className="fixed inset-0 bg-black/90 backdrop-blur-sm flex justify-center items-center p-4 z-50 animate-in fade-in duration-200">
          <div className="bg-zinc-900 rounded-3xl p-6 w-full max-w-md border border-zinc-800 shadow-2xl">
            <h2 className="text-2xl font-bold text-white mb-4 text-center">What happened?</h2>
            <p className="text-zinc-400 text-center mb-6">Breaking the streak is part of the journey. Why did you give in?</p>

            <textarea
              value={relapseReason}
              onChange={(e) => setRelapseReason(e.target.value)}
              placeholder="e.g., Stress, Boredom, Triggered by..."
              className="w-full bg-zinc-800 rounded-xl p-4 text-white mb-6 min-h-[80px] resize-none focus:outline-none focus:ring-1 focus:ring-white transition-all"
            />

            <div className="flex gap-4">
              <button
                onClick={() => setShowResetModal(false)}
                className="flex-1 bg-zinc-800 text-white py-4 rounded-2xl font-semibold hover:bg-zinc-700 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={resetStreak}
                className="flex-1 bg-white text-black py-4 rounded-2xl font-bold hover:bg-zinc-200 transition-colors"
              >
                Reset Streak
              </button>
            </div>
          </div>
        </div>
      )}

      <BottomNav />
    </div>
  );
}