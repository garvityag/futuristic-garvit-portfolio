// Cinematic preloader — runs immediately on parse
(function () {
  const preloader = document.getElementById('preloader');
  if (!preloader) return;

  const bar = preloader.querySelector('.preloader-bar');
  const pct = preloader.querySelector('.preloader-pct');

  document.documentElement.style.overflow = 'hidden';

  let progress = 0;
  let rafId;

  // Ease-out acceleration curve: fast at start, slows near end
  function easeProgress() {
    const remaining = 100 - progress;
    const step = Math.max(remaining * 0.045, 0.4) + Math.random() * 0.8;
    progress = Math.min(progress + step, 99.5);

    if (bar) bar.style.width = progress.toFixed(1) + '%';
    if (pct) pct.textContent = Math.floor(progress) + '%';

    if (progress < 99.5) {
      rafId = requestAnimationFrame(easeProgress);
    }
  }

  rafId = requestAnimationFrame(easeProgress);

  function dismiss() {
    cancelAnimationFrame(rafId);
    progress = 100;
    if (bar) bar.style.width = '100%';
    if (pct) pct.textContent = '100%';

    setTimeout(() => {
      preloader.classList.add('exit');
      document.documentElement.style.overflow = '';

      setTimeout(() => {
        preloader.style.display = 'none';
      }, 950);
    }, 280);
  }

  // Dismiss on page ready (whichever fires first)
  if (document.readyState === 'complete') {
    setTimeout(dismiss, 600);
  } else {
    window.addEventListener('load', () => setTimeout(dismiss, 400));
  }

  // Safety timeout
  setTimeout(dismiss, 3800);
})();
