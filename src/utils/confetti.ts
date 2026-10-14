import confetti from 'canvas-confetti';

export function triggerCompletionConfetti() {
  confetti({
    particleCount: 50,
    spread: 60,
    origin: { y: 0.8 },
    colors: ['#0284c7', '#38bdf8', '#10b981', '#f59e0b', '#7c3aed'],
  });
}

export function triggerMilestoneConfetti() {
  const end = Date.now() + 1000;
  const colors = ['#f59e0b', '#ea580c', '#10b981', '#3b82f6'];

  (function frame() {
    confetti({
      particleCount: 3,
      angle: 60,
      spread: 55,
      origin: { x: 0 },
      colors: colors,
    });
    confetti({
      particleCount: 3,
      angle: 120,
      spread: 55,
      origin: { x: 1 },
      colors: colors,
    });

    if (Date.now() < end) {
      requestAnimationFrame(frame);
    }
  })();
}
