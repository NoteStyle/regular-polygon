import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import { POLYGONS } from '../data/challenges';
import { PolygonId } from '../types/polygon';
import { PolygonSvg } from './PolygonSvg';
import { OwlGuide } from './OwlGuide';
import { playSound } from '../utils/audio';
import { Sparkles, PenTool, CheckCircle, RotateCcw, Info, Compass } from 'lucide-react';

export const SandboxView: React.FC = () => {
  const [selectedPolyId, setSelectedPolyId] = useState<PolygonId>('hexagon');
  const [mode, setMode] = useState<'inspect' | 'draw'>('inspect');

  // Inspection toggles
  const [showDiagonals, setShowDiagonals] = useState(true);
  const [showSymmetry, setShowSymmetry] = useState(true);
  const [showCorners, setShowCorners] = useState(true);
  const [showSides, setShowSides] = useState(true);
  const [showAngles, setShowAngles] = useState(true);

  // Manual diagonal drawing mode
  const [firstSelectedVertex, setFirstSelectedVertex] = useState<number | null>(null);
  const [userDrawnDiagonals, setUserDrawnDiagonals] = useState<Array<[number, number]>>([]);
  const [drawFeedback, setDrawFeedback] = useState<string>('Ketik mana-mana bucu (corner) untuk mula melukis pepenjuru!');

  const currentPoly = POLYGONS[selectedPolyId];
  const sides = currentPoly.sides;

  const handleSelectPoly = (polyId: PolygonId) => {
    playSound('click');
    setSelectedPolyId(polyId);
    setFirstSelectedVertex(null);
    setUserDrawnDiagonals([]);
    setDrawFeedback(`Memilih ${POLYGONS[polyId].name}. Bolehkah kamu cari kesemua ${POLYGONS[polyId].diagonals} pepenjuru?`);
  };

  const handleVertexClick = (vertexIndex: number) => {
    if (mode !== 'draw') return;

    if (firstSelectedVertex === null) {
      playSound('click');
      setFirstSelectedVertex(vertexIndex);
      setDrawFeedback(`Bucu ${vertexIndex + 1} dipilih. Sekarang ketik BUCU BERTENTANGAN untuk melukis garisan pepenjuru!`);
    } else if (firstSelectedVertex === vertexIndex) {
      // Deselect
      setFirstSelectedVertex(null);
      setDrawFeedback('Bucu dinyahpilih.');
    } else {
      // Check if adjacent or diagonal
      const diff = Math.abs(firstSelectedVertex - vertexIndex);
      const isAdjacent = diff === 1 || diff === sides - 1;

      if (isAdjacent) {
        playSound('wrong');
        setDrawFeedback(`⚠️ Itu sisi lurus luar, BUKAN pepenjuru! Pepenjuru mesti menyambungkan bucu yang bertentangan (bukan bersebelahan).`);
        setFirstSelectedVertex(null);
      } else {
        // Valid diagonal!
        const pair: [number, number] = [
          Math.min(firstSelectedVertex, vertexIndex),
          Math.max(firstSelectedVertex, vertexIndex),
        ];

        // Check if already drawn
        const alreadyDrawn = userDrawnDiagonals.some(
          ([a, b]) => a === pair[0] && b === pair[1]
        );

        if (alreadyDrawn) {
          playSound('click');
          setDrawFeedback(`Garisan pepenjuru ini sudah dilukis! Cuba pasangkan bucu lain.`);
        } else {
          playSound('diagonal');
          const newDrawn = [...userDrawnDiagonals, pair];
          setUserDrawnDiagonals(newDrawn);
          setFirstSelectedVertex(null);

          if (newDrawn.length === currentPoly.diagonals) {
            playSound('fanfare');
            setDrawFeedback(`🎉 Syabas adik! Kamu telah berjaya menemui kesemua ${currentPoly.diagonals} pepenjuru ${currentPoly.name}!`);
            confetti({
              particleCount: 85,
              spread: 70,
              origin: { y: 0.6 },
              colors: ['#38bdf8', '#fbbf24', '#f43f5e', '#a855f7'],
            });
          } else {
            setDrawFeedback(`✨ Cantik! Jumpa ${newDrawn.length} daripada ${currentPoly.diagonals} pepenjuru.`);
          }
        }
      }
    }
  };

  const handleResetDrawing = () => {
    playSound('click');
    setFirstSelectedVertex(null);
    setUserDrawnDiagonals([]);
    setDrawFeedback(`Kanvas dikosongkan. Ketik bucu untuk mula melukis!`);
  };

  return (
    <div className="space-y-6">
      {/* Cheerful Header */}
      <div className="bg-gradient-to-r from-sky-100 via-indigo-50 to-purple-100 rounded-3xl p-4 sm:p-5 border-3 border-sky-300 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1 flex-wrap">
            <span className="text-xs font-display font-bold text-sky-950 uppercase bg-sky-200/90 px-3 py-0.5 rounded-full border border-sky-300 shadow-2xs">
              🧪 Makmal Eksplorasi Interaktif
            </span>
            <span className="text-xs text-sky-600 font-bold">·</span>
            <span className="text-xs font-display font-bold text-sky-800">
              Penerokaan Pepenjuru & Simetri
            </span>
          </div>
          <h2 className="text-xl sm:text-2xl font-display font-bold text-slate-900 flex items-center gap-2">
            Makmal Interaktif Poligon Sekata 🎨
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 mt-1 font-display">
            Terokai rahsia mengapa setiap poligon mempunyai bilangan pepenjuru dan paksi simetri tersendiri!
          </p>
        </div>

        {/* Mode Toggle Buttons */}
        <div className="flex items-center gap-1.5 bg-white p-1.5 rounded-2xl border-2 border-sky-200 shadow-2xs">
          <button
            onClick={() => {
              playSound('click');
              setMode('inspect');
            }}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-display font-bold transition-all cursor-pointer active:scale-95 ${
              mode === 'inspect'
                ? 'bg-amber-400 text-amber-950 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Pemeriksaan Automatik
          </button>
          <button
            onClick={() => {
              playSound('click');
              setMode('draw');
              setUserDrawnDiagonals([]);
              setFirstSelectedVertex(null);
            }}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-display font-bold transition-all cursor-pointer active:scale-95 ${
              mode === 'draw'
                ? 'bg-indigo-600 text-white shadow-xs animate-pulse-subtle'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <PenTool className="w-3.5 h-3.5" />
            Lukis Pepenjuru Sendiri! ✏️
          </button>
        </div>
      </div>

      {/* Main Sandbox Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Shape Selector List */}
        <div className="lg:col-span-4 space-y-3">
          <label className="text-xs font-display font-bold text-slate-700 uppercase tracking-wider block">
            Pilih Poligon Sekata:
          </label>

          <div className="space-y-2">
            {(Object.keys(POLYGONS) as PolygonId[]).map((polyId) => {
              const poly = POLYGONS[polyId];
              const isSelected = selectedPolyId === polyId;
              return (
                <button
                  key={polyId}
                  onClick={() => handleSelectPoly(polyId)}
                  className={`w-full flex items-center justify-between p-3 rounded-2xl border-2 transition-all cursor-pointer text-left active:translate-y-0.5 ${
                    isSelected
                      ? 'bg-amber-100/90 border-amber-400 ring-3 ring-amber-300 shadow-xs'
                      : 'bg-white border-slate-200 hover:border-amber-300 hover:bg-amber-50/40'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-white border-2 border-slate-100 flex items-center justify-center shrink-0 shadow-2xs">
                      <PolygonSvg
                        sides={poly.sides}
                        size={28}
                        showDiagonals={false}
                        showSides={false}
                        showCorners={false}
                        borderColor={poly.borderColor}
                        fillColor={poly.fillColor}
                      />
                    </div>
                    <div>
                      <div className="font-display font-bold text-sm text-slate-900">
                        {poly.name}
                      </div>
                      <div className="text-[11px] text-slate-500 font-display">
                        {poly.sides} sisi · {poly.diagonals} pepenjuru
                      </div>
                    </div>
                  </div>

                  <span className="text-xs font-display font-bold text-amber-950 bg-amber-200/80 px-2.5 py-1 rounded-xl border border-amber-300">
                    n = {poly.sides}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Formula Card */}
          <div className="p-4 rounded-3xl bg-gradient-to-br from-yellow-50 to-amber-100/80 border-3 border-amber-200 text-xs text-amber-950 space-y-2.5 font-display shadow-xs">
            <div className="font-bold flex items-center gap-1.5 text-amber-900 uppercase tracking-wide text-[11px]">
              <Info className="w-4 h-4 text-amber-600" />
              Formula Pepenjuru (Diagonals)
            </div>
            <p className="leading-relaxed text-slate-700">
              Dari setiap bucu, garisan pepenjuru boleh ditarik ke <span className="font-bold text-amber-950">(n - 3)</span> bucu yang lain.
            </p>
            <div className="p-2.5 rounded-2xl bg-white border-2 border-amber-300 text-center font-mono-math font-bold text-amber-900 text-sm shadow-2xs">
              Pepenjuru = n × (n - 3) ÷ 2
            </div>
            <div className="text-[11px] text-amber-900 text-center font-bold">
              Bagi {currentPoly.name}: {sides} × ({sides} - 3) ÷ 2 ={' '}
              <span className="text-indigo-700 font-mono-math font-bold">{currentPoly.diagonals}</span> pepenjuru!
            </div>
          </div>
        </div>

        {/* Right: The Interactive Canvas & Controls */}
        <div className="lg:col-span-8 space-y-4">
          <div className="bg-white rounded-3xl p-6 border-3 border-amber-300 shadow-md">
            {/* Top Toolbar */}
            <div className="flex flex-wrap items-center justify-between gap-3 border-b-2 border-dashed border-amber-200 pb-4 mb-4">
              <div>
                <h3 className="font-display font-bold text-xl text-slate-900">
                  Kanvas: {currentPoly.name}
                </h3>
                <span className="text-xs text-slate-500 font-display">
                  {mode === 'draw'
                    ? 'Mod Lukis: Ketik mana-mana bucu untuk menyambungkan garis pepenjuru'
                    : 'Mod Periksa: Buka atau tutup lapisan garisan di bawah'}
                </span>
              </div>

              {mode === 'draw' ? (
                <div className="flex items-center gap-2">
                  <span className="text-xs font-display font-bold text-indigo-900 bg-indigo-100 border-2 border-indigo-200 px-3 py-1.5 rounded-xl shadow-2xs">
                    Dilukis: {userDrawnDiagonals.length} / {currentPoly.diagonals}
                  </span>
                  <button
                    onClick={handleResetDrawing}
                    className="p-2 text-xs text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 rounded-xl cursor-pointer border border-slate-200"
                    title="Padam Lukisan"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                  </button>
                </div>
              ) : (
                /* Layer Toggles */
                <div className="flex flex-wrap gap-1.5">
                  <button
                    onClick={() => {
                      playSound('click');
                      setShowDiagonals((v) => !v);
                    }}
                    className={`text-xs font-display font-bold px-3 py-1.5 rounded-xl border-2 transition-all cursor-pointer active:scale-95 ${
                      showDiagonals
                        ? 'bg-sky-400 text-sky-950 border-sky-500 shadow-2xs'
                        : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
                    }`}
                  >
                    Pepenjuru ({currentPoly.diagonals})
                  </button>
                  <button
                    onClick={() => {
                      playSound('click');
                      setShowSymmetry((v) => !v);
                    }}
                    className={`text-xs font-display font-bold px-3 py-1.5 rounded-xl border-2 transition-all cursor-pointer active:scale-95 ${
                      showSymmetry
                        ? 'bg-rose-400 text-white border-rose-500 shadow-2xs'
                        : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
                    }`}
                  >
                    Simetri ({currentPoly.symmetricalAxes})
                  </button>
                  <button
                    onClick={() => {
                      playSound('click');
                      setShowAngles((v) => !v);
                    }}
                    className={`text-xs font-display font-bold px-3 py-1.5 rounded-xl border-2 transition-all cursor-pointer active:scale-95 ${
                      showAngles
                        ? 'bg-amber-400 text-amber-950 border-amber-500 shadow-2xs'
                        : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
                    }`}
                  >
                    Sudut ({Math.round(currentPoly.interiorAngleDeg)}°)
                  </button>
                </div>
              )}
            </div>

            {/* Drawing Feedback Strip in Draw Mode */}
            {mode === 'draw' && (
              <div className="p-3.5 bg-amber-100/80 border-2 border-amber-300 rounded-2xl text-xs font-display font-bold text-amber-950 mb-4 flex items-center justify-between animate-pop">
                <span>{drawFeedback}</span>
                {firstSelectedVertex !== null && (
                  <span className="text-[11px] text-amber-900 bg-amber-200 px-2.5 py-0.5 rounded-lg border border-amber-300 font-bold">
                    Pilihan: Bucu {firstSelectedVertex + 1}
                  </span>
                )}
              </div>
            )}

            {/* SVG Interactive Display */}
            <div className="bg-gradient-to-b from-yellow-50/60 to-amber-50/40 rounded-3xl p-6 flex items-center justify-center border-2 border-amber-100 min-h-[340px] shadow-inner">
              <PolygonSvg
                sides={currentPoly.sides}
                size={300}
                showSides={showSides}
                showCorners={showCorners}
                showDiagonals={mode === 'draw' ? true : showDiagonals}
                showSymmetry={mode === 'draw' ? false : showSymmetry}
                showAngles={mode === 'draw' ? false : showAngles}
                selectedColor={currentPoly.color}
                borderColor={currentPoly.borderColor}
                fillColor={currentPoly.fillColor}
                customDiagonals={mode === 'draw' ? userDrawnDiagonals : undefined}
                onVertexClick={mode === 'draw' ? handleVertexClick : undefined}
                interactiveVertexSelection={firstSelectedVertex}
              />
            </div>

            {/* Footer Summary Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 mt-4 text-xs font-display">
              <div className="p-2.5 rounded-2xl bg-amber-50 border-2 border-amber-200">
                <span className="text-amber-700 block text-[10px] font-bold">Sisi Lurus</span>
                <span className="font-bold text-amber-950 font-mono-math text-sm">{currentPoly.sides}</span>
              </div>
              <div className="p-2.5 rounded-2xl bg-indigo-50 border-2 border-indigo-200">
                <span className="text-indigo-700 block text-[10px] font-bold">Bucu (Vertices)</span>
                <span className="font-bold text-indigo-950 font-mono-math text-sm">{currentPoly.corners}</span>
              </div>
              <div className="p-2.5 rounded-2xl bg-rose-50 border-2 border-rose-200">
                <span className="text-rose-700 block text-[10px] font-bold">Paksi Simetri</span>
                <span className="font-bold text-rose-950 font-mono-math text-sm">{currentPoly.symmetricalAxes}</span>
              </div>
              <div className="p-2.5 rounded-2xl bg-sky-50 border-2 border-sky-200">
                <span className="text-sky-700 block text-[10px] font-bold">Pepenjuru</span>
                <span className="font-bold text-sky-950 font-mono-math text-sm">{currentPoly.diagonals}</span>
              </div>
            </div>
          </div>

          <OwlGuide
            message={`Dalam buku teks muka surat 218: "Pepenjuru ialah garis lurus yang menghubungkan satu bucu dengan bucu yang bertentangan." Dalam segi tiga sama sisi, setiap bucu disambung oleh sisi luar, sebab itulah pepenjuru = 0!`}
            hints={[
              'Segi tiga sama sisi: 0 pepenjuru.',
              'Segi empat sama: 2 pepenjuru.',
              'Pentagon: 5 pepenjuru (membentuk bintang di dalam!).',
              'Heksagon: 9 pepenjuru.',
              'Heptagon: 14 pepenjuru.',
              'Oktagon: 20 pepenjuru.',
            ]}
          />
        </div>
      </div>
    </div>
  );
};
