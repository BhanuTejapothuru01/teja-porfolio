/* ═══════════════════════════════════════════════════════════════
   CONTACT PAGE JS — Copy, 3D Tilt, Form Ripple
   ═══════════════════════════════════════════════════════════════ */

document.addEventListener('DOMContentLoaded', () => {
  initCopyButtons();
  initContactCardTilt();
  initFormSubmit();
});

/* ── Copy to Clipboard ── */
function initCopyButtons() {
  document.querySelectorAll('[data-copy]').forEach(btn => {
    btn.addEventListener('click', () => {
      const text = btn.dataset.copy;
      navigator.clipboard.writeText(text).then(() => {
        showToast('✅ Copied to clipboard!');
        btn.textContent = '✓';
        setTimeout(() => { btn.textContent = 'Copy'; }, 2000);
      }).catch(() => {
        showToast('Failed to copy');
      });
    });
  });
}

/* ── Contact Card 3D Tilt ── */
function initContactCardTilt() {
  const card = document.querySelector('.contact-card');
  if (!card) return;
  init3DTilt(card, card, 6);
}

/* ── Form Submit with Ripple ── */
function initFormSubmit() {
  const form = document.querySelector('.contact-form');
  const submitBtn = document.querySelector('.form-submit');
  if (!form || !submitBtn) return;

  // Ripple effect
  submitBtn.addEventListener('click', (e) => {
    const rect = submitBtn.getBoundingClientRect();
    const ripple = document.createElement('span');
    ripple.classList.add('ripple');
    ripple.style.left = (e.clientX - rect.left) + 'px';
    ripple.style.top = (e.clientY - rect.top) + 'px';
    submitBtn.appendChild(ripple);
    setTimeout(() => ripple.remove(), 600);
  });

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    submitBtn.classList.add('success');
    submitBtn.textContent = '✓ Message Sent!';
    showToast('✅ Message sent successfully!');
    
    setTimeout(() => {
      submitBtn.classList.remove('success');
      submitBtn.textContent = 'Send Message →';
      form.reset();
    }, 3000);
  });
}
