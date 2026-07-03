/* =============================================
   Wedding Invitation — Adit & Chintya
   SATU FILE JS untuk index.html & page2.html
   ============================================= */

/* =============================================
   INDEX.HTML — fungsi cover page
   ============================================= */

// Baca nama tamu dari URL param: ?to=Bapak+Ahmad
(function () {
  const el = document.getElementById('guestName');
  if (!el) return; // hanya jalan di index.html
  const params = new URLSearchParams(window.location.search);
  el.textContent = params.has('to') && params.get('to').trim() ? params.get('to') : 'nama tamu';
})();

// Tombol "Buka Undangan" → pindah ke page2.html
function bukaUndangan() {
  const params = new URLSearchParams(window.location.search);
  const dest = 'page.html' + (params.toString() ? '?' + params.toString() : '');
  window.location.href = dest;
}

/* =============================================
   PAGE2.HTML — scroll & animasi
   ============================================= */

// IntersectionObserver: animasi fade saat elemen masuk viewport
(function () {
  const items = document.querySelectorAll('.scroll-fade');
  if (!items.length) return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry, i) => {
        if (entry.isIntersecting) {
          // Delay bertahap antar elemen dalam satu section
          setTimeout(() => {
            entry.target.classList.add('visible');
          }, i * 120);
          observer.unobserve(entry.target);
        }
      });
    },
    {
      threshold: 0.15,
    },
  );

  items.forEach((el) => observer.observe(el));
})();

// Tombol "Save the date" → scroll ke section berikutnya
function scrollToNext(btn) {
  const currentSection = btn.closest('.section');
  const nextSection = currentSection?.nextElementSibling;
  if (nextSection) {
    nextSection.scrollIntoView({ behavior: 'smooth' });
  }
}

// =============================================
// SECTION 4 — Countdown to Wedding Day
// Target: 08 Agustus 2026, jam 08:00 WIB (UTC+7)
// =============================================
function updateCountdown() {
  // Jam 08:00 pagi WIB = 01:00 UTC
  const weddingDate = new Date('2026-08-08T01:00:00Z');
  const now = new Date();
  const diff = weddingDate - now;

  if (diff <= 0) {
    // Hari H sudah tiba
    document.getElementById('days').textContent = '00';
    document.getElementById('hours').textContent = '00';
    document.getElementById('minutes').textContent = '00';
    document.getElementById('seconds').textContent = '00';
    return;
  }

  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((diff % (1000 * 60)) / 1000);

  document.getElementById('days').textContent = String(days).padStart(2, '0');
  document.getElementById('hours').textContent = String(hours).padStart(2, '0');
  document.getElementById('minutes').textContent = String(minutes).padStart(2, '0');
  document.getElementById('seconds').textContent = String(seconds).padStart(2, '0');
}

// Jalankan sekali langsung, lalu tiap 1 detik
updateCountdown();
setInterval(updateCountdown, 1000);

// =============================================
// Scroll Fade — IntersectionObserver
// Covers: .scroll-fade dan bunga pojok section 6
// =============================================
const scrollTargets = document.querySelectorAll('.scroll-fade, .story-flower-topleft, .story-flower-topright');

const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const el = entry.target;
        const delay = el.style.getPropertyValue('--delay') || '0s';

        // Terapkan delay sebelum tambah class visible
        setTimeout(
          () => {
            el.classList.add('visible');
          },
          parseFloat(delay) * 1000,
        );

        observer.unobserve(el); // animasi hanya sekali
      }
    });
  },
  { threshold: 0.15 },
);

scrollTargets.forEach((el) => observer.observe(el));

// =============================================
// SECTION 9 — Wedding Gift
// =============================================

// Toggle show/hide cards
function toggleGiftCards() {
  const cards = document.getElementById('giftCards');
  const btn = document.getElementById('giftToggleBtn');
  const isOpen = cards.classList.contains('open');

  cards.classList.toggle('open');
  btn.textContent = isOpen ? 'Klik Disini' : 'Sembunyikan';

  // Trigger scroll-fade untuk card yang baru muncul
  if (!isOpen) {
    cards.querySelectorAll('.scroll-fade').forEach((el, i) => {
      setTimeout(() => el.classList.add('visible'), i * 120);
    });
  }
}

// Copy nomor rekening ke clipboard
function copyAccount(btn) {
  const number = btn.getAttribute('data-number');

  navigator.clipboard
    .writeText(number)
    .then(() => {
      // Animasi tombol
      btn.classList.add('copied');
      setTimeout(() => btn.classList.remove('copied'), 600);

      // Tampilkan toast
      showGiftToast();
    })
    .catch(() => {
      // Fallback untuk browser lama
      const el = document.createElement('textarea');
      el.value = number;
      el.style.position = 'fixed';
      el.style.opacity = '0';
      document.body.appendChild(el);
      el.select();
      document.execCommand('copy');
      document.body.removeChild(el);

      btn.classList.add('copied');
      setTimeout(() => btn.classList.remove('copied'), 600);
      showGiftToast();
    });
}

// =============================================
// PARALLAX — Section 4 church background
// =============================================

function initParallax() {
  const church = document.querySelector('.save-date .church');
  if (!church) return;

  // Hitung posisi section
  const section = church.closest('.save-date');

  window.addEventListener(
    'scroll',
    () => {
      const rect = section.getBoundingClientRect();
      const inView = rect.bottom > 0 && rect.top < window.innerHeight;
      if (!inView) return;

      // Seberapa jauh section sudah discroll (0 = atas viewport, 1 = bawah)
      const progress = -rect.top / (rect.height + window.innerHeight);
      // Geser background -10% sampai +10%
      const offset = progress * 80; // px
      church.style.transform = `translateY(${offset}px)`;
    },
    { passive: true },
  );
}

// Tampilkan toast "Nomor disalin!"
function showGiftToast() {
  const toast = document.getElementById('giftToast');
  toast.classList.add('show');
  setTimeout(() => toast.classList.remove('show'), 2200);
}

// =============================================
// SECTION 9 — RSVP & Ucapan (localStorage)
// =============================================

const RSVP_KEY = 'wedding_rsvp_adit_chintya';

// Muat data saat halaman dibuka
document.addEventListener('DOMContentLoaded', () => {
  renderRSVPList();
  updateRSVPCounters();
  initParallax();
});

// Submit form
function submitRSVP() {
  const nama = document.getElementById('rsvpNama').value.trim();
  const ucapan = document.getElementById('rsvpUcapan').value.trim();
  const kehadiran = document.getElementById('rsvpKehadiran').value;
  const errorEl = document.getElementById('rsvpError');

  // Validasi
  if (!nama) {
    showRSVPError('Nama tidak boleh kosong.');
    return;
  }
  if (!ucapan) {
    showRSVPError('Ucapan tidak boleh kosong.');
    return;
  }
  if (!kehadiran) {
    showRSVPError('Pilih konfirmasi kehadiran.');
    return;
  }
  errorEl.textContent = '';

  // Simpan ke localStorage
  const data = getRSVPData();
  data.push({
    nama,
    ucapan,
    kehadiran,
    waktu: new Date().toLocaleString('id-ID', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }),
  });
  localStorage.setItem(RSVP_KEY, JSON.stringify(data));

  // Reset form
  document.getElementById('rsvpNama').value = '';
  document.getElementById('rsvpUcapan').value = '';
  document.getElementById('rsvpKehadiran').value = '';

  // Ripple animasi tombol
  addRSVPRipple(document.getElementById('rsvpSubmitBtn'));

  // Update UI
  renderRSVPList();
  updateRSVPCounters();

  // Scroll list ke atas supaya entry terbaru terlihat
  const wrap = document.getElementById('rsvpListWrap');
  wrap.scrollTo({ top: 0, behavior: 'smooth' });
}

// Ambil data dari localStorage
function getRSVPData() {
  try {
    return JSON.parse(localStorage.getItem(RSVP_KEY)) || [];
  } catch {
    return [];
  }
}

// Render list ucapan (terbaru di atas)
function renderRSVPList() {
  const list = document.getElementById('rsvpList');
  const wrap = document.getElementById('rsvpListWrap');
  const data = getRSVPData().slice().reverse(); // terbaru di atas

  if (data.length === 0) {
    list.innerHTML = '';
    wrap.style.display = 'none';
    return;
  }

  wrap.style.display = 'block';
  list.innerHTML = data
    .map(
      (item, i) => `
    <div class="rsvp-item" style="animation-delay: ${i * 0.05}s">
      <div class="rsvp-item-header">
        <span class="rsvp-item-name">${escapeHTML(item.nama)}</span>
        <span class="rsvp-item-badge ${item.kehadiran}">
          ${item.kehadiran === 'hadir' ? '✓ Hadir' : '✗ Tidak Hadir'}
        </span>
      </div>
      <p class="rsvp-item-msg">${escapeHTML(item.ucapan)}</p>
      <span class="rsvp-item-time">${item.waktu}</span>
    </div>
  `,
    )
    .join('');
}

// Update counter angka hadir / tidak hadir
function updateRSVPCounters() {
  const data = getRSVPData();
  const hadir = data.filter((d) => d.kehadiran === 'hadir').length;
  const tidak = data.filter((d) => d.kehadiran === 'tidak').length;

  animateCounter('countHadir', hadir);
  animateCounter('countTidak', tidak);
}

// Animasi bump angka counter
function animateCounter(id, value) {
  const el = document.getElementById(id);
  el.textContent = value;
  el.classList.remove('bump');
  void el.offsetWidth; // reflow trigger
  el.classList.add('bump');
  setTimeout(() => el.classList.remove('bump'), 300);
}

// Tampilkan error
function showRSVPError(msg) {
  const el = document.getElementById('rsvpError');
  el.textContent = msg;
  el.style.opacity = '0';
  requestAnimationFrame(() => {
    el.style.opacity = '1';
  });
  setTimeout(() => {
    el.textContent = '';
  }, 3000);
}

// Ripple pada tombol kirim
function addRSVPRipple(btn) {
  const ripple = document.createElement('span');
  ripple.classList.add('ripple');
  const size = Math.max(btn.offsetWidth, btn.offsetHeight);
  ripple.style.cssText = `width:${size}px;height:${size}px;
    left:${btn.offsetWidth / 2 - size / 2}px;
    top:${btn.offsetHeight / 2 - size / 2}px`;
  btn.appendChild(ripple);
  setTimeout(() => ripple.remove(), 600);
}

// Escape HTML untuk keamanan
function escapeHTML(str) {
  return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#039;');
}

// Tambahkan ke daftar scrollTargets yang sudah ada sebelumnya
const extraTargets = document.querySelectorAll('.closing-flower-left, .closing-flower-right');
extraTargets.forEach((el) => observer.observe(el));

// =============================================
// MUSIK
// =============================================

let music = null;
let musicBtn = null;
let isPlaying = false;

// Jalankan otomatis saat page.html dibuka
document.addEventListener('DOMContentLoaded', () => {
  music = document.getElementById('bgMusic');
  musicBtn = document.getElementById('musicBtn');

  // Tampilkan tombol musik
  setTimeout(() => {
    musicBtn.classList.add('visible');
  }, 800);

  // Langsung putar musik
  playMusic();

  // Scroll observer untuk animasi
  initScrollObserver();
});

// ── Musik ──────────────────────────────────────

function playMusic() {
  music.volume = 0;
  music
    .play()
    .then(() => {
      isPlaying = true;
      musicBtn.classList.add('playing');
      musicBtn.classList.remove('paused');
      fadeVolume(0, 0.6, 1500);
    })
    .catch((err) => {
      // Autoplay diblokir browser — user bisa klik icon musiknya manual
      console.warn('Autoplay diblokir, klik icon musik untuk memutar.', err);
    });
}

function toggleMusic() {
  if (isPlaying) {
    fadeVolume(music.volume, 0, 600, () => {
      music.pause();
      isPlaying = false;
      musicBtn.classList.remove('playing');
      musicBtn.classList.add('paused');
    });
  } else {
    music.play().then(() => {
      isPlaying = true;
      musicBtn.classList.add('playing');
      musicBtn.classList.remove('paused');
      fadeVolume(0, 0.6, 800);
    });
  }
}

function fadeVolume(from, to, duration, callback) {
  const steps = 30;
  const interval = duration / steps;
  const delta = (to - from) / steps;
  let current = from;
  let count = 0;

  music.volume = Math.min(1, Math.max(0, from));

  const timer = setInterval(() => {
    count++;
    current += delta;
    music.volume = Math.min(1, Math.max(0, current));

    if (count >= steps) {
      clearInterval(timer);
      music.volume = Math.min(1, Math.max(0, to));
      if (callback) callback();
    }
  }, interval);
}
