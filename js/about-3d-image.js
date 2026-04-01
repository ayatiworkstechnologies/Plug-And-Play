
  /* ── Scroll reveal ── */
  const reveals = document.querySelectorAll(".img-reveal");
  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
          revealObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.15 }
  );
  reveals.forEach((el) => revealObserver.observe(el));

  /* ── 3D tilt + glare (generic — works for .img-tilt cards) ── */
  document.querySelectorAll(".img-tilt").forEach((card) => {
    const glare = card.querySelector(".tilt-glare");
    const glow  = card.dataset.glow || "255,255,255";

    card.addEventListener("mousemove", (e) => {
      const r  = card.getBoundingClientRect();
      const nx = (e.clientX - r.left - r.width  / 2) / (r.width  / 2);
      const ny = (e.clientY - r.top  - r.height / 2) / (r.height / 2);

      card.style.transform  = `perspective(900px) rotateX(${-ny * 13}deg) rotateY(${nx * 17}deg) scale(1.055) translateZ(12px)`;
      card.style.boxShadow  = `${nx * 20}px ${ny * 14 + 20}px 55px rgba(${glow},0.5), 0 0 40px rgba(${glow},0.25)`;

      const gx = ((e.clientX - r.left) / r.width  * 100).toFixed(1);
      const gy = ((e.clientY - r.top)  / r.height * 100).toFixed(1);
      if (glare) glare.style.background = `radial-gradient(circle at ${gx}% ${gy}%, rgba(255,255,255,0.15), transparent 58%)`;
    });

    card.addEventListener("mouseleave", () => {
      card.style.transform = `perspective(900px) rotateX(0deg) rotateY(0deg) scale(1) translateZ(0px)`;
      card.style.boxShadow = card.dataset.shadow || "0 0 30px rgba(255,255,255,0.08)";
    });
  });

  /* ── 3D tilt + glare (gpCard — gamepad specific) ── */
  const gpCard  = document.getElementById("gpCard");
  const gpGlare = document.getElementById("gpGlare");

  if (gpCard) {
    gpCard.addEventListener("mousemove", (e) => {
      const r  = gpCard.getBoundingClientRect();
      const nx = (e.clientX - r.left - r.width  / 2) / (r.width  / 2);
      const ny = (e.clientY - r.top  - r.height / 2) / (r.height / 2);

      gpCard.style.transform  = `perspective(900px) rotateX(${-ny * 13}deg) rotateY(${nx * 17}deg) scale(1.04) translateZ(14px)`;
      gpCard.style.boxShadow  = `${nx * 22}px ${ny * 16 + 18}px 55px rgba(199,166,75,0.55), 0 0 60px rgba(199,166,75,0.28)`;

      const gx = ((e.clientX - r.left) / r.width  * 100).toFixed(1);
      const gy = ((e.clientY - r.top)  / r.height * 100).toFixed(1);
      if (gpGlare) gpGlare.style.background = `radial-gradient(circle at ${gx}% ${gy}%, rgba(255,220,100,0.18), transparent 58%)`;
    });

    gpCard.addEventListener("mouseleave", () => {
      gpCard.style.transform = `perspective(900px) rotateX(0deg) rotateY(0deg) scale(1) translateZ(0px)`;
      gpCard.style.boxShadow = "0 0 25px rgba(199,166,75,0.45), 0 0 60px rgba(199,166,75,0.22)";
    });
  }
