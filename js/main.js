(function () {
  "use strict";

  var root = document.documentElement;
  var CAREER_START = new Date(2022, 7, 1); // August 2022

  // ---------- Theme ----------
  var themeToggle = document.querySelector(".theme-toggle");

  function currentTheme() {
    var set = root.getAttribute("data-theme");
    if (set) return set;
    return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
  }

  if (themeToggle) {
    themeToggle.addEventListener("click", function () {
      var next = currentTheme() === "dark" ? "light" : "dark";
      root.setAttribute("data-theme", next);
      try {
        localStorage.setItem("theme", next);
      } catch (e) {}
    });
  }

  // ---------- Mobile menu ----------
  var nav = document.querySelector(".nav");
  var menuToggle = document.querySelector(".menu-toggle");

  function closeMenu() {
    nav.classList.remove("is-open");
    if (menuToggle) menuToggle.setAttribute("aria-expanded", "false");
  }

  if (menuToggle) {
    menuToggle.addEventListener("click", function () {
      var open = nav.classList.toggle("is-open");
      menuToggle.setAttribute("aria-expanded", String(open));
    });
  }

  document.querySelectorAll(".nav-links a").forEach(function (link) {
    link.addEventListener("click", closeMenu);
  });

  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape") closeMenu();
  });

  // ---------- Nav border on scroll ----------
  function onScroll() {
    nav.classList.toggle("is-scrolled", window.scrollY > 8);
  }
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  // ---------- Years of experience ----------
  var now = new Date();
  var months = (now.getFullYear() - CAREER_START.getFullYear()) * 12 + (now.getMonth() - CAREER_START.getMonth());
  var years = Math.floor(months / 12);
  document.querySelectorAll("[data-years]").forEach(function (el) {
    el.textContent = years + "+";
  });

  var yearEl = document.querySelector("[data-current-year]");
  if (yearEl) yearEl.textContent = now.getFullYear();

  if (!("IntersectionObserver" in window)) {
    document.querySelectorAll(".reveal").forEach(function (el) {
      el.classList.add("is-visible");
    });
    return;
  }

  // ---------- Reveal on scroll ----------
  var revealObserver = new IntersectionObserver(
    function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          revealObserver.unobserve(entry.target);
        }
      });
    },
    { rootMargin: "0px 0px -40px 0px", threshold: 0.05 }
  );

  document.querySelectorAll(".reveal").forEach(function (el) {
    revealObserver.observe(el);
  });

  // ---------- Active nav link ----------
  var links = {};
  document.querySelectorAll(".nav-links a[href^='#']").forEach(function (a) {
    links[a.getAttribute("href").slice(1)] = a;
  });

  var spyObserver = new IntersectionObserver(
    function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        Object.keys(links).forEach(function (id) {
          links[id].classList.toggle("is-active", id === entry.target.id);
        });
      });
    },
    { rootMargin: "-45% 0px -50% 0px" }
  );

  Object.keys(links).forEach(function (id) {
    var section = document.getElementById(id);
    if (section) spyObserver.observe(section);
  });
})();
