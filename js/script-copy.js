/* =============================================
   Wedding Invitation — Adit & Chintya
   UNIFIED ANIMATION SYSTEM
   - Semua animasi via IntersectionObserver
   - Tidak ada animasi jalan sebelum elemen terlihat
   - Parallax di semua section background gedung
   ============================================= */

/* =============================================
   1. NAMA TAMU — baca dari URL path atau ?to=
   ============================================= */
(function () {
  const el = document.getElementById('guestName');
  if (!el) return;

  // Coba dari path dulu: /andri
  const segments = window.location.pathname.split('/').filter(Boolean);
  const fromPath = segments[segments.length - 1] || '';

  // Fallback ke ?to=
  const params = new URLSearchParams(window.location.search);
  const fromQuery = params.get('to') || '';

  const raw = fromPath || fromQuery;

  if (raw && raw !== 'index.html' && raw !== 'page.html') {
    el.textContent = raw
      .split('-')
      .map((w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
      .join(' ');
  } else {
    el.textContent = 'Tamu Undangan';
  }
})();

/* =============================================
   2. COVER — Buka Undangan
   ============================================= */
function bukaUndangan() {
  const params = new URLSearchParams(window.location.search);
  const path = window.location.pathname;
  const seg = path.split('/').filter(Boolean);
  const name = seg[seg.length - 1] || '';

  let dest = 'page.html';
  if (name && name !== 'index.html') {
    dest += '?to=' + encodeURIComponent(name);
  } else if (params.toString()) {
    dest += '?' + params.toString();
  }
  window.location.href = dest;
}

/* =============================================
   3. SCROLL TO NEXT SECTION
   ============================================= */
function scrollToNext(btn) {
  const next = btn.closest('.section')?.nextElementSibling;
  if (next) next.scrollIntoView({ behavior: 'smooth' });
}

/* =============================================
   4. COUNTDOWN
   ============================================= */
(function initCountdown() {
  const ids = ['days', 'hours', 'minutes', 'seconds'];
  if (!document.getElementById('days')) return;

  function update() {
    const diff = new Date('2026-08-08T01:00:00Z') - new Date();
    if (diff <= 0) {
      ids.forEach((id) => (document.getElementById(id).textContent = '00'));
      return;
    }
    const v = [Math.floor(diff / 86400000), Math.floor((diff % 86400000) / 3600000), Math.floor((diff % 3600000) / 60000), Math.floor((diff % 60000) / 1000)];
    ids.forEach((id, i) => (document.getElementById(id).textContent = String(v[i]).padStart(2, '0')));
  }
  update();
  setInterval(update, 1000);
})();

/* =============================================
   5. UNIFIED INTERSECTION OBSERVER
   Menggantikan semua CSS animation langsung
   ============================================= */
document.addEventListener('DOMContentLoaded', () => {
  // ── 5a. Kumpulkan semua target animasi ──────
  const targets = new Set();

  // Elemen scroll-fade global
  document.querySelectorAll('.scroll-fade').forEach((el) => targets.add(el));

  // Elemen khusus per-section yang punya transisi CSS sendiri
  const specialSelectors = [
    // Section 1 — savedate
    '.deco-top',
    '.deco-bottom',
    '.butterfly',
    '.savedate__arch-bg',
    // Section 2
    '.s2-deco-top',
    '.s2-gold-tr',
    '.s2-gold-bl',
    '.s2-flower-top',
    '.s2-butterfly',
    '.s2-corner-bl',
    '.s2-corner-br',
    '.s2-frame',
    // Section 3
    '.s3-deco-top',
    '.s3-butterfly--1',
    '.s3-title',
    '.s3-desc',
    '.s3-couple-row',
    '.s3-ampersand',
    // Section 4 — save the date
    '.church',
    '.flower-top',
    '.frame',
    '.save-date h2',
    '.countdown',
    '.flower-bottom',
    // Section 5 & 6 — akad/resepsi
    '.akad-flower-topleft',
    '.akad-flower-topright',
    '.akad-flower-botleft',
    '.akad-flower-botright',
    '.akad-card',
    '.akad-flower-bottom',
    // Section 7 — lovely story
    '.story-flower-topleft',
    '.story-flower-topright',
    '.story-title',
    '.story-frame-wrap',
    // Section 8 — gallery
    '.gallery-title',
    '.gallery-flower-bottom',
    // Section 9 — gift
    '.gift-title',
    '.gift-desc',
    '.gift-toggle-btn',
    '.gift-flower-bottom',
    // Section 10 — rsvp
    '.rsvp-card',
    // Section 11 — closing
    '.closing-flower-left',
    '.closing-flower-right',
    '.closing-frame-area',
    '.closing-text',
    '.closing-names',
    '.closing-flower-bottom',
  ];

  specialSelectors.forEach((sel) => {
    document.querySelectorAll(sel).forEach((el) => targets.add(el));
  });

  // ── 5b. Set state awal semua target ──────────
  // (override CSS animation agar tidak jalan duluan)
  targets.forEach((el) => {
    // Skip elemen yang sudah punya class visible
    if (el.classList.contains('visible')) return;

    // Matikan CSS animation bawaan, pakai transition saja
    el.style.animationName = 'none';
    el.style.animationDuration = '0s';
    el.style.animationDelay = '0s';

    // Pastikan opacity 0 dan transform awal sesuai tipe elemen
    const type = getAnimType(el);
    applyInitState(el, type);
  });

  // ── 5c. Observer ────────────────────────────
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;

        const el = entry.target;
        const delay = getDelay(el);

        setTimeout(() => {
          el.style.animationName = '';
          el.style.animationDuration = '';
          el.style.animationDelay = '';
          triggerVisible(el);
        }, delay);

        observer.unobserve(el);
      });
    },
    { threshold: 0.12, rootMargin: '0px 0px -40px 0px' },
  );

  targets.forEach((el) => observer.observe(el));

  // ── 5d. Stagger countdown boxes ─────────────
  const countdown = document.querySelector('.countdown');
  if (countdown) {
    const boxObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          entry.target.querySelectorAll('.box').forEach((box, i) => {
            box.style.animationName = 'none';
            box.style.animationDuration = '0s';
            applyInitState(box, 'scaleUp');
            setTimeout(() => triggerVisible(box), 100 + i * 150);
          });
          boxObserver.unobserve(entry.target);
        });
      },
      { threshold: 0.2 },
    );
    boxObserver.observe(countdown);
  }

  // ── 5e. Parallax semua .arch-bg & .church ───
  initAllParallax();

  // ── 5f. Music & RSVP init ───────────────────
  initMusic();
  initRSVP();
});

/* =============================================
   6. HELPER: tentukan tipe animasi per elemen
   ============================================= */
function getAnimType(el) {
  // Slide dari atas
  if (el.matches('.deco-top, .s2-deco-top, .s3-deco-top, .flower-top')) return 'slideDown';

  // Slide dari bawah
  if (el.matches('.deco-bottom, .flower-bottom, .akad-flower-bottom, .gallery-flower-bottom, .gift-flower-bottom, .closing-flower-bottom')) return 'slideUp';

  // Slide dari kiri
  if (el.matches('.story-flower-topleft, .closing-flower-left, .s2-corner-bl, .s2-gold-bl, .akad-flower-topleft, .akad-flower-botleft')) return 'slideLeft';

  // Slide dari kanan
  if (el.matches('.story-flower-topright, .closing-flower-right, .s2-corner-br, .s2-gold-tr, .akad-flower-topright, .akad-flower-botright')) return 'slideRight';

  // Scale in
  if (el.matches('.frame, .akad-card, .rsvp-card, .s2-frame')) return 'scaleUp';

  // Float (butterfly)
  if (el.matches('.butterfly, .s2-butterfly, .s3-butterfly--1')) return 'float';

  // Fade only (background)
  if (el.matches('.church, .savedate__arch-bg, .s2-arch-bg, .s3-arch-bg, .akad-church, .story-church, .gallery-church, .gift-church, .rsvp-church, .closing-church')) return 'fadeOnly';

  // Default: fadeUp
  return 'fadeUp';
}

/* =============================================
   7. HELPER: apply initial hidden state
   ============================================= */
function applyInitState(el, type) {
  el.style.transition = '';
  el.style.opacity = '0';

  switch (type) {
    case 'slideDown':
      el.style.transform = 'translateY(-32px)';
      break;
    case 'slideUp':
      el.style.transform = 'translateY(32px)';
      break;
    case 'slideLeft':
      el.style.transform = 'translateX(-32px)';
      break;
    case 'slideRight':
      el.style.transform = 'translateX(32px)';
      break;
    case 'scaleUp':
      el.style.transform = 'scale(0.88) translateY(16px)';
      break;
    case 'float':
      el.style.transform = 'translateY(0)';
      break;
    case 'fadeOnly':
      el.style.transform = 'none';
      break;
    default:
      el.style.transform = 'translateY(24px)';
      break; // fadeUp
  }
}

/* =============================================
   8. HELPER: trigger visible (tambah transition, reset transform)
   ============================================= */
function triggerVisible(el) {
  const type = getAnimType(el);

  // Pilih easing sesuai tipe
  const ease = type === 'scaleUp' ? 'cubic-bezier(0.34, 1.56, 0.64, 1)' : 'cubic-bezier(0.25, 0.46, 0.45, 0.94)';

  const dur = type === 'fadeOnly' ? '1.2s' : '0.85s';

  el.style.transition = `opacity ${dur} ${ease}, transform ${dur} ${ease}`;
  el.style.opacity = '1';
  el.style.transform = type === 'scaleUp' ? 'scale(1) translateY(0)' : 'none';

  el.classList.add('visible');

  // Post-visible: tambah float animation untuk butterfly
  if (type === 'float') {
    setTimeout(() => {
      el.style.animation = 'floatButterfly 4s ease-in-out infinite';
    }, 850);
  }

  // Post-visible: float frame foto section 4
  if (el.matches('.frame')) {
    setTimeout(() => {
      el.style.animation = 'floatFrame 5s ease-in-out infinite';
    }, 900);
  }

  // Post-visible: pulse box detik
  if (el.matches('.box:last-child, .box:nth-child(4)')) {
    setTimeout(() => {
      el.style.animation = 'boxPulse 1s ease-in-out infinite';
    }, 500);
  }
}

/* =============================================
   9. HELPER: hitung delay (ms) per elemen
   ============================================= */
function getDelay(el) {
  // Dari CSS custom property --delay
  const cssDelay = el.style.getPropertyValue('--delay');
  if (cssDelay) return parseFloat(cssDelay) * 1000;

  // Delay berbeda per tipe
  if (el.matches('.deco-top, .s2-deco-top, .s3-deco-top')) return 0;
  if (el.matches('.savedate__arch-bg, .s2-arch-bg, .s3-arch-bg, .church, .akad-church')) return 0;
  if (el.matches('.deco-bottom')) return 100;
  if (el.matches('.s2-gold-tr')) return 200;
  if (el.matches('.s2-gold-bl')) return 250;
  if (el.matches('.s2-flower-top')) return 300;
  if (el.matches('.s2-corner-bl')) return 150;
  if (el.matches('.s2-corner-br')) return 200;
  if (el.matches('.s2-butterfly')) return 400;
  if (el.matches('.butterfly--1')) return 0;
  if (el.matches('.butterfly--2')) return 150;
  if (el.matches('.butterfly--3')) return 300;
  if (el.matches('.butterfly--4')) return 450;
  if (el.matches('.akad-flower-topleft')) return 0;
  if (el.matches('.akad-flower-topright')) return 150;
  if (el.matches('.akad-flower-botleft')) return 200;
  if (el.matches('.akad-flower-botright')) return 250;
  if (el.matches('.akad-card')) return 200;
  if (el.matches('.akad-flower-bottom')) return 300;
  if (el.matches('.story-flower-topleft')) return 0;
  if (el.matches('.story-flower-topright')) return 150;
  if (el.matches('.closing-flower-left')) return 100;
  if (el.matches('.closing-flower-right')) return 200;

  return 0;
}

/* =============================================
   10. PARALLAX — semua background gedung
   ============================================= */
function initAllParallax() {
  const pairs = [
    // Section 1-3: centered (left:50%, top:50%)
    { secSel: '.section--savedate', bgSel: '.savedate__arch-bg', centered: true },
    { secSel: '.section--s2', bgSel: '.s2-arch-bg', centered: true },
    { secSel: '.section--s3', bgSel: '.s3-arch-bg', centered: true },
    // Section 4-11: full width (top:0, left:0)
    { secSel: '.save-date', bgSel: '.church', centered: false },
    { secSel: '.akad-nikah', bgSel: '.akad-church', centered: false },
    { secSel: '.lovely-story', bgSel: '.story-church', centered: false },
    { secSel: '.gallery', bgSel: '.gallery-church', centered: false },
    { secSel: '.wedding-gift', bgSel: '.gift-church', centered: false },
    { secSel: '.rsvp-section', bgSel: '.rsvp-church', centered: false },
    { secSel: '.closing', bgSel: '.closing-church', centered: false },
  ];

  const activePairs = pairs.flatMap(({ secSel, bgSel, centered }) =>
    [...document.querySelectorAll(secSel)]
      .map((sec) => ({
        sec,
        bg: sec.querySelector(bgSel),
        centered,
      }))
      .filter((p) => p.bg),
  );

  if (!activePairs.length) return;

  let ticking = false;

  function onScroll() {
    if (ticking) return;
    ticking = true;

    requestAnimationFrame(() => {
      activePairs.forEach(({ sec, bg, centered }) => {
        const rect = sec.getBoundingClientRect();
        const inView = rect.bottom > 0 && rect.top < window.innerHeight;
        if (!inView) {
          ticking = false;
          return;
        }

        const progress = -rect.top / (rect.height + window.innerHeight);
        const offset = progress * 60;

        if (centered) {
          // Elemen ini pakai left:50%, top:50% untuk centering
          // HARUS selalu include -50%,-50% agar tidak geser
          bg.style.transform = `translate(-50%, calc(-50% + ${offset}px))`;
        } else {
          // Elemen full width, cukup translateY
          bg.style.transform = `translateY(${offset}px)`;
        }
      });

      ticking = false;
    });
  }

  window.addEventListener('scroll', onScroll, { passive: true });

  // Set posisi awal TANPA dispatchEvent
  // — langsung panggil manual agar tidak race condition
  activePairs.forEach(({ bg, centered }) => {
    if (centered) {
      bg.style.transform = 'translate(-50%, -50%)';
    } else {
      bg.style.transform = 'translateY(0px)';
    }
  });
}

/* =============================================
   11. WEDDING GIFT
   ============================================= */
function toggleGiftCards() {
  const cards = document.getElementById('giftCards');
  const btn = document.getElementById('giftToggleBtn');
  if (!cards || !btn) return;

  const isOpen = cards.classList.contains('open');
  cards.classList.toggle('open');
  btn.textContent = isOpen ? 'Klik Disini' : 'Sembunyikan';

  if (!isOpen) {
    cards.querySelectorAll('.gift-card').forEach((el, i) => {
      applyInitState(el, 'scaleUp');
      setTimeout(() => triggerVisible(el), i * 150);
    });
  }
}

function copyAccount(btn) {
  const number = btn.getAttribute('data-number');
  const doSuccess = () => {
    btn.classList.add('copied');
    setTimeout(() => btn.classList.remove('copied'), 600);
    showGiftToast();
  };

  if (navigator.clipboard) {
    navigator.clipboard
      .writeText(number)
      .then(doSuccess)
      .catch(() => fallbackCopy(number, doSuccess));
  } else {
    fallbackCopy(number, doSuccess);
  }
}

function fallbackCopy(text, cb) {
  const el = document.createElement('textarea');
  el.value = text;
  el.style.cssText = 'position:fixed;opacity:0';
  document.body.appendChild(el);
  el.select();
  document.execCommand('copy');
  document.body.removeChild(el);
  if (cb) cb();
}

function showGiftToast() {
  const toast = document.getElementById('giftToast');
  if (!toast) return;
  toast.classList.add('show');
  setTimeout(() => toast.classList.remove('show'), 2200);
}

/* =============================================
   12. RSVP
   ============================================= */
const RSVP_KEY = 'wedding_rsvp_adit_chintya';
const API_URL = 'https://script.google.com/macros/s/AKfycbx-6VnF_4n8rcn6LlMGzH9LAZar5hV5nf-o5JUzJYnx1EnhVxqN-rRc_bXUmbFwoVHcxg/exec';
const ITEMS_PER_PAGE = 3;

let currentPage = 1;

let allRSVP = [];

function initRSVP() {
  if (!document.getElementById('rsvpList')) return;
  loadRSVP();
}

function showToast(message) {
  const toast = document.getElementById('toast');

  toast.textContent = message;

  toast.classList.add('show');

  setTimeout(() => {
    toast.classList.remove('show');
  }, 3000);
}

async function submitRSVP() {
  const nama = document.getElementById('rsvpNama').value.trim();
  const ucapan = document.getElementById('rsvpUcapan').value.trim();
  const kehadiran = document.getElementById('rsvpKehadiran').value;
  const errorEl = document.getElementById('rsvpError');
  const btn = document.getElementById('rsvpSubmitBtn');

  const lastSubmit = localStorage.getItem('last_submit');

  if (lastSubmit) {
    const diff = Date.now() - Number(lastSubmit);

    if (diff < 30000) {
      showRSVPError('Mohon tunggu 30 detik sebelum mengirim lagi.');

      return;
    }
  }

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

  try {
    btn.disabled = true;
    btn.classList.add('loading');
    btn.textContent = 'Mengirim...';
    const response = await fetch(API_URL, {
      method: 'POST',
      body: JSON.stringify({
        nama,
        ucapan,
        kehadiran,
      }),
    });

    const result = await response.json();

    if (result.success) {
      document.getElementById('rsvpNama').value = '';
      document.getElementById('rsvpUcapan').value = '';
      document.getElementById('rsvpKehadiran').value = '';

      addRSVPRipple(document.getElementById('rsvpSubmitBtn'));
      btn.disabled = false;
      btn.classList.remove('loading');
      btn.textContent = 'Kirim';

      loadRSVP();
      showToast('Terima kasih atas doa dan konfirmasi kehadiran Anda ❤️');
      localStorage.setItem('last_submit', Date.now());
    }
  } catch (err) {
    console.error(err);
    btn.disabled = false;
    btn.classList.remove('loading');
    btn.textContent = 'Kirim';

    showRSVPError('Gagal mengirim RSVP');
  }

  document.getElementById('rsvpNama').value = '';
  document.getElementById('rsvpUcapan').value = '';
  document.getElementById('rsvpKehadiran').value = '';

  addRSVPRipple(document.getElementById('rsvpSubmitBtn'));
  renderRSVPList();
  updateRSVPCounters();
  document.getElementById('rsvpListWrap')?.scrollTo({ top: 0, behavior: 'smooth' });
}

async function loadRSVP() {
  const response = await fetch(API_URL);

  const data = await response.json();

  data.sort((a, b) => new Date(b.waktu) - new Date(a.waktu));

  allRSVP = data;

  renderCurrentPage();
}

function renderCurrentPage() {
  const start = (currentPage - 1) * ITEMS_PER_PAGE;

  const end = start + ITEMS_PER_PAGE;

  const pageData = allRSVP.slice(start, end);

  renderRSVPList(pageData);

  updateRSVPCounters(allRSVP);

  renderPagination();
}

function renderPagination() {
  const pagination = document.getElementById('rsvpPagination');

  if (!pagination) return;

  const totalPages = Math.ceil(allRSVP.length / ITEMS_PER_PAGE);

  if (totalPages <= 1) {
    pagination.innerHTML = '';

    return;
  }

  let html = '';

  html += `
<button
class="page-btn"
${currentPage === 1 ? 'disabled' : ''}
onclick="changePage(${currentPage - 1})">
‹
</button>
`;

  for (let i = 1; i <= totalPages; i++) {
    html += `
<button
class="page-btn ${i === currentPage ? 'active' : ''}"
onclick="changePage(${i})">
${i}
</button>
`;
  }

  html += `
<button
class="page-btn"
${currentPage === totalPages ? 'disabled' : ''}
onclick="changePage(${currentPage + 1})">
›
</button>
`;

  pagination.innerHTML = html;
}

function changePage(page) {
  const totalPages = Math.ceil(allRSVP.length / ITEMS_PER_PAGE);

  if (page < 1 || page > totalPages) return;

  currentPage = page;

  renderCurrentPage();
}

function getRSVPData() {
  try {
    return JSON.parse(localStorage.getItem(RSVP_KEY)) || [];
  } catch {
    return [];
  }
}

function renderRSVPList(data) {
  const list = document.getElementById('rsvpList');
  const wrap = document.getElementById('rsvpListWrap');
  if (!list || !wrap) return;

  data = data.reverse();

  if (!data.length) {
    list.innerHTML = '';
    wrap.style.display = 'none';
    return;
  }

  wrap.style.display = 'block';
  list.innerHTML = data
    .map(
      (item, i) => `
    <div class="rsvp-item" style="animation-delay:${i * 0.05}s">
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

function updateRSVPCounters(data) {
  animateCounter('countHadir', data.filter((d) => d.kehadiran === 'hadir').length);
  animateCounter('countTidak', data.filter((d) => d.kehadiran === 'tidak').length);
}

function animateCounter(id, value) {
  const el = document.getElementById(id);
  if (!el) return;
  el.textContent = value;
  el.classList.remove('bump');
  void el.offsetWidth;
  el.classList.add('bump');
  setTimeout(() => el.classList.remove('bump'), 300);
}

function showRSVPError(msg) {
  const el = document.getElementById('rsvpError');
  if (!el) return;
  el.textContent = msg;
  el.style.opacity = '0';
  requestAnimationFrame(() => {
    el.style.opacity = '1';
  });
  setTimeout(() => {
    el.textContent = '';
  }, 3000);
}

function addRSVPRipple(btn) {
  if (!btn) return;
  const ripple = document.createElement('span');
  ripple.classList.add('ripple');
  const size = Math.max(btn.offsetWidth, btn.offsetHeight);
  ripple.style.cssText = `
    width:${size}px;height:${size}px;
    left:${btn.offsetWidth / 2 - size / 2}px;
    top:${btn.offsetHeight / 2 - size / 2}px
  `;
  btn.appendChild(ripple);
  setTimeout(() => ripple.remove(), 600);
}

function escapeHTML(str) {
  return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#039;');
}

/* =============================================
   13. MUSIK
   ============================================= */
let _music = null;
let _musicBtn = null;
let _playing = false;

function initMusic() {
  _music = document.getElementById('bgMusic');
  _musicBtn = document.getElementById('musicBtn');
  if (!_music || !_musicBtn) return;

  setTimeout(() => _musicBtn.classList.add('visible'), 1000);

  _music.volume = 0;
  _music
    .play()
    .then(() => {
      _playing = true;
      _musicBtn.classList.add('playing');
      fadeVolume(0, 0.6, 1500);
    })
    .catch(() => {
      // Autoplay diblokir — user klik manual
    });
}

function toggleMusic() {
  if (!_music || !_musicBtn) return;
  if (_playing) {
    fadeVolume(_music.volume, 0, 600, () => {
      _music.pause();
      _playing = false;
      _musicBtn.classList.remove('playing');
      _musicBtn.classList.add('paused');
    });
  } else {
    _music.play().then(() => {
      _playing = true;
      _musicBtn.classList.add('playing');
      _musicBtn.classList.remove('paused');
      fadeVolume(0, 0.6, 800);
    });
  }
}

function fadeVolume(from, to, dur, cb) {
  const steps = 30;
  const interval = dur / steps;
  const delta = (to - from) / steps;
  let cur = from,
    n = 0;
  _music.volume = Math.min(1, Math.max(0, from));
  const t = setInterval(() => {
    n++;
    cur += delta;
    _music.volume = Math.min(1, Math.max(0, cur));
    if (n >= steps) {
      clearInterval(t);
      _music.volume = Math.min(1, Math.max(0, to));
      if (cb) cb();
    }
  }, interval);
}
