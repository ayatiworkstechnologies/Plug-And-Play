document.addEventListener("DOMContentLoaded", function () {

  const images = [
    "images/peroson-banner.png",
    "images/ps5.png",
    "images/rc-banner.png"
  ];

  const glows = [
    "radial-gradient(circle, rgba(0,80,160,0.85) 0%, transparent 70%)",
    "radial-gradient(circle, rgba(90,0,170,0.75) 0%, transparent 70%)",
    "radial-gradient(circle, rgba(0,120,100,0.80) 0%, transparent 70%)"
  ];

  let current = 0;

  const img = document.getElementById("personImg");
  const glow = document.getElementById("glowCircle");
  const pulse = document.getElementById("pulseRing");
  const dots = document.querySelectorAll(".dot");
  const cards = document.querySelectorAll(".feature-card");
  const personWrap = document.getElementById("personWrap");

  // ✅ Safety check (very important)
  if (!img || !glow || !pulse || dots.length === 0 || cards.length === 0 || !personWrap) {
    console.warn("Some elements not found in DOM");
    return;
  }

  function swapImage(src) {
    img.classList.add("opacity-0", "translate-y-4");

    setTimeout(() => {
      img.src = src;

      img.onload = () => {
        img.classList.remove("opacity-0", "translate-y-4");
      };
    }, 250);
  }

  function updateUI() {
    glow.style.background = glows[current];

    dots.forEach((dot, i) => {
      dot.classList.toggle("bg-cyan-400", i === current);
      dot.classList.toggle("bg-cyan-400/20", i !== current);
    });

    cards.forEach((card, i) => {
      card.classList.toggle("ring-2", i === current);
      card.classList.toggle("ring-cyan-400", i === current);
    });
  }

  function firePulse() {
    pulse.classList.remove("scale-150", "opacity-0");
    pulse.classList.add("scale-100", "opacity-70");

    setTimeout(() => {
      pulse.classList.add("scale-150", "opacity-0");
    }, 50);
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
    card.addEventListener("click", () => {
      selectImage(Number(card.dataset.index));
    });
  });

  dots.forEach((dot) => {
    dot.addEventListener("click", () => {
      selectImage(Number(dot.dataset.index));
    });
  });

  personWrap.addEventListener("click", cycleImage);

  updateUI();

});
