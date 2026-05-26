/* ── menu hamburguesa ── */
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

/* ── scroll reveal ── */
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.12 });
document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));

/* ── tabs ── */
function switchTab(id, btn) {
  document.querySelectorAll('.tab-panel').forEach(p => p.classList.remove('active'));
  document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
  document.getElementById('tab-' + id).classList.add('active');
  btn.classList.add('active');
}

/* ── hero ── */
window.addEventListener('scroll', () => {
  const bg = document.getElementById('heroBg');
  if (bg) bg.style.transform = `scale(1.04) translateY(${window.scrollY * 0.15}px)`;
});

/* ── video cards ── */
document.querySelectorAll('.video-card').forEach(card => {
  const thumbLink = card.querySelector('.video-thumb-link');
  const thumb     = card.querySelector('.video-thumb');
  const thumbImg  = card.querySelector('.video-thumb-img');
  const extLink   = card.querySelector('.ext-link');
  if (!thumbLink || !thumb) return;

  /* youtube id del href */
  const href = thumbLink.href || '';
  const ytIdMatch = href.match(/youtube\.com\/shorts\/([A-Za-z0-9_-]+)|youtu\.be\/([A-Za-z0-9_-]+)|youtube\.com\/watch\?v=([A-Za-z0-9_-]+)/);
  const ytId = ytIdMatch ? (ytIdMatch[1] || ytIdMatch[2] || ytIdMatch[3]) : null;
  if (!ytId) return;

  let previewIframe = null;
  let hoverTimer    = null;

  /* hover enter quitar blur de imagen */
  card.addEventListener('mouseenter', () => {
    if (thumbImg) {
      thumbImg.style.opacity = '1';
      thumbImg.style.filter = 'blur(0)';
    }
    hoverTimer = setTimeout(() => {
      if (previewIframe) return;
      previewIframe = document.createElement('iframe');
      previewIframe.className = 'thumb-preview';
      previewIframe.setAttribute('allow', 'autoplay; encrypted-media');
      previewIframe.src =
        `https://www.youtube-nocookie.com/embed/${ytId}` +
        `?autoplay=1&mute=1&controls=0&loop=1&playlist=${ytId}` +
        `&playsinline=1&rel=0&modestbranding=1&enablejsapi=0`;
      thumb.appendChild(previewIframe);
    }, 350);
  });

  /* over leave revertir blur y eliminar iframe */
  card.addEventListener('mouseleave', () => {
    clearTimeout(hoverTimer);
    if (previewIframe) { previewIframe.remove(); previewIframe = null; }
    if (thumbImg) {
      thumbImg.style.opacity = '0.85';
      thumbImg.style.filter = 'blur(1.6px)';
    }
  });

  /* click en el botón fullscreen: abrir modal con video desmuteado */
  const fullscreenBtn = card.querySelector('.video-fullscreen-btn');
  if (fullscreenBtn) {
    fullscreenBtn.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      openVideoModal(
        ytId,
        card.querySelector('.video-card-title')?.textContent?.trim() || 'Reel',
        card.querySelector('.video-card-client')?.textContent?.trim() || ''
      );
    });
  }

  /* click en el link: prevenir navegación y abrir modal */
  thumbLink.addEventListener('click', (e) => {
    e.preventDefault();
    e.stopPropagation();
    openVideoModal(
      ytId,
      card.querySelector('.video-card-title')?.textContent?.trim() || 'Reel',
      card.querySelector('.video-card-client')?.textContent?.trim() || ''
    );
  });

  /* click en el card: si no es el ext-link, abrir modal */
  card.addEventListener('click', (e) => {
    if (extLink && extLink.contains(e.target)) return;
  });
});

/* ── cards — flyers y videos ── */
document.querySelectorAll('.design-card').forEach(card => {
  const img     = card.querySelector('.design-card-inner img');
  const extLink = card.querySelector('.ext-link');
   if (!img) return;
  card.addEventListener('click', (e) => {
    if (extLink && extLink.contains(e.target)) return;
    openImageModal(
      img.src,
      card.querySelector('.design-card-title')?.textContent?.trim() || '',
      card.querySelector('.design-card-client')?.textContent?.trim() || ''
    );
  });
});

/* ── modal ── */
const modal        = document.getElementById('previewModal');
const modalOverlay = document.getElementById('previewOverlay');
const modalClose   = document.getElementById('previewClose');
const modalTitle   = document.getElementById('previewTitle');
const modalSub     = document.getElementById('previewSubtitle');
const previewCard  = modal?.querySelector('.preview-card');

function clearModal() {
  previewCard?.querySelectorAll('.modal-media').forEach(el => el.remove());
  ['previewImage','previewVideo','previewText'].forEach(id => {
    const el = document.getElementById(id);
    if (el) el.style.display = 'none';
  });
}

function openVideoModal(ytId, title, client) {
  clearModal();
  if (modalTitle) modalTitle.textContent = title;
  if (modalSub)   modalSub.textContent   = client;

  /*
   youtube-nocookie.com para mayor compatibilidad.
    autoplay=1 funciona porque el usuario hizo click.
    mute=0 → con sonido en el modal.
  */
  const iframe = document.createElement('iframe');
  iframe.className = 'modal-media';
  iframe.setAttribute('allow', 'autoplay; fullscreen; encrypted-media; picture-in-picture');
  iframe.setAttribute('allowfullscreen', '');
  iframe.style.cssText =
    'width:100%;aspect-ratio:9/16;max-height:75vh;' +
    'border:0;border-radius:12px;display:block;background:#000;';
  /* Primero seteamos src dsp de agregar al dom para que el autoplay funcione */
  previewCard?.insertBefore(iframe, previewCard.querySelector('.preview-caption') || null);
  /* pequeño timeout para que el iframe esté en el dom antes de asignar src */
  setTimeout(() => {
    iframe.src =
      `https://www.youtube-nocookie.com/embed/${ytId}` +
      `?autoplay=1&mute=0&playsinline=1&rel=0&modestbranding=1`;
  }, 50);

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
  img.style.cssText =
    'width:100%;max-height:80vh;object-fit:contain;border-radius:12px;display:block;';
  previewCard?.insertBefore(img, previewCard.querySelector('.preview-caption') || null);

  openModalBase();
}

function openModalBase() {
  if (!modal) return;
  modal.classList.add('open');
  modal.setAttribute('aria-hidden', 'false');
  document.body.style.overflow = 'hidden';
}

function closeModal() {
  clearModal();
  if (!modal) return;
  modal.classList.remove('open');
  modal.setAttribute('aria-hidden', 'true');
  document.body.style.overflow = '';
}

/* alias para compatibilidad con el HTML existente */
const closePreview = closeModal;

if (modalOverlay) modalOverlay.addEventListener('click', closeModal);
if (modalClose)   modalClose.addEventListener('click',   closeModal);
document.addEventListener('keydown', e => { if (e.key === 'Escape') closeModal(); });
