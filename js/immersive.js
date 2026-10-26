/* =========================================================
   Immersive layer: a darkroom tunnel of work "prints" the
   camera flies through as you scroll the hero, plus 3D card
   tilt, split-letter titles and depth reveals.
   ========================================================= */
(function () {
  const root = document.documentElement;
  const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const fine = matchMedia('(hover: hover) and (pointer: fine)').matches;
  const mobile = innerWidth < 860;
  if (reduced) root.classList.add('reduced');

  /* ---------------- split-letter titles ---------------- */
  function split(el) {
    if (el.dataset.split) return;
    el.dataset.split = '1';
    let i = 0;
    const walk = node => {
      [...node.childNodes].forEach(n => {
        if (n.nodeType === 3) {
          const frag = document.createDocumentFragment();
          n.textContent.split(/(\s+)/).forEach(word => {
            if (!word) return;
            if (/^\s+$/.test(word)) { frag.appendChild(document.createTextNode(' ')); return; }
            const w = document.createElement('span'); w.className = 'w';
            [...word].forEach(c => { const s = document.createElement('span'); s.className = 'ch'; s.style.setProperty('--i', i++); s.textContent = c; w.appendChild(s); });
            frag.appendChild(w);
          });
          n.replaceWith(frag);
        } else if (n.nodeType === 1) walk(n);
      });
    };
    walk(el);
    el.classList.add('split');
  }
  document.querySelectorAll('.section-title, .contact-big, .cs-title').forEach(split);
  const splitIO = new IntersectionObserver(es => es.forEach(e => {
    if (e.isIntersecting) { e.target.classList.add('in'); splitIO.unobserve(e.target); }
  }), { rootMargin: '0px 0px -10% 0px' });
  document.querySelectorAll('.split').forEach(el => splitIO.observe(el));

  /* ---------------- staggered card delays ---------------- */
  function stagger() {
    document.querySelectorAll('.work-grid .card').forEach((c, i) => c.style.setProperty('--d', ((i % 3) * 0.09) + 's'));
  }
  stagger();
  new MutationObserver(stagger).observe(document.getElementById('workGrid') || document.body, { childList: true });

  /* ---------------- 3D tilt ---------------- */
  if (fine && !reduced) {
    document.addEventListener('mousemove', e => {
      const card = e.target.closest('.card');
      document.querySelectorAll('.card.tilting').forEach(c => { if (c !== card) { c.classList.remove('tilting'); const m = c.querySelector('.card-media'); m.style.removeProperty('--rx'); m.style.removeProperty('--ry'); } });
      if (!card) return;
      const m = card.querySelector('.card-media');
      const r = m.getBoundingClientRect();
      const x = (e.clientX - r.left) / r.width, y = (e.clientY - r.top) / r.height;
      if (x < 0 || x > 1 || y < 0 || y > 1) return;
      card.classList.add('tilting');
      m.style.setProperty('--ry', ((x - 0.5) * 10).toFixed(2) + 'deg');
      m.style.setProperty('--rx', ((0.5 - y) * 8).toFixed(2) + 'deg');
      m.style.setProperty('--gx', (x * 100) + '%');
      m.style.setProperty('--gy', (y * 100) + '%');
    });
    const tiltEl = (sel, amt) => document.querySelectorAll(sel).forEach(el => {
      el.addEventListener('mousemove', e => {
        const r = el.getBoundingClientRect();
        el.style.setProperty('--ry', (((e.clientX - r.left) / r.width - 0.5) * amt) + 'deg');
        el.style.setProperty('--rx', ((0.5 - (e.clientY - r.top) / r.height) * amt) + 'deg');
      });
      el.addEventListener('mouseleave', () => { el.style.setProperty('--rx', '0deg'); el.style.setProperty('--ry', '0deg'); });
    });
    tiltEl('.about-photo .ph', 12);
    setTimeout(() => tiltEl('.cs-cover', 5), 300);
  }

  /* ---------------- darkroom tunnel ---------------- */
  const stage = document.getElementById('heroStage');
  const canvas = document.getElementById('gl');
  if (!stage || !canvas) return;
  const hero = document.getElementById('hero');
  const grid = hero.querySelector('.hero-grid');
  const name = hero.querySelector('.hero-name');
  const foot = hero.querySelector('.hero-foot');
  const cap = document.getElementById('tunnelCaption');
  const tcNum = document.getElementById('tcNum'), tcTitle = document.getElementById('tcTitle');

  const ok = (() => { try { return !!(window.THREE && (canvas.getContext('webgl') || canvas.getContext('experimental-webgl'))); } catch (e) { return false; } })();
  if (!ok) { root.classList.add('no-gl'); return; }

  const T = window.THREE;
  const renderer = new T.WebGLRenderer({ canvas, antialias: !mobile, alpha: false, powerPreference: 'high-performance' });
  renderer.setPixelRatio(Math.min(devicePixelRatio, mobile ? 1.25 : 1.75));
  renderer.setClearColor(0x0e0d0b, 1);
  const scene = new T.Scene();
  scene.fog = new T.FogExp2(0x0e0d0b, 0.045);
  const camera = new T.PerspectiveCamera(55, 1, 0.1, 200);
  camera.position.set(0, 0, 14);

  const projects = (window.PROJECTS || []).slice(0, mobile ? 14 : 27);
  const base = window.ASSET_BASE || '';
  const prints = [];
  const loader = new T.TextureLoader();

  function coverTexture(p, i) {
    const c = document.createElement('canvas'); c.width = 800; c.height = 600;
    const x = c.getContext('2d');
    const cv = p.cover || {};
    x.fillStyle = cv.bg || '#201d1a'; x.fillRect(0, 0, 800, 600);
    const g = x.createRadialGradient(620, 160, 10, 620, 160, 420);
    g.addColorStop(0, (cv.accent || '#e5482a') + 'cc'); g.addColorStop(1, 'transparent');
    x.fillStyle = g; x.fillRect(0, 0, 800, 600);
    x.fillStyle = cv.ink || '#ede6d6';
    x.font = '500 22px "IBM Plex Mono", monospace';
    x.fillText(('GY–' + String(i + 1).padStart(2, '0') + '  ' + p.title).toUpperCase().slice(0, 46), 44, 64);
    x.font = '900 170px Archivo, "Arial Narrow", sans-serif';
    x.fillText(p.stat ? p.stat.value : String(i + 1).padStart(2, '0'), 40, 470);
    x.font = 'italic 34px "Instrument Serif", Georgia, serif';
    x.fillText((p.stat ? p.stat.label : p.kicker).slice(0, 40), 46, 530);
    const t = new T.CanvasTexture(c); t.anisotropy = 4; return t;
  }

  const paper = new T.MeshBasicMaterial({ color: 0xede6d6 });
  const W = 3.2, H = 2.4, B = 0.14;
  projects.forEach((p, i) => {
    const g = new T.Group();
    const border = new T.Mesh(new T.PlaneGeometry(W + B * 2, H + B * 2.8), paper);
    border.position.y = -B * 0.4;
    const mat = new T.MeshBasicMaterial({ map: coverTexture(p, i) });
    const img = new T.Mesh(new T.PlaneGeometry(W, H), mat);
    img.position.z = 0.002;
    g.add(border, img);
    const src = p.thumb ? base + p.thumb : null;
    if (src) loader.load(src, tex => { tex.anisotropy = 4; mat.map = tex; mat.needsUpdate = true; });
    const a = i * 0.78;
    const r = mobile ? 3.8 : 5.6;
    g.position.set(Math.cos(a) * r, Math.sin(a) * r * 0.62, -i * 2.7);
    g.rotation.set((Math.random() - 0.5) * 0.25, -Math.cos(a) * 0.35, (Math.random() - 0.5) * 0.3);
    g.userData = { p, i, base: g.position.clone(), rot: g.rotation.clone(), seed: Math.random() * 10, hover: 0 };
    img.userData.group = g; border.userData.group = g;
    scene.add(g); prints.push(g);
  });
  const depth = projects.length * 2.7;

  /* dust in the safelight */
  const N = mobile ? 600 : 1600;
  const pos = new Float32Array(N * 3), col = new Float32Array(N * 3);
  const cA = new T.Color(0xe5482a), cB = new T.Color(0xede6d6);
  for (let k = 0; k < N; k++) {
    pos[k * 3] = (Math.random() - 0.5) * 22; pos[k * 3 + 1] = (Math.random() - 0.5) * 14; pos[k * 3 + 2] = 14 - Math.random() * (depth + 20);
    const c = Math.random() < 0.35 ? cA : cB; col[k * 3] = c.r; col[k * 3 + 1] = c.g; col[k * 3 + 2] = c.b;
  }
  const pg = new T.BufferGeometry();
  pg.setAttribute('position', new T.BufferAttribute(pos, 3));
  pg.setAttribute('color', new T.BufferAttribute(col, 3));
  const dust = new T.Points(pg, new T.PointsMaterial({ size: 0.045, vertexColors: true, transparent: true, opacity: 0.75, blending: T.AdditiveBlending, depthWrite: false }));
  scene.add(dust);

  /* safelight at the end of the tunnel */
  const gc = document.createElement('canvas'); gc.width = gc.height = 256;
  const gx = gc.getContext('2d'); const rg = gx.createRadialGradient(128, 128, 0, 128, 128, 128);
  rg.addColorStop(0, 'rgba(255,90,60,1)'); rg.addColorStop(0.25, 'rgba(229,72,42,.55)'); rg.addColorStop(1, 'rgba(229,72,42,0)');
  gx.fillStyle = rg; gx.fillRect(0, 0, 256, 256);
  const glow = new T.Sprite(new T.SpriteMaterial({ map: new T.CanvasTexture(gc), blending: T.AdditiveBlending, depthWrite: false, fog: false }));
  glow.scale.set(40, 40, 1); glow.position.set(0, 0, -depth - 10); scene.add(glow);

  /* sizing */
  function resize() {
    const w = hero.clientWidth, h = hero.clientHeight;
    renderer.setSize(w, h, false); camera.aspect = w / h; camera.updateProjectionMatrix();
  }
  resize(); addEventListener('resize', resize);

  /* input */
  let mx = 0, my = 0, tmx = 0, tmy = 0;
  const ray = new T.Raycaster(); const ndc = new T.Vector2(-9, -9);
  let hovered = null;
  if (fine) {
    hero.addEventListener('mousemove', e => {
      const r = hero.getBoundingClientRect();
      tmx = ((e.clientX - r.left) / r.width) * 2 - 1; tmy = -(((e.clientY - r.top) / r.height) * 2 - 1);
      ndc.set(tmx, tmy);
    });
    hero.addEventListener('mouseleave', () => { ndc.set(-9, -9); });
    canvas.addEventListener('click', () => { if (hovered) location.href = 'pages/project.html?p=' + hovered.userData.p.slug; });
  }

  /* scroll progress through the stage */
  let prog = 0, tprog = 0;
  function readScroll() {
    const r = stage.getBoundingClientRect();
    const span = stage.offsetHeight - innerHeight;
    tprog = reduced ? 0 : Math.min(1, Math.max(0, -r.top / Math.max(1, span)));
  }
  addEventListener('scroll', readScroll, { passive: true }); readScroll();

  let visible = true;
  new IntersectionObserver(es => { visible = es[0].isIntersecting; }).observe(hero);

  const clock = new T.Clock();
  const lerp = (a, b, t) => a + (b - a) * t;
  const ease = t => t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
  let lastCap = -1;

  function frame() {
    requestAnimationFrame(frame);
    if (!visible) return;
    const t = clock.getElapsedTime();
    prog = lerp(prog, tprog, 0.08);
    mx = lerp(mx, tmx, 0.05); my = lerp(my, tmy, 0.05);

    /* camera flies through the prints */
    const e = ease(prog);
    const z = lerp(14, -depth + 4, e);
    camera.position.set(mx * 1.2, my * 0.8, z);
    camera.rotation.set(my * 0.06, -mx * 0.08, Math.sin(t * 0.2) * 0.02 + e * 0.35);

    /* prints float, spin, and lift on hover */
    let hit = null;
    if (fine && prog < 0.98) {
      ray.setFromCamera(ndc, camera);
      const hits = ray.intersectObjects(prints.map(g => g.children[1]));
      hit = hits.length ? hits[0].object.userData.group : null;
    }
    if (hit !== hovered) { hovered = hit; root.classList.toggle('gl-hover', !!hit); }
    prints.forEach(g => {
      const u = g.userData;
      u.hover = lerp(u.hover, g === hovered ? 1 : 0, 0.12);
      g.position.x = u.base.x + Math.sin(t * 0.5 + u.seed) * 0.15;
      g.position.y = u.base.y + Math.cos(t * 0.4 + u.seed) * 0.15;
      g.position.z = u.base.z + u.hover * 0.8;
      g.rotation.x = u.rot.x + Math.sin(t * 0.3 + u.seed) * 0.05;
      g.rotation.y = u.rot.y * (1 - u.hover) + Math.cos(t * 0.25 + u.seed) * 0.05;
      g.rotation.z = u.rot.z * (1 - u.hover);
      const s = 1 + u.hover * 0.12; g.scale.set(s, s, 1);
    });
    dust.rotation.z = t * 0.01;
    glow.material.opacity = 0.55 + Math.sin(t * 1.3) * 0.08 + e * 0.35;
    renderer.render(scene, camera);

    /* DOM choreography over the canvas */
    const a = Math.min(1, prog / 0.28);
    grid.style.opacity = 1 - a; grid.style.transform = `translate3d(0, ${-a * 60}px, 0)`;
    foot.style.opacity = 1 - Math.min(1, prog / 0.18);
    const b = Math.min(1, prog / 0.42);
    name.style.opacity = 1 - b;
    name.style.transform = `perspective(900px) translate3d(0, ${-b * 40}px, ${b * 260}px) rotateX(${b * 28}deg)`;
    name.style.pointerEvents = b > 0.5 ? 'none' : '';

    /* caption names the print nearest the camera */
    let best = -1, bd = 1e9;
    if (prog > 0.3) prints.forEach((g, i) => { const d = g.position.z - camera.position.z; if (d < -2 && -d < bd) { bd = -d; best = i; } });
    root.classList.toggle('tunnel-on', best > -1);
    if (best > -1 && best !== lastCap) { lastCap = best; const p = prints[best].userData.p; tcNum.textContent = 'GY–' + String(best + 1).padStart(2, '0'); tcTitle.textContent = p.title; }
    root.classList.toggle('tunnel-end', prog > 0.86);
  }
  root.classList.add('gl-ready');
  frame();
})();
