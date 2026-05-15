// Cinematic preloader — instant dismiss, no artificial delays
(function () {
  const preloader = document.getElementById('preloader');
  if (!preloader) return;

  const bar = preloader.querySelector('.preloader-bar');
  const pct = preloader.querySelector('.preloader-pct');

  document.documentElement.style.overflow = 'hidden';

  // Flash to 100% immediately, then exit
  function dismiss() {
    if (bar) bar.style.width = '100%';
    if (pct) pct.textContent = '100%';

    preloader.classList.add('exit');
    document.documentElement.style.overflow = '';

    setTimeout(() => {
      preloader.style.display = 'none';
    }, 900);
  }

  // Quick animated fill: 0→100% in ~500ms, then dismiss
  let progress = 0;
  let rafId;

  function fastFill() {
    progress = Math.min(progress + 6, 100);
    if (bar) bar.style.width = progress + '%';
    if (pct) pct.textContent = progress + '%';
    if (progress < 100) {
      rafId = requestAnimationFrame(fastFill);
    } else {
      setTimeout(dismiss, 80);
    }
  }

  rafId = requestAnimationFrame(fastFill);

  // Safety cap — never show longer than 1.4s total
  setTimeout(() => {
    cancelAnimationFrame(rafId);
    dismiss();
  }, 1400);
})();
