import React from 'react';
import { Volume2, VolumeX, BookOpen, Key, Layers, Table2, Compass, Sparkles } from 'lucide-react';
import { playSound } from '../utils/audio';
import { RiddleProgressIndicator } from './RiddleProgressIndicator';

export type NavTab = 'escape' | 'match' | 'table' | 'sandbox';

interface NavbarProps {
  currentTab: NavTab;
  onTabChange: (tab: NavTab) => void;
  soundMuted: boolean;
  onToggleSound: () => void;
  onOpenCurriculum: () => void;
  completedRiddleIds: string[];
  onNavigateToRiddle?: (riddleId: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentTab,
  onTabChange,
  soundMuted,
  onToggleSound,
  onOpenCurriculum,
  completedRiddleIds,
  onNavigateToRiddle,
}) => {
  const tabs = [
    {
      id: 'escape' as NavTab,
      label: 'Escape Room',
      icon: Key,
      badge: 'Chamber Quest 🗝️',
      color: 'from-amber-400 to-orange-500',
      activeBg: 'bg-amber-400 text-amber-950 border-amber-500 shadow-amber-200',
    },
    {
      id: 'match' as NavTab,
      label: 'Riddle Match',
      icon: Layers,
      badge: 'Try These 🧩',
      color: 'from-pink-400 to-rose-500',
      activeBg: 'bg-pink-500 text-white border-pink-600 shadow-pink-200',
    },
    {
      id: 'table' as NavTab,
      label: 'Table Challenge',
      icon: Table2,
      badge: 'Page 2 #3 📊',
      color: 'from-emerald-400 to-teal-500',
      activeBg: 'bg-emerald-500 text-white border-emerald-600 shadow-emerald-200',
    },
    {
      id: 'sandbox' as NavTab,
      label: 'Diagonal Lab',
      icon: Compass,
      badge: 'Explore 🧪',
      color: 'from-sky-400 to-indigo-500',
      activeBg: 'bg-indigo-600 text-white border-indigo-700 shadow-indigo-200',
    },
  ];

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b-4 border-amber-300 shadow-sm">
      {/* Decorative cute top bunting ribbon stripe */}
      <div className="h-2 w-full bg-gradient-to-r from-red-400 via-amber-400 via-emerald-400 via-sky-400 to-purple-400" />

      <div className="max-w-6xl mx-auto px-3 sm:px-6">
        <div className="flex items-center justify-between h-16 sm:h-20 gap-2 sm:gap-4">
          {/* Logo / App Brand */}
          <div className="flex items-center gap-2.5 sm:gap-3 min-w-0">
            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-2xl bg-gradient-to-br from-amber-400 via-pink-400 to-indigo-500 p-1 flex items-center justify-center text-white shadow-md shadow-pink-200 border-2 border-white shrink-0 animate-bounce-gentle">
              <svg width="26" height="26" viewBox="0 0 24 24" fill="none">
                <polygon
                  points="12,2 21,7 21,17 12,22 3,17 3,7"
                  stroke="#ffffff"
                  strokeWidth="2.8"
                  fill="#fef08a"
                  strokeLinejoin="round"
                />
              </svg>
            </div>

            <div className="min-w-0">
              <div className="flex items-center gap-1.5 flex-wrap">
                <span className="text-[10px] sm:text-xs font-display font-bold text-amber-900 bg-amber-200/90 px-2 py-0.5 rounded-full border border-amber-300 shadow-2xs">
                  ⭐ Unit 6: Space · Tahun 5
                </span>
              </div>
              <h1 className="text-sm sm:text-lg font-display font-bold text-slate-900 leading-tight truncate flex items-center gap-1 mt-0.5">
                Polygon Escape Quest <Sparkles className="w-4 h-4 text-amber-500 shrink-0 inline" />
              </h1>
            </div>
          </div>

          {/* Right Area: Cute Progress & Fun Buttons */}
          <div className="flex items-center gap-1.5 sm:gap-2.5 shrink-0">
            {/* Header Riddle Progress Indicator */}
            <RiddleProgressIndicator
              completedRiddleIds={completedRiddleIds}
              onNavigateToRiddle={onNavigateToRiddle}
            />

            {/* Sound Toggle */}
            <button
              onClick={() => {
                onToggleSound();
                playSound('click');
              }}
              className="p-2 sm:px-3 sm:py-2 rounded-2xl bg-amber-100 hover:bg-amber-200 text-amber-900 border-2 border-amber-300 font-display font-bold text-xs flex items-center gap-1.5 transition-all cursor-pointer shadow-xs active:scale-95"
              title={soundMuted ? 'Unmute Audio' : 'Mute Audio'}
            >
              {soundMuted ? (
                <>
                  <VolumeX className="w-4 h-4 text-rose-500" />
                  <span className="hidden md:inline">Mute</span>
                </>
              ) : (
                <>
                  <Volume2 className="w-4 h-4 text-emerald-600 animate-wiggle" />
                  <span className="hidden md:inline">Sound</span>
                </>
              )}
            </button>

            {/* Curriculum Notes */}
            <button
              onClick={() => {
                playSound('click');
                onOpenCurriculum();
              }}
              className="p-2 sm:px-3 sm:py-2 rounded-2xl bg-indigo-100 hover:bg-indigo-200 text-indigo-900 border-2 border-indigo-300 font-display font-bold text-xs flex items-center gap-1.5 transition-all cursor-pointer shadow-xs active:scale-95"
              title="View Textbook Reference"
            >
              <BookOpen className="w-4 h-4 text-indigo-600" />
              <span className="hidden lg:inline">Buku Teks</span>
            </button>
          </div>
        </div>

        {/* Tab Navigation Bar - Cute Candy Buttons */}
        <div className="flex items-center gap-1.5 sm:gap-2 overflow-x-auto py-2.5 no-scrollbar">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = currentTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => {
                  playSound('click');
                  onTabChange(tab.id);
                }}
                className={`flex items-center gap-2 py-2 px-3 sm:px-4 rounded-2xl font-display font-bold text-xs sm:text-sm whitespace-nowrap transition-all cursor-pointer border-2 shadow-xs active:translate-y-0.5 ${
                  isActive
                    ? `${tab.activeBg} scale-102`
                    : 'bg-white text-slate-700 border-slate-200 hover:border-amber-300 hover:bg-amber-50/50'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-current animate-bounce-gentle' : 'text-slate-400'}`} />
                <span>{tab.label}</span>
                <span
                  className={`text-[10px] px-2 py-0.5 rounded-full font-bold shadow-2xs ${
                    isActive
                      ? 'bg-black/15 text-white'
                      : 'bg-slate-100 text-slate-600'
                  }`}
                >
                  {tab.badge}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </header>
  );
};
