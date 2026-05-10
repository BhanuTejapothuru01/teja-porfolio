/* ═══════════════════════════════════════════════════════════════
   SKILLS PAGE JS — Progress Bar Animations
   ═══════════════════════════════════════════════════════════════ */

document.addEventListener('DOMContentLoaded', () => {
  initProgressBars();
  initSkillCounters();
});

/* ── Animate Progress Bars on Scroll ── */
function initProgressBars() {
  const bars = document.querySelectorAll('.lang-bar-fill');
  if (!bars.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const target = entry.target.dataset.percent;
        entry.target.style.width = target + '%';
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.3 });

  bars.forEach(bar => observer.observe(bar));
}

/* ── Skill Percentage Counters ── */
function initSkillCounters() {
  const counters = document.querySelectorAll('.skill-counter');
  if (!counters.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const target = parseInt(entry.target.dataset.target);
        animateCounter(entry.target, target, 1200);
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });

  counters.forEach(c => observer.observe(c));
}
