/**
 * navigation.js
 * إدارة شريط التنقل، القائمة الجوّالة، مؤشر تقدّم التمرير، وزر العودة للأعلى.
 */
export function initNavigation() {
  const nav = document.querySelector('.nav');
  const toggle = document.querySelector('.nav__toggle');
  const mobileMenu = document.querySelector('.nav__mobile');
  const progressBar = document.querySelector('.scroll-progress');
  const backToTop = document.querySelector('.back-to-top');
  const navLinks = document.querySelectorAll('.nav__link, .nav__mobile a');
  const sections = document.querySelectorAll('main section[id]');

  if (!nav) return;

  /* ---- حالة الشريط عند التمرير + مؤشر التقدّم ---- */
  const onScroll = () => {
    const scrollTop = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const ratio = docHeight > 0 ? scrollTop / docHeight : 0;

    nav.classList.toggle('is-scrolled', scrollTop > 12);
    if (progressBar) progressBar.style.transform = `scaleX(${ratio})`;
    if (backToTop) backToTop.classList.toggle('is-visible', scrollTop > window.innerHeight * 0.6);
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* ---- القائمة الجوّالة ---- */
  if (toggle && mobileMenu) {
    toggle.setAttribute('aria-expanded', 'false');
    toggle.addEventListener('click', () => {
      const isOpen = document.body.classList.toggle('menu-open');
      mobileMenu.classList.toggle('is-open', isOpen);
      toggle.setAttribute('aria-expanded', String(isOpen));
      document.body.style.overflow = isOpen ? 'hidden' : '';
    });

    mobileMenu.querySelectorAll('a').forEach((a) =>
      a.addEventListener('click', () => {
        document.body.classList.remove('menu-open');
        mobileMenu.classList.remove('is-open');
        toggle.setAttribute('aria-expanded', 'false');
        document.body.style.overflow = '';
      })
    );
  }

  /* ---- تمييز الرابط النشط حسب القسم الظاهر ---- */
  if ('IntersectionObserver' in window && sections.length) {
    const byId = (id) => document.querySelector(`.nav__link[href="#${id}"]`);
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            navLinks.forEach((l) => l.classList.remove('is-active'));
            const link = byId(entry.target.id);
            if (link) link.classList.add('is-active');
          }
        });
      },
      { rootMargin: '-45% 0px -45% 0px' }
    );
    sections.forEach((s) => io.observe(s));
  }

  /* ---- زر العودة للأعلى ---- */
  if (backToTop) {
    backToTop.addEventListener('click', () => {
      if (window.__lenis) {
        window.__lenis.scrollTo(0, { duration: 1.2 });
      } else {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    });
  }

  /* ---- التنقل بالكيبورد: إغلاق القائمة بـ Escape ---- */
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && document.body.classList.contains('menu-open')) {
      document.body.classList.remove('menu-open');
      mobileMenu?.classList.remove('is-open');
      toggle?.setAttribute('aria-expanded', 'false');
      document.body.style.overflow = '';
    }
  });
}
