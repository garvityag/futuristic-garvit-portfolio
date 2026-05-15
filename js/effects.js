// Elite visual effects — 3D card tilt, magnetic buttons, cursor spotlight
(function () {

  // ── 3D Card Tilt ──────────────────────────────────────────
  function initTilt() {
    const cards = document.querySelectorAll('.project-card, .journal-card');
    if (matchMedia('(hover: none)').matches) return; // skip touch

    cards.forEach(card => {
      const MAX = 8; // max tilt degrees

      card.addEventListener('mousemove', e => {
        const r  = card.getBoundingClientRect();
        const x  = (e.clientX - r.left) / r.width  - 0.5;
        const y  = (e.clientY - r.top)  / r.height - 0.5;
        const ry =  x * MAX;
        const rx = -y * MAX;

        card.style.transform = `perspective(900px) rotateX(${rx}deg) rotateY(${ry}deg) translateY(-8px)`;
        card.style.transition = 'transform 0.05s linear';

        // Move shimmer highlight to mouse position
        const shine = card.querySelector('.card-shine');
        if (shine) {
          shine.style.background = `radial-gradient(circle at ${(x+0.5)*100}% ${(y+0.5)*100}%,
            rgba(255,255,255,0.06) 0%,
            transparent 65%)`;
        }
      });

      card.addEventListener('mouseleave', () => {
        card.style.transform = '';
        card.style.transition = 'transform 0.55s cubic-bezier(0.22,1,0.36,1)';
        const shine = card.querySelector('.card-shine');
        if (shine) shine.style.background = '';
      });

      // Inject shine layer
      const shine = document.createElement('div');
      shine.className = 'card-shine';
      shine.style.cssText = `
        position:absolute; inset:0; border-radius:inherit;
        pointer-events:none; z-index:5; transition:background 0.08s ease;
      `;
      card.appendChild(shine);
    });
  }

  // ── Magnetic Buttons ──────────────────────────────────────
  function initMagnetic() {
    const btns = document.querySelectorAll('.magnetic, .nav-cta');
    if (matchMedia('(hover: none)').matches) return;

    btns.forEach(btn => {
      btn.addEventListener('mousemove', e => {
        const r    = btn.getBoundingClientRect();
        const cx   = r.left + r.width  / 2;
        const cy   = r.top  + r.height / 2;
        const dx   = (e.clientX - cx) * 0.28;
        const dy   = (e.clientY - cy) * 0.28;
        btn.style.transform   = `translate(${dx}px, ${dy}px)`;
        btn.style.transition  = 'transform 0.1s ease';
      });
      btn.addEventListener('mouseleave', () => {
        btn.style.transform  = '';
        btn.style.transition = 'transform 0.45s cubic-bezier(0.22,1,0.36,1)';
      });
    });
  }

  // ── Cursor Spotlight on Hero ───────────────────────────────
  function initSpotlight() {
    const hero = document.querySelector('.hero-card');
    if (!hero || matchMedia('(hover: none)').matches) return;

    const spotlight = document.createElement('div');
    spotlight.style.cssText = `
      position:absolute; inset:0; border-radius:inherit;
      pointer-events:none; z-index:2; opacity:0;
      transition:opacity 0.4s ease;
      background:radial-gradient(circle 280px at 50% 50%,
        rgba(255,107,43,0.04) 0%, transparent 70%);
    `;
    hero.appendChild(spotlight);

    hero.addEventListener('mouseenter', () => { spotlight.style.opacity = '1'; });
    hero.addEventListener('mouseleave', () => { spotlight.style.opacity = '0'; });

    hero.addEventListener('mousemove', e => {
      const r  = hero.getBoundingClientRect();
      const x  = ((e.clientX - r.left) / r.width  * 100).toFixed(1);
      const y  = ((e.clientY - r.top)  / r.height * 100).toFixed(1);
      spotlight.style.background = `radial-gradient(circle 320px at ${x}% ${y}%,
        rgba(255,107,43,0.055) 0%,
        rgba(14,165,233,0.025) 40%,
        transparent 70%)`;
    });
  }

  // ── Skill Bars animate on scroll ─────────────────────────
  function initSkillBars() {
    const bars = document.querySelectorAll('.skill-fill');
    if (!bars.length) return;

    const obs = new IntersectionObserver(entries => {
      entries.forEach(en => {
        if (en.isIntersecting) {
          en.target.style.width = en.target.dataset.width || en.target.style.width;
          en.target.style.transition = 'width 1.1s cubic-bezier(0.22,1,0.36,1) 0.2s';
          obs.unobserve(en.target);
        }
      });
    }, { threshold: 0.3 });

    bars.forEach(bar => {
      const w = bar.style.width;
      bar.dataset.width = w;
      bar.style.width = '0';
      obs.observe(bar);
    });
  }

  // ── Counter animation on stats ────────────────────────────
  function initCounters() {
    const nums = document.querySelectorAll('.stat-num[data-target]');
    if (!nums.length) return;

    const obs = new IntersectionObserver(entries => {
      entries.forEach(en => {
        if (!en.isIntersecting) return;
        const el  = en.target;
        const end = parseInt(el.dataset.target, 10);
        const dur = 1400;
        const start = performance.now();

        function step(now) {
          const p = Math.min((now - start) / dur, 1);
          const ease = 1 - Math.pow(1 - p, 3);
          el.textContent = Math.round(ease * end);
          if (p < 1) requestAnimationFrame(step);
          else el.textContent = end;
        }
        requestAnimationFrame(step);
        obs.unobserve(el);
      });
    }, { threshold: 0.5 });

    nums.forEach(n => obs.observe(n));
  }

  // ── Project card tag pop on hover ─────────────────────────
  function initTagPop() {
    document.querySelectorAll('.project-card').forEach(card => {
      card.addEventListener('mouseenter', () => {
        card.querySelectorAll('.project-tag').forEach((tag, i) => {
          tag.style.transitionDelay = `${i * 45}ms`;
          tag.style.transform = 'translateY(-2px)';
          tag.style.opacity = '1';
        });
      });
      card.addEventListener('mouseleave', () => {
        card.querySelectorAll('.project-tag').forEach(tag => {
          tag.style.transitionDelay = '0ms';
          tag.style.transform = '';
          tag.style.opacity = '';
        });
      });
    });
  }

  // ── Section reveal animation ─────────────────────────────
  function initRevealWave() {
    const els = document.querySelectorAll('.journal-card, .project-card');
    const obs = new IntersectionObserver(entries => {
      entries.forEach((en, idx) => {
        if (en.isIntersecting) {
          const delay = parseInt(en.target.dataset.revealDelay || 0);
          en.target.style.transitionDelay = delay + 'ms';
          en.target.classList.add('revealed');
          obs.unobserve(en.target);
        }
      });
    }, { threshold: 0.08 });

    // Assign staggered delays by position in grid
    let idx = 0;
    document.querySelectorAll('.journals-row .journal-card').forEach(el => {
      el.dataset.revealDelay = idx * 80;
      idx++;
    });
    idx = 0;
    document.querySelectorAll('.work-grid .project-card').forEach(el => {
      el.dataset.revealDelay = idx * 60;
      idx++;
    });

    els.forEach(el => obs.observe(el));
  }

  document.addEventListener('DOMContentLoaded', () => {
    initTilt();
    initMagnetic();
    initSpotlight();
    initSkillBars();
    initCounters();
    initTagPop();
    initRevealWave();

    // Safety: reveal all cards after 1.6s regardless (catches slow observers)
    setTimeout(() => {
      document.querySelectorAll('.journal-card:not(.revealed), .project-card:not(.revealed)').forEach(el => {
        el.style.transitionDelay = '0ms';
        el.classList.add('revealed');
      });
    }, 1600);
  });

})();
