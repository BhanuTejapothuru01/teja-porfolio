/* ═══════════════════════════════════════════════════════════════
   SPRING CURSOR — Vanilla JS adaptation of React CustomCursor
   Smooth spring physics follow with mix-blend-difference
   ═══════════════════════════════════════════════════════════════ */

(function () {
  const SPRING = {
    damping: 0.75,     // 0–1, lower = more bouncy
    stiffness: 0.08,   // spring strength
  };

  document.addEventListener("DOMContentLoaded", () => {
    const cursor = document.getElementById("custom-cursor");
    if (!cursor) return;

    let mouseX = -100, mouseY = -100;
    let cursorX = -100, cursorY = -100;
    let velocityX = 0, velocityY = 0;

    // Track mouse position
    window.addEventListener("mousemove", (e) => {
      mouseX = e.clientX - 10;
      mouseY = e.clientY - 10;
    });

    // Spring physics animation loop
    function animate() {
      const dx = mouseX - cursorX;
      const dy = mouseY - cursorY;

      // Spring force
      velocityX += dx * SPRING.stiffness;
      velocityY += dy * SPRING.stiffness;

      // Damping
      velocityX *= SPRING.damping;
      velocityY *= SPRING.damping;

      cursorX += velocityX;
      cursorY += velocityY;

      cursor.style.transform = `translate(${cursorX}px, ${cursorY}px)`;
      requestAnimationFrame(animate);
    }
    animate();

    // Hover shrink on interactive elements
    const hoverTargets = document.querySelectorAll(
      'a, button, .card, .nav-card, .tool-badge, .concept-card, .award-card, .hex-card, .stat-card, .web-tech-card, .contact-item, .social-link, .keyword-pill, .pill, .btn, .nav-link, .responsibility-card, .project-card, .coursework-item, .lang-prof-item, .edu-card, .form-input, .form-textarea, .contact-item-action'
    );

    hoverTargets.forEach(el => {
      el.addEventListener('mouseenter', () => cursor.classList.add('hovering'));
      el.addEventListener('mouseleave', () => {
        cursor.classList.remove('hovering');
        cursor.classList.remove('text-mode');
        cursor.textContent = '';
      });
    });

    // Optional: elements with data-cursor-text show text in cursor
    document.querySelectorAll('[data-cursor-text]').forEach(el => {
      el.addEventListener('mouseenter', () => {
        cursor.classList.add('text-mode');
        cursor.textContent = el.dataset.cursorText;
      });
      el.addEventListener('mouseleave', () => {
        cursor.classList.remove('text-mode');
        cursor.textContent = '';
      });
    });
  });
})();
