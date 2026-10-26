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

  /* ---------------- the developing tray ----------------
     A darkroom under safelight. Scrolling slides each print into
     the developer, the image appears out of blank paper, then the
     print is lifted and pegged on the drying line above.        */
  const stage = document.getElementById('heroStage');
  const canvas = document.getElementById('gl');
  if (!stage || !canvas) return;
  const hero = document.getElementById('hero');
  const grid = hero.querySelector('.hero-grid');
  const name = hero.querySelector('.hero-name');
  const foot = hero.querySelector('.hero-foot');
  const tcNum = document.getElementById('tcNum'), tcTitle = document.getElementById('tcTitle');

  const ok = (() => { try { return !!(window.THREE && (canvas.getContext('webgl') || canvas.getContext('experimental-webgl'))); } catch (e) { return false; } })();
  if (!ok) { root.classList.add('no-gl'); return; }

  const T = window.THREE;
  const renderer = new T.WebGLRenderer({ canvas, antialias: true, alpha: false, powerPreference: 'high-performance' });
  renderer.setPixelRatio(Math.min(devicePixelRatio, mobile ? 1.5 : 1.75));
  renderer.setClearColor(0x0b0605, 1);
  const scene = new T.Scene();
  const camera = new T.PerspectiveCamera(mobile ? 58 : 42, 1, 0.1, 100);
  const look = new T.Vector3(0, 1.2, 0);

  /* prints to develop: projects with real thumbnails first */
  const base = window.ASSET_BASE || '';
  const all = (window.PROJECTS || []);
  const picks = all.filter(p => p.thumb).concat(all.filter(p => !p.thumb)).slice(0, mobile ? 5 : 8);
  const N = picks.length;

  /* ---- liquid surface ---- */
  const liquidMat = new T.ShaderMaterial({
    uniforms: { uTime: { value: 0 }, uMouse: { value: new T.Vector2(0, 0) }, uPulse: { value: 0 }, uDrop: { value: new T.Vector2(0, 0) }, uDropT: { value: -10 } },
    vertexShader: `varying vec2 vUv; varying vec3 vP; void main(){ vUv = uv; vec4 w = modelMatrix * vec4(position,1.); vP = w.xyz; gl_Position = projectionMatrix * viewMatrix * w; }`,
    fragmentShader: `
      precision highp float; varying vec2 vUv; varying vec3 vP;
      uniform float uTime; uniform vec2 uMouse; uniform float uPulse; uniform vec2 uDrop; uniform float uDropT;
      float h(vec2 p){ return fract(sin(dot(p, vec2(127.1,311.7))) * 43758.5453); }
      float n(vec2 p){ vec2 i=floor(p), f=fract(p); f=f*f*(3.-2.*f);
        return mix(mix(h(i),h(i+vec2(1,0)),f.x), mix(h(i+vec2(0,1)),h(i+vec2(1,1)),f.x), f.y); }
      void main(){
        vec2 p = vP.xz;
        float d = length(p - uMouse);
        float ring = sin(d * 7.0 - uTime * 4.0) * exp(-d * 0.55) * (0.35 + uPulse);
        float dd = length(p - uDrop); float age = uTime - uDropT;
        ring += sin(dd * 9.0 - age * 9.0) * exp(-dd * 0.7) * exp(-age * 1.2) * step(0.0, age) * 1.4;
        float c = n(p * 1.6 + vec2(uTime * .05, -uTime * .04)) * .6 + n(p * 3.7 - uTime * .07) * .4;
        float caust = pow(smoothstep(.45, .95, c), 3.0);
        vec3 deep = vec3(.045, .018, .015);
        vec3 safe = vec3(.92, .18, .10);
        float spot = exp(-length(p - vec2(2.5, -3.0)) * .32);
        vec3 col = deep + safe * (spot * .55 + caust * .10 * spot + ring * .07 * (0.4 + spot));
        float edge = smoothstep(0.0, .06, vUv.x) * smoothstep(0.0, .06, vUv.y) * smoothstep(0.0, .06, 1. - vUv.x) * smoothstep(0.0, .06, 1. - vUv.y);
        col = mix(vec3(.02,.012,.01), col, edge);
        gl_FragColor = vec4(col, 1.0);
      }`
  });
  const liquid = new T.Mesh(new T.PlaneGeometry(13, 9, 1, 1), liquidMat);
  liquid.rotation.x = -Math.PI / 2;
  scene.add(liquid);

  /* tray rim */
  const rimMat = new T.MeshBasicMaterial({ color: 0x1a0d0a });
  [[0, -4.6, 13.6, 0.3], [0, 4.6, 13.6, 0.3], [-6.65, 0, 0.3, 9.4], [6.65, 0, 0.3, 9.4]].forEach(([x, z, w, d]) => {
    const m = new T.Mesh(new T.BoxGeometry(w, 0.35, d), rimMat); m.position.set(x, 0.12, z); scene.add(m);
  });

  /* ---- drying line ---- */
  const LINE_Y = 3.55, LINE_Z = -3.4;
  const lineGeo = new T.BufferGeometry().setFromPoints(Array.from({ length: 40 }, (_, i) => {
    const x = -8 + i * (16 / 39); return new T.Vector3(x, LINE_Y + 0.12 - Math.pow(x / 8, 2) * -0.25 - 0.25, LINE_Z);
  }));
  scene.add(new T.Line(lineGeo, new T.LineBasicMaterial({ color: 0x5a3a30 })));

  /* ---- prints ---- */
  const PW = 3.2, PH = 2.4;
  const printVS = `varying vec2 vUv; void main(){ vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.); }`;
  const printFS = `
    precision highp float; varying vec2 vUv;
    uniform sampler2D uTex; uniform float uDev; uniform float uWet; uniform float uTime; uniform float uHas;
    float h(vec2 p){ return fract(sin(dot(p, vec2(12.9898,78.233))) * 43758.5453); }
    float n(vec2 p){ vec2 i=floor(p), f=fract(p); f=f*f*(3.-2.*f);
      return mix(mix(h(i),h(i+vec2(1,0)),f.x), mix(h(i+vec2(0,1)),h(i+vec2(1,1)),f.x), f.y); }
    void main(){
      vec2 uv = vUv;
      uv += vec2(sin(uv.y * 18. + uTime * 2.), cos(uv.x * 14. + uTime * 1.7)) * .0035 * uWet;
      float border = step(.035, uv.x) * step(.035, 1.-uv.x) * step(.045, uv.y) * step(.035, 1.-uv.y);
      vec2 iuv = (uv - vec2(.035,.045)) / vec2(.93,.92);
      vec3 img = texture2D(uTex, iuv).rgb;
      vec3 paper = vec3(.93,.90,.84);
      float fb = n(iuv * 5.) * .6 + n(iuv * 13.) * .4;
      float dev = smoothstep(fb - .22, fb + .22, uDev * 1.35 - .2);
      vec3 latent = mix(paper, paper * vec3(.86,.80,.74), smoothstep(.0, .3, uDev));
      vec3 im = mix(latent, img, dev);
      vec3 col = mix(paper, im, border);
      col *= mix(vec3(1.), vec3(1., .58, .5), uWet * .55);
      col += vec3(.25,.05,.03) * uWet * pow(1. - abs(uv.y - .5) * 2., 4.) * .25;
      gl_FragColor = vec4(col, 1.);
    }`;
  const loader = new T.TextureLoader();
  function coverTex(p, i) {
    const c = document.createElement('canvas'); c.width = 800; c.height = 600; const x = c.getContext('2d'); const cv = p.cover || {};
    x.fillStyle = cv.bg || '#201d1a'; x.fillRect(0, 0, 800, 600);
    x.fillStyle = cv.ink || '#ede6d6'; x.font = '900 180px Archivo, "Arial Narrow", sans-serif';
    x.fillText(p.stat ? p.stat.value : String(i + 1).padStart(2, '0'), 40, 470);
    x.font = '500 22px "IBM Plex Mono", monospace'; x.fillText(p.title.toUpperCase().slice(0, 40), 44, 64);
    return new T.CanvasTexture(c);
  }
  const prints = picks.map((p, i) => {
    const mat = new T.ShaderMaterial({
      uniforms: { uTex: { value: coverTex(p, i) }, uDev: { value: 0 }, uWet: { value: 0 }, uTime: { value: 0 }, uHas: { value: 1 } },
      vertexShader: printVS, fragmentShader: printFS, side: T.DoubleSide
    });
    if (p.thumb) loader.load(base + p.thumb, tex => { tex.minFilter = T.LinearFilter; mat.uniforms.uTex.value = tex; });
    const m = new T.Mesh(new T.PlaneGeometry(PW, PH * 1.04, 1, 1), mat);
    const clip = new T.Mesh(new T.BoxGeometry(0.18, 0.34, 0.08), new T.MeshBasicMaterial({ color: 0x2b1b16 }));
    clip.position.set(0, PH * 0.52 + 0.08, 0.02); m.add(clip); clip.visible = false;
    const g = new T.Group(); g.add(m); g.visible = false; scene.add(g);
    const slotX = (i - (N - 1) / 2) * (mobile ? 1.45 : 1.75);
    g.userData = { p, i, mat, clip, slot: new T.Vector3(slotX, LINE_Y - 0.45, LINE_Z), seed: Math.random() * 6 };
    return g;
  });

  /* ---- sizing ---- */
  function resize() {
    const w = hero.clientWidth, hh = hero.clientHeight;
    renderer.setSize(w, hh, false); camera.aspect = w / hh; camera.updateProjectionMatrix();
  }
  resize(); addEventListener('resize', resize);

  /* ---- input: ripples follow the cursor, click drops a ripple ---- */
  const ray = new T.Raycaster(); const ndc = new T.Vector2(); let mx = 0, my = 0, tmx = 0, tmy = 0, pulse = 0;
  const target = new T.Vector2(0, 0);
  hero.addEventListener('pointermove', e => {
    const r = hero.getBoundingClientRect();
    tmx = ((e.clientX - r.left) / r.width) * 2 - 1; tmy = -(((e.clientY - r.top) / r.height) * 2 - 1);
    ndc.set(tmx, tmy); ray.setFromCamera(ndc, camera);
    const hit = ray.intersectObject(liquid)[0]; if (hit) target.set(hit.point.x, hit.point.z);
    pulse = Math.min(1, pulse + 0.06);
  });
  hero.addEventListener('pointerdown', () => { liquidMat.uniforms.uDrop.value.copy(target); liquidMat.uniforms.uDropT.value = clock.getElapsedTime(); });

  /* ---- scroll ---- */
  let prog = 0, tprog = 0;
  function readScroll() {
    const r = stage.getBoundingClientRect(); const span = stage.offsetHeight - innerHeight;
    tprog = reduced ? 0 : Math.min(1, Math.max(0, -r.top / Math.max(1, span)));
  }
  addEventListener('scroll', readScroll, { passive: true }); readScroll();
  let visible = true; new IntersectionObserver(es => { visible = es[0].isIntersecting; }).observe(hero);

  const clock = new T.Clock();
  const L = (a, b, t) => a + (b - a) * t;
  const cl = v => Math.min(1, Math.max(0, v));
  const sm = v => v * v * (3 - 2 * v);
  const TRAY = new T.Vector3(0, 0.03, 0.6);
  let lastCap = -1;

  function frame() {
    requestAnimationFrame(frame);
    if (!visible) return;
    const t = clock.getElapsedTime();
    prog = L(prog, tprog, 0.09); mx = L(mx, tmx, 0.05); my = L(my, tmy, 0.05); pulse *= 0.96;
    const lm = liquidMat.uniforms; lm.uTime.value = t; lm.uPulse.value = pulse;
    lm.uMouse.value.lerp(target, 0.12);

    /* camera: a slow lean over the tray, rising toward the line */
    const rise = sm(cl((prog - 0.03) / 0.45));
    camera.position.set(mx * 0.9, L(mobile ? 9.5 : 8.2, mobile ? 8.2 : 6.8, rise) + my * 0.4, L(mobile ? 9.5 : 8.4, mobile ? 9 : 8.8, rise));
    look.set(mx * 0.4, L(0.6, 1.75, rise), L(0.2, -0.9, rise));
    camera.lookAt(look);

    /* prints: enter, develop, lift, peg */
    const span = 0.92 / N; let active = -1;
    prints.forEach((g, i) => {
      const u = g.userData, m = g.children[0];
      const f = (prog - 0.04 - i * span) / span;      // local 0..1 for this print
      u.mat.uniforms.uTime.value = t;
      if (f < -0.05) { g.visible = false; return; }
      g.visible = true;
      const enter = sm(cl(f / 0.2)), dev = cl((f - 0.15) / 0.5), lift = sm(cl((f - 0.68) / 0.32));
      if (f >= 0 && f < 1) active = i;
      // in the tray: slide in from the right, lie flat, rock with the liquid
      const trayPos = TRAY.clone().add(new T.Vector3(L(9, 0, enter), 0, L(1.2, 0, enter)));
      trayPos.y += Math.sin(t * 1.3 + u.seed) * 0.02;
      const hang = u.slot.clone(); hang.y += Math.sin(t * 0.9 + u.seed) * 0.03;
      const arc = Math.sin(lift * Math.PI) * 1.6;
      g.position.set(L(trayPos.x, hang.x, lift), L(trayPos.y, hang.y, lift) + arc, L(trayPos.z, hang.z, lift));
      const sc = L(1, mobile ? 0.42 : 0.5, lift); g.scale.set(sc, sc, sc);
      m.rotation.set(L(-Math.PI / 2, 0, lift) + Math.sin(t * 0.8 + u.seed) * 0.02 * (1 - lift), 0, L(-0.06, Math.sin(t * 0.7 + u.seed) * 0.03, lift));
      u.mat.uniforms.uDev.value = dev;
      u.mat.uniforms.uWet.value = (1 - lift) * enter * 0.9 + lift * 0.25;
      u.clip.visible = lift > 0.85;
    });
    renderer.render(scene, camera);

    /* DOM choreography */
    const a = cl(prog / 0.12);
    grid.style.opacity = 1 - a; grid.style.transform = `translate3d(0, ${-a * 50}px, 0)`;
    foot.style.opacity = 1 - cl(prog / 0.08);
    const b = cl(prog / 0.16);
    name.style.opacity = 1 - b;
    name.style.transform = `perspective(900px) translate3d(0, ${b * 80}px, ${-b * 200}px) rotateX(${-b * 35}deg)`;
    name.style.filter = `blur(${b * 6}px)`;
    root.classList.toggle('tunnel-on', active > -1 && prog > 0.08 && prog < 0.95);
    if (active > -1 && active !== lastCap) {
      lastCap = active; const p = prints[active].userData.p;
      tcNum.textContent = 'DEVELOPING · GY–' + String(all.indexOf(p) + 1).padStart(2, '0'); tcTitle.textContent = p.title;
    }
    root.classList.toggle('tunnel-end', prog > 0.95);
  }
  root.classList.add('gl-ready');
  frame();
})();
