/**
 * app.js — نقطة الدخول الرئيسية
 * يهيّئ شاشة التحميل، التمرير السلس (Lenis)، ثم يشغّل بقية الوحدات.
 * ملاحظة: هذا الملف عبارة عن سكربت عادي (لا ES Module) عن قصد،
 * حتى يعمل الموقع مباشرة بفتح index.html بنقرتين بدون خادم محلي.
 * initNavigation / initPortfolio / initAnimations معرّفة عالميًا
 * عبر الملفات المحمّلة قبله في index.html.
 */

const reduceMotionApp = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/* ---------------------------------------------------------------
   1) شاشة التحميل الفاخرة
--------------------------------------------------------------- */
function runLoader() {
  return new Promise((resolve) => {
    const loader = document.querySelector('.loader');
    const fill = document.querySelector('.loader__bar-fill');
    if (!loader || !fill) return resolve();

    let progress = 0;
    const images = Array.from(document.images);
    const total = Math.max(images.length, 1);
    let loaded = 0;

    const bump = () => {
      loaded += 1;
      const target = Math.min(100, Math.round((loaded / total) * 100));
      progress = Math.max(progress, target);
      fill.style.width = progress + '%';
    };

    // شريط تقدّم بحد أدنى زمني حتى لا تومض الشاشة بسرعة مفرطة
    const minTimer = new Promise((r) => setTimeout(r, reduceMotionApp ? 200 : 900));

    if (images.length === 0) {
      fill.style.width = '100%';
    } else {
      images.forEach((img) => {
        if (img.complete) bump();
        else {
          img.addEventListener('load', bump, { once: true });
          img.addEventListener('error', bump, { once: true });
        }
      });
    }

  minTimer.then(() => {
    fill.style.width = '100%';

    setTimeout(() => {
      loader.style.transition = 'opacity .6s ease, visibility .6s';
      loader.style.opacity = '0';
      loader.style.visibility = 'hidden';
      loader.style.pointerEvents = 'none';

      setTimeout(() => {
        loader.remove();
      }, 700);

      document.body.style.overflow = '';
      resolve();
    }, 250);
  });
  });
}

/* ---------------------------------------------------------------
   2) التمرير السلس (Lenis)
--------------------------------------------------------------- */
function initSmoothScroll() {
  if (reduceMotionApp || typeof window.Lenis === 'undefined') return;

  const lenis = new window.Lenis({
    duration: 1.1,
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    smoothWheel: true,
  });

  window.__lenis = lenis;

  function raf(time) {
    lenis.raf(time);
    requestAnimationFrame(raf);
  }
requestAnimationFrame(raf);

if (window.gsap && window.ScrollTrigger) {
  lenis.on('scroll', window.ScrollTrigger.update);
}

  // روابط الإرساء الداخلية
  document.querySelectorAll('a[href^="#"]').forEach((a) => {
    a.addEventListener('click', (e) => {
      const id = a.getAttribute('href');
      if (id.length > 1) {
        const target = document.querySelector(id);
        if (target) {
          e.preventDefault();
          lenis.scrollTo(target, { offset: -84, duration: 1.1 });
        }
      }
    });
  });
}

/* ---------------------------------------------------------------
   3) خلفية النقاط الضوئية الهادئة
--------------------------------------------------------------- */
function initParticles() {
  const field = document.querySelector('[data-particle-field]');
  if (!field || reduceMotionApp) return;
  const count = window.innerWidth < 640 ? 14 : window.innerWidth < 1100 ? 20 : 28;
  const fragment = document.createDocumentFragment();

  for (let i = 0; i < count; i += 1) {
    const dot = document.createElement('span');
    dot.className = 'particle';
    const near = Math.random() > 0.72;
    dot.style.left = `${Math.random() * 100}%`;
    dot.style.top = `${Math.random() * 100}%`;
    dot.style.setProperty('--particle-size', `${near ? 2.6 + Math.random() * 1.6 : 1 + Math.random() * 1.2}px`);
    dot.style.setProperty('--particle-blur', `${near ? 12 + Math.random() * 8 : 5 + Math.random() * 5}px`);
    dot.style.setProperty('--particle-soft', `${near ? .25 + Math.random() * .45 : 0}px`);
    dot.style.setProperty('--particle-opacity', `${near ? .48 + Math.random() * .2 : .2 + Math.random() * .25}`);
    dot.style.setProperty('--particle-duration', `${5.5 + Math.random() * 5.5}s`);
    dot.style.setProperty('--particle-delay', `${-Math.random() * 8}s`);
    dot.style.setProperty('--particle-x', `${-10 + Math.random() * 20}px`);
    dot.style.setProperty('--particle-y', `${-14 + Math.random() * 28}px`);
    fragment.appendChild(dot);
  }
  field.appendChild(fragment);
}

/* ---------------------------------------------------------------
   4) رمز الاستجابة السريعة (QR) لرابط الموقع
--------------------------------------------------------------- */
function initQRCode() {
  const el = document.getElementById('qrcode');
  if (!el || typeof window.QRCode === 'undefined') return;
  // eslint-disable-next-line no-new
  new window.QRCode(el, {
    text: 'https://abuadeeb-design.carrd.co',
    width: 148,
    height: 148,
    colorDark: '#17141f',
    colorLight: '#ffffff',
    correctLevel: window.QRCode.CorrectLevel.M,
  });
}

/* ---------------------------------------------------------------
   4) شبكة أمان: مهما حدث (خطأ برمجي، فشل تحميل مكتبة، بطء شبكة)
   يجب ألا تبقى شاشة التحميل عالقة ولا يبقى أي جزء من الصفحة مخفيًا.
--------------------------------------------------------------- */
function forceRevealEverything() {
  const loader = document.querySelector('.loader');
  if (loader) {
    loader.style.opacity = '0';
    loader.style.visibility = 'hidden';
  }
  document.body.style.overflow = '';
  document.querySelectorAll('[data-reveal], [data-hero-eyebrow], [data-hero-lead], [data-hero-cta], [data-hero-visual], [data-hero-scroll]')
    .forEach((el) => {
      el.style.opacity = '1';
      el.style.transform = 'none';
    });
}

/* ---------------------------------------------------------------
   5) التشغيل
--------------------------------------------------------------- */
async function boot() {
  document.body.style.overflow = 'hidden';

  try {
    initNavigation();
    initParticles();
    initPortfolio();
    initQRCode();

    document.querySelectorAll('[data-email-link]').forEach((link) => {
      link.addEventListener('click', () => {
        const email = (link.getAttribute('data-email-link') || '').trim();
        if (email) link.dataset.emailLink = email;
      });
    });
  } catch (err) {
    console.error('تعذّر تهيئة أحد مكوّنات الصفحة:', err);
  }

  try {
    await runLoader();
  } catch (err) {
    console.error('تعذّر إكمال شاشة التحميل:', err);
    forceRevealEverything();
  }

  try {
    initSmoothScroll();
    initAnimations();
    if (window.__playHeroIntro) window.__playHeroIntro();
    if (window.ScrollTrigger) setTimeout(() => window.ScrollTrigger.refresh(), 300);
  } catch (err) {
    console.error('تعذّر تشغيل الحركات، سيتم عرض المحتوى مباشرة:', err);
    forceRevealEverything();
  }
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', boot);
} else {
  boot();
}

// شبكة أمان أخيرة: مهما حدث، لا يجوز أن تبقى الصفحة مخفية بعد 6 ثوانٍ.
setTimeout(forceRevealEverything, 6000);
