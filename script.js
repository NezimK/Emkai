// Canvas 2D Background avec particules (reproduction fidèle de Three.js)
const canvas = document.getElementById("three-bg");

if (!canvas) {
  console.error('Canvas #three-bg introuvable');
} else {
  const ctx = canvas.getContext('2d');

  // Configuration du canvas
  function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }

  resizeCanvas();

  // Création de 300 particules avec propriétés 3D - effet système solaire
  const particles = [];
  const particlesCount = 300;

  for (let i = 0; i < particlesCount; i++) {
    particles.push({
      x: (Math.random() - 0.5) * 18, // Large dispersion pour effet spatial
      y: (Math.random() - 0.5) * 18,
      z: (Math.random() - 0.5) * 18
    });
  }

  // Variables pour l'animation
  let rotationY = 0;
  let rotationX = 0;
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

  // Fonction d'animation
  function animate() {
    requestAnimationFrame(animate);

    // Ne pas animer si la page n'est pas visible
    if (!isPageVisible) return;

    // Effacer le canvas avec un fond noir transparent
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Mise à jour de la rotation - effet système solaire qui tourne lentement
    rotationY += 0.0008; // Rotation Y plus visible
    rotationX += 0.0004; // Rotation X plus visible

    // Mouvement subtle basé sur la souris
    rotationY += mouseX * 0.0002;
    rotationX += mouseY * 0.0002;

    // Calculer les matrices de rotation
    const cosY = Math.cos(rotationY);
    const sinY = Math.sin(rotationY);
    const cosX = Math.cos(rotationX);
    const sinX = Math.sin(rotationX);

    // Paramètres de projection - perspective accentuée pour effet 3D
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    const fov = 6; // Field of view élargi pour meilleur effet 3D
    const scale = Math.min(canvas.width, canvas.height) / 14; // Ajusté pour la dispersion

    // Dessiner chaque particule avec projection 3D
    particles.forEach(particle => {
      // Rotation Y
      let x = particle.x;
      let y = particle.y;
      let z = particle.z;

      let tempX = x * cosY - z * sinY;
      let tempZ = x * sinY + z * cosY;
      x = tempX;
      z = tempZ;

      // Rotation X
      let tempY = y * cosX - z * sinX;
      tempZ = y * sinX + z * cosX;
      y = tempY;
      z = tempZ;

      // Projection perspective
      const perspective = fov / (fov + z);
      const projectedX = centerX + x * scale * perspective;
      const projectedY = centerY + y * scale * perspective;

      // Calculer la taille basée sur la distance - effet de profondeur prononcé
      const size = 0.018 * scale * perspective;

      // Calculer l'opacité avec forte variation de profondeur (effet 3D spatial)
      const opacity = Math.max(0.1, Math.min(0.7, perspective * 0.7));

      // Ne dessiner que si la particule est visible
      if (size > 0.1 && opacity > 0.01) {
        // Créer un dégradé radial pour effet de glow très subtle
        const gradient = ctx.createRadialGradient(
          projectedX, projectedY, 0,
          projectedX, projectedY, size * 2
        );
        gradient.addColorStop(0, `rgba(200, 169, 107, ${opacity})`);
        gradient.addColorStop(0.5, `rgba(200, 169, 107, ${opacity * 0.2})`);
        gradient.addColorStop(1, 'rgba(200, 169, 107, 0)');

        // Dessiner la particule avec glow
        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(projectedX, projectedY, size * 2, 0, Math.PI * 2);
        ctx.fill();

        // Point central très fin
        ctx.fillStyle = `rgba(200, 169, 107, ${opacity * 0.8})`;
        ctx.beginPath();
        ctx.arc(projectedX, projectedY, size * 0.6, 0, Math.PI * 2);
        ctx.fill();
      }
    });
  }

  // Gestion du redimensionnement (optimisé avec debounce)
  let resizeTimeout;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(() => {
      resizeCanvas();
    }, 100);
  });

  // Lancer l'animation
  animate();
}

// Attendre que le DOM soit chargé
document.addEventListener("DOMContentLoaded", () => {
  const navToggle = document.getElementById("nav-toggle");
  const primaryNav = document.getElementById("primary-nav");
  const yearSpan = document.getElementById("current-year");

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

  // Gestion des barres de la section méthode
  const processSteps = document.querySelectorAll(".process-step");
  processSteps.forEach((step) => {
    step.addEventListener("mouseenter", () => {
      step.classList.add("bar-visible");
    });
  });

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

        const response = await fetch("https://hook.eu2.make.com/gs0ywvxt7g60p4angadg2v6y1s78i8qw", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        });

        if (response.ok) {
          formMessage.textContent = 'Merci. Votre demande a bien été prise en compte ✓';
          formMessage.className = "form-message success";
          contactForm.reset();
        } else {
          throw new Error("Erreur lors de l'envoi");
        }
      } catch (error) {
        formMessage.textContent = 'Une erreur est survenue. Veuillez réessayer.';
        formMessage.className = "form-message error";
        console.error("Erreur:", error);
      } finally {
        submitButton.disabled = false;
        submitButton.textContent = originalButtonText;
      }
    });
  }
});
