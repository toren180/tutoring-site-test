(function () {
  "use strict";

  var header = document.getElementById("site-header");
  var hero = document.getElementById("hero");
  var navToggle = document.getElementById("nav-toggle");
  var navMenu = document.getElementById("nav-menu");

  function updateHeaderShadow() {
    if (!header || !hero) return;
    var heroBottom = hero.getBoundingClientRect().bottom;
    if (heroBottom <= 0) {
      header.classList.add("is-scrolled");
    } else {
      header.classList.remove("is-scrolled");
    }
  }

  function closeMobileNav() {
    if (!navToggle || !navMenu) return;
    navMenu.classList.remove("is-open");
    navToggle.setAttribute("aria-expanded", "false");
    navToggle.setAttribute("aria-label", "Open menu");
  }

  function toggleMobileNav() {
    if (!navToggle || !navMenu) return;
    var open = navMenu.classList.toggle("is-open");
    navToggle.setAttribute("aria-expanded", open ? "true" : "false");
    navToggle.setAttribute("aria-label", open ? "Close menu" : "Open menu");
  }

  if (navToggle && navMenu) {
    navToggle.addEventListener("click", toggleMobileNav);
    navMenu.querySelectorAll('a[href^="#"]').forEach(function (link) {
      link.addEventListener("click", function () {
        closeMobileNav();
      });
    });
  }

  window.addEventListener("scroll", updateHeaderShadow, { passive: true });
  window.addEventListener("resize", updateHeaderShadow);
  updateHeaderShadow();

  var prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
    anchor.addEventListener("click", function (e) {
      var id = anchor.getAttribute("href");
      if (!id || id === "#") return;
      var target = document.querySelector(id);
      if (target) {
        e.preventDefault();
        target.scrollIntoView({
          behavior: prefersReducedMotion ? "auto" : "smooth",
          block: "start",
        });
      }
    });
  });

  function initAnimations() {
    var revealElements = document.querySelectorAll(".reveal");

    if (prefersReducedMotion) {
      if (hero) hero.classList.add("is-loaded");
      revealElements.forEach(function (el) {
        el.classList.add("is-visible");
      });
      return;
    }

    if (hero) {
      requestAnimationFrame(function () {
        requestAnimationFrame(function () {
          hero.classList.add("is-loaded");
        });
      });
    }

    if (!("IntersectionObserver" in window) || !revealElements.length) {
      revealElements.forEach(function (el) {
        el.classList.add("is-visible");
      });
      return;
    }

    var revealObserver = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            revealObserver.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0.15,
        rootMargin: "0px 0px -40px 0px",
      }
    );

    revealElements.forEach(function (el) {
      revealObserver.observe(el);
    });
  }

  initAnimations();
})();
