  document.addEventListener("DOMContentLoaded", function () {
    const track = document.getElementById("ipp3dTrack");
    const cards = Array.from(track.querySelectorAll(".ipp3dCard"));
    const dotsWrap = document.getElementById("ipp3dDots");

    let current = 0;
    const total = cards.length;
    let autoSlide;

    cards.forEach((_, i) => {
      const dot = document.createElement("button");
      dot.className = "ipp3dDot";
      dot.setAttribute("aria-label", `Go to slide ${i + 1}`);
      dot.addEventListener("click", () => {
        current = i;
        update3dCarousel();
        restartAutoSlide();
      });
      dotsWrap.appendChild(dot);
    });

    const dots = Array.from(dotsWrap.querySelectorAll(".ipp3dDot"));

    function getOffset(index) {
      let offset = index - current;
      if (offset > total / 2) offset -= total;
      if (offset < -total / 2) offset += total;
      return offset;
    }

    function update3dCarousel() {
      cards.forEach((card, index) => {
        const offset = getOffset(index);

        card.classList.remove("ipp3dActive");

        if (offset === 0) {
          card.style.transform =
            "translate(-50%, -50%) translateX(0) translateZ(0) rotateY(0deg) scale(1)";
          card.style.opacity = "1";
          card.style.zIndex = "5";
          card.classList.add("ipp3dActive");
        } else if (offset === -1) {
          card.style.transform =
            "translate(-50%, -50%) translateX(-72%) translateZ(-120px) rotateY(28deg) scale(0.88)";
          card.style.opacity = "0.7";
          card.style.zIndex = "4";
        } else if (offset === 1) {
          card.style.transform =
            "translate(-50%, -50%) translateX(72%) translateZ(-120px) rotateY(-28deg) scale(0.88)";
          card.style.opacity = "0.7";
          card.style.zIndex = "4";
        } else if (offset === -2) {
          card.style.transform =
            "translate(-50%, -50%) translateX(-130%) translateZ(-260px) rotateY(38deg) scale(0.72)";
          card.style.opacity = "0.25";
          card.style.zIndex = "2";
        } else if (offset === 2) {
          card.style.transform =
            "translate(-50%, -50%) translateX(130%) translateZ(-260px) rotateY(-38deg) scale(0.72)";
          card.style.opacity = "0.25";
          card.style.zIndex = "2";
        } else {
          card.style.transform =
            "translate(-50%, -50%) translateX(0) translateZ(-400px) scale(0.6)";
          card.style.opacity = "0";
          card.style.zIndex = "1";
        }
      });

      dots.forEach((dot, i) => {
        dot.classList.toggle("active", i === current);
      });
    }

    function startAutoSlide() {
      autoSlide = setInterval(() => {
        current = (current + 1) % total;
        update3dCarousel();
      }, 3000);
    }

    function restartAutoSlide() {
      clearInterval(autoSlide);
      startAutoSlide();
    }

    let startX = 0;
    let endX = 0;

    track.addEventListener("touchstart", function (e) {
      startX = e.touches[0].clientX;
    }, { passive: true });

    track.addEventListener("touchend", function (e) {
      endX = e.changedTouches[0].clientX;
      const diff = startX - endX;

      if (diff > 50) {
        current = (current + 1) % total;
        update3dCarousel();
        restartAutoSlide();
      } else if (diff < -50) {
        current = (current - 1 + total) % total;
        update3dCarousel();
        restartAutoSlide();
      }
    }, { passive: true });

    track.addEventListener("mouseenter", function () {
      clearInterval(autoSlide);
    });

    track.addEventListener("mouseleave", function () {
      startAutoSlide();
    });

    update3dCarousel();
    startAutoSlide();
  });
