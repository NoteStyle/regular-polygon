import React from 'react';
import { BookOpen, X, CheckCircle } from 'lucide-react';

interface TextbookModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const TextbookModal: React.FC<TextbookModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto border-4 border-amber-300 shadow-2xl p-6 sm:p-8 space-y-6 animate-pop font-display">
        {/* Header */}
        <div className="flex items-center justify-between border-b-2 border-dashed border-amber-200 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-amber-200 text-amber-900 border-2 border-amber-300 flex items-center justify-center shadow-xs text-2xl">
              📖
            </div>
            <div>
              <span className="text-[11px] font-bold text-amber-800 uppercase tracking-wider bg-amber-100 px-2.5 py-0.5 rounded-full border border-amber-300">
                Matematik Tahun 5 · Unit 6: Ruang
              </span>
              <h3 className="font-bold text-lg sm:text-xl text-slate-900 mt-1">
                Nota Buku Teks KSSR (Standard 6.1.1)
              </h3>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-9 h-9 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 flex items-center justify-center font-bold text-base cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Section 1: Characteristics of Regular Polygons */}
        <div className="space-y-3">
          <h4 className="font-bold text-sm text-slate-900 uppercase tracking-wider flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-amber-400 shadow-xs" />
            Ciri-Ciri Poligon Sekata (Muka Surat 217)
          </h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
            <div className="p-3 rounded-2xl bg-amber-50 border-2 border-amber-200 flex items-start gap-2">
              <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <span>Bentuk tertutup (closed shape)</span>
            </div>
            <div className="p-3 rounded-2xl bg-indigo-50 border-2 border-indigo-200 flex items-start gap-2">
              <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <span>Semua sisi lurus adalah sama panjang</span>
            </div>
            <div className="p-3 rounded-2xl bg-pink-50 border-2 border-pink-200 flex items-start gap-2">
              <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <span>Semua sudut adalah sama saiz</span>
            </div>
            <div className="p-3 rounded-2xl bg-emerald-50 border-2 border-emerald-200 flex items-start gap-2">
              <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <span>Bilangan sudut sama dengan bilangan bucu</span>
            </div>
            <div className="p-3 rounded-2xl bg-sky-50 border-2 border-sky-200 flex items-start gap-2 sm:col-span-2">
              <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <span>Bilangan paksi simetri sama dengan bilangan sisi lurus</span>
            </div>
          </div>
        </div>

        {/* Section 2: Diagonal Definition */}
        <div className="p-4 rounded-3xl bg-gradient-to-r from-amber-100 to-yellow-100 border-3 border-amber-300 text-amber-950 space-y-2 shadow-xs">
          <div className="text-xs font-bold uppercase tracking-wider text-amber-900 flex items-center gap-1.5">
            <span>💡 Minda Cergas / Mind Trigger (Muka Surat 218):</span>
          </div>
          <p className="text-xs sm:text-sm font-bold italic">
            "Pepenjuru ialah garis lurus yang dilukis dari satu bucu ke bucu yang bertentangan."
          </p>
          <p className="text-xs text-amber-900 leading-relaxed">
            Dalam segi tiga sama sisi, setiap bucu disambungkan terus oleh sisi lurus ke semua bucu yang lain. Tiada bucu bertentangan yang tinggal — oleh itu, segi tiga mempunyai <strong>0 pepenjuru</strong>.
          </p>
        </div>

        {/* Section 3: Exact Textbook Riddles */}
        <div className="space-y-3">
          <h4 className="font-bold text-sm text-slate-900 uppercase tracking-wider flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-pink-500 shadow-xs" />
            Soalan Teka-Teki "Cuba Ini" (Muka Surat 218 Soalan 1)
          </h4>
          <div className="space-y-2 text-xs">
            <div className="p-3 rounded-2xl bg-amber-50 border-2 border-amber-200">
              <strong className="text-amber-900 block mb-1">Cabaran A: Heksagon Sekata</strong>
              • 6 sisi lurus yang tertutup<br />
              • semua sisi lurus sama panjang<br />
              • 6 paksi simetri
            </div>
            <div className="p-3 rounded-2xl bg-indigo-50 border-2 border-indigo-200">
              <strong className="text-indigo-900 block mb-1">Cabaran B: Segi Tiga Sama Sisi</strong>
              • 3 sisi lurus sama panjang<br />
              • 3 sudut pedalaman sama saiz<br />
              • 0 pepenjuru
            </div>
            <div className="p-3 rounded-2xl bg-pink-50 border-2 border-pink-200">
              <strong className="text-pink-900 block mb-1">Cabaran C: Heptagon Sekata</strong>
              • 7 bucu (corners)<br />
              • semua sisi lurus sama panjang<br />
              • 14 pepenjuru
            </div>
          </div>
        </div>

        <button
          onClick={onClose}
          className="w-full comic-btn-amber text-amber-950 py-3.5 rounded-2xl font-bold text-sm shadow-md transition-all cursor-pointer"
        >
          Faham, Terima Kasih Cikgu Owl! 👍
        </button>
      </div>
    </div>
  );
};
