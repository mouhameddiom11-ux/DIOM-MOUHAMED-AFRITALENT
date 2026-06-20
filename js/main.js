// reset de base pour recuperer les elements a manipuler

const STORAGE_KEY = 'afritalent-theme';
const toggleBtn = document.getElementById('theme-toggle');
const navbar = document.querySelector('nav.navbar');
const scrollThreshold = 60;
const isHomePage = document.body.classList.contains('home-page');

/* ================================================
        THÈME dark and light
   ================================================ */

  //  Fonction sans paramètre qui retourne le thème à utiliser 

const getPreferredTheme = () => {
  const saved = localStorage.getItem(STORAGE_KEY);  // on sauvegarde
  if (saved === 'light' || saved === 'dark') return saved;  // retourne le thème sauvegardé s'il est valide
  return window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark'; // sinon on regarde la préférence du système et on retourne 'light' ou 'dark'
};

const applyTheme = (theme) => {
  if (theme === 'light') {
    document.body.classList.add('light-mode');
  }
   else {
    document.body.classList.remove('light-mode');
  } // si le thème est 'light', on ajoute la classe 'light-mode' au body

  localStorage.setItem(STORAGE_KEY, theme); // on sauvegarde le thème choisi dans le localStorage pour que ça soit persistant

  if (toggleBtn) {
    toggleBtn.textContent = theme === 'light' ? '☀️' : '🌙';
    toggleBtn.setAttribute('aria-label',
      theme === 'light' ? 'Passer en mode sombre' : 'Passer en mode clair'
    );
   }  // le bouton de bascule est mis à jour pour refléter le thème actuel, avec une icône et un label accessible.
};

const initThemeToggle = () => {
  applyTheme(getPreferredTheme());

  if (toggleBtn) {
    toggleBtn.addEventListener('click', () => {
      const isLight = document.body.classList.contains('light-mode');
      applyTheme(isLight ? 'dark' : 'light');
    });
  }
}; // écouteur d'événement sur le bouton de bascule pour changer de thème lorsque l'utilisateur clique dessus. Il vérifie le thème actuel et applique l'autre thème en conséquence.

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
}; //  Fonction qui ajoute ou supprime la classe 'scrolled' à la navbar en fonction de la position de défilement de la page. 
// Si l'utilisateur a défilé plus de 60 pixels, la classe 'scrolled' est ajoutée, sinon elle est supprimée. Cela permet de changer le style de la navbar lorsqu'on fait défiler la page.

if (isHomePage) {
  window.addEventListener('scroll', handleNavbarScroll);
  window.addEventListener('load', handleNavbarScroll);
} // si la page est la page d'accueil, on ajoute un écouteur d'événement pour le défilement de la fenêtre afin d'appeler la fonction handleNavbarScroll à chaque fois que l'utilisateur fait défiler la page. 


/* ================================================
   COMPTEUR STATS
   ================================================ */

//  Calcule le "pas" d'incrémentation par nombre de frames (environ 60fps) pour atteindre la valeur cible en 2 secondes.

const animateCounter = (el, target, duration = 2000) => {
  let start = 0;
  const step = target / (duration / 16); // fonction de calcul du pas d'incrémentation pour atteindre la valeur cible en 2 secondes, en supposant que l'animation se déroule à environ 60 images par seconde (16 ms par frame).

 // À chaque frame, on ajoute step et on met à jour le texte.

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

//  L'animation ne se lance que quand la section est visible à 30% dans l'écran — pas au chargement de la page.

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


// On lit ce que l'utilisateur a tapé/sélectionné, en supprimant les espaces et en mettant tout en minuscules pour comparer sans erreur de casse.

  const updateFreelanceFilter = () => {
    const query = searchInput.value.trim().toLowerCase();
    const selectedCategory = categorySelect.value.trim().toLowerCase();
    let visibleCount = 0;

  // Parcours de chaque carte

    freelanceCards.forEach((card) => {
      const name = card.querySelector('.card-title')?.textContent.trim().toLowerCase() || '';
      const category = card.dataset.category?.trim().toLowerCase() || '';
      const description = card.querySelector('.card-text')?.textContent.trim().toLowerCase() || '';
      
      // Afficher ou masquer la carte 

      const matchesCategory = !selectedCategory || category === selectedCategory;
      const matchesQuery = !query || name.includes(query) || category.includes(query) || description.includes(query);
      const visible = matchesCategory && matchesQuery;

      card.style.display = visible ? '' : 'none';
      if (visible) visibleCount += 1;
    });

    // message de statut pour informer l'utilisateur du nombre de freelances trouvés ou si aucun ne correspond à sa recherche.   

    if (statusText) {
      statusText.textContent = visibleCount > 0
        ? `${visibleCount} freelance${visibleCount > 1 ? 's' : ''} trouvé${visibleCount > 1 ? 's' : ''}`
        : 'Aucun freelance ne correspond à votre recherche.';
    }
  };

//  Les écouteurs d'événements

  searchInput.addEventListener('input', updateFreelanceFilter);
  categorySelect.addEventListener('change', updateFreelanceFilter);
  updateFreelanceFilter();
};

/* ================================================
   INIT
   ================================================ */

initThemeToggle();
initFreelanceFiltering();