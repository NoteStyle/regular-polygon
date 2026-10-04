import confetti from 'canvas-confetti';

/**
 * Triggers a joyful confetti burst whenever a pupil successfully solves a riddle challenge.
 */
export function triggerRiddleSolvedConfetti(options?: { x?: number; y?: number }) {
  const originX = options?.x ?? 0.5;
  const originY = options?.y ?? 0.65;

  // Primary burst with geometric palette matching the polygons
  confetti({
    particleCount: 65,
    spread: 70,
    startVelocity: 35,
    origin: { x: originX, y: originY },
    colors: ['#ef4444', '#3b82f6', '#8b5cf6', '#f59e0b', '#ec4899', '#10b981'],
    ticks: 200,
    gravity: 1.1,
    scalar: 1.1,
  });

  // Secondary delayed sparkle burst
  setTimeout(() => {
    confetti({
      particleCount: 35,
      angle: 60,
      spread: 55,
      origin: { x: 0.15, y: 0.75 },
      colors: ['#fbbf24', '#f59e0b', '#6366f1'],
      ticks: 180,
    });
    confetti({
      particleCount: 35,
      angle: 120,
      spread: 55,
      origin: { x: 0.85, y: 0.75 },
      colors: ['#34d399', '#38bdf8', '#ec4899'],
      ticks: 180,
    });
  }, 120);
}

/**
 * Grand celebration confetti for completing the entire escape room or solving all challenges.
 */
export function triggerGrandCelebrationConfetti() {
  const duration = 2.5 * 1000;
  const animationEnd = Date.now() + duration;

  const frame = () => {
    confetti({
      particleCount: 4,
      angle: 60,
      spread: 55,
      origin: { x: 0, y: 0.65 },
      colors: ['#ef4444', '#3b82f6', '#8b5cf6', '#f59e0b', '#10b981'],
    });
    confetti({
      particleCount: 4,
      angle: 120,
      spread: 55,
      origin: { x: 1, y: 0.65 },
      colors: ['#ec4899', '#f59e0b', '#3b82f6', '#10b981', '#6366f1'],
    });

    if (Date.now() < animationEnd) {
      requestAnimationFrame(frame);
    }
  };

  frame();
}
