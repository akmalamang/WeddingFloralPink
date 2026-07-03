document.addEventListener('DOMContentLoaded', () => {
  const guestEl = document.getElementById('guestName');
  if (!guestEl) return;

  const path = window.location.pathname;
  const segments = path.split('/').filter(Boolean);
  const rawName = segments[segments.length - 1] || '';

  // Filter: jangan baca "index.html" atau "page.html" sebagai nama
  const ignored = ['index.html', 'page.html', ''];
  if (rawName && !ignored.includes(rawName)) {
    guestEl.textContent = rawName
      .split('-')
      .map((w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
      .join(' ');
  } else {
    guestEl.textContent = 'Tamu Undangan';
  }
});

function bukaUndangan() {
  const path = window.location.pathname;
  const segments = path.split('/').filter(Boolean);
  const rawName = segments[segments.length - 1] || '';
  const ignored = ['index.html', 'page.html', ''];

  const target = rawName && !ignored.includes(rawName) ? `page.html?to=${encodeURIComponent(rawName)}` : 'page.html';

  window.location.href = target;
}
