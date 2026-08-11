/**
 * portfolio.js — معرض الأعمال، الفلاتر، وصندوق العرض الكامل.
 */

const COUNTS = { ai: 16, games: 9, sports: 14, services: 9, luxury: 10, products: 15 };

function portfolioTranslations() {
  const t = window.__i18n?.get;
  return {
    all: t?.('portfolio.all') || 'الكل',
    categories: {
      ai:       { label: t?.('portfolio.categories.ai.label') || 'مفاهيم ذكاء اصطناعي', short: 'AI' },
      games:    { label: t?.('portfolio.categories.games.label') || 'ألعاب إلكترونية', short: 'GAMES' },
      sports:   { label: t?.('portfolio.categories.sports.label') || 'رياضة', short: 'SPORTS' },
      services: { label: t?.('portfolio.categories.services.label') || 'خدمات', short: 'SERVICES' },
      luxury:   { label: t?.('portfolio.categories.luxury.label') || 'عطور ومجوهرات', short: 'LUXURY' },
      products: { label: t?.('portfolio.categories.products.label') || 'منتجات', short: 'PRODUCTS' }
    },
    item: t?.('portfolio.item') || 'تصميم'
  };
}

function buildManifest() {
  const T = portfolioTranslations();
  const items = [];
  Object.entries(COUNTS).forEach(([key, count]) => {
    for (let i = 1; i <= count; i++) {
      items.push({
        cat: key,
        catLabel: T.categories[key].label,
        src: `assets/images/${key === 'ai' ? 'ai-concepts' : key}-${i}.jpg`,
        title: `${T.item} ${String(i).padStart(2, '0')}`,
      });
    }
  });
  return items;
}

function initPortfolio() {
  const grid = document.querySelector('[data-portfolio-grid]');
  const filterWrap = document.querySelector('[data-portfolio-filters]');
  if (!grid) return;

  let manifest = buildManifest();
  let activeFilter = 'all';
  let lightboxIndex = 0;

  function currentPool() {
    return activeFilter === 'all' ? manifest : manifest.filter((m) => m.cat === activeFilter);
  }

  function renderFilters() {
    if (!filterWrap) return;
    filterWrap.innerHTML = '';
    const T = portfolioTranslations();
    const makeButton = (key, label, active = false) => {
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = `filter-btn${active ? ' is-active' : ''}`;
      btn.textContent = label;
      btn.dataset.filter = key;
      btn.setAttribute('role', 'tab');
      btn.setAttribute('aria-selected', String(active));
      return btn;
    };
    filterWrap.appendChild(makeButton('all', T.all, activeFilter === 'all'));
    Object.entries(T.categories).forEach(([key, meta]) => filterWrap.appendChild(makeButton(key, meta.label, activeFilter === key)));
  }

  function renderGrid() {
    grid.innerHTML = '';
    manifest.forEach((item, index) => {
      const el = document.createElement('figure');
      el.className = 'masonry-item';
      el.dataset.cat = item.cat;
      el.dataset.index = String(index);
      el.setAttribute('role', 'button');
      el.setAttribute('tabindex', '0');
      el.setAttribute('aria-label', `${window.__i18n?.getLanguage() === 'en' ? 'View' : 'عرض'} ${item.title}`);
      el.innerHTML = `
        <span class="masonry-item__zoom" aria-hidden="true">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M11 4a7 7 0 1 0 0 14 7 7 0 0 0 0-14zm10 17-5.4-5.4" stroke="#f4d68a" stroke-width="1.8" stroke-linecap="round"/></svg>
        </span>
        <img src="${item.src}" alt="${item.title}" loading="lazy" decoding="async" />
        <figcaption class="masonry-item__overlay">
          <span class="masonry-item__cat">${item.catLabel}</span>
          <span class="masonry-item__title">${item.title}</span>
        </figcaption>`;

      const img = el.querySelector('img');
      img.addEventListener('load', () => img.setAttribute('data-loaded', 'true'), { once: true });
      img.addEventListener('error', () => { el.remove(); });

      const open = () => openLightbox(index);
      el.addEventListener('click', open);
      el.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); open(); }
      });
      grid.appendChild(el);
    });
  }

  function applyFilter() {
    grid.querySelectorAll('.masonry-item').forEach((el) => {
      const match = activeFilter === 'all' || el.dataset.cat === activeFilter;
      el.classList.toggle('is-hidden', !match);
      if (window.gsap) {
        window.gsap.to(el, { opacity: match ? 1 : 0, scale: match ? 1 : 0.96, duration: 0.28, ease: 'power2.out' });
      } else {
        el.style.opacity = match ? '1' : '0';
      }
    });
    filterWrap?.querySelectorAll('.filter-btn').forEach((b) => {
      const active = b.dataset.filter === activeFilter;
      b.classList.toggle('is-active', active);
      b.setAttribute('aria-selected', String(active));
    });
  }

  renderFilters();
  renderGrid();

  filterWrap?.addEventListener('click', (e) => {
    const btn = e.target.closest('.filter-btn');
    if (!btn) return;
    activeFilter = btn.dataset.filter;
    applyFilter();
  });

  const lb = document.querySelector('.lightbox');
  const lbImg = lb?.querySelector('.lightbox__figure img');
  const lbCatLabel = lb?.querySelector('[data-lb-cat]');
  const lbTitle = lb?.querySelector('[data-lb-title]');
  let lastFocused = null;

  function openLightbox(globalIndex) {
    if (!lb) return;
    const item = manifest[globalIndex];
    const pool = currentPool();
    lightboxIndex = pool.findIndex((m) => m === item);
    if (lightboxIndex < 0) lightboxIndex = 0;
    lastFocused = document.activeElement;
    renderLightbox();
    lb.classList.add('is-open');
    document.body.style.overflow = 'hidden';
    lb.querySelector('.lightbox__close')?.focus();
  }

  function renderLightbox() {
    const item = currentPool()[lightboxIndex];
    if (!item || !lbImg) return;
    lbImg.src = item.src;
    lbImg.alt = item.title;
    if (lbCatLabel) lbCatLabel.textContent = item.catLabel;
    if (lbTitle) lbTitle.textContent = item.title;
  }

  function closeLightbox() {
    if (!lb) return;
    lb.classList.remove('is-open');
    document.body.style.overflow = '';
    lastFocused?.focus();
  }

  function step(dir) {
    const pool = currentPool();
    if (!pool.length) return;
    lightboxIndex = (lightboxIndex + dir + pool.length) % pool.length;
    renderLightbox();
  }

  lb?.querySelector('.lightbox__close')?.addEventListener('click', closeLightbox);
  lb?.querySelector('.lightbox__nav--next')?.addEventListener('click', () => step(1));
  lb?.querySelector('.lightbox__nav--prev')?.addEventListener('click', () => step(-1));
  lb?.addEventListener('click', (e) => { if (e.target === lb) closeLightbox(); });
  document.addEventListener('keydown', (e) => {
    if (!lb?.classList.contains('is-open')) return;
    if (e.key === 'Escape') closeLightbox();
    if (e.key === 'ArrowLeft') step(1);
    if (e.key === 'ArrowRight') step(-1);
  });

  window.__refreshPortfolioLanguage = () => {
    manifest = buildManifest();
    renderFilters();
    renderGrid();
    applyFilter();
    if (lb?.classList.contains('is-open')) renderLightbox();
  };
}
