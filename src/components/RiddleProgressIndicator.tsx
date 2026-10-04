import React, { useState, useRef, useEffect } from 'react';
import { TEXTBOOK_RIDDLES, POLYGONS } from '../data/challenges';
import { Trophy, CheckCircle2, ChevronDown, Sparkles, Award, Star } from 'lucide-react';
import { playSound } from '../utils/audio';

interface RiddleProgressIndicatorProps {
  completedRiddleIds: string[];
  onNavigateToRiddle?: (riddleId: string) => void;
}

export const RiddleProgressIndicator: React.FC<RiddleProgressIndicatorProps> = ({
  completedRiddleIds,
  onNavigateToRiddle,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const total = TEXTBOOK_RIDDLES.length;
  const completedCount = completedRiddleIds.length;
  const percent = Math.round((completedCount / total) * 100);
  const isAllComplete = completedCount === total;
  const isCoreComplete = ['A', 'B', 'C'].every((id) => completedRiddleIds.includes(id));

  // Close dropdown on click outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Trigger Button in Header */}
      <button
        onClick={() => {
          playSound('click');
          setIsOpen((prev) => !prev);
        }}
        className={`group flex items-center gap-2 sm:gap-2.5 px-3 py-1.5 sm:px-3.5 sm:py-2 rounded-2xl border-2 transition-all cursor-pointer select-none shadow-xs active:scale-95 ${
          isAllComplete
            ? 'bg-gradient-to-r from-emerald-100 to-green-100 border-emerald-400 text-emerald-950 ring-2 ring-emerald-300'
            : isCoreComplete
            ? 'bg-gradient-to-r from-amber-100 to-yellow-100 border-amber-400 text-amber-950'
            : 'bg-white border-amber-300 text-slate-800 hover:bg-amber-50/70'
        }`}
        title="View session riddle challenge progress"
        aria-expanded={isOpen}
      >
        {/* Cute Cartoon Trophy / Star */}
        <div
          className={`w-7 h-7 sm:w-8 sm:h-8 rounded-xl flex items-center justify-center shrink-0 border transition-all ${
            isAllComplete
              ? 'bg-emerald-500 border-emerald-600 text-white shadow-sm animate-bounce-gentle'
              : completedCount > 0
              ? 'bg-amber-400 border-amber-500 text-amber-950 shadow-sm'
              : 'bg-slate-100 border-slate-200 text-slate-400'
          }`}
        >
          {isAllComplete ? (
            <Award className="w-4 h-4 text-white" />
          ) : (
            <Trophy className="w-4 h-4 text-current" />
          )}
        </div>

        {/* Text and Mini Rainbow Progress Bar */}
        <div className="text-left">
          <div className="flex items-center gap-1.5">
            <span className="text-[10px] sm:text-xs font-display font-bold uppercase tracking-wider text-amber-900">
              Riddles ⭐
            </span>
            <span className="text-[11px] sm:text-xs font-display font-bold text-slate-900 bg-amber-200/80 px-1.5 py-0.2 rounded-md">
              {completedCount}/{total}
            </span>
            {isAllComplete && (
              <span className="hidden sm:inline-block text-[10px] font-display font-bold text-emerald-800 bg-emerald-200 px-1.5 py-0.2 rounded-full">
                Champion! 🏆
              </span>
            )}
          </div>

          {/* Cheerful Rainbow Progress Bar Track */}
          <div className="w-20 sm:w-28 h-2 bg-slate-100 rounded-full overflow-hidden mt-1 border border-slate-200">
            <div
              className={`h-full transition-all duration-500 rounded-full ${
                isAllComplete
                  ? 'bg-gradient-to-r from-emerald-400 to-green-500'
                  : completedCount >= 3
                  ? 'bg-gradient-to-r from-amber-400 via-pink-400 to-indigo-500'
                  : 'bg-gradient-to-r from-indigo-400 to-blue-500'
              }`}
              style={{ width: `${percent}%` }}
            />
          </div>
        </div>

        <ChevronDown
          className={`w-3.5 h-3.5 text-amber-700 transition-transform duration-200 ${
            isOpen ? 'rotate-180' : ''
          }`}
        />
      </button>

      {/* Cute Colorful Dropdown Popover */}
      {isOpen && (
        <div className="absolute right-0 sm:left-auto top-full mt-2 w-72 sm:w-84 bg-white rounded-3xl border-3 border-amber-300 shadow-xl p-4 z-50 animate-pop">
          {/* Top header */}
          <div className="flex items-center justify-between border-b-2 border-dashed border-amber-200 pb-2.5 mb-3">
            <div className="flex items-center gap-2">
              <span className="text-lg">⭐</span>
              <h4 className="font-display font-bold text-sm text-slate-900">
                Pupil Riddle Badges
              </h4>
            </div>
            <span className="text-xs font-display font-bold text-amber-900 bg-amber-100 px-2 py-0.5 rounded-full border border-amber-300">
              {percent}% Selesai!
            </span>
          </div>

          <p className="text-[11px] font-medium text-slate-600 mb-3 leading-snug font-display">
            Unlock each chamber door in the <strong>Escape Room</strong> or pair cards in <strong>Riddle Match</strong> to collect all badges!
          </p>

          {/* List of Challenges A to F with cute candy styles */}
          <div className="space-y-2">
            {TEXTBOOK_RIDDLES.map((riddle) => {
              const isCompleted = completedRiddleIds.includes(riddle.id);
              const poly = POLYGONS[riddle.targetPolygonId];

              return (
                <div
                  key={riddle.id}
                  onClick={() => {
                    if (onNavigateToRiddle) {
                      playSound('click');
                      onNavigateToRiddle(riddle.id);
                      setIsOpen(false);
                    }
                  }}
                  className={`flex items-center justify-between p-2.5 rounded-2xl border-2 text-xs transition-all cursor-pointer ${
                    isCompleted
                      ? 'bg-emerald-50 border-emerald-300 text-emerald-950 shadow-2xs'
                      : 'bg-amber-50/40 border-amber-200/80 text-slate-700 hover:bg-amber-100/50 hover:border-amber-300'
                  }`}
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <span
                      className={`w-7 h-7 rounded-xl flex items-center justify-center font-display font-bold text-xs shrink-0 shadow-xs border ${
                        isCompleted
                          ? 'bg-emerald-400 border-emerald-500 text-white'
                          : 'bg-amber-200 border-amber-300 text-amber-900'
                      }`}
                    >
                      {riddle.id.charAt(0)}
                    </span>
                    <div className="truncate">
                      <div className="font-display font-bold text-slate-900 flex items-center gap-1.5">
                        <span className="truncate">{riddle.challengeName}</span>
                        {['A', 'B', 'C'].includes(riddle.id) && (
                          <span className="text-[9px] font-display font-bold text-pink-700 bg-pink-100 px-1.5 py-0.2 rounded-full border border-pink-200">
                            Try These
                          </span>
                        )}
                      </div>
                      <div className="text-[10px] text-slate-500 truncate font-display">
                        {poly.name} ({poly.sides} sisi lurus)
                      </div>
                    </div>
                  </div>

                  <div className="shrink-0 ml-2">
                    {isCompleted ? (
                      <span className="flex items-center gap-1 text-[11px] font-display font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full border border-emerald-300">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> Tahniah!
                      </span>
                    ) : (
                      <span className="text-[10px] font-display font-bold text-amber-700 bg-amber-100/80 px-2 py-0.5 rounded-full border border-amber-200">
                        Jawab 🔑
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Footer inside Dropdown */}
          <div className="mt-3 pt-2.5 border-t-2 border-dashed border-amber-200 flex items-center justify-between text-[11px] font-display font-bold text-slate-600">
            <span>Textbook Core: A, B, C</span>
            <button
              onClick={() => setIsOpen(false)}
              className="text-indigo-600 hover:text-indigo-800 bg-indigo-50 hover:bg-indigo-100 px-3 py-1 rounded-xl border border-indigo-200 cursor-pointer"
            >
              Tutup ✕
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
