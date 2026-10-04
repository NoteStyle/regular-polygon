import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import { TEXTBOOK_RIDDLES, POLYGONS } from '../data/challenges';
import { PolygonId, TextbookRiddle } from '../types/polygon';
import { PolygonSvg } from './PolygonSvg';
import { OwlGuide } from './OwlGuide';
import { playSound } from '../utils/audio';
import { Check, CheckCircle2, RotateCcw, Sparkles, HelpCircle, Trophy, Star } from 'lucide-react';

interface RiddleMatchViewProps {
  completedRiddleIds?: string[];
  onRiddleCompleted?: (riddleId: string) => void;
  activeRiddleId?: string | null;
}

export const RiddleMatchView: React.FC<RiddleMatchViewProps> = ({
  completedRiddleIds = [],
  onRiddleCompleted,
  activeRiddleId = null,
}) => {
  // All textbook riddles
  const allRiddles = TEXTBOOK_RIDDLES;

  // Track matches: mapping from riddleId -> polygonId
  const [matches, setMatches] = useState<Record<string, PolygonId>>({});
  const [selectedRiddleId, setSelectedRiddleId] = useState<string | null>(activeRiddleId);
  const [selectedPolygonId, setSelectedPolygonId] = useState<PolygonId | null>(null);
  const [checkedResults, setCheckedResults] = useState<Record<string, boolean> | null>(null);
  const [score, setScore] = useState<number | null>(null);

  // Sync active riddle if requested from header
  React.useEffect(() => {
    if (activeRiddleId) {
      setSelectedRiddleId(activeRiddleId);
    }
  }, [activeRiddleId]);

  // Available polygons to match
  const polygonList: PolygonId[] = ['hexagon', 'triangle', 'heptagon', 'pentagon', 'square', 'octagon'];

  const handleSelectRiddle = (riddleId: string) => {
    playSound('click');
    setSelectedRiddleId(riddleId);
    setCheckedResults(null);

    // If a polygon is already selected, pair them!
    if (selectedPolygonId) {
      makeMatch(riddleId, selectedPolygonId);
      setSelectedRiddleId(null);
      setSelectedPolygonId(null);
    }
  };

  const handleSelectPolygon = (polyId: PolygonId) => {
    playSound('click');
    setSelectedPolygonId(polyId);
    setCheckedResults(null);

    // If a riddle is already selected, pair them!
    if (selectedRiddleId) {
      makeMatch(selectedRiddleId, polyId);
      setSelectedRiddleId(null);
      setSelectedPolygonId(null);
    }
  };

  const makeMatch = (riddleId: string, polyId: PolygonId) => {
    playSound('click');
    setMatches((prev) => {
      const updated = { ...prev };
      // Remove any previous match for this polygon
      Object.keys(updated).forEach((rId) => {
        if (updated[rId] === polyId) {
          delete updated[rId];
        }
      });
      updated[riddleId] = polyId;
      return updated;
    });
  };

  const handleUnpair = (riddleId: string) => {
    playSound('click');
    setMatches((prev) => {
      const next = { ...prev };
      delete next[riddleId];
      return next;
    });
    setCheckedResults(null);
  };

  const handleCheckMatches = () => {
    const results: Record<string, boolean> = {};
    let correctCount = 0;

    allRiddles.forEach((riddle) => {
      const matchedPoly = matches[riddle.id];
      const isCorrect = matchedPoly === riddle.targetPolygonId;
      results[riddle.id] = isCorrect;
      if (isCorrect) {
        correctCount++;
        onRiddleCompleted?.(riddle.id);
      }
    });

    setCheckedResults(results);
    setScore(correctCount);

    if (correctCount === allRiddles.length) {
      playSound('fanfare');
      confetti({
        particleCount: 110,
        spread: 85,
        origin: { y: 0.6 },
        colors: ['#ec4899', '#f59e0b', '#3b82f6', '#10b981'],
      });
    } else if (correctCount > 0) {
      playSound('correct');
    } else {
      playSound('wrong');
    }
  };

  const handleReset = () => {
    playSound('click');
    setMatches({});
    setSelectedRiddleId(null);
    setSelectedPolygonId(null);
    setCheckedResults(null);
    setScore(null);
  };

  return (
    <div className="space-y-6">
      {/* Cheerful Header */}
      <div className="bg-gradient-to-r from-pink-100 via-rose-50 to-amber-100 rounded-3xl p-4 sm:p-5 border-3 border-pink-300 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1 flex-wrap">
            <span className="text-xs font-display font-bold text-pink-900 uppercase bg-pink-200/90 px-3 py-0.5 rounded-full border border-pink-300 shadow-2xs">
              🧩 Cuba Ini / Try These · Muka Surat 218
            </span>
            <span className="text-xs text-pink-600 font-bold">·</span>
            <span className="text-xs font-display font-bold text-pink-800">
              Permainan Padanan Ciri-Ciri Poligon
            </span>
          </div>
          <h2 className="text-xl sm:text-2xl font-display font-bold text-slate-900 flex items-center gap-2">
            Padankan Klu Teka-Teki dengan Bentuk! ⭐
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 mt-1 font-display">
            Pilih kad klu daripada soalan buku teks, kemudian ketik bentuk poligon sekata yang sepadan!
          </p>
        </div>

        <div className="flex items-center gap-3">
          {score !== null && (
            <div className="flex items-center gap-1.5 px-3.5 py-2 rounded-2xl bg-amber-100 border-2 border-amber-300 text-amber-950 font-display font-bold text-xs sm:text-sm shadow-xs animate-pop">
              <Star className="w-4 h-4 fill-amber-400 text-amber-600" />
              Skor: {score} / {allRiddles.length} Betul!
            </div>
          )}

          <button
            onClick={handleReset}
            className="flex items-center gap-1.5 text-xs font-display font-bold text-slate-700 hover:text-slate-900 bg-white hover:bg-slate-100 px-3.5 py-2 rounded-2xl border-2 border-slate-200 shadow-2xs transition-all cursor-pointer active:scale-95"
          >
            <RotateCcw className="w-3.5 h-3.5 text-slate-500" />
            Padam Padanan
          </button>
        </div>
      </div>

      {/* Matching Arena */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Side: Exact Riddle Cards */}
        <div className="lg:col-span-7 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-xs sm:text-sm font-display font-bold text-slate-800 uppercase tracking-wider flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-pink-500 text-white flex items-center justify-center text-xs font-bold">1</span>
              Langkah 1: Ketik Kad Teka-Teki
            </h3>
            <span className="text-xs font-display font-bold text-pink-700 bg-pink-50 px-2.5 py-1 rounded-full border border-pink-200">
              {Object.keys(matches).length} daripada {allRiddles.length} dipadan
            </span>
          </div>

          <div className="space-y-3.5">
            {allRiddles.map((riddle) => {
              const matchedPolyId = matches[riddle.id];
              const matchedPoly = matchedPolyId ? POLYGONS[matchedPolyId] : null;
              const isSelected = selectedRiddleId === riddle.id;
              const isChecked = checkedResults !== null;
              const isCorrect = checkedResults ? checkedResults[riddle.id] : null;

              return (
                <div
                  key={riddle.id}
                  onClick={() => handleSelectRiddle(riddle.id)}
                  className={`relative rounded-3xl p-4 sm:p-5 border-3 transition-all cursor-pointer active:translate-y-0.5 ${
                    isSelected
                      ? 'border-indigo-500 ring-4 ring-indigo-200/80 bg-indigo-50/40 shadow-md scale-101'
                      : isChecked && isCorrect
                      ? 'border-emerald-500 bg-emerald-50/70 shadow-2xs'
                      : isChecked && !isCorrect
                      ? 'border-rose-400 bg-rose-50/70 shadow-2xs'
                      : 'border-slate-200 hover:border-pink-300 bg-white shadow-2xs'
                  }`}
                >
                  <div className="flex items-start justify-between gap-3 mb-2.5">
                    <div className="flex items-center gap-2">
                      <span
                        className="w-8 h-8 rounded-2xl flex items-center justify-center font-display font-bold text-sm text-white shrink-0 shadow-xs border"
                        style={{ backgroundColor: riddle.textColor, borderColor: 'white' }}
                      >
                        {riddle.id.charAt(0)}
                      </span>
                      <h4 className="font-display font-bold text-slate-900 text-base sm:text-lg">
                        {riddle.challengeName}
                      </h4>
                    </div>

                    {/* Matched Token Tag */}
                    {matchedPoly ? (
                      <div className="flex items-center gap-2">
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-slate-900 text-amber-300 text-xs font-display font-bold shadow-xs border border-slate-700">
                          <Check className="w-3.5 h-3.5 text-emerald-400" />
                          Dipadan: {matchedPoly.name}
                        </span>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleUnpair(riddle.id);
                          }}
                          className="w-6 h-6 rounded-full bg-rose-100 hover:bg-rose-200 text-rose-700 font-bold text-xs flex items-center justify-center cursor-pointer"
                          title="Batal Padanan"
                        >
                          ✕
                        </button>
                      </div>
                    ) : (
                      <span className="text-xs font-display font-bold text-pink-700 bg-pink-100 hover:bg-pink-200 px-3 py-1 rounded-xl border border-pink-200 shadow-2xs">
                        Ketik untuk Padan 👉
                      </span>
                    )}
                  </div>

                  {/* Riddle Clues Bullet Box */}
                  <div
                    className="rounded-2xl p-3.5 sm:p-4 border-2 transition-all text-left shadow-2xs"
                    style={{
                      backgroundColor: riddle.cardColor,
                      borderColor: `${riddle.textColor}40`,
                    }}
                  >
                    <ul className="space-y-1.5">
                      {riddle.clues.map((clue, idx) => (
                        <li key={idx} className="flex items-start gap-2.5">
                          <span
                            className="w-2.5 h-2.5 rounded-full shrink-0 mt-1.5 shadow-2xs ring-1 ring-white"
                            style={{ backgroundColor: riddle.textColor }}
                          />
                          <span
                            className="text-xs sm:text-sm font-display font-bold leading-snug"
                            style={{ color: riddle.textColor }}
                          >
                            {clue}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Feedback text if checked */}
                  {isChecked && (
                    <div
                      className={`mt-2.5 p-2 rounded-xl text-xs font-display font-bold flex items-center gap-2 ${
                        isCorrect ? 'bg-emerald-100 text-emerald-950 border border-emerald-300' : 'bg-rose-100 text-rose-950 border border-rose-300'
                      }`}
                    >
                      {isCorrect ? (
                        <>
                          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                          Tahniah, jawapan tepat! {riddle.explanation}
                        </>
                      ) : (
                        <>
                          <HelpCircle className="w-4 h-4 text-rose-600 shrink-0" />
                          Belum tepat! Bentuk sasaran ialah: {POLYGONS[riddle.targetPolygonId].name}.
                        </>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Side: Available Polygon Shapes */}
        <div className="lg:col-span-5 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-xs sm:text-sm font-display font-bold text-slate-800 uppercase tracking-wider flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-indigo-500 text-white flex items-center justify-center text-xs font-bold">2</span>
              Langkah 2: Pilih Bentuk Poligon
            </h3>
            <span className="text-xs text-slate-400 font-display">Ketik bentuk</span>
          </div>

          <div className="grid grid-cols-2 gap-3">
            {polygonList.map((polyId) => {
              const poly = POLYGONS[polyId];
              const isSelected = selectedPolygonId === polyId;
              const isMatchedToRiddle = Object.entries(matches).find(
                ([_, matchedId]) => matchedId === polyId
              );

              return (
                <button
                  key={polyId}
                  onClick={() => handleSelectPolygon(polyId)}
                  className={`flex flex-col items-center p-4 rounded-3xl border-3 text-center transition-all cursor-pointer active:scale-95 ${
                    isSelected
                      ? 'border-indigo-500 bg-indigo-50 ring-4 ring-indigo-200 shadow-md scale-102'
                      : isMatchedToRiddle
                      ? 'border-slate-300 bg-slate-50 opacity-90'
                      : 'border-slate-200 bg-white hover:border-pink-300 hover:shadow-xs'
                  }`}
                >
                  <div className="p-2 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-center shadow-2xs">
                    <PolygonSvg
                      sides={poly.sides}
                      size={80}
                      showDiagonals={true}
                      showSides={true}
                      showCorners={true}
                      borderColor={poly.borderColor}
                      fillColor={poly.fillColor}
                    />
                  </div>

                  <div className="font-display font-bold text-xs sm:text-sm text-slate-900 mt-2.5">
                    {poly.name}
                  </div>
                  <div className="text-[11px] text-slate-500 mt-0.5 font-display">
                    {poly.sides} sisi · {poly.diagonals} diag.
                  </div>

                  {isMatchedToRiddle && (
                    <span className="mt-2 text-[10px] font-display font-bold px-2.5 py-0.5 rounded-full bg-slate-800 text-amber-300 shadow-2xs">
                      Dipadan: Cabaran {isMatchedToRiddle[0]}
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          {/* Action Check Button */}
          <div className="pt-2">
            <button
              onClick={handleCheckMatches}
              disabled={Object.keys(matches).length === 0}
              className={`w-full py-4 px-6 rounded-2xl font-display font-bold text-sm sm:text-base shadow-md transition-all cursor-pointer ${
                Object.keys(matches).length > 0
                  ? 'comic-btn-pink text-white active:translate-y-1'
                  : 'bg-slate-200 text-slate-400 cursor-not-allowed border-b-4 border-slate-300'
              }`}
            >
              Semak Jawapan Padanan Saya ✨
            </button>
          </div>

          {/* Owl Guide Tips */}
          <OwlGuide
            message="Padankan setiap kad klu dengan bentuk poligon yang betul! Ingat: Cabaran A ada 6 sisi lurus tertutup, Cabaran B ada 0 pepenjuru, dan Cabaran C ada 7 bucu dan 14 pepenjuru!"
            hints={[
              'Cabaran A: 6 sisi lurus tertutup dan sama panjang = Heksagon Sekata.',
              'Cabaran B: 3 sisi lurus dan 0 pepenjuru = Segi Tiga Sama Sisi.',
              'Cabaran C: 7 bucu dan 14 pepenjuru = Heptagon Sekata.',
            ]}
          />
        </div>
      </div>
    </div>
  );
};
