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

// Three.js Audit Magnifier
function initAuditMagnifier() {
  const canvas = document.getElementById('audit-canvas');
  if (!canvas) return;

  const scene = new THREE.Scene();
  const camera = new THREE.OrthographicCamera(-2, 2, 1.5, -1.5, 0.1, 100);
  const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });

  const rect = canvas.getBoundingClientRect();
  renderer.setSize(rect.width, rect.height);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  camera.position.z = 5;

  // Couleur dorée
  const goldColor = 0xC8A96B;

  // Groupe pour la loupe
  const magnifierGroup = new THREE.Group();

  // Cercle de la loupe
  const ringGeometry = new THREE.RingGeometry(0.8, 0.85, 64);
  const ringMaterial = new THREE.MeshBasicMaterial({
    color: goldColor,
    transparent: true,
    opacity: 0.7,
    side: THREE.DoubleSide
  });
  const ring = new THREE.Mesh(ringGeometry, ringMaterial);
  magnifierGroup.add(ring);

  // Fond du cercle
  const circleGeometry = new THREE.CircleGeometry(0.8, 64);
  const circleMaterial = new THREE.MeshBasicMaterial({
    color: goldColor,
    transparent: true,
    opacity: 0.03
  });
  const circle = new THREE.Mesh(circleGeometry, circleMaterial);
  magnifierGroup.add(circle);

  // Manche de la loupe
  const handleGeometry = new THREE.CylinderGeometry(0.08, 0.08, 0.8, 16);
  const handleMaterial = new THREE.MeshBasicMaterial({
    color: goldColor,
    transparent: true,
    opacity: 0.6
  });
  const handle = new THREE.Mesh(handleGeometry, handleMaterial);
  handle.rotation.z = Math.PI / 4;
  handle.position.set(1, -1, 0);
  magnifierGroup.add(handle);

  // Groupe pour les diagrammes dans la loupe
  const chartsGroup = new THREE.Group();

  // Barres du graphique
  const barData = [
    { height: 0.3, x: -0.4 },
    { height: 0.45, x: -0.2 },
    { height: 0.52, x: 0 },
    { height: 0.63, x: 0.2 },
    { height: 0.37, x: 0.4 }
  ];

  barData.forEach(data => {
    const barGeometry = new THREE.BoxGeometry(0.12, data.height, 0.02);
    const barMaterial = new THREE.MeshBasicMaterial({
      color: goldColor,
      transparent: true,
      opacity: 0.6
    });
    const bar = new THREE.Mesh(barGeometry, barMaterial);
    bar.position.set(data.x, -0.2 + data.height / 2, 0.01);
    chartsGroup.add(bar);
  });


  magnifierGroup.add(chartsGroup);
  scene.add(magnifierGroup);

  // Groupe pour le graphique agrandi (initialement invisible)
  const expandedChartsGroup = new THREE.Group();
  expandedChartsGroup.scale.set(0.3, 0.3, 0.3);
  expandedChartsGroup.visible = false;

  // Barres agrandies
  const expandedBarData = [
    { height: 0.8, x: -1.2 },
    { height: 1.2, x: -0.6 },
    { height: 1.4, x: 0 },
    { height: 1.7, x: 0.6 },
    { height: 1.0, x: 1.2 }
  ];

  expandedBarData.forEach(data => {
    const barGeometry = new THREE.BoxGeometry(0.3, data.height, 0.02);
    const barMaterial = new THREE.MeshBasicMaterial({
      color: goldColor,
      transparent: true,
      opacity: 0.5
    });
    const bar = new THREE.Mesh(barGeometry, barMaterial);
    bar.position.set(data.x, -0.5 + data.height / 2, 0.01);
    expandedChartsGroup.add(bar);
  });

  // Courbe agrandie
  const expandedCurve = new THREE.CatmullRomCurve3([
    new THREE.Vector3(-1.4, 0.2, 0.02),
    new THREE.Vector3(-0.7, 0.6, 0.02),
    new THREE.Vector3(0, 0.9, 0.02),
    new THREE.Vector3(0.7, 1.3, 0.02),
    new THREE.Vector3(1.4, 1.2, 0.02)
  ]);

  const expandedPoints = expandedCurve.getPoints(50);
  const expandedLineGeometry = new THREE.BufferGeometry().setFromPoints(expandedPoints);
  const expandedLineMaterial = new THREE.LineBasicMaterial({
    color: goldColor,
    transparent: true,
    opacity: 0.8,
    linewidth: 3
  });
  const expandedLine = new THREE.Line(expandedLineGeometry, expandedLineMaterial);
  expandedChartsGroup.add(expandedLine);

  // Points sur la courbe agrandie
  [0, 0.25, 0.5, 0.75, 1].forEach(t => {
    const point = expandedCurve.getPoint(t);
    const pointGeometry = new THREE.SphereGeometry(0.08, 16, 16);
    const pointMaterial = new THREE.MeshBasicMaterial({
      color: goldColor,
      transparent: true,
      opacity: 0.9
    });
    const pointMesh = new THREE.Mesh(pointGeometry, pointMaterial);
    pointMesh.position.copy(point);
    expandedChartsGroup.add(pointMesh);
  });

  scene.add(expandedChartsGroup);

  // Animation
  let isHovered = false;
  let zoomProgress = 0;
  const serviceCard = canvas.closest('.service-card');

  if (serviceCard) {
    serviceCard.addEventListener('mouseenter', () => {
      isHovered = true;
    });

    serviceCard.addEventListener('mouseleave', () => {
      isHovered = false;
    });
  }

  function animate() {
    requestAnimationFrame(animate);

    // Animation de zoom
    if (isHovered && zoomProgress < 1) {
      zoomProgress += 0.02;
    } else if (!isHovered && zoomProgress > 0) {
      zoomProgress -= 0.02;
    }
    zoomProgress = Math.max(0, Math.min(1, zoomProgress));

    // Easing function
    const easeOutCubic = (t) => 1 - Math.pow(1 - t, 3);
    const easedProgress = easeOutCubic(zoomProgress);

    // Animer la loupe et le manche (disparition)
    ring.material.opacity = 0.7 * (1 - easedProgress);
    circle.material.opacity = 0.03 * (1 - easedProgress);
    handle.material.opacity = 0.6 * (1 - easedProgress);
    magnifierGroup.scale.set(
      1 + easedProgress * 2,
      1 + easedProgress * 2,
      1
    );

    // Animer les petits diagrammes (disparition)
    chartsGroup.children.forEach(child => {
      if (child.material) {
        const baseOpacity = child.material.userData.baseOpacity || child.material.opacity;
        child.material.userData.baseOpacity = baseOpacity;
        child.material.opacity = baseOpacity * (1 - easedProgress);
      }
    });

    // Animer les grands diagrammes (apparition)
    expandedChartsGroup.visible = zoomProgress > 0.01;
    expandedChartsGroup.scale.set(
      0.3 + easedProgress * 0.7,
      0.3 + easedProgress * 0.7,
      1
    );
    expandedChartsGroup.children.forEach(child => {
      if (child.material) {
        const baseOpacity = child.material.userData.baseOpacity || child.material.opacity;
        child.material.userData.baseOpacity = baseOpacity;
        child.material.opacity = baseOpacity * easedProgress;
      }
    });

    renderer.render(scene, camera);
  }

  animate();

  // Responsive
  window.addEventListener('resize', () => {
    const rect = canvas.getBoundingClientRect();
    renderer.setSize(rect.width, rect.height);
  });
}

// Attendre que le DOM soit chargé
document.addEventListener("DOMContentLoaded", () => {
  initAuditMagnifier();
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
          formMessage.textContent = 'Merci. Votre demande a bien été prise en compte ✓';
          formMessage.className = "form-message success";
          contactForm.reset();
        } else {
          throw new Error("Erreur lors de l'envoi");
        }
      } catch (error) {
        // Erreur
        formMessage.textContent = 'Une erreur est survenue. Veuillez réessayer.';
        formMessage.className = "form-message error";
        console.error("Erreur:", error);
      } finally {
        // Réactiver le bouton
        submitButton.disabled = false;
        submitButton.textContent = originalButtonText;
      }
    });
  }
});


