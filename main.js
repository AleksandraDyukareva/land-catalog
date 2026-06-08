// Sticky nav
const nav = document.getElementById('nav');
window.addEventListener('scroll', () => {
  nav.classList.toggle('scrolled', window.scrollY > 60);
});

// Burger menu (mobile)
document.getElementById('burger')?.addEventListener('click', () => {
  const links = document.querySelector('.nav__links');
  links.style.display = links.style.display === 'flex' ? 'none' : 'flex';
  links.style.flexDirection = 'column';
  links.style.position = 'absolute';
  links.style.top = '72px';
  links.style.left = '0';
  links.style.right = '0';
  links.style.background = 'var(--dark)';
  links.style.padding = '20px 32px';
  links.style.gap = '16px';
});

// Contact form — заглушка
document.getElementById('contact-form')?.addEventListener('submit', e => {
  e.preventDefault();
  const btn = e.target.querySelector('button[type=submit]');
  btn.textContent = 'Заявка отправлена ✓';
  btn.disabled = true;
  btn.style.background = '#2d5a3d';
});
