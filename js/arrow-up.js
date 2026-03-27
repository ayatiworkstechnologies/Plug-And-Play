  const btn = document.getElementById("scrollTopBtn");

  // Show after scroll
  window.addEventListener("scroll", () => {
    if (window.scrollY > 200) {
      btn.classList.remove("hidden");
      btn.classList.add("flex");
    } else {
      btn.classList.add("hidden");
      btn.classList.remove("flex");
    }
  });

  // Scroll to top
  btn.addEventListener("click", () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth"
    });
  });
