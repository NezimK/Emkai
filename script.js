// Three.js Background avec gestion de visibilité - Compatible Hostinger
const canvas = document.getElementById("three-bg");

if (!canvas) {
  console.error('Canvas #three-bg introuvable');
} else if (typeof THREE === 'undefined') {
  console.error('Three.js n\'est pas chargé. Vérifiez que le CDN est accessible.');
  canvas.style.display = 'none';
} else {
  try {
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });

    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    camera.position.z = 4.5; // Rapproché pour effet 3D plus immersif

    // Créer une texture circulaire
    function createCircleTexture() {
      const canvas = document.createElement('canvas');
      canvas.width = 32;
      canvas.height = 32;
      const ctx = canvas.getContext('2d');

      const gradient = ctx.createRadialGradient(16, 16, 0, 16, 16, 16);
      gradient.addColorStop(0, 'rgba(255, 255, 255, 1)');
      gradient.addColorStop(0.5, 'rgba(255, 255, 255, 0.5)');
      gradient.addColorStop(1, 'rgba(255, 255, 255, 0)');

      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, 32, 32);

      const texture = new THREE.Texture(canvas);
      texture.needsUpdate = true;
      return texture;
    }

    // Créer des particules
    const particlesGeometry = new THREE.BufferGeometry();
    const particlesCount = 280;
    const posArray = new Float32Array(particlesCount * 3);

    // Distribution spatiale élargie pour effet 3D prononcé
    for (let i = 0; i < particlesCount * 3; i++) {
      posArray[i] = (Math.random() - 0.5) * 12;
    }

    particlesGeometry.setAttribute('position', new THREE.BufferAttribute(posArray, 3));

    const particlesMaterial = new THREE.PointsMaterial({
      size: 0.03,
      color: 0xC8A96B,
      transparent: true,
      opacity: 0.85,
      blending: THREE.AdditiveBlending,
      sizeAttenuation: true,
      depthWrite: false,
      map: createCircleTexture()
    });

    const particlesMesh = new THREE.Points(particlesGeometry, particlesMaterial);
    scene.add(particlesMesh);

    // Animation avec gestion de visibilité de page
    let mouseX = 0;
    let mouseY = 0;
    let isPageVisible = true;

    // Optimisation: throttle du mousemove
    let lastMouseUpdate = 0;
    const MOUSE_THROTTLE = 16; // ~60fps

    document.addEventListener('mousemove', (event) => {
      const now = Date.now();
      if (now - lastMouseUpdate < MOUSE_THROTTLE) return;

      mouseX = (event.clientX / window.innerWidth) * 2 - 1;
      mouseY = -(event.clientY / window.innerHeight) * 2 + 1;
      lastMouseUpdate = now;
    });

    // Pause l'animation quand l'onglet n'est pas visible
    document.addEventListener('visibilitychange', () => {
      isPageVisible = !document.hidden;
    });

    function animate() {
      requestAnimationFrame(animate);

      // Ne pas animer si la page n'est pas visible
      if (!isPageVisible) return;

      particlesMesh.rotation.y += 0.0008;
      particlesMesh.rotation.x += 0.0005;

      // Mouvement subtle basé sur la souris - effet 3D accentué
      particlesMesh.rotation.y += mouseX * 0.0003;
      particlesMesh.rotation.x += mouseY * 0.0003;

      renderer.render(scene, camera);
    }

    animate();

    // Responsive (optimisé avec debounce)
    let resizeTimeout;
    window.addEventListener('resize', () => {
      clearTimeout(resizeTimeout);
      resizeTimeout = setTimeout(() => {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
      }, 100);
    });

  } catch (error) {
    console.error('Erreur lors de l\'initialisation de Three.js:', error);
    if (canvas) canvas.style.display = 'none';
  }
}

// Attendre que le DOM soit chargé
document.addEventListener("DOMContentLoaded", () => {
  const navToggle = document.getElementById("nav-toggle");
  const primaryNav = document.getElementById("primary-nav");
  const yearSpan = document.getElementById("current-year");
  const logo = document.querySelector(".logo");

  // Navigation mobile
  if (navToggle && primaryNav) {
    navToggle.addEventListener("click", () => {
      primaryNav.classList.toggle("active");
      const expanded = navToggle.getAttribute("aria-expanded") === "true";
      navToggle.setAttribute("aria-expanded", String(!expanded));
    });

    primaryNav.querySelectorAll("a").forEach((link) => {
      link.addEventListener("click", () => {
        primaryNav.classList.remove("active");
        navToggle.setAttribute("aria-expanded", "false");
      });
    });
  }

  // Année dans le footer
  if (yearSpan) {
    yearSpan.textContent = String(new Date().getFullYear());
  }

  // Gestion de la disparition du logo au scroll
  const scrollThreshold = 100; // Distance de scroll avant de cacher le logo

  function handleLogoScroll() {
    const currentScrollY = window.scrollY;

    if (logo) {
      if (currentScrollY > scrollThreshold) {
        logo.classList.add("hidden");
      } else {
        logo.classList.remove("hidden");
      }
    }
  }

  // Throttle du scroll pour performance
  let scrollTimeout;
  window.addEventListener("scroll", () => {
    if (scrollTimeout) {
      window.cancelAnimationFrame(scrollTimeout);
    }
    scrollTimeout = window.requestAnimationFrame(handleLogoScroll);
  });

  // Gestion des barres de la section méthode
  const processSteps = document.querySelectorAll(".process-step");
  processSteps.forEach((step) => {
    step.addEventListener("mouseenter", () => {
      step.classList.add("bar-visible");
    });
  });

  // Gestion des cartes FAQ Bento
  const faqCards = document.querySelectorAll(".faq-card[data-faq]");
  faqCards.forEach((card) => {
    card.addEventListener("click", () => {
      const isActive = card.classList.contains("active");

      // Fermer toutes les autres cartes
      faqCards.forEach((otherCard) => {
        otherCard.classList.remove("active");
      });

      // Ouvrir/fermer la carte cliquée
      if (!isActive) {
        card.classList.add("active");
      }
    });
  });

  // Animated Counters for Impact Section
  const counters = document.querySelectorAll('.counter');

  if (counters.length > 0) {
    const observerOptions = {
      root: null,
      rootMargin: '0px',
      threshold: 0.3
    };

    const counterObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting && !entry.target.classList.contains('counted')) {
          const counter = entry.target;
          const target = parseInt(counter.dataset.target);
          const suffix = counter.dataset.suffix || '';
          const duration = 2000;
          const startTime = performance.now();

          counter.classList.add('counted');

          function updateCounter(currentTime) {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);

            // Easing function for smooth animation (easeOutQuart)
            const easeOutQuart = 1 - Math.pow(1 - progress, 4);
            const current = Math.floor(easeOutQuart * target);

            counter.textContent = current.toLocaleString('fr-FR') + suffix;

            if (progress < 1) {
              requestAnimationFrame(updateCounter);
            } else {
              counter.classList.add('animated');
            }
          }

          requestAnimationFrame(updateCounter);
        }
      });
    }, observerOptions);

    counters.forEach(counter => counterObserver.observe(counter));
  }

  // Gestion du formulaire de contact
  const contactForm = document.getElementById("contact-form");
  const formMessage = document.getElementById("form-message");

  if (contactForm && formMessage) {
    contactForm.addEventListener("submit", async (e) => {
      e.preventDefault();

      const submitButton = contactForm.querySelector('button[type="submit"]');
      const originalButtonText = submitButton.textContent;

      // Désactiver le bouton pendant l'envoi
      submitButton.disabled = true;
      submitButton.textContent = "Envoi en cours...";

      try {
        const formData = {
          nom_prenom: contactForm.nom_prenom.value,
          agence: contactForm.agence.value,
          email: contactForm.email.value,
          service: contactForm.service.value,
          objectif: contactForm.objectif.value,
          recipient_email: "alimekzine@emkai.fr",
          timestamp: new Date().toISOString()
        };

        // Utilisation de Make.com webhook
        const response = await fetch("https://hook.eu2.make.com/gs0ywvxt7g60p4angadg2v6y1s78i8qw", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Accept": "application/json"
          },
          body: JSON.stringify(formData),
        });

        if (response.ok) {
          await response.text();
          formMessage.textContent = 'Merci. Votre demande a bien été prise en compte ✓';
          formMessage.className = "form-message success";
          contactForm.reset();
        } else {
          throw new Error(`Erreur ${response.status}`);
        }
      } catch (error) {
        formMessage.textContent = 'Une erreur est survenue. Veuillez réessayer.';
        formMessage.className = "form-message error";
      } finally {
        submitButton.disabled = false;
        submitButton.textContent = originalButtonText;
      }
    });
  }
});

