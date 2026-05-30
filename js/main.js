const STORAGE_KEY = 'afritalent-theme';
const toggleBtn = document.getElementById('theme-toggle');
const navbar = document.querySelector('nav.navbar');
const scrollThreshold = 60;
const isHomePage = document.body.classList.contains('home-page');

/* ================================================
   THÈME
   ================================================ */

const getPreferredTheme = () => {
  const saved = localStorage.getItem(STORAGE_KEY);
  if (saved === 'light' || saved === 'dark') return saved;
  return window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark';
};

const applyTheme = (theme) => {
  if (theme === 'light') {
    document.body.classList.add('light-mode');
  } else {
    document.body.classList.remove('light-mode');
  }

  localStorage.setItem(STORAGE_KEY, theme);

  if (toggleBtn) {
    toggleBtn.textContent = theme === 'light' ? '☀️' : '🌙';
    toggleBtn.setAttribute('aria-label',
      theme === 'light' ? 'Passer en mode sombre' : 'Passer en mode clair'
    );
  }
};

const initThemeToggle = () => {
  applyTheme(getPreferredTheme());

  if (toggleBtn) {
    toggleBtn.addEventListener('click', () => {
      const isLight = document.body.classList.contains('light-mode');
      applyTheme(isLight ? 'dark' : 'light');
    });
  }
};

/* ================================================
   NAVBAR SCROLL
   ================================================ */

const handleNavbarScroll = () => {
  if (!navbar) return;
  if (window.scrollY > scrollThreshold) {
    navbar.classList.add('scrolled');
  } else {
    navbar.classList.remove('scrolled');
  }
};

if (isHomePage) {
  window.addEventListener('scroll', handleNavbarScroll);
  window.addEventListener('load', handleNavbarScroll);
}

/* ================================================
   COMPTEUR STATS
   ================================================ */

const animateCounter = (el, target, duration = 2000) => {
  let start = 0;
  const step = target / (duration / 16);

  const update = () => {
    start += step;
    if (start < target) {
      el.textContent = '+' + Math.floor(start).toLocaleString('fr-FR');
      requestAnimationFrame(update);
    } else {
      el.textContent = '+' + target.toLocaleString('fr-FR');
    }
  };

  requestAnimationFrame(update);
};

const statsSection = document.querySelector('.stats-Hero');
if (statsSection) {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;

      const statBoxes = entry.target.querySelectorAll('.stat-box h2');
      statBoxes.forEach((h2) => {
        const raw = h2.textContent.replace(/\s/g, '').replace('+', '');
        const target = parseInt(raw, 10);
        if (!Number.isNaN(target)) {
          animateCounter(h2, target, 2000);
        }
      });

      observer.unobserve(entry.target);
    });
  }, { threshold: 0.3 });

  observer.observe(statsSection);
}

/* ================================================
   BOUTON SCROLL TO TOP
   ================================================ */

const scrollBtn = document.getElementById('scrollTopBtn');
if (scrollBtn) {
  window.addEventListener('scroll', () => {
    scrollBtn.classList.toggle('show', window.scrollY > 300);
  });

  scrollBtn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}

/* ================================================
   INIT
   ================================================ */

initThemeToggle();