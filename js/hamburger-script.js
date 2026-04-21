
  document.addEventListener("DOMContentLoaded", function () {
    const menuBtn = document.getElementById("menuBtn");
    const mobileMenu = document.getElementById("mobileMenu");
    const menuIconPath = document.getElementById("menuIconPath");

    const projectsToggle = document.getElementById("projectsToggle");
    const projectsSubmenu = document.getElementById("projectsSubmenu");
    const projectsArrow = document.getElementById("projectsArrow");

    function openMenu() {
      mobileMenu.classList.remove("hidden");
      menuBtn.setAttribute("aria-expanded", "true");
      menuIconPath.setAttribute("d", "M6 18L18 6M6 6l12 12");
    }

    function closeMenu() {
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

    // Mobile submenu toggle
    if (projectsToggle && projectsSubmenu && projectsArrow) {
      projectsToggle.addEventListener("click", function () {
        projectsSubmenu.classList.toggle("hidden");
        projectsArrow.classList.toggle("rotate-180");
      });
    }

    // Active menu link
    const currentPath = window.location.pathname.split("/").pop() || "index.html";

    document.querySelectorAll(".nav-link, .mobile-nav-link").forEach((link) => {
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
      }
    });
  });
