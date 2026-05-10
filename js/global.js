/* ═══════════════════════════════════════════════════════════════
   GLOBAL JS — Loader (session-only), Scroll Reveals, Nav, Transitions
   No particles. Cursor handled by cursor.js.
   ═══════════════════════════════════════════════════════════════ */

document.addEventListener('DOMContentLoaded', () => {
  initLoader();
  initCyberBackground();
  initScrollReveal();
  initNavbar();
  initPageTransitions();
  initCyberSFX();
  initCardTilt();
  initGlitchTextReveal();
});

/* ── Cyberpunk Matrix Rain Background ── */
function initCyberBackground() {
  const canvas = document.getElementById('cyber-bg-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  
  let width, height;
  let columns = [];
  const fontSize = 12; // Smaller drops

  // Cyberpunk character set (Katakana + Latin + Digits)
  const charset = 'アァカサタナハマヤャラワガザダバパイィキシチニヒミリヰギジヂビピウゥクスツヌフムユュルグズブヅプエェケセテネヘメレゲゼデベペオォコソトノホモヨョロゴゾドボポヴッン0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  
  // Neon Cyberpunk colors
  const colors = [
    '#ff0055', // Pink
    '#00f0ff', // Cyan
    '#ccff00', // Yellow
    '#bf00ff'  // Purple
  ];

  let lastWidth = 0;
  function resize() {
    // Only reset if width changes significantly (fixes mobile scroll bar issue)
    if (Math.abs(window.innerWidth - lastWidth) < 50 && width > 0) return;
    
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
    lastWidth = width;
    
    // Calculate how many columns we need
    const colCount = Math.floor(width / fontSize) + 1;
    columns = [];
    for (let i = 0; i < colCount; i++) {
      columns[i] = {
        y: Math.random() * height, // Random start height
        speed: Math.random() * 2 + 1, // Varied speed
        color: colors[Math.floor(Math.random() * colors.length)]
      };
    }
  }
  window.addEventListener('resize', resize);
  resize();

  function animate() {
    // Semi-transparent black background to create trail effect
    ctx.fillStyle = 'rgba(5, 0, 10, 0.15)';
    ctx.fillRect(0, 0, width, height);

    ctx.font = `bold ${fontSize}px "Share Tech Mono", monospace`;

    for (let i = 0; i < columns.length; i++) {
      const col = columns[i];
      // Random character
      const char = charset[Math.floor(Math.random() * charset.length)];

      // White/bright for the "head" of the drop
      ctx.fillStyle = '#ffffff';
      ctx.fillText(char, i * fontSize, col.y);

      // Slightly higher up, we draw the colored trail
      ctx.fillStyle = col.color;
      ctx.fillText(char, i * fontSize, col.y - fontSize);

      // Move drop down
      col.y += fontSize * (col.speed * 0.5);

      // Reset drop to top randomly when it goes off screen
      if (col.y > height && Math.random() > 0.98) {
        col.y = 0;
        col.speed = Math.random() * 2 + 1;
        col.color = colors[Math.floor(Math.random() * colors.length)];
      }
    }
    requestAnimationFrame(animate);
  }
  animate();
}

/* ── Loader (only first visit per session) ── */
function initLoader() {
  const loader = document.getElementById('loader');
  if (!loader) return;

  // If already seen this session, hide immediately
  if (sessionStorage.getItem('loaderShown')) {
    loader.remove();
    return;
  }

  // First visit — show loader then dismiss
  sessionStorage.setItem('loaderShown', 'true');
  setTimeout(() => {
    loader.classList.add('hidden');
    setTimeout(() => loader.remove(), 600);
  }, 2200);
}

/* ── Scroll Reveal ── */
function initScrollReveal() {
  const reveals = document.querySelectorAll('.reveal');
  if (!reveals.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('revealed');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

  reveals.forEach(el => observer.observe(el));
}

/* ── Navbar ── */
function initNavbar() {
  const toggle = document.querySelector('.nav-toggle');
  const links = document.querySelector('.nav-links');
  if (!toggle || !links) return;

  toggle.addEventListener('click', () => {
    toggle.classList.toggle('open');
    links.classList.toggle('open');
  });

  links.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
      toggle.classList.remove('open');
      links.classList.remove('open');
    });
  });
}

/* ── Page Transitions ── */
function initPageTransitions() {
  const overlay = document.querySelector('.page-transition');
  if (!overlay) return;

  document.body.style.opacity = '0';
  requestAnimationFrame(() => {
    document.body.style.transition = 'opacity 0.4s ease';
    document.body.style.opacity = '1';
  });

  document.querySelectorAll('a[data-page]').forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const href = link.getAttribute('href');
      overlay.classList.add('active');
      // Wait for shutter animation to finish (0.4s + 0.2s delay + 0.2s buffer = 800ms)
      setTimeout(() => { window.location.href = href; }, 800);
    });
  });
}

/* ── Animated Counter ── */
function animateCounter(element, target, duration = 1500) {
  const startTime = performance.now();
  function update(currentTime) {
    const elapsed = currentTime - startTime;
    const progress = Math.min(elapsed / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3);
    const current = Math.floor(eased * target);
    if (element.dataset.suffix) {
      element.textContent = current + element.dataset.suffix;
    } else {
      element.textContent = current;
    }
    if (progress < 1) requestAnimationFrame(update);
  }
  requestAnimationFrame(update);
}



/* ── Toast ── */
function showToast(message) {
  const toast = document.querySelector('.toast');
  if (!toast) return;
  toast.textContent = message;
  toast.classList.add('show');
  setTimeout(() => toast.classList.remove('show'), 2500);
}

/* ── Cyberpunk Sound Effects (Web Audio API) ── */
let audioCtx = null;

function initAudio() {
  if (!audioCtx) {
    audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  }
}

function triggerHaptic(duration = 15) {
  if (navigator.vibrate) {
    navigator.vibrate(duration);
  }
}

function playCyberBlip() {
  if (!audioCtx) return;
  const osc = audioCtx.createOscillator();
  const gain = audioCtx.createGain();
  osc.type = 'square';
  osc.frequency.setValueAtTime(800, audioCtx.currentTime);
  osc.frequency.exponentialRampToValueAtTime(400, audioCtx.currentTime + 0.1);
  gain.gain.setValueAtTime(0.08, audioCtx.currentTime); // Increased volume
  gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.1);
  osc.connect(gain);
  gain.connect(audioCtx.destination);
  osc.start();
  osc.stop(audioCtx.currentTime + 0.1);
  triggerHaptic(10); // Light haptic tap
}

function playCyberClack() {
  if (!audioCtx) return;
  const osc = audioCtx.createOscillator();
  const gain = audioCtx.createGain();
  osc.type = 'sawtooth';
  osc.frequency.setValueAtTime(100, audioCtx.currentTime);
  osc.frequency.exponentialRampToValueAtTime(20, audioCtx.currentTime + 0.2);
  gain.gain.setValueAtTime(0.4, audioCtx.currentTime); // Increased volume
  gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.2);
  osc.connect(gain);
  gain.connect(audioCtx.destination);
  osc.start();
  osc.stop(audioCtx.currentTime + 0.2);
  triggerHaptic(30); // Heavy haptic clack
}

function initCyberSFX() {
  // Initialize audio context on first interaction to bypass browser autoplay blocks
  document.body.addEventListener('click', initAudio, { once: true });
  document.body.addEventListener('mousemove', initAudio, { once: true });

  const hoverElements = document.querySelectorAll('.nav-link, .btn, .card, .stat-card, .nav-card, .social-link');
  hoverElements.forEach(el => {
    el.addEventListener('mouseenter', () => {
      playCyberBlip();
    });
    // Add specific touch listener for immediate mobile feedback
    el.addEventListener('touchstart', () => {
      playCyberBlip();
    }, { passive: true });
  });

  // Attach clack to links that transition pages
  document.querySelectorAll('a[data-page]').forEach(link => {
    link.addEventListener('click', () => {
      playCyberClack();
    });
  });
}

/* ── Global 3D Card Tilt Effect ── */
function initCardTilt() {
  const cards = document.querySelectorAll('.card, .contact-card, .contact-form-card, .stat-card, .nav-card');
  
  cards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      
      const rotateX = ((y - centerY) / centerY) * -5; // max 5 deg rotation
      const rotateY = ((x - centerX) / centerX) * 5;
      
      card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`;
      card.style.transition = 'none'; // remove transition for smooth tracking
    });
    
    card.addEventListener('mouseleave', () => {
      card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) scale3d(1, 1, 1)';
      card.style.transition = 'transform 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94)'; // restore transition
    });
  });
}

/* ── Glitch Text Reveal (Decoding Effect) ── */
function initGlitchTextReveal() {
  const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789アァカサタナハマヤャラワガザダバパイィキシチニヒミリヰギジヂビピウゥクスツヌフムユュルグズブヅプ";
  const elements = document.querySelectorAll('.decode-text');
  
  elements.forEach(el => {
    // Store original text if not already stored
    if (!el.dataset.value) {
      el.dataset.value = el.innerText;
    }
    const originalText = el.dataset.value;
    
    el.addEventListener('mouseenter', () => {
      let iterations = 0;
      clearInterval(el.interval);
      
      el.interval = setInterval(() => {
        el.innerText = originalText.split("").map((letter, index) => {
          if (index < iterations) {
            return originalText[index];
          }
          // Preserve spaces
          if (letter === " ") return " ";
          return letters[Math.floor(Math.random() * letters.length)];
        }).join("");
        
        if (iterations >= originalText.length) {
          clearInterval(el.interval);
        }
        
        iterations += 1/3; // Speed of decoding
      }, 30);
    });
  });
}
