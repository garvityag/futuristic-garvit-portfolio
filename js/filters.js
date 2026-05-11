document.addEventListener('DOMContentLoaded', () => {
  const filterBtns = document.querySelectorAll('.filter-btn');
  const cards = document.querySelectorAll('.project-card');
  const grid = document.getElementById('projectsGrid');
  const comingSoon = document.getElementById('comingSoon');
  if (!filterBtns.length || !cards.length) return;

  // Categories that have real projects
  const realCategories = new Set();
  cards.forEach(c => realCategories.add(c.dataset.category));

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const filter = btn.dataset.filter;

      // Check if this filter has real projects
      const hasProjects = filter === 'all' || realCategories.has(filter);

      if (!hasProjects && comingSoon) {
        grid.style.display = 'none';
        comingSoon.style.display = 'block';
        return;
      }

      if (comingSoon) comingSoon.style.display = 'none';
      grid.style.display = '';

      cards.forEach(card => {
        const match = filter === 'all' || card.dataset.category === filter;
        if (match) {
          card.style.display = '';
          card.style.opacity = '0';
          card.style.transform = 'scale(0.95)';
          requestAnimationFrame(() => {
            card.style.transition = 'opacity 0.4s ease, transform 0.4s ease';
            card.style.opacity = '1';
            card.style.transform = '';
          });
        } else {
          card.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
          card.style.opacity = '0';
          card.style.transform = 'scale(0.95)';
          setTimeout(() => { card.style.display = 'none'; }, 300);
        }
      });
    });
  });
});
