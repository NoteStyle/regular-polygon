import React, { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import { POLYGONS, TEXTBOOK_RIDDLES } from '../data/challenges';
import { PolygonId, TextbookRiddle } from '../types/polygon';
import { PolygonSvg } from './PolygonSvg';
import { OwlGuide } from './OwlGuide';
import { playSound } from '../utils/audio';
import {
  Key,
  Lock,
  Unlock,
  Sparkles,
  RotateCcw,
  CheckCircle2,
  ChevronRight,
  Eye,
  Award,
  Star,
  Check,
} from 'lucide-react';

interface EscapeRoomViewProps {
  onGoToMatch?: () => void;
  onGoToTable?: () => void;
  completedRiddleIds?: string[];
  onRiddleCompleted?: (riddleId: string) => void;
  activeRiddleId?: string | null;
}

export const EscapeRoomView: React.FC<EscapeRoomViewProps> = ({
  onGoToMatch,
  onGoToTable,
  completedRiddleIds = [],
  onRiddleCompleted,
  activeRiddleId = null,
}) => {
  // Current active challenge index (0 = A, 1 = B, 2 = C, etc.)
  const [currentStageIndex, setCurrentStageIndex] = useState(0);
  const [selectedPolygonId, setSelectedPolygonId] = useState<PolygonId | null>('hexagon');
  const [inspectedPolygonId, setInspectedPolygonId] = useState<PolygonId>('hexagon');
  const [unlockedKeys, setUnlockedKeys] = useState<string[]>(completedRiddleIds);
  const [showFeedback, setShowFeedback] = useState<'idle' | 'correct' | 'wrong'>('idle');
  const [feedbackMessage, setFeedbackMessage] = useState('');
  const [isEscaped, setIsEscaped] = useState(false);

  // Inspector toggles
  const [showSides, setShowSides] = useState(true);
  const [showCorners, setShowCorners] = useState(true);
  const [showDiagonals, setShowDiagonals] = useState(true);
  const [showSymmetry, setShowSymmetry] = useState(false);
  const [showAngles, setShowAngles] = useState(false);

  // All textbook riddles for the chamber escape sequence
  const stages: TextbookRiddle[] = TEXTBOOK_RIDDLES;

  // Sync stage if activeRiddleId changed externally (e.g. from header progress indicator)
  useEffect(() => {
    if (activeRiddleId) {
      const idx = stages.findIndex((s) => s.id === activeRiddleId);
      if (idx !== -1) {
        setCurrentStageIndex(idx);
        setSelectedPolygonId(null);
        setInspectedPolygonId(stages[idx].targetPolygonId);
        setShowFeedback('idle');
        setFeedbackMessage('');
      }
    }
  }, [activeRiddleId]);

  // Sync unlocked keys with session completed riddles
  useEffect(() => {
    setUnlockedKeys((prev) => {
      const combined = Array.from(new Set([...prev, ...completedRiddleIds]));
      return combined;
    });
  }, [completedRiddleIds]);

  const currentRiddle = stages[currentStageIndex];
  const inspectedData = POLYGONS[inspectedPolygonId];

  const handleSelectShape = (id: PolygonId) => {
    playSound('click');
    setSelectedPolygonId(id);
    setInspectedPolygonId(id);
    setShowFeedback('idle');
    setFeedbackMessage('');
  };

  const handleTestKey = () => {
    if (!selectedPolygonId) return;

    if (selectedPolygonId === currentRiddle.targetPolygonId) {
      // Correct!
      playSound('unlock');
      playSound('correct');
      setShowFeedback('correct');
      const keyId = currentRiddle.id;
      if (!unlockedKeys.includes(keyId)) {
        setUnlockedKeys((prev) => [...prev, keyId]);
      }
      onRiddleCompleted?.(keyId);
      setFeedbackMessage(
        `🎉 Pintu Terbuka! Tahniah! You found the ${POLYGONS[selectedPolygonId].name}! ${currentRiddle.explanation}`
      );

      // Trigger colorful confetti
      confetti({
        particleCount: 65,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#f59e0b', '#ec4899', '#3b82f6', '#10b981', '#8b5cf6'],
      });

      // Check if finished final stage
      if (currentStageIndex === stages.length - 1) {
        setTimeout(() => {
          setIsEscaped(true);
          playSound('fanfare');
          confetti({
            particleCount: 140,
            spread: 100,
            origin: { y: 0.5 },
            colors: ['#fbbf24', '#f43f5e', '#38bdf8', '#4ade80', '#a855f7'],
          });
        }, 1200);
      }
    } else {
      // Incorrect
      playSound('wrong');
      setShowFeedback('wrong');
      const chosen = POLYGONS[selectedPolygonId];
      setFeedbackMessage(
        `Oops! Kunci ${chosen.name} tidak sesuai. Bentuk ini ada ${chosen.sides} sisi lurus, ${chosen.corners} bucu, dan ${chosen.diagonals} pepenjuru. Semak klu dalam buku teks lagi ya!`
      );
    }
  };

  const handleNextStage = () => {
    if (currentStageIndex < stages.length - 1) {
      playSound('click');
      const nextIdx = currentStageIndex + 1;
      setCurrentStageIndex(nextIdx);
      setShowFeedback('idle');
      setFeedbackMessage('');
      const nextCandidate = stages[nextIdx].targetPolygonId;
      setSelectedPolygonId(null);
      setInspectedPolygonId(nextCandidate);
    }
  };

  const handleReset = () => {
    playSound('click');
    setCurrentStageIndex(0);
    setSelectedPolygonId('hexagon');
    setInspectedPolygonId('hexagon');
    setUnlockedKeys([]);
    setShowFeedback('idle');
    setFeedbackMessage('');
    setIsEscaped(false);
  };

  const getHintsForCurrentStage = () => {
    if (currentRiddle.id === 'A') {
      return [
        'Klu 1: Kira sisi lurusnya! 6 sisi lurus tertutup maksudnya heksagon sekata.',
        'Klu 2: Bilangan paksi simetri heksagon sekata ialah 6.',
        'Buku teks muka surat 217 menunjukkan jubin dinding mural berwarna ungu ialah heksagon!',
      ];
    }
    if (currentRiddle.id === 'B') {
      return [
        'Klu 1: 3 sisi lurus yang sama panjang mestilah segi tiga sama sisi!',
        'Klu 2: Sudut pedalaman setiap bucu ialah 60° (3 sudut sama saiz).',
        'Klu 3: 0 pepenjuru (diagonal) sebab semua bucu sudah disambung oleh sisi lurus!',
      ];
    }
    if (currentRiddle.id === 'C') {
      return [
        'Klu 1: 7 bucu (corners) bermaksud bentuk ini mempunyai 7 sisi lurus.',
        'Klu 2: Bentuk 7 sisi dipanggil Heptagon sekata!',
        'Klu 3: Formula pepenjuru: 7 × (7 - 3) ÷ 2 = (7 × 4) ÷ 2 = 14 pepenjuru!',
      ];
    }
    return [
      'Perhatikan bilangan sisi lurus, bucu, dan garis pepenjuru!',
      'Rujuk jadual muka surat 218 dalam buku teks.',
    ];
  };

  // Cute polygon color schemes for the keypad buttons
  const shapeButtonTheme: Record<PolygonId, { bg: string; border: string; text: string }> = {
    triangle: { bg: 'bg-rose-50 hover:bg-rose-100', border: 'border-rose-300', text: 'text-rose-900' },
    square: { bg: 'bg-sky-50 hover:bg-sky-100', border: 'border-sky-300', text: 'text-sky-900' },
    pentagon: { bg: 'bg-purple-50 hover:bg-purple-100', border: 'border-purple-300', text: 'text-purple-900' },
    hexagon: { bg: 'bg-amber-50 hover:bg-amber-100', border: 'border-amber-300', text: 'text-amber-900' },
    heptagon: { bg: 'bg-pink-50 hover:bg-pink-100', border: 'border-pink-300', text: 'text-pink-900' },
    octagon: { bg: 'bg-emerald-50 hover:bg-emerald-100', border: 'border-emerald-300', text: 'text-emerald-900' },
  };

  return (
    <div className="space-y-6">
      {/* Top Banner: Cute Key Chain & Progress */}
      <div className="bg-gradient-to-r from-amber-100 via-yellow-50 to-orange-100 rounded-3xl p-4 sm:p-5 border-3 border-amber-300 shadow-sm flex flex-col md:flex-row items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1 flex-wrap">
            <span className="text-xs font-display font-bold text-amber-900 uppercase bg-amber-200/80 px-2.5 py-0.5 rounded-full border border-amber-300">
              🚀 Unit 6: Ruang (Poligon Sekata)
            </span>
            <span className="text-xs text-amber-600 font-bold">·</span>
            <span className="text-xs font-display font-bold text-amber-800">
              Bilik Rahsia {currentStageIndex + 1} daripada {stages.length}
            </span>
          </div>
          <h2 className="text-xl sm:text-2xl font-display font-bold text-slate-900 flex items-center gap-2">
            Misteri Bilik Poligon Sekata 🏰
          </h2>
        </div>

        {/* Collected Keys on Golden Ring */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 bg-white/90 border-2 border-amber-300 px-3.5 py-2 rounded-2xl shadow-2xs">
            <div className="w-6 h-6 rounded-full bg-amber-400 text-amber-950 flex items-center justify-center font-bold text-xs shadow-2xs">
              🔑
            </div>
            <span className="text-xs font-display font-bold text-amber-950">Kunci Diperoleh:</span>
            <div className="flex items-center gap-1.5 ml-1">
              {stages.map((stage) => {
                const isUnlocked = unlockedKeys.includes(stage.id);
                return (
                  <span
                    key={stage.id}
                    title={`${stage.challengeName}: ${isUnlocked ? 'Terbuka' : 'Terkunci'}`}
                    className={`w-7 h-7 rounded-xl flex items-center justify-center text-xs font-display font-bold transition-all border-2 ${
                      isUnlocked
                        ? 'bg-gradient-to-br from-amber-400 to-yellow-300 text-amber-950 border-amber-500 shadow-sm ring-2 ring-yellow-300 scale-105 animate-bounce-gentle'
                        : 'bg-slate-100 text-slate-400 border-slate-200'
                    }`}
                  >
                    {isUnlocked ? '⭐' : stage.id.charAt(0)}
                  </span>
                );
              })}
            </div>
          </div>

          <button
            onClick={handleReset}
            className="flex items-center gap-1.5 text-xs font-display font-bold text-slate-700 hover:text-slate-900 bg-white hover:bg-slate-100 px-3 py-2 rounded-2xl border-2 border-slate-200 shadow-2xs transition-all cursor-pointer active:scale-95"
            title="Mula Semula"
          >
            <RotateCcw className="w-3.5 h-3.5 text-slate-500" />
            Reset
          </button>
        </div>
      </div>

      {/* Main Room Layout */}
      {!isEscaped ? (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Column: The Whimsical Space Chamber Door & Keypad */}
          <div className="lg:col-span-7 space-y-5">
            {/* The Chamber Door Frame: Cosmic Purple with Star Sparks */}
            <div className="bg-gradient-to-b from-indigo-900 via-purple-900 to-slate-900 text-white rounded-3xl p-5 sm:p-7 border-4 border-amber-300 shadow-xl relative overflow-hidden">
              {/* Cute glowing stars in the background */}
              <div className="absolute top-4 right-8 text-amber-300/40 text-sm animate-pulse-subtle">✨</div>
              <div className="absolute top-16 left-6 text-yellow-300/30 text-lg animate-wiggle">⭐</div>
              <div className="absolute bottom-6 right-12 text-pink-300/40 text-xs">✨</div>

              {/* Chamber Door Header Ribbon */}
              <div className="flex items-center justify-between border-b-2 border-dashed border-indigo-700 pb-3.5 mb-4">
                <div className="flex items-center gap-3">
                  <div
                    className={`w-11 h-11 rounded-2xl flex items-center justify-center transition-all border-2 shadow-md ${
                      showFeedback === 'correct'
                        ? 'bg-emerald-400 text-emerald-950 border-emerald-300 animate-bounce'
                        : 'bg-amber-400 text-amber-950 border-amber-300'
                    }`}
                  >
                    {showFeedback === 'correct' ? (
                      <Unlock className="w-6 h-6" />
                    ) : (
                      <Lock className="w-6 h-6" />
                    )}
                  </div>
                  <div>
                    <span className="text-[11px] font-display font-bold tracking-wider text-amber-300 uppercase bg-amber-400/20 px-2 py-0.5 rounded-full border border-amber-400/30">
                      Pintu Cabaran #{currentStageIndex + 1}
                    </span>
                    <h3 className="text-base sm:text-xl font-display font-bold text-white mt-1">
                      Kunci Bilik {currentRiddle.id.charAt(0)}: {currentRiddle.challengeName}
                    </h3>
                  </div>
                </div>

                <span
                  className={`text-xs font-display font-bold px-3 py-1 rounded-full border-2 shadow-2xs ${
                    unlockedKeys.includes(currentRiddle.id)
                      ? 'bg-emerald-400 text-emerald-950 border-emerald-300'
                      : 'bg-amber-400/30 text-amber-200 border-amber-400/50'
                  }`}
                >
                  {unlockedKeys.includes(currentRiddle.id) ? '🔓 TERBUKA' : '🔒 TERKUNCI'}
                </span>
              </div>

              {/* Exact Textbook Riddle Card Embedded on Door (Joyful Pastel Style) */}
              <div className="mb-5">
                <div className="text-xs font-display font-bold text-amber-200 uppercase tracking-wide mb-2 flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4 text-amber-400" />
                  Klu Teka-Teki Buku Teks (Cuba Ini / Try These)
                </div>

                {/* The Pastel Card */}
                <div
                  className="rounded-2xl p-4 sm:p-5 border-3 shadow-md text-slate-900 transition-all relative overflow-hidden"
                  style={{
                    backgroundColor: currentRiddle.cardColor,
                    borderColor: currentRiddle.textColor,
                  }}
                >
                  {/* Cute Ribbon Tag */}
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <span
                        className="w-7 h-7 rounded-full flex items-center justify-center font-display font-bold text-xs text-white shadow-xs"
                        style={{ backgroundColor: currentRiddle.textColor }}
                      >
                        {currentRiddle.id.toLowerCase().charAt(0)}
                      </span>
                      <h4
                        className="font-display font-bold text-base sm:text-lg tracking-tight"
                        style={{ color: currentRiddle.textColor }}
                      >
                        {currentRiddle.challengeName}
                      </h4>
                    </div>

                    <span
                      className="text-[10px] font-display font-bold px-2 py-0.5 rounded-full border text-white shadow-2xs"
                      style={{ backgroundColor: currentRiddle.textColor, borderColor: 'white' }}
                    >
                      Buku Teks m/s 218
                    </span>
                  </div>

                  {/* Bullet points with cute candy circles */}
                  <ul className="space-y-2.5">
                    {currentRiddle.clues.map((clue, idx) => (
                      <li key={idx} className="flex items-start gap-2.5">
                        <span
                          className="w-3 h-3 rounded-full shrink-0 mt-1 ring-2 ring-white shadow-xs"
                          style={{ backgroundColor: currentRiddle.textColor }}
                        />
                        <span
                          className="text-sm sm:text-base font-display font-bold tracking-tight leading-snug"
                          style={{ color: currentRiddle.textColor }}
                        >
                          {clue}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Cute Polygon Key Selector (Interactive Keypad) */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-xs font-display font-bold text-amber-200 uppercase tracking-wide flex items-center gap-1.5">
                    <span>Pilih Bentuk Kunci Poligon:</span>
                  </label>
                  <span className="text-[11px] font-display font-bold text-purple-200">
                    Ketik untuk uji bentuk 👇
                  </span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                  {(Object.keys(POLYGONS) as PolygonId[]).map((polyId) => {
                    const poly = POLYGONS[polyId];
                    const isSelected = selectedPolygonId === polyId;
                    const theme = shapeButtonTheme[polyId];

                    return (
                      <button
                        key={polyId}
                        onClick={() => handleSelectShape(polyId)}
                        className={`flex items-center gap-2.5 p-3 rounded-2xl border-2 text-left transition-all cursor-pointer active:translate-y-0.5 ${
                          isSelected
                            ? 'bg-amber-300 text-slate-950 font-bold border-amber-500 shadow-md ring-3 ring-amber-300/60 scale-102'
                            : `${theme.bg} ${theme.border} text-slate-800 hover:scale-101 shadow-xs`
                        }`}
                      >
                        <div className="w-9 h-9 rounded-xl bg-white shadow-xs flex items-center justify-center shrink-0 border border-slate-200">
                          <PolygonSvg
                            sides={poly.sides}
                            size={32}
                            showDiagonals={false}
                            showSides={false}
                            showCorners={false}
                            borderColor={isSelected ? '#78350f' : poly.borderColor}
                            fillColor={poly.fillColor}
                          />
                        </div>
                        <div className="min-w-0">
                          <div className="text-xs font-display font-bold truncate">
                            {poly.name}
                          </div>
                          <div className="text-[10px] text-slate-600 truncate font-display">
                            {poly.sides} sisi · {poly.diagonals} diag.
                          </div>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Action Buttons: 3D Candy Button */}
              <div className="mt-6 flex flex-wrap items-center gap-3">
                <button
                  onClick={handleTestKey}
                  disabled={!selectedPolygonId || showFeedback === 'correct'}
                  className={`flex-1 flex items-center justify-center gap-2 py-3.5 px-6 rounded-2xl font-display font-bold text-sm sm:text-base transition-all cursor-pointer ${
                    showFeedback === 'correct'
                      ? 'bg-emerald-500 text-white border-b-4 border-emerald-700 cursor-default'
                      : 'comic-btn-amber text-amber-950 shadow-md active:translate-y-1'
                  }`}
                >
                  <Key className="w-5 h-5" />
                  {showFeedback === 'correct'
                    ? 'Pintu Berjaya Dibuka! 🎉'
                    : 'Masuk Kunci Poligon Dalam Mangga Pintu 🔑'}
                </button>

                {showFeedback === 'correct' && currentStageIndex < stages.length - 1 && (
                  <button
                    onClick={handleNextStage}
                    className="comic-btn-indigo text-white flex items-center gap-1.5 py-3.5 px-6 rounded-2xl font-display font-bold text-sm sm:text-base shadow-md cursor-pointer animate-wiggle"
                  >
                    Bilik Seterusnya <ChevronRight className="w-5 h-5" />
                  </button>
                )}
              </div>

              {/* Feedback Strip */}
              {showFeedback !== 'idle' && (
                <div
                  className={`mt-4 p-4 rounded-2xl border-2 text-xs sm:text-sm font-display font-bold flex items-start gap-2.5 animate-pop ${
                    showFeedback === 'correct'
                      ? 'bg-emerald-100 border-emerald-400 text-emerald-950'
                      : 'bg-rose-100 border-rose-400 text-rose-950'
                  }`}
                >
                  {showFeedback === 'correct' ? (
                    <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                  ) : (
                    <span className="text-lg leading-none">❌</span>
                  )}
                  <div>{feedbackMessage}</div>
                </div>
              )}
            </div>

            {/* Cute Owl Mascot Guide */}
            <OwlGuide
              message={
                showFeedback === 'correct'
                  ? `Hebat adik! Kamu telah mengenal pasti ${POLYGONS[selectedPolygonId!].name} dengan tepat! Sekarang kamu memegang Kunci ${currentRiddle.id.charAt(0)}.`
                  : `Baca klu dengan teliti! Berapakah sisi lurus, bucu, atau pepenjurunya? Gunakan Makmal Pemeriksa Bentuk di sebelah kanan untuk menyiasat!`
              }
              hints={getHintsForCurrentStage()}
              solved={showFeedback === 'correct'}
            />
          </div>

          {/* Right Column: Cute Interactive Shape Inspector */}
          <div className="lg:col-span-5 space-y-4">
            <div className="bg-white rounded-3xl p-5 border-3 border-amber-200 shadow-md">
              <div className="flex items-center justify-between mb-3 border-b-2 border-dashed border-amber-100 pb-2.5">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-xl bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold text-xs">
                    🔍
                  </div>
                  <h3 className="font-display font-bold text-base text-slate-800">
                    Makmal Siasatan Bentuk
                  </h3>
                </div>
                <span className="text-xs font-display font-bold text-indigo-700 bg-indigo-50 border border-indigo-200 px-2.5 py-0.5 rounded-full">
                  {inspectedData.name}
                </span>
              </div>

              {/* Interactive SVG Display */}
              <div className="bg-gradient-to-b from-yellow-50/50 to-amber-50/30 rounded-2xl p-4 flex flex-col items-center justify-center border-2 border-amber-100 relative min-h-[280px]">
                <PolygonSvg
                  sides={inspectedData.sides}
                  size={240}
                  showSides={showSides}
                  showCorners={showCorners}
                  showDiagonals={showDiagonals}
                  showSymmetry={showSymmetry}
                  showAngles={showAngles}
                  selectedColor={inspectedData.color}
                  borderColor={inspectedData.borderColor}
                  fillColor={inspectedData.fillColor}
                />

                {/* Cute candy toggles */}
                <div className="mt-3 flex flex-wrap justify-center gap-1.5">
                  <button
                    onClick={() => {
                      playSound('click');
                      setShowDiagonals((v) => !v);
                    }}
                    className={`text-xs font-display font-bold px-3 py-1 rounded-xl border-2 transition-all cursor-pointer active:scale-95 ${
                      showDiagonals
                        ? 'bg-sky-400 text-sky-950 border-sky-500 shadow-2xs'
                        : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
                    }`}
                  >
                    Pepenjuru ({inspectedData.diagonals})
                  </button>

                  <button
                    onClick={() => {
                      playSound('click');
                      setShowSymmetry((v) => !v);
                    }}
                    className={`text-xs font-display font-bold px-3 py-1 rounded-xl border-2 transition-all cursor-pointer active:scale-95 ${
                      showSymmetry
                        ? 'bg-rose-400 text-white border-rose-500 shadow-2xs'
                        : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
                    }`}
                  >
                    Paksi Simetri ({inspectedData.symmetricalAxes})
                  </button>

                  <button
                    onClick={() => {
                      playSound('click');
                      setShowAngles((v) => !v);
                    }}
                    className={`text-xs font-display font-bold px-3 py-1 rounded-xl border-2 transition-all cursor-pointer active:scale-95 ${
                      showAngles
                        ? 'bg-amber-400 text-amber-950 border-amber-500 shadow-2xs'
                        : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
                    }`}
                  >
                    Sudut ({Math.round(inspectedData.interiorAngleDeg)}°)
                  </button>
                </div>
              </div>

              {/* Colorful characteristics tiles */}
              <div className="mt-4 space-y-2 text-xs font-display">
                <div className="font-bold text-slate-700 uppercase tracking-wider text-[11px] flex items-center gap-1">
                  <span>Ciri-Ciri Poligon Sekata (Buku Teks):</span>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div className="p-2.5 rounded-2xl bg-amber-50 border-2 border-amber-200">
                    <span className="text-amber-700 block text-[10px] font-bold">Sisi Lurus</span>
                    <span className="text-sm font-bold text-amber-950 font-mono-math">
                      {inspectedData.sides} sisi sama
                    </span>
                  </div>

                  <div className="p-2.5 rounded-2xl bg-indigo-50 border-2 border-indigo-200">
                    <span className="text-indigo-700 block text-[10px] font-bold">Bucu / Corners</span>
                    <span className="text-sm font-bold text-indigo-950 font-mono-math">
                      {inspectedData.corners} bucu
                    </span>
                  </div>

                  <div className="p-2.5 rounded-2xl bg-rose-50 border-2 border-rose-200">
                    <span className="text-rose-700 block text-[10px] font-bold">Paksi Simetri</span>
                    <span className="text-sm font-bold text-rose-950 font-mono-math">
                      {inspectedData.symmetricalAxes} paksi
                    </span>
                  </div>

                  <div className="p-2.5 rounded-2xl bg-sky-50 border-2 border-sky-200">
                    <span className="text-sky-700 block text-[10px] font-bold">Pepenjuru (Diagonals)</span>
                    <span className="text-sm font-bold text-sky-950 font-mono-math">
                      {inspectedData.diagonals} pepenjuru
                    </span>
                  </div>
                </div>

                <p className="text-slate-600 text-xs italic pt-1 leading-relaxed bg-slate-50 p-2.5 rounded-xl border border-slate-200">
                  "{inspectedData.description}"
                </p>
              </div>
            </div>
          </div>
        </div>
      ) : (
        /* Victory & Escape Screen - Super Cute Celebration */
        <div className="bg-gradient-to-b from-yellow-50 via-white to-amber-50 rounded-3xl p-8 sm:p-10 border-4 border-amber-300 shadow-xl text-center max-w-2xl mx-auto space-y-6 animate-pop">
          <div className="w-24 h-24 rounded-3xl bg-gradient-to-tr from-amber-400 to-yellow-300 border-4 border-white text-amber-950 flex items-center justify-center mx-auto shadow-lg animate-bounce-gentle text-4xl">
            🏆
          </div>

          <div>
            <span className="text-xs font-display font-bold text-amber-900 uppercase tracking-widest bg-amber-200 px-4 py-1 rounded-full border border-amber-400 shadow-2xs">
              TAHNIAH! KAMU BERJAYA MELEPASKAN DIRI! 🎉
            </span>
            <h2 className="text-3xl sm:text-4xl font-display font-bold text-slate-900 mt-3">
              Juara Poligon Sekata Tahun 5!
            </h2>
            <p className="text-sm text-slate-700 mt-2 max-w-lg mx-auto leading-relaxed font-display">
              Syabas! Kamu berjaya menyelesaikan teka-teki buku teks (Cabaran A, B, dan C) serta membuka semua pintu bilik rahsia!
            </p>
          </div>

          {/* Solved Riddles Showcase */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-left">
            <div className="p-3.5 rounded-2xl bg-amber-100/80 border-2 border-amber-300">
              <span className="text-xs font-display font-bold text-amber-900">Cabaran A Selesai ⭐</span>
              <div className="text-sm font-display font-bold text-slate-900 mt-1">Heksagon Sekata</div>
              <p className="text-[11px] text-slate-600 mt-0.5">6 sisi · 6 paksi simetri</p>
            </div>

            <div className="p-3.5 rounded-2xl bg-indigo-100/80 border-2 border-indigo-300">
              <span className="text-xs font-display font-bold text-indigo-900">Cabaran B Selesai ⭐</span>
              <div className="text-sm font-display font-bold text-slate-900 mt-1">Segi Tiga Sama Sisi</div>
              <p className="text-[11px] text-slate-600 mt-0.5">3 sisi · 0 pepenjuru</p>
            </div>

            <div className="p-3.5 rounded-2xl bg-pink-100/80 border-2 border-pink-300">
              <span className="text-xs font-display font-bold text-pink-900">Cabaran C Selesai ⭐</span>
              <div className="text-sm font-display font-bold text-slate-900 mt-1">Heptagon Sekata</div>
              <p className="text-[11px] text-slate-600 mt-0.5">7 bucu · 14 pepenjuru</p>
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-3 pt-3">
            <button
              onClick={handleReset}
              className="comic-btn-amber text-amber-950 px-6 py-3 rounded-2xl font-display font-bold text-sm shadow-md transition-all cursor-pointer"
            >
              Main Semula Bilik Rahsia 🔄
            </button>

            {onGoToMatch && (
              <button
                onClick={() => {
                  playSound('click');
                  onGoToMatch();
                }}
                className="comic-btn-indigo text-white px-6 py-3 rounded-2xl font-display font-bold text-sm shadow-md transition-all cursor-pointer"
              >
                Cuba Padanan Klu 🧩
              </button>
            )}

            {onGoToTable && (
              <button
                onClick={() => {
                  playSound('click');
                  onGoToTable();
                }}
                className="comic-btn-emerald text-white px-6 py-3 rounded-2xl font-display font-bold text-sm shadow-md transition-all cursor-pointer"
              >
                Lengkapkan Jadual m/s 218 📊
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
