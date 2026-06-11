// Scroll reveal
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      e.target.classList.add('visible');
      revealObserver.unobserve(e.target);
    }
  });
}, { threshold: 0.12 });
document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));

// Counter animation
function animateCount(el) {
  const target = parseInt(el.dataset.counter);
  const suffix = el.dataset.suffix || '';
  if (isNaN(target) || target === 0) { el.innerHTML = '0' + suffix; return; }
  const duration = 1600;
  let startTs = null;
  const tick = (ts) => {
    if (!startTs) startTs = ts;
    const p = Math.min((ts - startTs) / duration, 1);
    const ease = 1 - Math.pow(1 - p, 3);
    el.innerHTML = Math.round(ease * target) + suffix;
    if (p < 1) requestAnimationFrame(tick);
  };
  requestAnimationFrame(tick);
}
const counterObserver = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      animateCount(e.target);
      counterObserver.unobserve(e.target);
    }
  });
}, { threshold: 0.5 });
document.querySelectorAll('[data-counter]').forEach(el => counterObserver.observe(el));

// Sticky nav
const nav = document.getElementById('nav');
window.addEventListener('scroll', () => {
  nav.classList.toggle('scrolled', window.scrollY > 60);
});

// Burger menu (mobile) — toggle class on nav
const burger = document.getElementById('burger');
burger?.addEventListener('click', () => {
  nav.classList.toggle('nav--open');
});
// Close menu when any link is clicked
document.querySelectorAll('.nav__links a').forEach(a => {
  a.addEventListener('click', () => nav.classList.remove('nav--open'));
});
// Close on outside click
document.addEventListener('click', e => {
  if (!nav.contains(e.target)) nav.classList.remove('nav--open');
});

async function sendToBitrix(title, name, phone, comment) {
  const res = await fetch('/.netlify/functions/submit-lead', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ title, name, phone, comment }),
  });
  if (!res.ok) throw new Error('submit failed');
}

// Форма на главной
document.getElementById('contact-form')?.addEventListener('submit', async e => {
  e.preventDefault();
  const btn = e.target.querySelector('button[type=submit]');
  const inputs = e.target.querySelectorAll('input, textarea');
  const name = inputs[0]?.value || '';
  const phone = inputs[1]?.value || '';
  const comment = inputs[2]?.value || '';
  btn.textContent = 'Отправляем...';
  btn.disabled = true;
  try {
    await sendToBitrix('Заявка с сайта (главная)', name, phone, comment);
    btn.textContent = 'Заявка отправлена ✓';
    btn.style.background = '#2d5a3d';
  } catch {
    btn.textContent = 'Ошибка, попробуйте ещё раз';
    btn.disabled = false;
  }
});
