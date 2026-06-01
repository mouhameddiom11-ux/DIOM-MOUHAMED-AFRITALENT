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
// validation du formulaire de contact

const form = document.querySelector(".contact-form");

if (form) {
  form.addEventListener("submit", function (e) {
    e.preventDefault();

    const nom = document.getElementById("name");
    const prenom = document.getElementById("prenom");
    const email = document.getElementById("email");
    const message = document.getElementById("message");

    const nameError = document.getElementById("nameError");
    const prenomError = document.getElementById("prenomError");
    const emailError = document.getElementById("emailError");
    const messageError = document.getElementById("messageError");
    const successMessage = document.getElementById("successMessage");

    let isValid = true;

    nameError.textContent = "";
    prenomError.textContent = "";
    emailError.textContent = "";
    messageError.textContent = "";
    successMessage.textContent = "";

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (nom.value.trim().length < 2) {
      nameError.textContent = "Le nom doit contenir au moins 2 caractères.";
      isValid = false;
    }

    if (prenom.value.trim().length < 2) {
      prenomError.textContent = "Le prénom doit contenir au moins 2 caractères.";
      isValid = false;
    }

    if (!emailRegex.test(email.value.trim())) {
      emailError.textContent = "Adresse email invalide.";
      isValid = false;
    }

    if (message.value.trim().length < 20) {
      messageError.textContent = "Le message doit contenir au moins 20 caractères.";
      isValid = false;
    }

    if (isValid) {
      successMessage.textContent = "Message envoyé avec succès !";
      form.reset();
    }
  });
}

/* ================================================
    filtre de recherche pour les freelances
   ================================================ */

const initFreelanceFiltering = () => {
  const searchInput = document.getElementById('freelance-search');
  const categorySelect = document.getElementById('freelance-category');
  const statusText = document.getElementById('freelance-status');
  const freelanceCards = Array.from(document.querySelectorAll('.freelance-card'));

  if (!searchInput || !categorySelect || freelanceCards.length === 0) {
    return;
  }

  const updateFreelanceFilter = () => {
    const query = searchInput.value.trim().toLowerCase();
    const selectedCategory = categorySelect.value.trim().toLowerCase();
    let visibleCount = 0;

    freelanceCards.forEach((card) => {
      const name = card.querySelector('.card-title')?.textContent.trim().toLowerCase() || '';
      const category = card.dataset.category?.trim().toLowerCase() || '';
      const description = card.querySelector('.card-text')?.textContent.trim().toLowerCase() || '';

      const matchesCategory = !selectedCategory || category === selectedCategory;
      const matchesQuery = !query || name.includes(query) || category.includes(query) || description.includes(query);
      const visible = matchesCategory && matchesQuery;

      card.style.display = visible ? '' : 'none';
      if (visible) visibleCount += 1;
    });

    if (statusText) {
      statusText.textContent = visibleCount > 0
        ? `${visibleCount} freelance${visibleCount > 1 ? 's' : ''} trouvé${visibleCount > 1 ? 's' : ''}`
        : 'Aucun freelance ne correspond à votre recherche.';
    }
  };

  searchInput.addEventListener('input', updateFreelanceFilter);
  categorySelect.addEventListener('change', updateFreelanceFilter);
  updateFreelanceFilter();
};

/* ================================================
   INIT
   ================================================ */

initThemeToggle();
initFreelanceFiltering();