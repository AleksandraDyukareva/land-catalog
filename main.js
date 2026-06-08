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

// Contact form — заглушка
document.getElementById('contact-form')?.addEventListener('submit', e => {
  e.preventDefault();
  const btn = e.target.querySelector('button[type=submit]');
  btn.textContent = 'Заявка отправлена ✓';
  btn.disabled = true;
  btn.style.background = '#2d5a3d';
});
