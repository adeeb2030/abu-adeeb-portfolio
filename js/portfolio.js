/**
 * portfolio.js
 * عرض معرض الأعمال (Masonry)، الفلاتر، وصندوق العرض الكامل (Lightbox).
 */

const CATEGORIES = {
  ai:       { label: 'مفاهيم ذكاء اصطناعي', short: 'AI' },
  games:    { label: 'ألعاب إلكترونية',      short: 'GAMES' },
  sports:   { label: 'رياضة',                short: 'SPORTS' },
  services: { label: 'خدمات',                short: 'SERVICES' },
  luxury:   { label: 'عطور ومجوهرات',        short: 'LUXURY' },
  products: { label: 'منتجات',               short: 'PRODUCTS' },
};

// عدد الصور المتاحة لكل تصنيف داخل assets/images
const COUNTS = { ai: 6, games: 6, sports: 6, services: 6, luxury: 6, products: 6 };

function buildManifest() {
  const items = [];
  Object.entries(COUNTS).forEach(([key, count]) => {
    for (let i = 1; i <= count; i++) {
      items.push({
        cat: key,
        catLabel: CATEGORIES[key].label,
        src: `assets/images/${key === 'ai' ? 'ai-concepts' : key}-${i}.jpg`,
        title: `${CATEGORIES[key].label} ${String(i).padStart(2, '0')}`,
      });
    }
  });
  return items;
}

export function initPortfolio() {
  const grid = document.querySelector('[data-portfolio-grid]');
  const filterWrap = document.querySelector('[data-portfolio-filters]');
  if (!grid) return;

  const manifest = buildManifest();
  let activeFilter = 'all';
  let lightboxIndex = 0;
  let visibleItems = manifest;

  /* ---- بناء الفلاتر ---- */
  if (filterWrap) {
    const allBtn = document.createElement('button');
    allBtn.className = 'filter-btn is-active';
    allBtn.textContent = 'الكل';
    allBtn.dataset.filter = 'all';
    filterWrap.appendChild(allBtn);

    Object.entries(CATEGORIES).forEach(([key, meta]) => {
      const btn = document.createElement('button');
      btn.className = 'filter-btn';
      btn.textContent = meta.label;
      btn.dataset.filter = key;
      filterWrap.appendChild(btn);
    });

    filterWrap.addEventListener('click', (e) => {
      const btn = e.target.closest('.filter-btn');
      if (!btn) return;
      activeFilter = btn.dataset.filter;
      filterWrap.querySelectorAll('.filter-btn').forEach((b) => b.classList.toggle('is-active', b === btn));
      applyFilter();
    });
  }

  /* ---- بناء الشبكة ---- */
  manifest.forEach((item, index) => {
    const el = document.createElement('figure');
    el.className = 'masonry-item';
    el.dataset.cat = item.cat;
    el.dataset.index = String(index);
    el.setAttribute('role', 'button');
    el.setAttribute('tabindex', '0');
    el.setAttribute('aria-label', `عرض ${item.title}`);

    el.innerHTML = `
      <span class="masonry-item__zoom" aria-hidden="true">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M11 4a7 7 0 1 0 0 14 7 7 0 0 0 0-14zm10 17-5.4-5.4" stroke="#f4d68a" stroke-width="1.8" stroke-linecap="round"/></svg>
      </span>
      <img src="${item.src}" alt="${item.title}" loading="lazy" decoding="async" />
      <figcaption class="masonry-item__overlay">
        <span class="masonry-item__cat">${item.catLabel}</span>
        <span class="masonry-item__title">${item.title}</span>
      </figcaption>
    `;

    const img = el.querySelector('img');
    img.addEventListener('load', () => img.setAttribute('data-loaded', 'true'));

    const open = () => openLightbox(index);
    el.addEventListener('click', open);
    el.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); open(); }
    });

    grid.appendChild(el);
  });

  function applyFilter() {
    visibleItems = activeFilter === 'all' ? manifest : manifest.filter((m) => m.cat === activeFilter);
    grid.querySelectorAll('.masonry-item').forEach((el) => {
      const match = activeFilter === 'all' || el.dataset.cat === activeFilter;
      if (window.gsap) {
        window.gsap.to(el, {
          opacity: match ? 1 : 0,
          scale: match ? 1 : 0.9,
          duration: 0.35,
          ease: 'power2.out',
          onStart: () => { if (match) el.classList.remove('is-hidden'); },
          onComplete: () => { if (!match) el.classList.add('is-hidden'); },
        });
      } else {
        el.classList.toggle('is-hidden', !match);
      }
    });
  }

  /* ---- صندوق العرض الكامل (Lightbox) ---- */
  const lb = document.querySelector('.lightbox');
  const lbImg = lb?.querySelector('.lightbox__figure img');
  const lbCatLabel = lb?.querySelector('[data-lb-cat]');
  const lbTitle = lb?.querySelector('[data-lb-title]');
  let lastFocused = null;

  function currentPool() {
    return activeFilter === 'all' ? manifest : manifest.filter((m) => m.cat === activeFilter);
  }

  function openLightbox(globalIndex) {
    if (!lb) return;
    const item = manifest[globalIndex];
    const pool = currentPool();
    lightboxIndex = pool.findIndex((m) => m === item);
    if (lightboxIndex === -1) lightboxIndex = 0;
    lastFocused = document.activeElement;
    renderLightbox();
    lb.classList.add('is-open');
    document.body.style.overflow = 'hidden';
    lb.querySelector('.lightbox__close')?.focus();
  }

  function renderLightbox() {
    const pool = currentPool();
    const item = pool[lightboxIndex];
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
    if (e.key === 'ArrowLeft') step(1);   // RTL: يسار = التالي بصريًا
    if (e.key === 'ArrowRight') step(-1);
  });
}
