const navToggle = document.getElementById("nav-toggle");
const primaryNav = document.getElementById("primary-nav");
const yearSpan = document.getElementById("current-year");
const siteHeader = document.querySelector(".site-header");

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

if (yearSpan) {
  yearSpan.textContent = String(new Date().getFullYear());
}

// Masquer le header lors du scroll vers le bas
let lastScrollTop = 0;
let scrollThreshold = 100;

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


