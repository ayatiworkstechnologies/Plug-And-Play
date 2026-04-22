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
    "Step Into Another Reality",
    "Game On. No Limits.",
    "Control the Speed",
    "Precision Meets Chill",
    "Take It Off the Grid",
    "Let Them Play Free"
  ];

  const descriptions = [
    "Immersive VR games that put you inside the action",
    "High-performance PS5 gaming for friends and rivals",
    "Real tracks. Real thrill. Race like you mean it",
    "Premium tables for casual play and serious matches",
    "Rough terrain. Pure control. Maximum adrenaline",
    "Safe, fun and engaging space for kids to enjoy"
  ];

  let current = 0;
  let autoSlide = null;

  const AUTO_DELAY = 4000;
  const IMAGE_DELAY = 320;
  const TEXT_DELAY = 220;

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
    img.classList.remove("opacity-0", "translate-y-5", "scale-[0.96]");
    img.classList.add("opacity-100", "translate-y-0", "scale-100");
  }

  function swapImage(src) {
    img.classList.add("opacity-0", "translate-y-5", "scale-[0.96]");
    img.classList.remove("opacity-100", "translate-y-0", "scale-100");

    setTimeout(() => {
      img.onload = finishImageIn;
      img.src = src;

      if (img.complete) {
        finishImageIn();
      }
    }, IMAGE_DELAY);
  }

  function updateText() {
    heroTitle.classList.add("opacity-0", "translate-y-3");
    heroDesc.classList.add("opacity-0", "translate-y-3");

    setTimeout(() => {
      heroTitle.textContent = titles[current];
      heroDesc.textContent = descriptions[current];

      heroTitle.classList.remove("opacity-0", "translate-y-3");
      heroDesc.classList.remove("opacity-0", "translate-y-3");
    }, TEXT_DELAY);
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

  function startAutoSlide() {
    if (autoSlide !== null) clearInterval(autoSlide);
    autoSlide = setInterval(cycleImage, AUTO_DELAY);
  }

  function resetAutoSlide() {
    startAutoSlide();
  }

  cards.forEach((card) => {
    card.addEventListener("click", function () {
      selectImage(Number(this.dataset.index));
      resetAutoSlide();
    });
  });

  dots.forEach((dot) => {
    dot.addEventListener("click", function () {
      selectImage(Number(this.dataset.index));
      resetAutoSlide();
    });
  });

  personWrap.addEventListener("click", function () {
    cycleImage();
    resetAutoSlide();
  });

  updateUI();
  startAutoSlide();
});