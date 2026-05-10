// Custom cursor with ember trail
(function () {
  if (matchMedia('(hover: none)').matches) return;

  const dot = document.getElementById('cursor-dot');
  const ring = document.getElementById('cursor-ring');
  const canvas = document.getElementById('cursor-trail');
  if (!dot || !ring || !canvas) return;

  const ctx = canvas.getContext('2d');

  function size() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }
  size();
  canvas.style.cssText = `
    position:fixed;top:0;left:0;
    pointer-events:none;z-index:99997;
  `;
  window.addEventListener('resize', size);

  let mx = window.innerWidth / 2, my = window.innerHeight / 2;
  let rx = mx, ry = my;
  const embers = [];

  document.addEventListener('mousemove', (e) => {
    mx = e.clientX;
    my = e.clientY;
    dot.style.left = (mx - 3) + 'px';
    dot.style.top = (my - 3) + 'px';
    embers.push({
      x: mx, y: my,
      size: Math.random() * 4 + 2,
      life: 1,
      decay: Math.random() * 0.04 + 0.03,
      vx: (Math.random() - 0.5) * 1.5,
      vy: -Math.random() * 2 - 0.5,
      color: Math.random() > 0.5 ? '#ff6b2b' : '#ff9500'
    });
    if (embers.length > 220) embers.splice(0, embers.length - 220);
  });

  function tick() {
    rx += (mx - rx) * 0.1;
    ry += (my - ry) * 0.1;
    ring.style.left = (rx - 14) + 'px';
    ring.style.top = (ry - 14) + 'px';

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    for (let i = embers.length - 1; i >= 0; i--) {
      const e = embers[i];
      e.x += e.vx; e.y += e.vy; e.life -= e.decay;
      if (e.life <= 0) { embers.splice(i, 1); continue; }
      ctx.save();
      ctx.globalAlpha = e.life;
      ctx.fillStyle = e.color;
      ctx.beginPath();
      ctx.arc(e.x, e.y, e.size * e.life, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }
    requestAnimationFrame(tick);
  }
  tick();

  // hover state for interactive elements (uses event delegation so it
  // also picks up dynamically-added elements)
  const interactiveSel = 'a, button, input, textarea, .project-card, .journal-card, .filter-btn, .magnetic, .contact-link';
  document.addEventListener('mouseover', (e) => {
    if (e.target.closest(interactiveSel)) {
      dot.style.transform = 'scale(3)';
      ring.style.transform = 'scale(1.5)';
      ring.style.borderColor = '#ff6b2b';
    }
  });
  document.addEventListener('mouseout', (e) => {
    if (e.target.closest(interactiveSel)) {
      dot.style.transform = 'scale(1)';
      ring.style.transform = 'scale(1)';
      ring.style.borderColor = 'rgba(255,107,43,0.5)';
    }
  });

  // Inject base cursor styles
  const cursorStyle = document.createElement('style');
  cursorStyle.textContent = `
    #cursor-dot {
      width:6px;height:6px;
      background:#ff6b2b;
      border-radius:50%;
      position:fixed;
      top:0;left:0;
      pointer-events:none;
      z-index:99999;
      transition:transform 0.15s ease;
      mix-blend-mode:screen;
    }
    #cursor-ring {
      width:28px;height:28px;
      border:1.5px solid rgba(255,107,43,0.5);
      border-radius:50%;
      position:fixed;
      top:0;left:0;
      pointer-events:none;
      z-index:99998;
      transition:transform 0.2s ease,border-color 0.2s ease;
    }
  `;
  document.head.appendChild(cursorStyle);
})();
