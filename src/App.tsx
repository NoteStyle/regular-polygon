import React, { useState } from 'react';
import { Navbar, NavTab } from './components/Navbar';
import { EscapeRoomView } from './components/EscapeRoomView';
import { RiddleMatchView } from './components/RiddleMatchView';
import { TableChallengeView } from './components/TableChallengeView';
import { SandboxView } from './components/SandboxView';
import { TextbookModal } from './components/TextbookModal';
import { isSoundEnabled, setSoundEnabled } from './utils/audio';
import { Heart, Sparkles } from 'lucide-react';

export default function App() {
  const [currentTab, setCurrentTab] = useState<NavTab>('escape');
  const [soundMuted, setSoundMuted] = useState<boolean>(!isSoundEnabled());
  const [isCurriculumOpen, setIsCurriculumOpen] = useState(false);

  // Session-wide completed riddle challenges: e.g. ['A', 'B', 'C']
  const [completedRiddleIds, setCompletedRiddleIds] = useState<string[]>([]);
  const [activeRiddleId, setActiveRiddleId] = useState<string | null>(null);

  const handleToggleSound = () => {
    const newState = !soundMuted;
    setSoundMuted(newState);
    setSoundEnabled(!newState);
  };

  const handleRiddleCompleted = (riddleId: string) => {
    setCompletedRiddleIds((prev) => {
      if (prev.includes(riddleId)) return prev;
      return [...prev, riddleId];
    });
  };

  const handleNavigateToRiddle = (riddleId: string) => {
    setActiveRiddleId(riddleId);
    if (currentTab !== 'escape' && currentTab !== 'match') {
      setCurrentTab('escape');
    }
  };

  return (
    <div className="min-h-screen flex flex-col antialiased selection:bg-amber-300 selection:text-amber-950 font-display">
      {/* Navigation Header with Session Riddle Progress Indicator */}
      <Navbar
        currentTab={currentTab}
        onTabChange={(tab) => {
          setCurrentTab(tab);
          setActiveRiddleId(null);
        }}
        soundMuted={soundMuted}
        onToggleSound={handleToggleSound}
        onOpenCurriculum={() => setIsCurriculumOpen(true)}
        completedRiddleIds={completedRiddleIds}
        onNavigateToRiddle={handleNavigateToRiddle}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-6xl w-full mx-auto p-3 sm:p-6 lg:p-8">
        {currentTab === 'escape' && (
          <EscapeRoomView
            onGoToMatch={() => setCurrentTab('match')}
            onGoToTable={() => setCurrentTab('table')}
            completedRiddleIds={completedRiddleIds}
            onRiddleCompleted={handleRiddleCompleted}
            activeRiddleId={activeRiddleId}
          />
        )}

        {currentTab === 'match' && (
          <RiddleMatchView
            completedRiddleIds={completedRiddleIds}
            onRiddleCompleted={handleRiddleCompleted}
            activeRiddleId={activeRiddleId}
          />
        )}

        {currentTab === 'table' && <TableChallengeView />}

        {currentTab === 'sandbox' && <SandboxView />}
      </main>

      {/* Cute Colorful Primary School Footer */}
      <footer className="mt-auto border-t-4 border-amber-300 bg-white/95 py-6 text-xs text-slate-600 shadow-inner">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2 flex-wrap justify-center sm:justify-start">
            <span className="font-bold text-amber-900 bg-amber-100 border border-amber-300 px-2.5 py-0.5 rounded-full">
              📐 Unit 6: Ruang (Poligon Sekata)
            </span>
            <span className="text-slate-400">·</span>
            <span className="font-medium text-slate-700">KSSR Matematik Tahun 5 (Muka Surat 217–218)</span>
          </div>

          <div className="flex items-center gap-1.5 text-slate-500 font-bold">
            <span>Dihasilkan untuk murid sekolah rendah dengan gembira</span>
            <Sparkles className="w-3.5 h-3.5 text-amber-500" />
          </div>
        </div>
      </footer>

      {/* Curriculum Modal */}
      <TextbookModal
        isOpen={isCurriculumOpen}
        onClose={() => setIsCurriculumOpen(false)}
      />
    </div>
  );
}
