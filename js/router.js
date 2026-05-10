// Lightweight client-side routing helpers
// Used by subpages to read query string and hydrate content
window.Router = {
  getParam(name) {
    const url = new URL(window.location.href);
    return url.searchParams.get(name);
  },
  buildUrl(page, params = {}) {
    const qs = new URLSearchParams(params).toString();
    return qs ? `${page}?${qs}` : page;
  },
  navigate(url) {
    window.location.href = url;
  }
};

// Internal nav anchor handler — fixed offset for any in-page nav
document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', (e) => {
      const href = a.getAttribute('href');
      if (href.length > 1 && document.querySelector(href)) {
        if (typeof Lenis === 'undefined') {
          // fallback only — lenis-init handles when lenis is present
          e.preventDefault();
          const target = document.querySelector(href);
          window.scrollTo({ top: target.offsetTop - 80, behavior: 'smooth' });
        }
      }
    });
  });
});
