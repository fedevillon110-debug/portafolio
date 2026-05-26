/* ── MENÚ HAMBURGUESA ── */
const hamburger = document.getElementById('hamburger');
const mobileMenu = document.getElementById('mobileMenu');
hamburger.addEventListener('click', () => {
  hamburger.classList.toggle('open');
  mobileMenu.classList.toggle('open');
});
function closeMobile() {
  hamburger.classList.remove('open');
  mobileMenu.classList.remove('open');
}

/* ── SCROLL REVEAL ── */
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.12 });
document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));

/* ── TABS ── */
function switchTab(id, btn) {
  document.querySelectorAll('.tab-panel').forEach(p => p.classList.remove('active'));
  document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
  document.getElementById('tab-' + id).classList.add('active');
  btn.classList.add('active');
}

/* ── PARALLAX HERO ── */
window.addEventListener('scroll', () => {
  const bg = document.getElementById('heroBg');
  if (bg) bg.style.transform = `scale(1.04) translateY(${window.scrollY * 0.15}px)`;
});

/* ── VIDEO CARDS — hover preview + modal ──
   Al hacer hover: inyecta un iframe de YouTube muted (preview silencioso)
   Al clickear:    abre el modal con el video con sonido y controles
*/
document.querySelectorAll('.video-card').forEach(card => {
  const ytId = card.dataset.ytId;
  const thumb = card.querySelector('.video-thumb');
  const extLink = card.querySelector('.ext-link');
  if (!ytId || !thumb) return;

  let previewIframe = null;
  let hoverTimer = null;

  // HOVER: crear iframe preview muted después de 300ms
  card.addEventListener('mouseenter', () => {
    hoverTimer = setTimeout(() => {
      if (previewIframe) return;
      previewIframe = document.createElement('iframe');
      previewIframe.className = 'thumb-preview';
      // autoplay=1, mute=1, controls=0, loop=1 — igual que YouTube en hover
      previewIframe.src = `https://www.youtube.com/embed/${ytId}?autoplay=1&mute=1&controls=0&loop=1&playlist=${ytId}&playsinline=1&rel=0&modestbranding=1`;
      previewIframe.allow = 'autoplay; encrypted-media';
      thumb.appendChild(previewIframe);
    }, 300); // pequeño delay para no cargar en cada mouseover rápido
  });

  // MOUSE LEAVE: eliminar iframe para parar el video
  card.addEventListener('mouseleave', () => {
    clearTimeout(hoverTimer);
    if (previewIframe) {
      previewIframe.remove();
      previewIframe = null;
    }
  });

  // CLICK: abrir modal — pero no si clickearon el link ↗
  card.addEventListener('click', (e) => {
    if (extLink && extLink.contains(e.target)) return;
    openVideoModal(ytId,
      card.querySelector('.video-card-title')?.textContent || 'Reel',
      card.querySelector('.video-card-client')?.textContent || ''
    );
  });
});

/* ── DESIGN CARDS — modal con imagen ── */
document.querySelectorAll('.design-card').forEach(card => {
  const img = card.querySelector('.design-card-inner img');
  const extLink = card.querySelector('.ext-link');
  if (!img) return;

  card.addEventListener('click', (e) => {
    if (extLink && extLink.contains(e.target)) return;
    openImageModal(
      img.src,
      card.querySelector('.design-card-title')?.textContent || '',
      card.querySelector('.design-card-client')?.textContent || ''
    );
  });
});

/* ── MODAL ── */
const modal        = document.getElementById('previewModal');
const modalOverlay = document.getElementById('previewOverlay');
const modalClose   = document.getElementById('previewClose');
const modalTitle   = document.getElementById('previewTitle');
const modalSub     = document.getElementById('previewSubtitle');
const previewCard  = modal?.querySelector('.preview-card');

function clearModal() {
  if (!previewCard) return;
  previewCard.querySelectorAll('.modal-media').forEach(el => el.remove());
  // ocultar elementos legacy del modal anterior
  ['previewImage','previewVideo','previewText'].forEach(id => {
    const el = document.getElementById(id);
    if (el) el.style.display = 'none';
  });
}

function openVideoModal(ytId, title, client) {
  clearModal();
  if (modalTitle) modalTitle.textContent = title;
  if (modalSub)   modalSub.textContent   = client;

  // iframe con controles y sonido para el modal
  const iframe = document.createElement('iframe');
  iframe.className = 'modal-media';
  iframe.src = `https://www.youtube.com/embed/${ytId}?autoplay=1&playsinline=1&rel=0&modestbranding=1`;
  iframe.allow = 'autoplay; fullscreen; encrypted-media; picture-in-picture';
  iframe.setAttribute('allowfullscreen', '');
  iframe.style.cssText = 'width:100%;aspect-ratio:9/16;max-height:75vh;border:0;border-radius:12px;display:block;background:#000;';

  const caption = previewCard?.querySelector('.preview-caption');
  previewCard?.insertBefore(iframe, caption || null);

  openModalBase();
}

function openImageModal(src, title, client) {
  clearModal();
  if (modalTitle) modalTitle.textContent = title;
  if (modalSub)   modalSub.textContent   = client;

  const img = document.createElement('img');
  img.className = 'modal-media';
  img.src = src;
  img.alt = title;
  img.style.cssText = 'width:100%;max-height:80vh;object-fit:contain;border-radius:12px;display:block;';

  const caption = previewCard?.querySelector('.preview-caption');
  previewCard?.insertBefore(img, caption || null);

  openModalBase();
}

function openModalBase() {
  if (!modal) return;
  modal.classList.add('open');
  modal.setAttribute('aria-hidden', 'false');
  document.body.style.overflow = 'hidden';
}

function closeModal() {
  if (!modal) return;
  clearModal();
  modal.classList.remove('open');
  modal.setAttribute('aria-hidden', 'true');
  document.body.style.overflow = '';
}

// Renombrar función vieja por compatibilidad con el HTML
const closePreview = closeModal;

if (modalOverlay) modalOverlay.addEventListener('click', closeModal);
if (modalClose)   modalClose.addEventListener('click',   closeModal);
document.addEventListener('keydown', e => { if (e.key === 'Escape') closeModal(); });
