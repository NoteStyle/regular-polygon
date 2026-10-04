import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import { TEXTBOOK_TABLE_DATA, POLYGONS } from '../data/challenges';
import { PolygonId } from '../types/polygon';
import { PolygonSvg } from './PolygonSvg';
import { OwlGuide } from './OwlGuide';
import { playSound } from '../utils/audio';
import { Check, CheckCircle2, RotateCcw, HelpCircle, Eye, Sparkles, Star } from 'lucide-react';

const DEFAULT_PREFILLED: Record<PolygonId, Partial<Record<'sides' | 'corners' | 'axes' | 'angles' | 'diagonals', number>>> = {
  triangle: { sides: 3, axes: 3 },
  square: { corners: 4, angles: 4 },
  pentagon: { corners: 5, axes: 5 },
  hexagon: { sides: 6, axes: 6, diagonals: 9 },
  heptagon: { corners: 7, angles: 7, diagonals: 14 },
  octagon: { sides: 8, angles: 8, diagonals: 20 },
};

export const TableChallengeView: React.FC = () => {
  const [userInputs, setUserInputs] = useState<Record<string, string>>({});
  const [validated, setValidated] = useState(false);
  const [inspectionPolygonId, setInspectionPolygonId] = useState<PolygonId | null>(null);

  const getCellKey = (polyId: PolygonId, field: string) => `${polyId}-${field}`;

  const handleInputChange = (polyId: PolygonId, field: string, val: string) => {
    const cleaned = val.replace(/[^0-9]/g, '');
    setUserInputs((prev) => ({
      ...prev,
      [getCellKey(polyId, field)]: cleaned,
    }));
    setValidated(false);
  };

  const handleValidate = () => {
    let allCorrect = true;

    TEXTBOOK_TABLE_DATA.forEach((row) => {
      const fields: Array<'sides' | 'corners' | 'symmetricalAxes' | 'angles' | 'diagonals'> = [
        'sides',
        'corners',
        'symmetricalAxes',
        'angles',
        'diagonals',
      ];

      fields.forEach((f) => {
        const shortField = f === 'symmetricalAxes' ? 'axes' : f;
        const isPrefilled = DEFAULT_PREFILLED[row.polygonId][shortField as keyof typeof DEFAULT_PREFILLED[typeof row.polygonId]] !== undefined;
        if (!isPrefilled) {
          const userVal = parseInt(userInputs[getCellKey(row.polygonId, shortField)] || '-1', 10);
          if (isNaN(userVal) || userVal === -1 || userVal !== row[f]) {
            allCorrect = false;
          }
        }
      });
    });

    setValidated(true);

    if (allCorrect) {
      playSound('fanfare');
      confetti({
        particleCount: 110,
        spread: 80,
        origin: { y: 0.6 },
        colors: ['#10b981', '#fbbf24', '#f43f5e', '#3b82f6'],
      });
    } else {
      playSound('wrong');
    }
  };

  const handleAutoFill = () => {
    playSound('click');
    const autoFilled: Record<string, string> = {};
    TEXTBOOK_TABLE_DATA.forEach((row) => {
      autoFilled[getCellKey(row.polygonId, 'sides')] = String(row.sides);
      autoFilled[getCellKey(row.polygonId, 'corners')] = String(row.corners);
      autoFilled[getCellKey(row.polygonId, 'axes')] = String(row.symmetricalAxes);
      autoFilled[getCellKey(row.polygonId, 'angles')] = String(row.angles);
      autoFilled[getCellKey(row.polygonId, 'diagonals')] = String(row.diagonals);
    });
    setUserInputs(autoFilled);
    setValidated(false);
  };

  const handleReset = () => {
    playSound('click');
    setUserInputs({});
    setValidated(false);
  };

  return (
    <div className="space-y-6">
      {/* Cheerful Colorful Header */}
      <div className="bg-gradient-to-r from-emerald-100 via-teal-50 to-amber-100 rounded-3xl p-4 sm:p-5 border-3 border-emerald-300 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1 flex-wrap">
            <span className="text-xs font-display font-bold text-emerald-900 uppercase bg-emerald-200/90 px-3 py-0.5 rounded-full border border-emerald-300 shadow-2xs">
              📊 Aktiviti Buku Teks · Soalan 3 Muka Surat 218
            </span>
            <span className="text-xs text-emerald-600 font-bold">·</span>
            <span className="text-xs font-display font-bold text-emerald-800">
              Jadual Ciri-Ciri Poligon Sekata
            </span>
          </div>
          <h2 className="text-xl sm:text-2xl font-display font-bold text-slate-900 flex items-center gap-2">
            Lengkapkan Jadual di Bawah ⭐
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 mt-1 font-display">
            Isikan nombor yang hilang bagi bilangan sisi lurus, bucu, paksi simetri, sudut, dan pepenjuru!
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={handleAutoFill}
            className="text-xs font-display font-bold text-indigo-800 hover:text-indigo-950 bg-indigo-100 hover:bg-indigo-200 px-3.5 py-2 rounded-2xl border-2 border-indigo-200 shadow-2xs transition-all cursor-pointer active:scale-95"
          >
            Tunjuk Skema Jawapan 💡
          </button>
          <button
            onClick={handleReset}
            className="flex items-center gap-1 text-xs font-display font-bold text-slate-700 hover:text-slate-900 bg-white hover:bg-slate-100 px-3.5 py-2 rounded-2xl border-2 border-slate-200 shadow-2xs transition-all cursor-pointer active:scale-95"
          >
            <RotateCcw className="w-3.5 h-3.5 text-slate-500" />
            Padam
          </button>
        </div>
      </div>

      {/* Colorful Rainbow Table Container */}
      <div className="bg-white rounded-3xl border-3 border-amber-300 shadow-md overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse font-display">
            <thead>
              <tr className="border-b-3 border-amber-300 text-slate-900 text-xs sm:text-sm">
                <th className="py-3.5 px-4 font-bold bg-amber-100/90 text-amber-950">
                  Poligon Sekata
                </th>
                <th className="py-3.5 px-3 font-bold text-center bg-rose-100/80 text-rose-950 border-l border-amber-200">
                  Bilangan sisi lurus
                </th>
                <th className="py-3.5 px-3 font-bold text-center bg-orange-100/80 text-orange-950 border-l border-amber-200">
                  Bilangan bucu
                </th>
                <th className="py-3.5 px-3 font-bold text-center bg-yellow-100/80 text-yellow-950 border-l border-amber-200">
                  Bilangan paksi simetri
                </th>
                <th className="py-3.5 px-3 font-bold text-center bg-sky-100/80 text-sky-950 border-l border-amber-200">
                  Bilangan sudut
                </th>
                <th className="py-3.5 px-3 font-bold text-center bg-purple-100/80 text-purple-950 border-l border-amber-200">
                  Bilangan pepenjuru
                </th>
                <th className="py-3.5 px-3 font-bold text-center bg-emerald-100/80 text-emerald-950 border-l border-amber-200">
                  Bukti
                </th>
              </tr>
            </thead>
            <tbody className="divide-y-2 divide-slate-100 text-xs sm:text-sm">
              {TEXTBOOK_TABLE_DATA.map((row, idx) => {
                const poly = POLYGONS[row.polygonId];
                const prefilled = DEFAULT_PREFILLED[row.polygonId];

                const renderCell = (
                  field: 'sides' | 'corners' | 'axes' | 'angles' | 'diagonals',
                  expectedVal: number
                ) => {
                  const isPrefilled = prefilled[field] !== undefined;
                  const key = getCellKey(row.polygonId, field);
                  const userVal = userInputs[key] || '';
                  const numVal = parseInt(userVal, 10);
                  const isCorrect = validated && numVal === expectedVal;
                  const isWrong = validated && !isPrefilled && numVal !== expectedVal;

                  if (isPrefilled) {
                    return (
                      <span className="font-mono-math font-bold text-slate-800 text-base sm:text-lg bg-amber-50/60 px-2.5 py-0.5 rounded-lg border border-amber-200/60">
                        {prefilled[field]}
                      </span>
                    );
                  }

                  return (
                    <input
                      type="text"
                      inputMode="numeric"
                      maxLength={2}
                      value={userVal}
                      onChange={(e) => handleInputChange(row.polygonId, field, e.target.value)}
                      placeholder="?"
                      className={`w-12 h-10 text-center font-mono-math font-bold rounded-xl border-2 text-sm sm:text-base transition-all focus:outline-none focus:scale-105 ${
                        isCorrect
                          ? 'border-emerald-500 bg-emerald-100 text-emerald-950 ring-2 ring-emerald-300'
                          : isWrong
                          ? 'border-rose-400 bg-rose-100 text-rose-950 ring-2 ring-rose-300'
                          : 'border-slate-300 bg-slate-50 focus:bg-white focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 text-slate-900 shadow-2xs'
                      }`}
                    />
                  );
                };

                return (
                  <tr
                    key={row.polygonId}
                    className={`hover:bg-amber-50/40 transition-colors ${
                      idx % 2 === 0 ? 'bg-white' : 'bg-slate-50/50'
                    }`}
                  >
                    <td className="py-3 px-4 font-bold text-slate-800 flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-xl bg-white border-2 border-slate-200 flex items-center justify-center shrink-0 shadow-2xs">
                        <PolygonSvg
                          sides={row.sides}
                          size={24}
                          showDiagonals={false}
                          showSides={false}
                          showCorners={false}
                          borderColor={poly.borderColor}
                          fillColor={poly.fillColor}
                        />
                      </div>
                      <span className="capitalize font-bold text-slate-900 text-xs sm:text-sm">
                        {row.polygonName}
                      </span>
                    </td>

                    <td className="py-3 px-3 text-center border-l border-slate-100">{renderCell('sides', row.sides)}</td>
                    <td className="py-3 px-3 text-center border-l border-slate-100">{renderCell('corners', row.corners)}</td>
                    <td className="py-3 px-3 text-center border-l border-slate-100">{renderCell('axes', row.symmetricalAxes)}</td>
                    <td className="py-3 px-3 text-center border-l border-slate-100">{renderCell('angles', row.angles)}</td>
                    <td className="py-3 px-3 text-center border-l border-slate-100">{renderCell('diagonals', row.diagonals)}</td>

                    <td className="py-3 px-3 text-center border-l border-slate-100">
                      <button
                        onClick={() => {
                          playSound('click');
                          setInspectionPolygonId(row.polygonId);
                        }}
                        className="text-xs font-display font-bold text-indigo-700 hover:text-indigo-900 bg-indigo-50 hover:bg-indigo-100 p-2 rounded-xl border border-indigo-200 transition-all cursor-pointer active:scale-95 shadow-2xs"
                        title="Lihat Rajah Poligon"
                      >
                        <Eye className="w-4 h-4 mx-auto" />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Footer Actions */}
        <div className="p-4 sm:p-5 bg-gradient-to-r from-amber-50 to-yellow-50 border-t-2 border-amber-200 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="text-xs text-amber-900 font-bold font-display flex items-center gap-1.5">
            <span>💡 Petua Mudah:</span>
            <span>Bagi setiap poligon sekata: Sisi = Bucu = Paksi Simetri = Sudut. Hanya Pepenjuru ikut formula <em>n(n-3)÷2</em>!</span>
          </div>

          <button
            onClick={handleValidate}
            className="w-full sm:w-auto comic-btn-emerald text-white px-7 py-3 rounded-2xl font-display font-bold text-sm shadow-md transition-all cursor-pointer"
          >
            Semak Jawapan Jadual Saya ✨
          </button>
        </div>
      </div>

      {/* Cute Inspection Modal */}
      {inspectionPolygonId && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 max-w-md w-full border-4 border-amber-300 shadow-2xl space-y-4 animate-pop font-display">
            <div className="flex items-center justify-between border-b-2 border-dashed border-amber-200 pb-3">
              <div className="flex items-center gap-2">
                <span className="text-xl">🔍</span>
                <h3 className="font-bold text-lg text-slate-900">
                  Bukti Bentuk: {POLYGONS[inspectionPolygonId].name}
                </h3>
              </div>
              <button
                onClick={() => setInspectionPolygonId(null)}
                className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 flex items-center justify-center font-bold text-sm cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="flex justify-center bg-gradient-to-b from-yellow-50 to-amber-50 rounded-3xl p-4 border-2 border-amber-200">
              <PolygonSvg
                sides={POLYGONS[inspectionPolygonId].sides}
                size={230}
                showDiagonals={true}
                showSymmetry={true}
                showCorners={true}
                showSides={true}
                showAngles={true}
                borderColor={POLYGONS[inspectionPolygonId].borderColor}
                fillColor={POLYGONS[inspectionPolygonId].fillColor}
              />
            </div>

            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="p-2.5 rounded-2xl bg-amber-50 border-2 border-amber-200">
                <span className="text-amber-700 block text-[10px] font-bold">Sisi Lurus</span>
                <span className="font-bold text-amber-950 font-mono-math text-sm">{POLYGONS[inspectionPolygonId].sides}</span>
              </div>
              <div className="p-2.5 rounded-2xl bg-indigo-50 border-2 border-indigo-200">
                <span className="text-indigo-700 block text-[10px] font-bold">Bucu (Corners)</span>
                <span className="font-bold text-indigo-950 font-mono-math text-sm">{POLYGONS[inspectionPolygonId].corners}</span>
              </div>
              <div className="p-2.5 rounded-2xl bg-rose-50 border-2 border-rose-200">
                <span className="text-rose-700 block text-[10px] font-bold">Paksi Simetri</span>
                <span className="font-bold text-rose-950 font-mono-math text-sm">{POLYGONS[inspectionPolygonId].symmetricalAxes}</span>
              </div>
              <div className="p-2.5 rounded-2xl bg-sky-50 border-2 border-sky-200">
                <span className="text-sky-700 block text-[10px] font-bold">Pepenjuru</span>
                <span className="font-bold text-sky-950 font-mono-math text-sm">{POLYGONS[inspectionPolygonId].diagonals}</span>
              </div>
            </div>

            <p className="text-xs text-slate-700 leading-relaxed bg-slate-50 p-3 rounded-2xl border border-slate-200">
              {POLYGONS[inspectionPolygonId].description}
            </p>

            <button
              onClick={() => setInspectionPolygonId(null)}
              className="w-full comic-btn-indigo text-white py-3 rounded-2xl font-bold text-xs shadow-md"
            >
              Faham! Tutup Bukti Rajah 👍
            </button>
          </div>
        </div>
      )}

      {/* Mascot Guide */}
      <OwlGuide
        message="Perhatikan lajur sisi lurus, bucu, paksi simetri, dan bilangan sudut adalah sentiasa sama bilangannya dalam poligon sekata! Hebat kan matematik ini?"
        hints={[
          'Segi tiga sama sisi: 0 pepenjuru.',
          'Segi empat sama: 2 pepenjuru.',
          'Pentagon: 5 pepenjuru.',
          'Heksagon: 9 pepenjuru.',
          'Heptagon: 14 pepenjuru.',
          'Oktagon: 20 pepenjuru.',
        ]}
      />
    </div>
  );
};
