import React, { useState } from 'react';
import { playSound } from '../utils/audio';
import { Sparkles, HelpCircle, ChevronRight, CheckCircle2, Star, Lightbulb } from 'lucide-react';

interface OwlGuideProps {
  message?: string;
  hints?: string[];
  solved?: boolean;
  className?: string;
}

export const OwlGuide: React.FC<OwlGuideProps> = ({
  message = "Hello friends! I'm Cikgu Owl! Let's solve the regular polygon riddles together!",
  hints = [],
  solved = false,
  className = '',
}) => {
  const [hintIndex, setHintIndex] = useState(0);
  const [showHint, setShowHint] = useState(false);

  const handleNextHint = () => {
    playSound('hint');
    if (!showHint) {
      setShowHint(true);
    } else {
      setHintIndex((prev) => (prev + 1) % hints.length);
    }
  };

  return (
    <div
      className={`relative flex flex-col sm:flex-row items-center sm:items-start gap-3 sm:gap-4 p-4 sm:p-5 bg-gradient-to-br from-amber-50 via-yellow-50 to-orange-50 border-3 border-amber-300 rounded-3xl shadow-md ${className}`}
    >
      {/* Decorative cute corner star badge */}
      <div className="absolute -top-3 -right-2 bg-gradient-to-r from-amber-400 to-yellow-400 text-amber-950 font-display font-bold text-[10px] sm:text-xs px-2.5 py-0.5 rounded-full border-2 border-white shadow-sm flex items-center gap-1 animate-bounce-gentle">
        <Star className="w-3 h-3 fill-amber-300 text-amber-700" />
        <span>KSSR Year 5 Guide</span>
      </div>

      {/* Super Cute Cartoon Owl Mascot */}
      <div className="shrink-0 flex flex-col items-center">
        <div className="relative group cursor-pointer" onClick={() => playSound('hint')}>
          <svg
            width="88"
            height="96"
            viewBox="0 0 100 110"
            className="drop-shadow-md transition-transform duration-300 group-hover:scale-110 group-hover:rotate-3"
          >
            {/* Soft Shadow under owl */}
            <ellipse cx="50" cy="104" rx="34" ry="5" fill="#fde68a" opacity="0.6" />

            {/* Owl Body */}
            <ellipse cx="50" cy="62" rx="38" ry="40" fill="#f59e0b" />
            <ellipse cx="50" cy="66" rx="28" ry="32" fill="#fef3c7" />

            {/* Feather belly marks */}
            <path d="M 44 65 Q 50 69 56 65" stroke="#f59e0b" strokeWidth="2.5" fill="none" strokeLinecap="round" />
            <path d="M 41 74 Q 50 78 59 74" stroke="#f59e0b" strokeWidth="2.5" fill="none" strokeLinecap="round" />
            <path d="M 45 83 Q 50 87 55 83" stroke="#f59e0b" strokeWidth="2.5" fill="none" strokeLinecap="round" />

            {/* Cute Rounded Wings */}
            <ellipse cx="14" cy="64" rx="10" ry="18" fill="#d97706" transform="rotate(15 14 64)" />
            <ellipse cx="86" cy="64" rx="10" ry="18" fill="#d97706" transform="rotate(-15 86 64)" />

            {/* Cute Orange Feet */}
            <ellipse cx="40" cy="101" rx="8" ry="5" fill="#ea580c" />
            <ellipse cx="60" cy="101" rx="8" ry="5" fill="#ea580c" />
            <circle cx="36" cy="101" r="3" fill="#ea580c" />
            <circle cx="64" cy="101" r="3" fill="#ea580c" />

            {/* Owl Ear Tufts */}
            <polygon points="26,30 14,8 38,20" fill="#d97706" />
            <polygon points="74,30 86,8 62,20" fill="#d97706" />

            {/* Big Expressive Cartoon Eyes */}
            <circle cx="34" cy="44" r="18" fill="#ffffff" stroke="#78350f" strokeWidth="2.5" />
            <circle cx="66" cy="44" r="18" fill="#ffffff" stroke="#78350f" strokeWidth="2.5" />

            {/* Eye Color Rings (Soft Cyan/Teal pupil rings) */}
            <circle cx="35" cy="44" r="11" fill="#0284c7" />
            <circle cx="65" cy="44" r="11" fill="#0284c7" />

            {/* Pupils */}
            <circle cx="36" cy="44" r="8" fill="#0f172a" />
            <circle cx="64" cy="44" r="8" fill="#0f172a" />

            {/* Big Glossy Sparkle Highlights */}
            <circle cx="33" cy="40" r="3.5" fill="#ffffff" />
            <circle cx="38" cy="47" r="1.5" fill="#ffffff" />
            <circle cx="61" cy="40" r="3.5" fill="#ffffff" />
            <circle cx="66" cy="47" r="1.5" fill="#ffffff" />

            {/* Cute Round Glasses Frame (Textbook scholar owl) */}
            <circle cx="34" cy="44" r="18" fill="none" stroke="#b45309" strokeWidth="3" />
            <circle cx="66" cy="44" r="18" fill="none" stroke="#b45309" strokeWidth="3" />
            <line x1="52" y1="44" x2="48" y2="44" stroke="#b45309" strokeWidth="4" />

            {/* Blushing Cute Cheeks */}
            <ellipse cx="20" cy="56" rx="6" ry="3.5" fill="#fda4af" opacity="0.8" />
            <ellipse cx="80" cy="56" rx="6" ry="3.5" fill="#fda4af" opacity="0.8" />

            {/* Cute Orange Beak */}
            <polygon points="45,52 55,52 50,63" fill="#ea580c" />

            {/* Colorful Graduation Hat */}
            <polygon points="50,2 12,14 50,23 88,14" fill="#4f46e5" />
            <polygon points="35,20 35,27 65,27 65,20" fill="#3730a3" />
            {/* Gold Tassel */}
            <line x1="82" y1="15" x2="86" y2="32" stroke="#fbbf24" strokeWidth="3" />
            <circle cx="86" cy="33" r="4" fill="#fbbf24" />
          </svg>

          <span className="block text-center text-xs font-display font-bold text-amber-900 bg-white/90 px-2 py-0.5 rounded-full border border-amber-200 mt-1 shadow-xs">
            Cikgu Owl 🦉
          </span>
        </div>
      </div>

      {/* Speech Content Bubble */}
      <div className="flex-1 min-w-0 bg-white/95 rounded-2xl p-3.5 sm:p-4 border-2 border-amber-200 shadow-sm relative">
        <div className="flex items-center justify-between gap-2 mb-1.5 flex-wrap">
          <div className="flex items-center gap-1.5">
            {solved ? (
              <span className="inline-flex items-center gap-1 text-xs font-display font-bold text-emerald-700 bg-emerald-100 px-2.5 py-0.5 rounded-full border border-emerald-300">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> Tahniah! Solved! 🎉
              </span>
            ) : (
              <span className="inline-flex items-center gap-1 text-xs font-display font-bold text-amber-800 bg-amber-100 px-2.5 py-0.5 rounded-full border border-amber-300">
                <Lightbulb className="w-3.5 h-3.5 text-amber-600" /> Mind Trigger Tip 💡
              </span>
            )}
          </div>

          {hints.length > 0 && !solved && (
            <button
              onClick={handleNextHint}
              className="text-xs font-display font-bold text-indigo-700 hover:text-indigo-900 bg-indigo-50 hover:bg-indigo-100 px-3 py-1 rounded-xl border border-indigo-200 transition-all flex items-center gap-1 cursor-pointer active:scale-95"
            >
              <HelpCircle className="w-3.5 h-3.5 text-indigo-600" />
              {showHint ? `Next Clue (${hintIndex + 1}/${hints.length})` : 'Need a Clue? 🔍'}
            </button>
          )}
        </div>

        <p className="text-xs sm:text-sm font-medium text-slate-800 leading-relaxed font-display">
          {message}
        </p>

        {showHint && hints.length > 0 && !solved && (
          <div className="mt-2.5 pt-2 border-t-2 border-dashed border-amber-200 text-xs font-bold text-amber-900 flex items-start gap-2 bg-yellow-50/70 p-2.5 rounded-xl animate-pop">
            <span className="text-base leading-none">👉</span>
            <span className="leading-snug">{hints[hintIndex]}</span>
          </div>
        )}
      </div>
    </div>
  );
};
