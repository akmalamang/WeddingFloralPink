// =============================================
// AMBIL NAMA TAMU DARI URL PATH
// =============================================

document.addEventListener('DOMContentLoaded', () => {
  const guestEl = document.getElementById('guestName');
  if (!guestEl) return;

  // Ambil path terakhir dari URL
  // misal: /andri           → "andri"
  // misal: /budi-santoso    → "budi-santoso"
  // misal: /                → "" (kosong = tamu umum)
  const path = window.location.pathname;
  const segments = path.split('/').filter(Boolean); // hapus string kosong
  const rawName = segments[segments.length - 1] || '';

  if (rawName) {
    // Ubah tanda hubung jadi spasi, capitalize tiap kata
    // "budi-santoso" → "Budi Santoso"
    const formatted = rawName
      .split('-')
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(' ');

    guestEl.textContent = formatted;
  } else {
    // Tidak ada nama di URL — tampilkan teks default
    guestEl.textContent = 'Tamu Undangan';
  }
});

// =============================================
// BUKA UNDANGAN — redirect ke page.html
// =============================================

function bukaUndangan() {
  // Bawa nama tamu ke page.html via query string
  // supaya page.html juga bisa tampilkan nama jika perlu
  const path = window.location.pathname;
  const segments = path.split('/').filter(Boolean);
  const rawName = segments[segments.length - 1] || '';

  const target = rawName ? `page.html?to=${encodeURIComponent(rawName)}` : 'page.html';

  window.location.href = target;
}
