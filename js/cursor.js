// Sci-fi targeting reticle cursor with rotating dual-ring and ember trail
(function () {
  if (matchMedia('(hover: none)').matches) return;

  const dot  = document.getElementById('cursor-dot');
  const ring = document.getElementById('cursor-ring');
  const trail = document.getElementById('cursor-trail');
  if (!dot || !ring || !trail) return;

  const ctx = trail.getContext('2d');

  function resize() {
    trail.width  = window.innerWidth;
    trail.height = window.innerHeight;
  }
  resize();
  trail.style.cssText = 'position:fixed;top:0;left:0;pointer-events:none;z-index:99997;';
  window.addEventListener('resize', resize);

  let mx = window.innerWidth / 2, my = window.innerHeight / 2;
  let rx = mx, ry = my;
  let rotation = 0;
  let isHovering = false;
  let clickPulse = 0;
  const embers = [];

  document.addEventListener('mousemove', (e) => {
    mx = e.clientX;
    my = e.clientY;
    dot.style.left = (mx - 3) + 'px';
    dot.style.top  = (my - 3) + 'px';

    // Spawn embers
    for (let i = 0; i < 2; i++) {
      embers.push({
        x: mx, y: my,
        size: Math.random() * 3.5 + 1.2,
        life: 1,
        decay: Math.random() * 0.055 + 0.025,
        vx: (Math.random() - 0.5) * 1.4,
        vy: -Math.random() * 2.2 - 0.4,
        color: Math.random() > 0.6
          ? '#ff6b2b'
          : (Math.random() > 0.5 ? '#0ea5e9' : '#ff9500'),
      });
    }
    if (embers.length > 200) embers.splice(0, embers.length - 200);
  });

  document.addEventListener('mousedown', () => { clickPulse = 1; });

  function tick() {
    // Lag ring behind cursor
    rx += (mx - rx) * 0.092;
    ry += (my - ry) * 0.092;

    // Rotate ring
    const speed = isHovering ? 3.2 : 1.0;
    rotation = (rotation + speed) % 360;

    const scale = isHovering ? 1.55 : (1 + clickPulse * 0.3);
    clickPulse *= 0.85;

    ring.style.left      = (rx - 18) + 'px';
    ring.style.top       = (ry - 18) + 'px';
    ring.style.transform = `rotate(${rotation}deg) scale(${scale})`;

    // Draw embers
    ctx.clearRect(0, 0, trail.width, trail.height);
    for (let i = embers.length - 1; i >= 0; i--) {
      const e = embers[i];
      e.x += e.vx;
      e.y += e.vy;
      e.life -= e.decay;
      if (e.life <= 0) { embers.splice(i, 1); continue; }

      ctx.save();
      ctx.globalAlpha = e.life * 0.65;
      ctx.shadowBlur  = 8;
      ctx.shadowColor = e.color;
      ctx.fillStyle   = e.color;
      ctx.beginPath();
      ctx.arc(e.x, e.y, e.size * e.life, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }

    requestAnimationFrame(tick);
  }
  tick();

  // Hover state — event delegation catches dynamically added elements too
  const sel = 'a, button, input, textarea, .project-card, .journal-card, .filter-btn, .magnetic, .contact-link';
  document.addEventListener('mouseover', (e) => {
    if (e.target.closest(sel)) {
      isHovering = true;
      dot.style.background = '#0ea5e9';
      dot.style.boxShadow  = '0 0 12px rgba(14,165,233,0.9)';
      dot.style.transform  = 'scale(2)';
    }
  });
  document.addEventListener('mouseout', (e) => {
    if (e.target.closest(sel)) {
      isHovering = false;
      dot.style.background = '#ff6b2b';
      dot.style.boxShadow  = '0 0 10px rgba(255,107,43,0.8)';
      dot.style.transform  = 'scale(1)';
    }
  });

  // Inject cursor base styles
  const s = document.createElement('style');
  s.textContent = `
    #cursor-dot {
      width: 6px; height: 6px;
      background: #ff6b2b;
      border-radius: 50%;
      position: fixed; top: 0; left: 0;
      pointer-events: none;
      z-index: 99999;
      transition: transform 0.12s ease, background 0.18s ease, box-shadow 0.18s ease;
      mix-blend-mode: screen;
      box-shadow: 0 0 10px rgba(255,107,43,0.8);
      will-change: transform;
    }
    #cursor-ring {
      width: 36px; height: 36px;
      position: fixed; top: 0; left: 0;
      pointer-events: none;
      z-index: 99998;
      will-change: transform;
      border-radius: 50%;
      border: 1.5px solid transparent;
      border-top-color: rgba(255,107,43,0.9);
      border-right-color: rgba(255,107,43,0.18);
      border-bottom-color: rgba(14,165,233,0.7);
      border-left-color: rgba(14,165,233,0.18);
    }
  `;
  document.head.appendChild(s);
})();
