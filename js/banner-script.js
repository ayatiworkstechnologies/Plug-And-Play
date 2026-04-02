 document.addEventListener("DOMContentLoaded", function () {
    const images = [
      "images/peroson-banner.png",
      "images/console.png",
      "images/rc-car.png",
      "images/snooker-balls.png",
      "images/off-roading.png",
      "images/sandpit-exploration.png"
    ];

    const glows = [
      "radial-gradient(circle, rgba(0,80,160,0.85) 0%, transparent 70%)",
      "radial-gradient(circle, rgba(90,0,170,0.75) 0%, transparent 70%)",
      "radial-gradient(circle, rgba(0,120,100,0.80) 0%, transparent 70%)",
      "radial-gradient(circle, rgba(0,180,255,0.82) 0%, transparent 70%)",
      "radial-gradient(circle, rgba(255,120,0,0.85) 0%, transparent 70%)",
      "radial-gradient(circle, rgba(255,190,60,0.82) 0%, transparent 70%)"
    ];

    const titles = [
      "Experience Next-Level Gaming",
      "Ultimate Console Power",
      "High-Speed RC Racing Thrill",
      "Precision Snooker Experience",
      "Extreme Off-Road Adventure",
      "Sandpit Exploration Zone"
    ];

    const descriptions = [
      "Dive into immersive VR, precision control, and real excitement",
      "Feel the power of PlayStation with smooth and responsive gameplay",
      "Control speed machines with precision and adrenaline-filled racing",
      "Enjoy skill-based snooker action with sharp focus and premium gameplay",
      "Take on rough tracks and thrilling off-road terrain with high-powered RC action",
      "Discover sandy trails, terrain play, and adventurous exploration moments"
    ];

    let current = 0;

    const img = document.getElementById("personImg");
    const glow = document.getElementById("glowCircle");
    const pulse = document.getElementById("pulseRing");
    const dots = document.querySelectorAll(".dot");
    const cards = document.querySelectorAll(".feature-card");
    const personWrap = document.getElementById("personWrap");
    const heroTitle = document.getElementById("heroTitle");
    const heroDesc = document.getElementById("heroDesc");

    if (
      !img ||
      !glow ||
      !pulse ||
      dots.length === 0 ||
      cards.length === 0 ||
      !personWrap ||
      !heroTitle ||
      !heroDesc
    ) {
      console.warn("Some elements not found in DOM");
      return;
    }

    function finishImageIn() {
      img.classList.remove("opacity-0", "translate-y-4");
      img.classList.add("opacity-100", "translate-y-0");
    }

    function swapImage(src) {
      img.classList.add("opacity-0", "translate-y-4");
      img.classList.remove("opacity-100", "translate-y-0");

      setTimeout(() => {
        img.onload = finishImageIn;
        img.src = src;

        if (img.complete) {
          finishImageIn();
        }
      }, 250);
    }

    function updateText() {
      heroTitle.classList.add("opacity-0", "translate-y-2");
      heroDesc.classList.add("opacity-0", "translate-y-2");

      setTimeout(() => {
        heroTitle.textContent = titles[current];
        heroDesc.textContent = descriptions[current];

        heroTitle.classList.remove("opacity-0", "translate-y-2");
        heroDesc.classList.remove("opacity-0", "translate-y-2");
      }, 180);
    }

    function updateUI() {
      glow.style.background = glows[current];

      dots.forEach((dot, i) => {
        dot.classList.toggle("bg-cyan-400", i === current);
        dot.classList.toggle("bg-cyan-400/20", i !== current);
        dot.classList.toggle("active-dot", i === current);
      });

      cards.forEach((card, i) => {
        card.classList.toggle("ring-2", i === current);
        card.classList.toggle("ring-cyan-400", i === current);
        card.classList.toggle("active", i === current);
      });

      updateText();
    }

    function firePulse() {
      pulse.classList.remove("pulse-fire");
      void pulse.offsetWidth;
      pulse.classList.add("pulse-fire");
    }

    function selectImage(i) {
      if (i === current) return;
      current = i;
      swapImage(images[i]);
      updateUI();
      firePulse();
    }

    function cycleImage() {
      current = (current + 1) % images.length;
      swapImage(images[current]);
      updateUI();
      firePulse();
    }

    cards.forEach((card) => {
      card.addEventListener("click", function () {
        selectImage(Number(this.dataset.index));
      });
    });

    dots.forEach((dot) => {
      dot.addEventListener("click", function () {
        selectImage(Number(this.dataset.index));
      });
    });

    personWrap.addEventListener("click", cycleImage);

    updateUI();
  });