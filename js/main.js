/* Shared site behaviour: covers, cursor, reveals, smooth scroll, menu */
(function () {
  document.documentElement.classList.remove('no-js');

  /* ---------- Typographic cover art ---------- */
  const MOTIFS = {
    masthead: `<rect x="0" y="0" width="400" height="34" class="cv-accent"/>
      <rect x="250" y="70" width="120" height="150" fill="none" class="cv-ink-stroke" stroke-width="1" opacity=".35"/>
      <line x1="250" y1="95" x2="370" y2="95" class="cv-ink-stroke" stroke-width="1" opacity=".35"/>
      <line x1="250" y1="110" x2="345" y2="110" class="cv-ink-stroke" stroke-width="1" opacity=".25"/>
      <line x1="250" y1="122" x2="355" y2="122" class="cv-ink-stroke" stroke-width="1" opacity=".25"/>`,
    glass: `<circle cx="320" cy="70" r="95" class="cv-accent" opacity=".35"/>
      <circle cx="250" cy="170" r="60" class="cv-accent" opacity=".18"/>
      <rect x="225" y="60" width="140" height="95" rx="10" fill="rgba(255,255,255,.06)" class="cv-ink-stroke" stroke-width=".8" stroke-opacity=".3"/>
      <rect x="240" y="170" width="110" height="60" rx="10" fill="rgba(255,255,255,.05)" class="cv-ink-stroke" stroke-width=".8" stroke-opacity=".25"/>`,
    banners: `<rect x="215" y="40" width="160" height="90" class="cv-ink-stroke" fill="none" stroke-width="1" opacity=".5"/>
      <rect x="235" y="140" width="140" height="50" class="cv-ink-stroke" fill="none" stroke-width="1" opacity=".4"/>
      <rect x="300" y="200" width="75" height="75" class="cv-ink-stroke" fill="none" stroke-width="1" opacity=".3"/>
      <rect x="215" y="40" width="54" height="90" class="cv-accent" opacity=".9"/>`,
    funnel: `<rect x="215" y="60" width="160" height="14" class="cv-accent" opacity=".25"/>
      <rect x="235" y="90" width="120" height="14" class="cv-accent" opacity=".45"/>
      <rect x="255" y="120" width="80" height="14" class="cv-accent" opacity=".7"/>
      <rect x="275" y="150" width="40" height="14" class="cv-accent"/>`,
    grid: `${Array.from({ length: 6 }, (_, r) => Array.from({ length: 6 }, (_, c) =>
      `<rect x="${220 + c * 26}" y="${46 + r * 26}" width="18" height="18" ${ (r * 6 + c) % 7 === 3 ? 'class="cv-accent"' : 'fill="none" class="cv-ink-stroke" stroke-width=".8" opacity=".35"' }/>`).join('')).join('')}`,
    frame: `<g class="cv-ink-stroke" stroke-width="1" fill="none" opacity=".4">
      <path d="M252 50 h-16 v16"/><path d="M362 50 h16 v16"/><path d="M252 220 h-16 v-16"/><path d="M362 220 h16 v-16"/></g>
      <circle cx="307" cy="135" r="44" class="cv-accent" opacity=".85"/>`,
    mark: `<circle cx="290" cy="130" r="70" fill="none" class="cv-ink-stroke" stroke-width="10"/>
      <rect x="282" y="40" width="16" height="180" class="cv-accent" opacity=".9"/>`
  };

  window.renderCover = function (p, idx) {
    const c = p.cover || {};
    const statValue = p.stat ? p.stat.value : String(idx + 1).padStart(2, '0');
    const statLabel = p.stat ? p.stat.label : p.kicker;
    return `<div class="cover" style="--c-bg:${c.bg || '#201D1A'};--c-ink:${c.ink || '#EDE6D6'};--c-accent:${c.accent || '#E5482A'}" aria-hidden="true">
      <div class="cv-art"><svg viewBox="0 0 400 300" preserveAspectRatio="xMaxYMid slice">${MOTIFS[c.motif] || MOTIFS.frame}</svg></div>
      <div class="cv-label">${p.title}</div>
      <div class="cv-stat">${statValue}</div>
      <div class="cv-sub">${statLabel}</div>
    </div>`;
  };

  /* Image with Drive fallbacks; on total failure swap in the cover */
  window.mediaFor = function (p, idx, w) {
    if (p.images && p.images.length) {
      const id = p.images[0];
      return `<img src="${driveImg(id, w || 1600)}" alt="${p.title}" loading="lazy" referrerpolicy="no-referrer" data-drive="${id}" data-slug="${p.slug}" data-idx="${idx}">`;
    }
    return renderCover(p, idx);
  };
  window.wireImageFallbacks = function (root) {
    (root || document).querySelectorAll('img[data-drive]').forEach(img => {
      if (img.dataset.wired) return;
      img.dataset.wired = '1';
      const urls = window.isLocal(img.dataset.drive) ? [img.src] : driveFallbacks(img.dataset.drive);
      let i = 0;
      const fail = () => {
        i++;
        if (i < urls.length) { img.src = urls[i]; return; }
        const p = (window.PROJECTS || []).find(x => x.slug === img.dataset.slug);
        if (p && img.closest('.card-media, .cs-cover')) img.outerHTML = renderCover(p, +img.dataset.idx || 0);
        else img.remove();
      };
      img.addEventListener('error', fail);
      if (img.complete && img.naturalWidth === 0 && img.getAttribute('src')) fail();
    });
  };

  /* ---------- Cursor ---------- */
  const fine = matchMedia('(hover: hover) and (pointer: fine)').matches;
  if (fine) {
    const cur = document.createElement('div');
    cur.className = 'cursor';
    cur.innerHTML = '<span>View</span>';
    document.body.appendChild(cur);
    let x = innerWidth / 2, y = innerHeight / 2, cx = x, cy = y;
    addEventListener('mousemove', e => { x = e.clientX; y = e.clientY; });
    (function loop() {
      cx += (x - cx) * 0.2; cy += (y - cy) * 0.2;
      cur.style.transform = `translate3d(${cx}px,${cy}px,0)`;
      requestAnimationFrame(loop);
    })();
    document.addEventListener('mouseover', e => {
      cur.classList.toggle('view', !!e.target.closest('[data-cursor="view"]'));
    });
  }

  /* ---------- Reveal on scroll ---------- */
  const io = 'IntersectionObserver' in window ? new IntersectionObserver(entries => {
    entries.forEach(en => { if (en.isIntersecting) { en.target.classList.add('in'); io.unobserve(en.target); } });
  }, { rootMargin: '0px 0px -8% 0px' }) : null;
  window.observeReveals = function (root) {
    (root || document).querySelectorAll('.reveal:not(.in)').forEach(el => io ? io.observe(el) : el.classList.add('in'));
  };

  /* ---------- Mobile menu ---------- */
  document.addEventListener('click', e => {
    const menu = document.getElementById('mobileMenu');
    if (!menu) return;
    if (e.target.closest('[data-menu-open]')) menu.classList.add('open');
    else if (e.target.closest('[data-menu-close]') || e.target.closest('#mobileMenu a')) menu.classList.remove('open');
  });

  /* ---------- Smooth scroll ---------- */
  window.addEventListener('load', () => {
    if (typeof Lenis === 'undefined' || matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const lenis = new Lenis({ duration: 1.1, smoothTouch: false });
    (function raf(t) { lenis.raf(t); requestAnimationFrame(raf); })(0);
    document.querySelectorAll('a[href^="#"]').forEach(a => a.addEventListener('click', e => {
      const t = document.querySelector(a.getAttribute('href'));
      if (t) { e.preventDefault(); lenis.scrollTo(t, { offset: -60 }); }
    }));
    window.__lenis = lenis;
  });

  document.addEventListener('DOMContentLoaded', () => {
    requestAnimationFrame(() => setTimeout(() => document.body.classList.add('loaded'), 60));
    wireImageFallbacks();
    observeReveals();
    const y = document.querySelectorAll('[data-year]');
    y.forEach(el => el.textContent = new Date().getFullYear());
  });
})();
