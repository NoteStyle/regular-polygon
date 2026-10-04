import React from 'react';
import { TextbookRiddle } from '../types/polygon';

interface RiddleCardProps {
  riddle: TextbookRiddle;
  selectedPolygonId?: string | null;
  onSelectOption?: (polygonId: string) => void;
  status?: 'idle' | 'correct' | 'wrong';
  compact?: boolean;
}

export const RiddleCard: React.FC<RiddleCardProps> = ({
  riddle,
  selectedPolygonId,
  onSelectOption,
  status = 'idle',
  compact = false,
}) => {
  return (
    <div
      className={`relative rounded-2xl p-5 border-2 transition-all duration-200 shadow-sm ${
        status === 'correct'
          ? 'border-emerald-500 bg-emerald-50/70'
          : status === 'wrong'
          ? 'border-rose-400 bg-rose-50/60'
          : 'border-slate-200 bg-white hover:border-slate-300'
      }`}
      style={{
        boxShadow: '0 4px 12px -2px rgba(0, 0, 0, 0.05), 0 2px 6px -1px rgba(0, 0, 0, 0.02)',
      }}
    >
      {/* Textbook Header Ribbon */}
      <div className="flex items-center justify-between gap-3 mb-3">
        <div className="flex items-center gap-2">
          <span
            className="w-7 h-7 rounded-full flex items-center justify-center font-display font-bold text-sm text-white"
            style={{
              backgroundColor:
                riddle.id === 'A'
                  ? '#d97706'
                  : riddle.id === 'B'
                  ? '#4f46e5'
                  : riddle.id === 'C'
                  ? '#db2777'
                  : '#0284c7',
            }}
          >
            {riddle.id.charAt(0)}
          </span>
          <h3 className="font-display font-bold text-base text-slate-800 tracking-tight">
            {riddle.challengeName}
          </h3>
        </div>

        <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
          TRY THESE
        </span>
      </div>

      {/* Textbook Exact Clues Box */}
      <div
        className="rounded-xl p-4 mb-4 border transition-colors"
        style={{
          backgroundColor: riddle.cardColor,
          borderColor: `${riddle.textColor}25`,
        }}
      >
        <div className="space-y-2">
          {riddle.clues.map((clue, idx) => (
            <div key={idx} className="flex items-start gap-2.5">
              <span
                className="w-2 h-2 rounded-full shrink-0 mt-1.5"
                style={{ backgroundColor: riddle.textColor }}
              />
              <span
                className="text-sm font-semibold leading-snug"
                style={{ color: riddle.textColor }}
              >
                {clue}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Explanatory footnote when solved */}
      {status === 'correct' && (
        <div className="text-xs font-medium text-emerald-800 bg-emerald-100/80 rounded-lg p-2.5 mb-2 animate-in fade-in">
          {riddle.explanation}
        </div>
      )}
    </div>
  );
};
