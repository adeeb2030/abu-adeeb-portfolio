/**
 * animations.js
 * حركة الصفحة: كشف الهيرو، تفكيك النص، الكشف عند التمرير، الأزرار المغناطيسية،
 * العدّادات الرقمية، ومؤشر الفأرة المخصص.
 * يعتمد على GSAP + ScrollTrigger (محمّلة عالميًا عبر CDN في index.html).
 */

const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

function splitLines(el) {
  const html = el.innerHTML.trim();
  const lines = html
    .split(/<br\s*\/?>/i)
    .map((lineText) => lineText.trim())
    .filter(Boolean);

  el.innerHTML = '';

  lines.forEach((lineText) => {
    const line = document.createElement('span');
    line.className = 'split-line';
    const inner = document.createElement('span');
    inner.innerHTML = lineText;
    line.appendChild(inner);
    el.appendChild(line);
  });

  return el.querySelectorAll('.split-line > span');
}

function initAnimations() {
  const gsap = window.gsap;
  const ScrollTrigger = window.ScrollTrigger;

  if (!gsap) {
    document
      .querySelectorAll(
        '[data-reveal], [data-hero-eyebrow], [data-hero-lead], [data-hero-cta], [data-hero-visual], [data-hero-scroll]'
      )
      .forEach((el) => {
        el.style.opacity = 1;
        el.style.transform = 'none';
      });
    return;
  }

  gsap.registerPlugin(ScrollTrigger);

  const heroTitle = document.querySelector('[data-hero-title]');
  const heroLines = heroTitle ? splitLines(heroTitle) : [];
  const heroTl = gsap.timeline({ defaults: { ease: 'power4.out' } });

  if (heroLines.length) {
    heroTl.to(heroLines, {
      y: '0%',
      duration: reduceMotion ? 0.01 : 1.1,
      stagger: reduceMotion ? 0 : 0.09,
    }, 0.15);
  }

  heroTl.to('[data-hero-eyebrow]', { opacity: 1, y: 0, duration: 0.7 }, 0.05)
        .to('[data-hero-lead]', { opacity: 1, y: 0, duration: 0.9 }, 0.55)
        .to('[data-hero-cta]', { opacity: 1, y: 0, duration: 0.9 }, 0.7)
        .to('[data-hero-visual]', { opacity: 1, scale: 1, duration: 1.2, ease: 'power3.out' }, 0.35)
        .to('[data-hero-scroll]', { opacity: 1, duration: 0.6 }, 1.1);

  window.__playHeroIntro = () => heroTl.play(0);

  document.querySelectorAll('[data-reveal]').forEach((el) => {
    const type = el.dataset.reveal;
    const vars = { opacity: 1, duration: 0.9, ease: 'power3.out' };
    if (type === 'up') vars.y = 0;
    if (type === 'scale') vars.scale = 1;
    if (type === 'side') vars.x = 0;

    gsap.to(el, {
      ...vars,
      scrollTrigger: {
        trigger: el,
        start: 'top 85%',
        toggleActions: 'play none none none',
      },
      delay: Number(el.dataset.revealDelay || 0),
    });
  });

  document.querySelectorAll('[data-parallax]').forEach((el) => {
    const speed = parseFloat(el.dataset.parallax) || 0.3;
    gsap.to(el, {
      yPercent: speed * 100,
      ease: 'none',
      scrollTrigger: { trigger: el.parentElement, start: 'top bottom', end: 'bottom top', scrub: true },
    });
  });

  document.querySelectorAll('[data-counter]').forEach((el) => {
    const target = parseFloat(el.dataset.counter);
    const suffix = el.dataset.counterSuffix || '';
    const obj = { val: 0 };
    gsap.to(obj, {
      val: target,
      duration: 1.8,
      ease: 'power2.out',
      scrollTrigger: { trigger: el, start: 'top 88%', once: true },
      onUpdate: () => {
        el.textContent = (Number.isInteger(target) ? Math.round(obj.val) : obj.val.toFixed(1)) + suffix;
      },
    });
  });

  if (!reduceMotion && window.matchMedia('(hover: hover)').matches) {
    document.querySelectorAll('[data-magnetic]').forEach((btn) => {
      const strength = 22;
      btn.addEventListener('mousemove', (e) => {
        const rect = btn.getBoundingClientRect();
        const x = e.clientX - rect.left - rect.width / 2;
        const y = e.clientY - rect.top - rect.height / 2;
        gsap.to(btn, { x: (x / rect.width) * strength, y: (y / rect.height) * strength, duration: 0.4, ease: 'power3.out' });
      });
      btn.addEventListener('mouseleave', () => {
        gsap.to(btn, { x: 0, y: 0, duration: 0.6, ease: 'elastic.out(1, 0.4)' });
      });
    });
  }

  if (!reduceMotion && window.matchMedia('(hover: hover)').matches) {
    const dot = document.querySelector('.cursor-dot');
    const ring = document.querySelector('.cursor-ring');
    if (dot && ring) {
      const pos = { x: 0, y: 0 };
      const ringPos = { x: 0, y: 0 };
      window.addEventListener('mousemove', (e) => { pos.x = e.clientX; pos.y = e.clientY; });

      gsap.ticker.add(() => {
        gsap.set(dot, { x: pos.x, y: pos.y });
        ringPos.x += (pos.x - ringPos.x) * 0.16;
        ringPos.y += (pos.y - ringPos.y) * 0.16;
        gsap.set(ring, { x: ringPos.x, y: ringPos.y });
      });

      document.querySelectorAll('a, button, [data-cursor-hover]').forEach((el) => {
        el.addEventListener('mouseenter', () => ring.classList.add('is-active'));
        el.addEventListener('mouseleave', () => ring.classList.remove('is-active'));
      });
    }
  }

  document.querySelectorAll('[data-section-glow]').forEach((section) => {
    const glow = section.querySelector('.aurora-bg');
    if (!glow) return;
    gsap.fromTo(
      glow,
      { opacity: 0.4 },
      {
        opacity: 0.9,
        scrollTrigger: { trigger: section, start: 'top 70%', end: 'bottom 30%', scrub: true },
      }
    );
  });
}

/* ============================================================================
   MOBILE HERO FINAL FIX
   The HTML intentionally keeps .hero__cta inside .hero__content.
   On mobile, display:contents promotes the CTA to a direct flex item of
   .hero__container, so the visual can sit between lead and CTA without
   changing the desktop DOM/layout.
============================================================================ */
(function installMobileHeroFix() {
  const style = document.createElement('style');
  style.id = 'mobile-hero-final-fix';
  style.textContent = `
@media (max-width: 900px) {
  .hero {
    width: 100%;
    max-width: 100%;
    min-width: 0;
    overflow-x: clip;
  }

  .hero__container {
    width: 100%;
    max-width: 100%;
    min-width: 0;
    margin-inline: 0;
    padding-inline: 16px;
    box-sizing: border-box;
    display: flex;
    flex-direction: column;
    align-items: stretch;
    justify-content: flex-start;
    gap: 0;
  }

  .hero__content {
    display: contents !important;
  }

  .hero__content > .eyebrow {
    order: 1;
    width: 100%;
    max-width: 100%;
    margin: 0 0 16px;
    text-align: center;
    justify-content: center;
    box-sizing: border-box;
  }

  .hero__content > .hero__title {
    order: 2;
    width: 100%;
    max-width: 100%;
    margin: 0 0 18px;
    padding: 0;
    text-align: center;
    box-sizing: border-box;
    overflow: visible;
    font-size: clamp(2.35rem, 9.5vw, 3.15rem);
    line-height: 1.22;
    letter-spacing: -0.025em;
    overflow-wrap: normal;
    word-break: normal;
  }

  .hero__content > .hero__lead {
    order: 3;
    width: 100%;
    max-width: 620px;
    margin: 0 auto 22px;
    padding: 0;
    text-align: center;
    box-sizing: border-box;
    line-height: 1.85;
    overflow-wrap: anywhere;
    word-break: normal;
  }

  .hero__visual {
    order: 4 !important;
    position: relative;
    width: min(100%, 320px);
    height: 310px;
    flex: 0 0 310px;
    min-width: 0;
    margin: 0 auto 24px;
    box-sizing: border-box;
    display: block !important;
    overflow: visible;
    transform: none;
  }

  .hero__visual-img {
    position: absolute;
    max-width: none;
    object-fit: cover;
  }

  .hero__visual-img:nth-child(1) {
    width: 190px;
    height: 260px;
    top: 0;
    right: 4px;
  }

  .hero__visual-img:nth-child(2) {
    width: 165px;
    height: 215px;
    top: 70px;
    left: 4px;
  }

  .hero__visual-img:nth-child(3) {
    width: 150px;
    height: 195px;
    bottom: 0;
    right: 82px;
  }

  .hero__content > .hero__cta {
    order: 5;
    width: 100%;
    max-width: 100%;
    margin: 0 auto 8px;
    padding: 0;
    display: flex;
    flex-direction: column;
    align-items: stretch;
    gap: 12px;
    box-sizing: border-box;
  }

  .hero__content > .hero__cta .btn {
    width: 100%;
    max-width: 100%;
    min-width: 0;
    margin: 0;
    box-sizing: border-box;
  }

  .hero__scroll {
    order: 6;
  }
}

@media (max-width: 640px) {
  .hero__container { padding-inline: 14px; }
  .hero__visual {
    width: min(100%, 310px);
    height: 300px;
    flex-basis: 300px;
  }
  .hero__content > .hero__title {
    font-size: clamp(2.2rem, 9.4vw, 2.9rem);
    line-height: 1.24;
  }
  .hero__content > .hero__lead {
    font-size: 1rem;
    line-height: 1.85;
  }
}

@media (max-width: 380px) {
  .hero__container { padding-inline: 12px; }
  .hero__visual {
    width: 290px;
    height: 285px;
    flex-basis: 285px;
  }
  .hero__visual-img:nth-child(1) { width: 170px; height: 235px; }
  .hero__visual-img:nth-child(2) { width: 150px; height: 195px; }
  .hero__visual-img:nth-child(3) { width: 135px; height: 180px; right: 76px; }
  .hero__content > .hero__title { font-size: 2.15rem; }
}
`;
  document.head.appendChild(style);
})();
