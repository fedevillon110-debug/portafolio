/* ============================================
   PORTFOLIO — FEDERICO VILLÓN
   script.js
   ============================================ */

/* ── MENÚ HAMBURGUESA (mobile) ── */
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

/* ── SCROLL REVEAL ──
   Cada elemento con clase .reveal aparece con
   fade + slide-up al entrar en el viewport.
*/
const revealEls = document.querySelectorAll('.reveal');

const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      revealObserver.unobserve(entry.target); // solo una vez
    }
  });
}, { threshold: 0.12 });

revealEls.forEach(el => revealObserver.observe(el));

/* ── TABS — TRABAJOS ──
   Alterna entre pestaña "Diseño gráfico" y "Videos"
*/
function switchTab(id, clickedBtn) {
  // Ocultar todos los paneles
  document.querySelectorAll('.tab-panel').forEach(panel => {
    panel.classList.remove('active');
  });
  // Desactivar todos los botones
  document.querySelectorAll('.tab-btn').forEach(btn => {
    btn.classList.remove('active');
  });
  // Mostrar el panel seleccionado
  document.getElementById('tab-' + id).classList.add('active');
  // Activar el botón clickeado
  clickedBtn.classList.add('active');
}

function openPreview(card) {
  const previewModal = document.getElementById('previewModal');
  const previewImage = document.getElementById('previewImage');
  const previewVideo = document.getElementById('previewVideo');
  const previewTitle = document.getElementById('previewTitle');
  const previewSubtitle = document.getElementById('previewSubtitle');
  const previewText = document.getElementById('previewText');

  // Si se pasó un elemento .design-card, extraer datos; si se pasó un string, usarlo como src
  let src = '';
  let title = 'Vista previa';
  let subtitle = '';

  if (typeof card === 'string') {
    src = card;
  } else if (card && card.nodeType === 1) {
    const vid = card.querySelector('video');
    if (vid) {
      // prefer currentSrc, fallback to first source
      src = vid.currentSrc || (vid.querySelector('source') && vid.querySelector('source').src) || '';
    }
    const img = card.querySelector('img');
    if (!src && img && img.src) src = img.src;
    const t = card.querySelector('.design-card-title');
    const s = card.querySelector('.design-card-client');
    if (t) title = t.textContent.trim();
    if (s) subtitle = s.textContent.trim();
  }

  previewTitle.textContent = title;
  previewSubtitle.textContent = subtitle;

  if (src) {
    // si es un video (extensiones comunes), usar el <video> del modal
    const isVideo = /\.(mp4|webm|ogg)(\?|$)/i.test(src) || (card && card.querySelector && card.querySelector('video'));
    if (isVideo && previewVideo) {
      previewImage.style.display = 'none';
      previewText.style.display = 'none';
      previewVideo.style.display = 'block';
      previewVideo.src = src;
      previewVideo.poster = '';
      previewVideo.muted = false;
      previewVideo.currentTime = 0;
      previewVideo.play().catch(()=>{});
    } else {
      if (previewVideo) {
        previewVideo.pause();
        previewVideo.src = '';
        previewVideo.style.display = 'none';
      }
      previewImage.src = src;
      previewImage.alt = title;
      previewImage.style.display = 'block';
      previewText.style.display = 'none';
    }
  } else {
    if (previewVideo) { previewVideo.pause(); previewVideo.src = ''; previewVideo.style.display = 'none'; }
    previewImage.src = '';
    previewImage.alt = '';
    previewImage.style.display = 'none';
    previewText.textContent = 'Vista previa disponible en breve. Podés ver más diseños completos en el Drive.';
    previewText.style.display = 'block';
  }

  previewModal.classList.add('open');
  previewModal.setAttribute('aria-hidden', 'false');
  document.body.style.overflow = 'hidden';
  // animación: ampliar imagen dentro del modal
  if (previewImage) previewImage.style.transform = 'scale(1)';
  if (previewVideo) previewVideo.style.transform = 'scale(1)';
}

function closePreview() {
  const previewModal = document.getElementById('previewModal');
  previewModal.classList.remove('open');
  previewModal.setAttribute('aria-hidden', 'true');
  // animación de cierre: reducir ligeramente la imagen antes de permitir scroll
  const previewImage = document.getElementById('previewImage');
  if (previewImage) previewImage.style.transform = 'scale(0.98)';
  const previewVideo = document.getElementById('previewVideo');
  if (previewVideo) {
    previewVideo.style.transform = 'scale(0.98)';
    previewVideo.pause();
    previewVideo.src = '';
  }
  document.body.style.overflow = '';
}

document.addEventListener('keydown', (event) => {
  const previewModal = document.getElementById('previewModal');
  if (event.key === 'Escape' && previewModal.classList.contains('open')) {
    closePreview();
  }
});

document.querySelectorAll('.design-card[role="button"]').forEach(card => {
  card.addEventListener('keydown', (event) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      openPreview(card);
    }
  });
});

// Añadir click handlers y atributos accesibles a las tarjetas de diseño
document.querySelectorAll('.design-card').forEach(card => {
  // Hacerlas interactivas para teclado
  if (!card.hasAttribute('role')) card.setAttribute('role', 'button');
  if (!card.hasAttribute('tabindex')) card.setAttribute('tabindex', '0');

  card.addEventListener('click', (e) => {
    // Abrir preview con el contenido de la tarjeta
    openPreview(card);
  });

  card.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      openPreview(card);
    }
  });
});

// Añadir click handlers y atributos accesibles a las tarjetas de video
document.querySelectorAll('.video-card').forEach(card => {
  if (!card.hasAttribute('role')) card.setAttribute('role', 'button');
  if (!card.hasAttribute('tabindex')) card.setAttribute('tabindex', '0');

  card.addEventListener('click', (e) => {
    openPreview(card);
  });
  card.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      openPreview(card);
    }
  });
});

// Cerrar modal al clicar overlay o botón
const previewOverlay = document.getElementById('previewOverlay');
const previewClose = document.getElementById('previewClose');
if (previewOverlay) previewOverlay.addEventListener('click', closePreview);
if (previewClose) previewClose.addEventListener('click', closePreview);

/* ── PARALLAX HERO ──
   El fondo del hero se mueve más lento que el scroll,
   creando profundidad.
*/
window.addEventListener('scroll', () => {
  const heroBg = document.getElementById('heroBg');
  if (heroBg) {
    heroBg.style.transform = `scale(1.04) translateY(${window.scrollY * 0.15}px)`;
  }
});

/* ── AGRANDAR / REDUCIR FLYERS (hover + touch) ──
   Añade la función "agrandar" que tenías antes y soporte
   para dispositivos táctiles y accesibilidad.
*/
function agrandar(el) {
  el.style.transition = 'transform 0.35s ease, filter 0.35s ease, opacity 0.35s ease';
  el.style.transform = 'scale(1.06)';
  el.style.filter = 'blur(0px)';
  el.style.opacity = '1';
}

function reducir(el) {
  el.style.transform = '';
  el.style.filter = 'blur(1.6px)';
  el.style.opacity = '0.85';
}

// Adjuntar listeners a los flyers para soporte touch/focus
document.querySelectorAll('.design-card-inner img').forEach(img => {
  img.setAttribute('tabindex', '0');
  img.addEventListener('pointerenter', () => agrandar(img));
  img.addEventListener('pointerleave', () => reducir(img));
  img.addEventListener('focus', () => agrandar(img));
  img.addEventListener('blur', () => reducir(img));

  let touched = false;
  img.addEventListener('touchstart', (e) => {
    e.stopPropagation();
    if (!touched) {
      agrandar(img);
      touched = true;
    } else {
      reducir(img);
      touched = false;
    }
  }, { passive: true });
});

// Miniaturas de video: play on hover / remove blur, pause on leave; touch toggles play
document.querySelectorAll('.video-thumb').forEach(thumb => {
  const video = thumb.querySelector('video');
  if (!video) return;

  // Ensure muted so autoplay on hover works
  video.muted = true;
  video.setAttribute('playsinline', '');

  thumb.addEventListener('pointerenter', () => {
    video.play().catch(()=>{});
  });
  thumb.addEventListener('pointerleave', () => {
    video.pause();
    try { video.currentTime = 0; } catch(e){}
  });

  // For keyboard accessibility: focus triggers play
  thumb.setAttribute('tabindex', '0');
  thumb.addEventListener('focus', () => video.play().catch(()=>{}));
  thumb.addEventListener('blur', () => { video.pause(); try { video.currentTime = 0; } catch(e){} });

  // Touch: first tap plays, second tap pauses (do not open modal on thumbnail tap)
  let touched = false;
  thumb.addEventListener('touchstart', (e) => {
    e.stopPropagation();
    if (!touched) {
      video.play().catch(()=>{});
      touched = true;
    } else {
      video.pause();
      try { video.currentTime = 0; } catch(e){}
      touched = false;
    }
  }, { passive: true });
});
