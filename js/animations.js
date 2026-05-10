document.addEventListener('DOMContentLoaded', () => {

  // 1. SCROLL PROGRESS BAR
  const bar = document.getElementById('scroll-progress');
  if (bar) {
    bar.style.cssText = `
      position:fixed;top:0;left:0;height:2px;width:0%;
      background:linear-gradient(90deg,#ff6b2b,#ff9500,#6366f1);
      z-index:99996;transition:width 0.1s linear;
    `;
    window.addEventListener('scroll', () => {
      const max = document.body.scrollHeight - window.innerHeight;
      const pct = max > 0 ? window.scrollY / max : 0;
      bar.style.width = (pct * 100) + '%';
    }, { passive: true });
  }

  // 2. LETTER STAGGER on hero name
  const nameEl = document.getElementById('heroName');
  if (nameEl) {
    const raw = nameEl.textContent.trim();
    let out = '';
    let delay = 0;
    for (let i = 0; i < raw.length; i++) {
      const ch = raw[i];
      if (ch === ' ') {
        out += '<span style="display:inline;width:0.3em;"> </span>';
        continue;
      }
      out += '<span class="letter" style="animation-delay:' + delay + 'ms;">' + ch + '</span>';
      delay += 40;
    }
    nameEl.innerHTML = out;
  }

  // 3. TYPEWRITER
  const desgEl = document.getElementById('heroDesignation');
  if (desgEl) {
    const roles = [
      'Graphic Designer',
      'Art Director',
      'Visual Strategist',
      'Creative Technologist'
    ];
    let ri = 0, ci = 0, deleting = false;
    function type() {
      const role = roles[ri];
      if (!deleting) {
        desgEl.textContent = role.slice(0, ci++);
        if (ci > role.length) {
          deleting = true;
          setTimeout(type, 1800);
          return;
        }
      } else {
        desgEl.textContent = role.slice(0, ci--);
        if (ci < 0) {
          deleting = false;
          ri = (ri + 1) % roles.length;
          ci = 0;
        }
      }
      setTimeout(type, deleting ? 40 : 80);
    }
    setTimeout(type, 800);
  }

  // 4. COUNTER ANIMATION
  const counters = document.querySelectorAll('.stat-num[data-target]');
  const counterObs = new IntersectionObserver((entries) => {
    entries.forEach(en => {
      if (!en.isIntersecting) return;
      const el = en.target;
      const target = parseInt(el.dataset.target, 10);
      let current = 0;
      const step = Math.max(target / 40, 1);
      const timer = setInterval(() => {
        current += step;
        if (current >= target) { current = target; clearInterval(timer); }
        el.textContent = Math.floor(current);
      }, 30);
      counterObs.unobserve(el);
    });
  }, { threshold: 0.4 });
  counters.forEach(c => counterObs.observe(c));

  // 5. SCROLL REVEAL
  const reveals = document.querySelectorAll('.reveal');
  const obs = new IntersectionObserver((entries) => {
    entries.forEach((en, i) => {
      if (en.isIntersecting) {
        setTimeout(() => en.target.classList.add('visible'), i * 80);
        obs.unobserve(en.target);
      }
    });
  }, { threshold: 0.08, rootMargin: '0px 0px -60px 0px' });
  reveals.forEach(el => obs.observe(el));

  // 6. MAGNETIC BUTTONS
  document.querySelectorAll('.magnetic').forEach(btn => {
    btn.addEventListener('mousemove', (e) => {
      const r = btn.getBoundingClientRect();
      const x = e.clientX - r.left - r.width / 2;
      const y = e.clientY - r.top - r.height / 2;
      btn.style.transform = `translate(${x * 0.15}px, ${y * 0.15}px)`;
    });
    btn.addEventListener('mouseleave', () => {
      btn.style.transform = '';
    });
  });

  // 7. 3D TILT
  document.querySelectorAll('.project-card, .journal-card').forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const r = card.getBoundingClientRect();
      const x = (e.clientX - r.left) / r.width - 0.5;
      const y = (e.clientY - r.top) / r.height - 0.5;
      card.style.transform = `perspective(800px) rotateY(${x * 8}deg) rotateX(${-y * 8}deg) translateY(-4px)`;
    });
    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
    });
  });

  // 8. JOURNAL DRAG SCROLL
  const row = document.getElementById('journalsRow');
  if (row) {
    let isDown = false, startX, scrollLeft;
    row.addEventListener('mousedown', (e) => {
      isDown = true;
      startX = e.pageX - row.offsetLeft;
      scrollLeft = row.scrollLeft;
    });
    row.addEventListener('mouseleave', () => isDown = false);
    row.addEventListener('mouseup', () => isDown = false);
    row.addEventListener('mousemove', (e) => {
      if (!isDown) return;
      e.preventDefault();
      const x = e.pageX - row.offsetLeft;
      row.scrollLeft = scrollLeft - (x - startX) * 1.5;
    });
  }

  // 9. NAV ACTIVE on scroll
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-link');
  if (sections.length && navLinks.length) {
    window.addEventListener('scroll', () => {
      let current = '';
      sections.forEach(s => {
        if (window.scrollY >= s.offsetTop - 200) current = s.id;
      });
      navLinks.forEach(link => {
        const href = link.getAttribute('href');
        link.classList.toggle('active', href === '#' + current);
      });
    }, { passive: true });
  }

  // 10. FORM SUBMIT
  const form = document.getElementById('contactForm');
  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const btn = form.querySelector('.form-submit');
      if (!btn) return;
      const orig = btn.innerHTML;
      btn.textContent = 'Sending...';
      btn.style.opacity = '0.7';
      setTimeout(() => {
        btn.textContent = 'Sent ✓';
        btn.style.background = 'linear-gradient(135deg,#4ade80,#22c55e)';
        btn.style.color = '#0a0a0a';
        btn.style.opacity = '1';
        setTimeout(() => {
          btn.innerHTML = orig;
          btn.style.background = '';
          btn.style.color = '';
        }, 2400);
      }, 1500);
    });
  }

  // 11. KONAMI CODE
  const konami = [38, 38, 40, 40, 37, 39, 37, 39, 66, 65];
  let ki = 0;
  document.addEventListener('keydown', (e) => {
    if (e.keyCode === konami[ki]) ki++;
    else ki = 0;
    if (ki === konami.length) {
      ki = 0;
      const msg = document.createElement('div');
      msg.style.cssText = `
        position:fixed;top:50%;left:50%;
        transform:translate(-50%,-50%);
        font-family:'Space Mono',monospace;
        font-size:18px;color:#ff6b2b;
        background:rgba(0,0,0,0.95);
        border:1px solid #ff6b2b;
        padding:32px 48px;border-radius:16px;
        z-index:999999;text-align:center;
        animation:fadeIn 0.3s ease;
      `;
      msg.innerHTML = `
        <div style="font-size:32px;margin-bottom:12px">🔥</div>
        You found the secret.<br>
        <span style="color:#ff9500">Garvit would be impressed.</span>
      `;
      document.body.appendChild(msg);
      setTimeout(() => msg.remove(), 3000);
    }
  });

  // 12. CHARACTER CAROUSEL
  (function initCarousel() {
    const slides = document.querySelectorAll('.char-slide');
    const dots = document.querySelectorAll('.char-dot');
    if (!slides.length) return;

    let current = 0;
    let timer = null;
    let isAnimating = false;

    function goTo(index) {
      if (isAnimating || index === current) return;
      isAnimating = true;

      slides[current].classList.remove('active');
      slides[current].classList.add('exit');
      if (dots[current]) dots[current].classList.remove('active');

      setTimeout(() => {
        slides[current].classList.remove('exit');
        current = index;
        slides[current].classList.add('active');
        if (dots[current]) dots[current].classList.add('active');
        isAnimating = false;
      }, 300);
    }

    function next() {
      goTo((current + 1) % slides.length);
    }

    function startTimer() {
      stopTimer();
      timer = setInterval(next, 2500);
    }

    function stopTimer() {
      if (timer) clearInterval(timer);
      timer = null;
    }

    dots.forEach((dot, i) => {
      dot.addEventListener('click', () => {
        stopTimer();
        goTo(i);
        startTimer();
      });
    });

    const carousel = document.getElementById('charCarousel');
    if (carousel) {
      carousel.addEventListener('mouseenter', stopTimer);
      carousel.addEventListener('mouseleave', startTimer);

      let touchStartX = 0;
      carousel.addEventListener('touchstart', (e) => {
        touchStartX = e.touches[0].clientX;
        stopTimer();
      }, { passive: true });

      carousel.addEventListener('touchend', (e) => {
        const diff = touchStartX - e.changedTouches[0].clientX;
        if (Math.abs(diff) > 50) {
          if (diff > 0) {
            next();
          } else {
            goTo((current - 1 + slides.length) % slides.length);
          }
        }
        startTimer();
      }, { passive: true });
    }

    startTimer();

    // Scroll parallax on active character
    window.addEventListener('scroll', () => {
      const scrollY = window.scrollY;
      const activeImg = slides[current] && slides[current].querySelector('.character-img');
      if (activeImg && scrollY < window.innerHeight) {
        activeImg.style.marginBottom = (scrollY * 0.1) + 'px';
      }
    }, { passive: true });
  })();
});
