/* Homepage: hero carousel, work grid + filters, AI lab, journal, contact */

/* Paste your Formspree form ID here (e.g. 'xyzabcd') to receive messages
   by email. Left empty, the form opens a pre-filled email instead. */
const FORMSPREE_ID = '';

document.addEventListener('DOMContentLoaded', () => {
  /* ---------- Hero character carousel ---------- */
  const figs = document.querySelectorAll('.hero-figure img');
  const counter = document.getElementById('frameNo');
  if (figs.length) {
    let cur = 0;
    const show = i => {
      figs.forEach((f, j) => f.classList.toggle('on', j === i));
      if (counter) counter.textContent = `FR ${String(i + 1).padStart(2, '0')} / ${String(figs.length).padStart(2, '0')}`;
    };
    show(0);
    if (!matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setInterval(() => { cur = (cur + 1) % figs.length; show(cur); }, 3200);
    }
  }

  /* ---------- Featured strip ---------- */
  const featRow = document.getElementById('featRow');
  if (featRow && window.PROJECTS) {
    const picks = ['it-newsletter', 'it-support-kit', 'intranet-articles', 'exhibition-graphics']
      .map(s => PROJECTS.findIndex(p => p.slug === s)).filter(i => i > -1);
    featRow.innerHTML = picks.map((i, n) => { const p = PROJECTS[i]; return `
      <a class="feat reveal" href="pages/project.html?p=${p.slug}" data-cursor="view" style="--d:${n * .08}s">
        <div class="feat-media">${mediaFor(p, i, 900)}</div>
        <div class="feat-meta">
          <span class="feat-n mono">0${n + 1}</span>
          ${p.stat ? `<b class="feat-stat">${p.stat.value}</b>` : ''}
          <h3>${p.title}</h3>
          <p>${p.stat ? p.stat.label : p.kicker}</p>
        </div>
      </a>`; }).join('');
    wireImageFallbacks(featRow);
    observeReveals(featRow);
  }

  /* ---------- Work grid ---------- */
  const grid = document.getElementById('workGrid');
  const filters = document.getElementById('workFilters');
  if (grid && window.PROJECTS) {
    grid.innerHTML = PROJECTS.map((p, i) => `
      <a class="card ${p.size || 'md'} reveal" href="pages/project.html?p=${p.slug}" data-cat="${p.category}" data-cursor="view">
        <div class="card-media">
          <span class="card-frame">GY–${String(i + 1).padStart(2, '0')}</span>
          ${mediaFor(p, i, p.size === 'xl' ? 2000 : 1200)}
        </div>
        <div class="card-meta">
          <h3 class="card-title">${p.title}</h3>
          <span class="card-year mono">${p.year}</span>
          <p class="card-kicker">${p.kicker}</p>
          <span class="card-cat mono">${(CATEGORIES.find(c => c.id === p.category) || {}).label || ''} · ${p.client}</span>
        </div>
      </a>`).join('');
    wireImageFallbacks(grid);
    observeReveals(grid);

    filters.innerHTML = CATEGORIES.map(c => {
      const n = c.id === 'all' ? PROJECTS.length : PROJECTS.filter(p => p.category === c.id).length;
      return n ? `<button data-f="${c.id}" class="${c.id === 'all' ? 'active' : ''}">${c.label}<sup>${n}</sup></button>` : '';
    }).join('');
    filters.addEventListener('click', e => {
      const b = e.target.closest('button');
      if (!b) return;
      filters.querySelectorAll('button').forEach(x => x.classList.toggle('active', x === b));
      const f = b.dataset.f;
      grid.querySelectorAll('.card').forEach(card => {
        const show = f === 'all' || card.dataset.cat === f;
        card.classList.toggle('hidden', !show);
        if (show) { card.classList.remove('in'); requestAnimationFrame(() => card.classList.add('in')); }
      });
    });
  }

  /* ---------- AI Lab ---------- */
  const lab = document.getElementById('labList');
  if (lab && window.AI_LAB) {
    lab.innerHTML = AI_LAB.map((x, i) => {
      const tag = x.link ? 'a' : 'div';
      const attrs = x.link ? `href="${x.link}" target="_blank" rel="noopener"` : '';
      return `<${tag} class="lab-row reveal" ${attrs}>
        <span class="n mono">L.${String(i + 1).padStart(2, '0')}</span>
        <h3>${x.name}</h3>
        <p>${x.what}</p>
        <span class="stack mono">${x.stack}</span>
        <span class="go">${x.link ? '↗' : ''}</span>
      </${tag}>`;
    }).join('');
    observeReveals(lab);
  }

  /* ---------- Journal ---------- */
  const jl = document.getElementById('journalList');
  if (jl && window.JOURNALS) {
    const items = Object.values(JOURNALS).sort((a, b) => new Date('1 ' + b.date) - new Date('1 ' + a.date));
    jl.innerHTML = items.map(j => `
      <a href="pages/journal.html?id=${j.id}" class="reveal">
        <span class="mono">${j.date}</span>
        <h3>${j.title}</h3>
        <span class="mono cat">${j.category}</span>
        <span class="mono rt">${j.readTime.replace(' read', '')}</span>
      </a>`).join('');
    observeReveals(jl);
  }

  /* ---------- Contact form ---------- */
  const form = document.getElementById('contactForm');
  if (form) {
    const status = document.getElementById('formStatus');
    form.addEventListener('submit', async e => {
      e.preventDefault();
      const d = new FormData(form);
      if (!d.get('name') || !d.get('email') || !d.get('message')) {
        status.textContent = 'Please fill in your name, email and message.';
        status.style.color = 'var(--red)';
        return;
      }
      if (!FORMSPREE_ID) {
        const body = `${d.get('message')}\n\n${d.get('name')} · ${d.get('email')}`;
        location.href = `mailto:garvityagnik@gmail.com?subject=${encodeURIComponent(d.get('subject') || 'Hello from your portfolio')}&body=${encodeURIComponent(body)}`;
        status.textContent = 'Opening your email app…';
        status.style.color = 'var(--paper-dim)';
        return;
      }
      const btn = form.querySelector('.submit');
      btn.disabled = true; btn.textContent = 'Sending…';
      try {
        const r = await fetch(`https://formspree.io/f/${FORMSPREE_ID}`, { method: 'POST', body: d, headers: { Accept: 'application/json' } });
        if (!r.ok) throw new Error();
        status.textContent = 'Thanks. I will reply within a day or two.';
        status.style.color = 'var(--paper)';
        form.reset();
      } catch {
        status.textContent = 'That did not go through. Email me directly at garvityagnik@gmail.com.';
        status.style.color = 'var(--red)';
      }
      btn.disabled = false; btn.textContent = 'Send message';
    });
  }
});
