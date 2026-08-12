/* i18n.js — Arabic / English language system for the portfolio */
(function () {
  const translations = {
    ar: {
      meta: {
        title: 'أبو أديب — معرض الأعمال الإبداعية | تصميم مدعوم بالذكاء الاصطناعي',
        description: 'أبو أديب — هوية بصرية وتصاميم إعلانية احترافية مدعومة بالذكاء الاصطناعي، بخبرة تتجاوز 20 عامًا في الإدارة والإبداع والتقنية.'
      },
      loader: 'جاري تحميل المعرض',
      nav: { home: 'الرئيسية', about: 'نبذة عني', work: 'الأعمال', contact: 'تواصل معي' },
      hero: {
        scroll: 'SCROLL',
        eyebrow: 'مصمم جرافيك • هوية بصرية • إبداع بالذكاء الاصطناعي',
        title: 'أصمم العلامات<br>أصنع التجارب<br>وأطلق الأفكار<br>بالذكاء الاصطناعي',
        lead: 'مصمم جرافيك بخبرة تتجاوز 20 عامًا في الأعمال، أقدّم هويات بصرية راقية، تصاميم إعلانية وحملات رقمية وحلولًا إبداعية مدعومة بالذكاء الاصطناعي.',
        portfolio: 'استعرض أعمالي',
        contact: 'تواصل معي'
      },
      about: {
        eyebrow: 'نبذة عني',
        title: 'خبرة عملية تلتقي برؤية الذكاء الاصطناعي',
        lead: 'أكثر من عشرين عامًا من الخبرة العملية في إدارة الأعمال والمبيعات وخدمة العملاء، أستخدمها اليوم مع أدوات الذكاء الاصطناعي لصناعة حلول بصرية مدروسة تجمع بين الفكرة والاستراتيجية والتنفيذ.',
        stat1: 'عامًا من الخبرة العملية',
        stat2: 'قطاعات إبداعية مختلفة',
        stat3: 'عملًا إبداعيًا منجزًا',
        card1: 'هندسة الأوامر',
        card1Text: 'صياغة Prompts احترافية تساعد على استخراج نتائج بصرية دقيقة وقابلة للاستخدام من أدوات الذكاء الاصطناعي التوليدي.',
        card2: 'الهوية البصرية',
        card2Text: 'بناء هويات بصرية وشعارات ومنشورات إعلانية تحافظ على شخصية العلامة واتساقها عبر المنصات.',
        card3: 'تصميم متعدد القطاعات',
        card3Text: 'خبرة بصرية تمتد من المنتجات والخدمات إلى الرياضة والعطور والألعاب الإلكترونية، مع الحفاظ على مستوى بصري موحّد.'
      },
      work: {
        eyebrow: 'أعمال مختارة', title: 'أعمال مختارة',
        lead: 'مجموعة من التصاميم الإعلانية والهويات البصرية عبر قطاعات متعددة، منظّمة لتسهيل الاستعراض حسب المجال.',
        filtersAria: 'تصفية الأعمال حسب القطاع'
      },
      contact: {
        eyebrow: 'تواصل معي', title: 'لنبدأ مشروعك القادم معًا',
        lead: 'من الفكرة الأولى إلى التصميم النهائي، أقدّم حلولًا إبداعية تجمع بين الخبرة العملية والتصميم والذكاء الاصطناعي.',
        email: 'البريد الإلكتروني', instagram: 'إنستغرام', tiktok: 'تيك توك', website: 'الموقع',
        qrAria: 'رمز استجابة سريعة لموقع أبو أديب', qrText: 'امسح الرمز لزيارة الموقع مباشرة'
      },
      footer: {
        tag: 'تصميم إعلاني وهوية بصرية مدعومة بالذكاء الاصطناعي، بخبرة تجمع بين الإدارة والإبداع.',
        copy: '© 2026 أبو أديب. جميع الحقوق محفوظة.', badge: 'AI CREATIVE PORTFOLIO'
      },
      lightbox: { dialog: 'معاينة العمل', close: 'إغلاق', prev: 'العمل السابق', next: 'العمل التالي' },
      portfolio: {
        all: 'الكل',
        categories: {
          ai: { label: 'مفاهيم ذكاء اصطناعي', short: 'AI' },
          games: { label: 'ألعاب إلكترونية', short: 'GAMES' },
          sports: { label: 'رياضة', short: 'SPORTS' },
          services: { label: 'خدمات', short: 'SERVICES' },
          luxury: { label: 'عطور ومجوهرات', short: 'LUXURY' },
          products: { label: 'منتجات', short: 'PRODUCTS' }
        },
        item: 'تصميم'
      }
    },
    en: {
      meta: {
        title: 'Abu Adeeb — Creative Portfolio | AI-Powered Design',
        description: 'Abu Adeeb — premium visual identities and advertising design powered by AI, backed by more than 20 years of business and creative experience.'
      },
      loader: 'Loading portfolio',
      nav: { home: 'Home', about: 'About Me', work: 'Work', contact: 'Contact Me' },
      hero: {
        scroll: 'SCROLL',
        eyebrow: 'GRAPHIC DESIGNER • BRAND IDENTITY • AI CREATIVE',
        title: 'I DESIGN BRANDS<br>I CREATE EXPERIENCES<br>I LAUNCH IDEAS WITH AI',
        lead: 'Graphic Designer with 20+ years of business experience, creating premium branding, visual identities, advertising campaigns, and AI-powered creative solutions.',
        portfolio: 'View My Work',
        contact: 'Contact Me'
      },
      about: {
        eyebrow: 'ABOUT ME',
        title: 'Practical Experience Meets an AI-Driven Creative Vision',
        lead: 'With more than 20 years of practical experience in business, sales, and customer service, I now combine that perspective with AI tools to create thoughtful visual solutions where strategy, concept, and execution work together.',
        stat1: 'Years of practical experience', stat2: 'Creative sectors', stat3: 'Completed creative works',
        card1: 'Prompt Engineering',
        card1Text: 'Crafting professional prompts that help generative AI tools produce precise, usable visual results.',
        card2: 'Visual Identity',
        card2Text: 'Building visual identities, logos, and advertising assets that preserve brand personality and consistency across platforms.',
        card3: 'Multi-Sector Design',
        card3Text: 'Visual experience across products, services, sports, luxury, and gaming while maintaining a consistent creative standard.'
      },
      work: {
        eyebrow: 'SELECTED WORK', title: 'Selected Work',
        lead: 'A curated collection of advertising designs and visual identities across multiple sectors, organized for easy exploration.',
        filtersAria: 'Filter work by sector'
      },
      contact: {
        eyebrow: 'GET IN TOUCH', title: "Let's Build Your Next Project Together",
        lead: 'From the first idea to the final design, I create practical creative solutions combining business experience, design, and AI.',
        email: 'EMAIL', instagram: 'INSTAGRAM', tiktok: 'TIKTOK', website: 'WEBSITE',
        qrAria: 'QR code for Abu Adeeb website', qrText: 'Scan to visit the website directly'
      },
      footer: {
        tag: 'Advertising design and visual identity powered by AI, backed by business and creative experience.',
        copy: '© 2026 Abu Adeeb. All rights reserved.', badge: 'AI CREATIVE PORTFOLIO'
      },
      lightbox: { dialog: 'Work preview', close: 'Close', prev: 'Previous work', next: 'Next work' },
      portfolio: {
        all: 'All',
        categories: {
          ai: { label: 'AI Concepts', short: 'AI' },
          games: { label: 'Gaming', short: 'GAMES' },
          sports: { label: 'Sports', short: 'SPORTS' },
          services: { label: 'Services', short: 'SERVICES' },
          luxury: { label: 'Luxury', short: 'LUXURY' },
          products: { label: 'Products', short: 'PRODUCTS' }
        },
        item: 'Design'
      }
    }
  };

  let language = localStorage.getItem('abuAdeebLanguage') || 'ar';
  if (!['ar', 'en'].includes(language)) language = 'ar';

  const get = (path) => path.split('.').reduce((obj, key) => obj?.[key], translations[language]);

  function applyLanguage(nextLanguage, persist = true) {
    language = nextLanguage === 'en' ? 'en' : 'ar';
    if (persist) localStorage.setItem('abuAdeebLanguage', language);

    const root = document.documentElement;
    root.lang = language;
    root.dir = language === 'ar' ? 'rtl' : 'ltr';
    document.body.classList.toggle('is-ar', language === 'ar');
    document.body.classList.toggle('is-en', language === 'en');

    document.querySelectorAll('[data-i18n]').forEach((el) => {
      const value = get(el.dataset.i18n);
      if (typeof value === 'string') el.textContent = value;
    });
    document.querySelectorAll('[data-i18n-html]').forEach((el) => {
      const value = get(el.dataset.i18nHtml);
      if (typeof value === 'string') el.innerHTML = value;
    });
    document.querySelectorAll('[data-i18n-aria]').forEach((el) => {
      const value = get(el.dataset.i18nAria);
      if (typeof value === 'string') el.setAttribute('aria-label', value);
    });
    document.querySelectorAll('[data-i18n-content]').forEach((el) => {
      const value = get(el.dataset.i18nContent);
      if (typeof value === 'string') el.setAttribute('content', value);
    });

    document.title = get('meta.title');
    const description = document.querySelector('meta[name="description"]');
    if (description) description.setAttribute('content', get('meta.description'));

    const toggle = document.querySelector('[data-language-toggle]');
    if (toggle) {
      toggle.querySelector('.language-toggle__current').textContent = language === 'ar' ? 'العربية' : 'English';
      toggle.querySelector('.language-toggle__other').textContent = language === 'ar' ? 'English' : 'العربية';
      toggle.setAttribute('aria-label', language === 'ar' ? 'التبديل إلى الإنجليزية' : 'Switch to Arabic');
    }

    document.querySelectorAll('.nav__mobile a').forEach((a) => a.addEventListener('click', () => {
      document.body.classList.remove('menu-open');
    }, { once: true }));

    window.dispatchEvent(new CustomEvent('languagechange', { detail: { language } }));
    if (typeof window.__refreshPortfolioLanguage === 'function') window.__refreshPortfolioLanguage();
  }

  document.addEventListener('DOMContentLoaded', () => {
    document.querySelector('[data-language-toggle]')?.addEventListener('click', () => {
      applyLanguage(language === 'ar' ? 'en' : 'ar');
    });
    applyLanguage(language, false);
  });

  window.__i18n = { get, applyLanguage, getLanguage: () => language, translations };
})();
