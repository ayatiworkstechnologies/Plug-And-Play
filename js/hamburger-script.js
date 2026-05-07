  document.addEventListener("DOMContentLoaded", function () {
    const menuBtn = document.getElementById("menuBtn");
    const mobileMenu = document.getElementById("mobileMenu");
    const menuIconPath = document.getElementById("menuIconPath");

    const projectsToggle = document.getElementById("projectsToggle");
    const projectsSubmenu = document.getElementById("projectsSubmenu");
    const projectsArrow = document.getElementById("projectsArrow");
    const desktopProjectsBtn = document.getElementById("desktopProjectsBtn");

    const projectPages = [
      "vr-gaming-zone-chennai.html",
      "rc-car-racing-chennai.html",
      "ps5-gaming-zone-chennai.html",
      "snooker-pool-chennai.html",
      "off-road-rc-cars-chennai.html",
      "kids-sand-play-zone-chennai.html"
    ];

    function openMenu() {
      if (!mobileMenu || !menuBtn || !menuIconPath) return;
      mobileMenu.classList.remove("hidden");
      menuBtn.setAttribute("aria-expanded", "true");
      menuIconPath.setAttribute("d", "M6 18L18 6M6 6l12 12");
    }

    function closeMenu() {
      if (!mobileMenu || !menuBtn || !menuIconPath) return;
      mobileMenu.classList.add("hidden");
      menuBtn.setAttribute("aria-expanded", "false");
      menuIconPath.setAttribute("d", "M4 6h16M4 12h16M4 18h16");

      if (projectsSubmenu) {
        projectsSubmenu.classList.add("hidden");
      }

      if (projectsArrow) {
        projectsArrow.classList.remove("rotate-180");
      }
    }

    function toggleMenu() {
      if (!mobileMenu) return;

      if (mobileMenu.classList.contains("hidden")) {
        openMenu();
      } else {
        closeMenu();
      }
    }

    if (menuBtn && mobileMenu) {
      menuBtn.addEventListener("click", function (e) {
        e.stopPropagation();
        toggleMenu();
      });

      mobileMenu.addEventListener("click", function (e) {
        e.stopPropagation();
      });

      document.addEventListener("click", function (e) {
        if (
          !mobileMenu.classList.contains("hidden") &&
          !mobileMenu.contains(e.target) &&
          !menuBtn.contains(e.target)
        ) {
          closeMenu();
        }
      });

      document.addEventListener("keydown", function (e) {
        if (e.key === "Escape") {
          closeMenu();
        }
      });
    }

    if (projectsToggle && projectsSubmenu && projectsArrow) {
      projectsToggle.addEventListener("click", function () {
        projectsSubmenu.classList.toggle("hidden");
        projectsArrow.classList.toggle("rotate-180");
      });
    }

    let currentPath = window.location.pathname.split("/").pop();

    if (!currentPath || currentPath === "/") {
      currentPath = "index.html";
    }

    document.querySelectorAll(".nav-link, .mobile-nav-link, .desktop-sub-link").forEach((link) => {
      const linkPath = link.getAttribute("href");

      if (linkPath === currentPath) {
        if (link.classList.contains("nav-link")) {
          link.classList.remove("text-white/65");
          link.classList.add("text-[#c7a64b]");
        }

        if (link.classList.contains("mobile-nav-link")) {
          link.classList.remove("text-white/75", "text-white/70");
          link.classList.add("text-[#c7a64b]", "bg-white/5");
        }

        if (link.classList.contains("desktop-sub-link")) {
          link.classList.remove("text-white/75");
          link.classList.add("text-[#c7a64b]", "bg-white/5");
        }
      }
    });

    if (projectPages.includes(currentPath)) {
      if (desktopProjectsBtn) {
        desktopProjectsBtn.classList.remove("text-white/65");
        desktopProjectsBtn.classList.add("text-[#c7a64b]");
      }

      if (projectsToggle) {
        projectsToggle.classList.remove("text-white/75");
        projectsToggle.classList.add("text-[#c7a64b]", "bg-white/5");
      }

      if (projectsSubmenu) {
        projectsSubmenu.classList.remove("hidden");
      }

      if (projectsArrow) {
        projectsArrow.classList.add("rotate-180");
      }
    }
  });
