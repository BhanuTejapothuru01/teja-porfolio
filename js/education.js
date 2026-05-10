/* ═══════════════════════════════════════════════════════════════
   EDUCATION PAGE JS — Progress Ring, Score Counters
   ═══════════════════════════════════════════════════════════════ */

document.addEventListener('DOMContentLoaded', () => {
  initProgressRing();
  initScoreCounters();
});

/* ── Circular Progress Ring ── */
function initProgressRing() {
  const ring = document.querySelector('.ring-fill');
  if (!ring) return;

  const circumference = 2 * Math.PI * 54; // radius = 54
  const percent = parseInt(ring.dataset.percent || 47);
  const offset = circumference - (percent / 100) * circumference;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        ring.style.strokeDashoffset = offset;

        // Also animate the percent text
        const percentEl = document.querySelector('.edu-progress-percent');
        if (percentEl) {
          animateCounter(percentEl, percent, 2000);
        }
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });

  observer.observe(ring);
}

/* ── Score Counters ── */
function initScoreCounters() {
  const counters = document.querySelectorAll('.score-counter');
  if (!counters.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const target = parseFloat(entry.target.dataset.target);
        const isDecimal = entry.target.dataset.decimal === 'true';
        
        if (isDecimal) {
          animateDecimalCounter(entry.target, target, 1500);
        } else {
          animateCounter(entry.target, target, 1500);
        }
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });

  counters.forEach(c => observer.observe(c));
}

function animateDecimalCounter(element, target, duration) {
  const startTime = performance.now();
  function update(currentTime) {
    const elapsed = currentTime - startTime;
    const progress = Math.min(elapsed / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3);
    const current = (eased * target).toFixed(1);
    element.textContent = current + '%';
    if (progress < 1) requestAnimationFrame(update);
  }
  requestAnimationFrame(update);
}
