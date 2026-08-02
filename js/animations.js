/**
 * animations.js
 * حركة الصفحة: كشف الهيرو، تفكيك النص، الكشف عند التمرير، الأزرار المغناطيسية،
 * العدّادات الرقمية، ومؤشر الفأرة المخصص.
 * يعتمد على GSAP + ScrollTrigger (محمّلة عالميًا عبر CDN في index.html).
 */

const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/* ---------------------------------------------------------------
   تقسيم عنوان إلى أسطر/كلمات لأجل تأثير الكشف التدريجي
--------------------------------------------------------------- */
function splitLines(el) {
  const text = el.textContent.trim();
  const words = text.split(/\s+/);
  el.innerHTML = '';
  words.forEach((word, i) => {
    const line = document.createElement('span');
    line.className = 'split-line';
    const inner = document.createElement('span');
    inner.textContent = word;
    line.appendChild(inner);
    el.appendChild(line);
    if (i < words.length - 1) el.appendChild(document.createTextNode(' '));
  });
  return el.querySelectorAll('.split-line > span');
}

export function initAnimations() {
  const gsap = window.gsap;
  const ScrollTrigger = window.ScrollTrigger;

  if (!gsap) {
    // بدون GSAP: أظهر كل شيء مباشرة حتى لا يبقى المحتوى مخفيًا
    document.querySelectorAll('[data-reveal]').forEach((el) => {
      el.style.opacity = 1;
      el.style.transform = 'none';
    });
    return;
  }

  gsap.registerPlugin(ScrollTrigger);

  /* ---------------- 1) كشف الهيرو (Cinematic Hero Reveal) ---------------- */
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

  /* ---------------- 2) كشف عام عند التمرير لكل [data-reveal] ---------------- */
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

  /* ---------------- 3) تدرّج ظهور بطاقات الشبكة ---------------- */
  document.querySelectorAll('[data-reveal-stagger]').forEach((group) => {
    const items = group.querySelectorAll(':scope > *');
    gsap.to(items, {
      opacity: 1,
      y: 0,
      duration: 0.8,
      ease: 'power3.out',
      stagger: 0.1,
      scrollTrigger: { trigger: group, start: 'top 85%' },
    });
  });

  /* ---------------- 4) الطبقات المتوازية (Parallax) ---------------- */
  document.querySelectorAll('[data-parallax]').forEach((el) => {
    const speed = parseFloat(el.dataset.parallax) || 0.3;
    gsap.to(el, {
      yPercent: speed * 100,
      ease: 'none',
      scrollTrigger: { trigger: el.parentElement, start: 'top bottom', end: 'bottom top', scrub: true },
    });
  });

  /* ---------------- 5) العدّادات الرقمية ---------------- */
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

  /* ---------------- 6) الأزرار المغناطيسية ---------------- */
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

  /* ---------------- 7) مؤشر الفأرة المخصص ---------------- */
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

  /* ---------------- 8) نبض توهج الخلفية بحسب موضع التمرير في القسم ---------------- */
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
