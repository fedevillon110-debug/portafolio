/* ============================================
   PORTFOLIO — FEDERICO VILLÓN
   script.js
   ============================================ */

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

/* ── VIDEO CARDS — hover preview + modal ── */
document.querySelectorAll('.video-card').forEach(card => {
  const ytId    = card.dataset.ytId;
  const thumb   = card.querySelector('.video-thumb');
  const extLink = card.querySelector('.ext-link');
  if (!ytId || !thumb) return;

  let previewIframe = null;
  let hoverTimer    = null;

  /* HOVER ENTER: inyecta iframe muted después de 350ms */
  card.addEventListener('mouseenter', () => {
    hoverTimer = setTimeout(() => {
      if (previewIframe) return;
      previewIframe = document.createElement('iframe');
      previewIframe.className = 'thumb-preview';
      previewIframe.setAttribute('allow', 'autoplay; encrypted-media');
      /* mute=1 es obligatorio para autoplay en navegadores modernos */
      previewIframe.src =
        `https://www.youtube-nocookie.com/embed/${ytId}` +
        `?autoplay=1&mute=1&controls=0&loop=1&playlist=${ytId}` +
        `&playsinline=1&rel=0&modestbranding=1&enablejsapi=0`;
      thumb.appendChild(previewIframe);
    }, 350);
  });

  /* HOVER LEAVE: elimina el iframe para detener reproducción */
  card.addEventListener('mouseleave', () => {
    clearTimeout(hoverTimer);
    if (previewIframe) { previewIframe.remove(); previewIframe = null; }
  });

  /* CLICK: abrir modal con sonido — no si clickearon el ↗ */
  card.addEventListener('click', (e) => {
    if (extLink && extLink.contains(e.target)) return;
    openVideoModal(
      ytId,
      card.querySelector('.video-card-title')?.textContent?.trim() || 'Reel',
      card.querySelector('.video-card-client')?.textContent?.trim() || ''
    );
  });
});

/* ── CARDS — flyers y videos ── */
document.querySelectorAll('.design-card').forEach(card => {
  const ytId    = card.dataset.ytId;
  const extLink = card.querySelector('.ext-link');

  card.addEventListener('click', (e) => {
    if (extLink?.contains(e.target)) return;

    const title  = card.querySelector('.design-card-title')?.textContent?.trim() || '';
    const client = card.querySelector('.design-card-client')?.textContent?.trim() || '';

    if (ytId) {
      /* VIDEO → modal con miniatura + botón YouTube */
      const wrap = document.createElement('div');
      wrap.className = 'modal-media';
      wrap.style.cssText = 'position:relative;width:100%;border-radius:12px;overflow:hidden;';

      const thumb = document.createElement('img');
      thumb.src = `https://i.ytimg.com/vi/${ytId}/hqdefault.jpg`;
      thumb.alt = title;
      thumb.style.cssText = 'width:100%;max-height:72vh;object-fit:cover;display:block;filter:brightness(0.5);';

      const btn = document.createElement('a');
      btn.href = `https://youtube.com/shorts/${ytId}`;
      btn.target = '_blank';
      btn.style.cssText =
        'position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);' +
        'display:flex;flex-direction:column;align-items:center;gap:.6rem;text-decoration:none;';
      btn.innerHTML = `
        <div style="width:64px;height:64px;border-radius:50%;
          background:rgba(126,184,212,0.15);border:2px solid #7eb8d4;
          display:flex;align-items:center;justify-content:center;
          font-size:1.5rem;color:#7eb8d4;padding-left:4px;">▶</div>
        <span style="font-family:'DM Mono',monospace;font-size:.68rem;
          letter-spacing:.15em;text-transform:uppercase;color:#7eb8d4;">
          Ver en YouTube →</span>`;

      wrap.appendChild(thumb);
      wrap.appendChild(btn);
      openModal(wrap, title, client);

    } else {
      /* FLYER → modal con imagen grande */
      const img = card.querySelector('.design-card-inner img');
      if (!img) return;
      const el = document.createElement('img');
      el.className = 'modal-media';
      el.src = img.src;
      el.alt = title;
      el.style.cssText = 'width:100%;max-height:80vh;object-fit:contain;border-radius:12px;display:block;';
      openModal(el, title, client);
    }
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
    Usamos youtube-nocookie.com para mayor compatibilidad.
    autoplay=1 funciona porque el usuario hizo click (gesto de usuario).
    mute=0 → con sonido en el modal.
  */
  const iframe = document.createElement('iframe');
  iframe.className = 'modal-media';
  iframe.setAttribute('allow', 'autoplay; fullscreen; encrypted-media; picture-in-picture');
  iframe.setAttribute('allowfullscreen', '');
  iframe.style.cssText =
    'width:100%;aspect-ratio:9/16;max-height:75vh;' +
    'border:0;border-radius:12px;display:block;background:#000;';
  /* Primero seteamos src DESPUÉS de agregar al DOM para que el autoplay funcione */
  previewCard?.insertBefore(iframe, previewCard.querySelector('.preview-caption') || null);
  /* Pequeño timeout para que el iframe esté en el DOM antes de asignar src */
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

/* Alias para compatibilidad con el HTML existente */
const closePreview = closeModal;

if (modalOverlay) modalOverlay.addEventListener('click', closeModal);
if (modalClose)   modalClose.addEventListener('click',   closeModal);
document.addEventListener('keydown', e => { if (e.key === 'Escape') closeModal(); });
