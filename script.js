// Three.js Background
const canvas = document.getElementById("three-bg");
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });

renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
camera.position.z = 5;

// Créer des particules
const particlesGeometry = new THREE.BufferGeometry();
const particlesCount = 400;
const posArray = new Float32Array(particlesCount * 3);

for (let i = 0; i < particlesCount * 3; i++) {
  posArray[i] = (Math.random() - 0.5) * 10;
}

particlesGeometry.setAttribute('position', new THREE.BufferAttribute(posArray, 3));

const particlesMaterial = new THREE.PointsMaterial({
  size: 0.025,
  color: 0xC8A96B,
  transparent: true,
  opacity: 0.8,
  blending: THREE.AdditiveBlending,
  sizeAttenuation: true,
  map: createCircleTexture()
});

// Fonction pour créer une texture circulaire
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

const particlesMesh = new THREE.Points(particlesGeometry, particlesMaterial);
scene.add(particlesMesh);

// Animation
let mouseX = 0;
let mouseY = 0;

document.addEventListener('mousemove', (event) => {
  mouseX = (event.clientX / window.innerWidth) * 2 - 1;
  mouseY = -(event.clientY / window.innerHeight) * 2 + 1;
});

function animate() {
  requestAnimationFrame(animate);

  particlesMesh.rotation.y += 0.0005;
  particlesMesh.rotation.x += 0.0003;

  // Mouvement subtle basé sur la souris
  particlesMesh.rotation.y += mouseX * 0.0001;
  particlesMesh.rotation.x += mouseY * 0.0001;

  renderer.render(scene, camera);
}

animate();

// Responsive
window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});

// Attendre que le DOM soit chargé
document.addEventListener("DOMContentLoaded", () => {
  const navToggle = document.getElementById("nav-toggle");
  const primaryNav = document.getElementById("primary-nav");
  const yearSpan = document.getElementById("current-year");
  const siteHeader = document.querySelector(".site-header");

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

  // Masquer le header lors du scroll vers le bas
  let lastScrollTop = 0;
  const scrollThreshold = 80;

  if (siteHeader) {
    window.addEventListener("scroll", () => {
      const scrollTop = window.pageYOffset || document.documentElement.scrollTop;

      if (scrollTop > scrollThreshold) {
        if (scrollTop > lastScrollTop) {
          // Scroll vers le bas
          siteHeader.classList.add("hidden");
        } else {
          // Scroll vers le haut
          siteHeader.classList.remove("hidden");
        }
      } else {
        // En haut de la page
        siteHeader.classList.remove("hidden");
      }

      lastScrollTop = scrollTop <= 0 ? 0 : scrollTop;
    });
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

  if (contactForm) {
    contactForm.addEventListener("submit", async (e) => {
      e.preventDefault();

      // Récupération des données du formulaire
      const formData = {
        nom_prenom: contactForm.nom_prenom.value,
        agence: contactForm.agence.value,
        email: contactForm.email.value,
        service: contactForm.service.value,
        objectif: contactForm.objectif.value,
        recipient_email: "alimekzine@emkai.fr",
        timestamp: new Date().toISOString()
      };

      // Désactiver le bouton pendant l'envoi
      const submitButton = contactForm.querySelector('button[type="submit"]');
      const originalButtonText = submitButton.textContent;
      submitButton.disabled = true;
      submitButton.textContent = "Envoi en cours...";

      try {
        // URL du webhook Make.com (à remplacer par votre webhook)
        const webhookURL = "https://hook.eu2.make.com/gs0ywvxt7g60p4angadg2v6y1s78i8qw";

        const response = await fetch(webhookURL, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        });

        if (response.ok) {
          // Succès
          formMessage.textContent = "✓ Merci ! Votre demande a été envoyée avec succès.";
          formMessage.style.color = "#10b981";
          formMessage.style.marginTop = "1rem";
          contactForm.reset();
        } else {
          throw new Error("Erreur lors de l'envoi");
        }
      } catch (error) {
        // Erreur
        formMessage.textContent = "✗ Une erreur est survenue. Veuillez réessayer.";
        formMessage.style.color = "#ef4444";
        formMessage.style.marginTop = "1rem";
        console.error("Erreur:", error);
      } finally {
        // Réactiver le bouton
        submitButton.disabled = false;
        submitButton.textContent = originalButtonText;
      }
    });
  }
});


