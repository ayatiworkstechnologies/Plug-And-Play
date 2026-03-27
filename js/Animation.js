document.addEventListener("DOMContentLoaded", () => {
  /* ===============================
     BANNER FADE OUT
  =============================== */
  const banner = document.getElementById("bannerSection");
  const logo = document.getElementById("bannerLogo");

  if (banner && logo) {
    const bannerObserver = new IntersectionObserver(
      (entries, obs) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setTimeout(() => {
              logo.style.opacity = "0";
            }, 300);

            obs.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0.3,
      }
    );

    bannerObserver.observe(banner);
  }

  /* ===============================
     TYPEWRITER TEXT
  =============================== */
  const fullText =
    "Nurturing young minds with academic excellence, strong values, and future-ready skills.";
  const el = document.getElementById("typeText");
  const cursor = document.getElementById("typeCursor");
  const heading = document.getElementById("typeHeading");
  const progress = document.getElementById("typeProgress");

  function fitDesktop() {
    if (!heading) return;

    if (window.innerWidth < 1024) {
      heading.style.fontSize = "";
      if (cursor) cursor.style.height = "0.85em";
      return;
    }

    const availW = window.innerWidth - 96;
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");

    let lo = 16,
      hi = 52,
      best = 28;

    while (lo <= hi) {
      const mid = Math.floor((lo + hi) / 2);
      ctx.font = `700 ${mid}px 'Playfair Display', serif`;

      const w = ctx.measureText(fullText).width;

      if (w <= availW) {
        best = mid;
        lo = mid + 1;
      } else {
        hi = mid - 1;
      }
    }

    heading.style.fontSize = best + "px";
    if (cursor) cursor.style.height = best * 0.8 + "px";
  }

  /* ===============================
     LABEL DOT PULSE
  =============================== */
  const dot = document.getElementById("labelDot");

  if (dot) {
    setInterval(() => {
      dot.style.transition = "opacity 0.9s ease, transform 0.9s ease";

      const on = dot.style.opacity !== "0.3";

      dot.style.opacity = on ? "0.3" : "1";
      dot.style.transform = on ? "scale(0.6)" : "scale(1)";
    }, 1400);
  }

  /* ===============================
     CURSOR BLINK
  =============================== */
  let blinkInterval = null;

  function startBlink() {
    if (!cursor) return;

    cursor.style.opacity = "1";

    clearInterval(blinkInterval);
    blinkInterval = setInterval(() => {
      cursor.style.transition = "opacity 0.3s ease";
      cursor.style.opacity = cursor.style.opacity === "0" ? "1" : "0";
    }, 700);
  }

  function stopBlink() {
    clearInterval(blinkInterval);
    if (cursor) cursor.style.opacity = "1";
  }

  /* ===============================
     TYPE EFFECT
  =============================== */
  let index = 0;
  let deleting = false;
  let pauseTick = 0;
  const PAUSE = 20;

  function typeEffect() {
    if (!el) return;

    el.textContent = fullText.slice(0, index);

    if (progress) {
      progress.style.width = (index / fullText.length) * 100 + "%";
    }

    if (!deleting) {
      if (index < fullText.length) {
        stopBlink();
        index++;

        const speed = 110 + Math.random() * 60;
        setTimeout(typeEffect, speed);
      } else {
        startBlink();

        if (++pauseTick >= PAUSE) {
          deleting = true;
          pauseTick = 0;
          setTimeout(typeEffect, 120);
        } else {
          setTimeout(typeEffect, 180);
        }
      }
    } else {
      if (index > 0) {
        stopBlink();
        index--;

        setTimeout(typeEffect, 55);
      } else {
        startBlink();
        deleting = false;

        setTimeout(typeEffect, 1200);
      }
    }
  }

  if (document.fonts && document.fonts.ready) {
    document.fonts.ready.then(() => {
      fitDesktop();
      typeEffect();
    });
  } else {
    fitDesktop();
    typeEffect();
  }

  window.addEventListener("resize", fitDesktop);

  /* ===============================
     LETTER TITLE BUILD
  =============================== */
  const title = document.querySelector(".phil-title");

  if (title) {
    title.innerHTML = "";
    const text = "Our Core Philosophy";

    text.split("").forEach((letter) => {
      if (letter === " ") {
        title.innerHTML += `<span class="space"></span>`;
      } else {
        title.innerHTML += `<span class="char">${letter}</span>`;
      }
    });
  }

  function revealTitle() {
    if (!title) return;

    title.querySelectorAll(".char").forEach((char, i) => {
      char.style.transitionDelay = `${i * 40}ms`;
    });

    title.classList.add("in-view");
  }

  /* ===============================
     GLOBAL SCROLL ANIMATION
  =============================== */
  const elements = document.querySelectorAll(
    ".fade-up, .fade-down, .fade-left, .fade-right, .fade-in, .animate-down, .animate-up"
  );

  const scrollObserver = new IntersectionObserver(
    (entries, obs) => {
      entries.forEach((entry) => {
        const target = entry.target;

        if (entry.isIntersecting) {
          target.classList.add("show");
          obs.unobserve(target);
        }
      });
    },
    {
      threshold: 0,
      rootMargin: "0px 0px -20% 0px",
    }
  );

  elements.forEach((item) => scrollObserver.observe(item));

  /* ===============================
     REUSABLE OBSERVER
  =============================== */
  const once = (element, fn, threshold = 0.2) => {
    if (!element) return;

    const io = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          fn();
          io.disconnect();
        }
      },
      { threshold }
    );

    io.observe(element);
  };

  /* ===============================
     TITLE REVEAL
  =============================== */
  once(title, revealTitle, 0.1);

  /* ===============================
     IMAGE REVEAL
  =============================== */
  const img = document.querySelector(".phil-img-wrap");

  once(img, () => {
    img.classList.add("in-view");
  });

  /* ===============================
     HEADING + LIST + BUTTON
  =============================== */
  const philHeading = document.querySelector(".phil-heading");

  once(philHeading, () => {
    philHeading.classList.add("in-view");

    document.querySelectorAll(".phil-list li").forEach((li, i) => {
      setTimeout(() => {
        li.classList.add("in-view");
      }, 300 + i * 100);
    });

    const btn = document.querySelector(".phil-btn");

    setTimeout(() => {
      if (btn) btn.classList.add("in-view");
    }, 1000);
  });
});