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


