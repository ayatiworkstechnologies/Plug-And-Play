
  document.addEventListener("DOMContentLoaded", function () {
    const menuBtn = document.getElementById("menuBtn");
    const mobileMenu = document.getElementById("mobileMenu");
    const menuIconPath = document.getElementById("menuIconPath");

    function openMenu() {
      mobileMenu.classList.remove("hidden");
      menuBtn.setAttribute("aria-expanded", "true");
      menuIconPath.setAttribute("d", "M6 18L18 6M6 6l12 12");
    }

    function closeMenu() {
      mobileMenu.classList.add("hidden");
      menuBtn.setAttribute("aria-expanded", "false");
      menuIconPath.setAttribute("d", "M4 6h16M4 12h16M4 18h16");
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
          link.classList.remove("text-white/75");
          link.classList.add("text-[#c7a64b]", "bg-white/5");
        }
      }
    });
  });