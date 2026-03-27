  document.addEventListener("DOMContentLoaded", function () {
    const plugrevSliderTrack = document.getElementById("plugrev-slider-track");
    const plugrevDots = document.querySelectorAll(".plugrev-dot");

    if (!plugrevSliderTrack || !plugrevDots.length) return;

    let plugrevCurrentIndex = 0;
    let plugrevInterval = null;
    const plugrevTotalSlides = plugrevDots.length;

    function plugrevUpdateSlide(index) {
      plugrevSliderTrack.style.transform = `translateX(-${index * 100}%)`;

      plugrevDots.forEach((dot, i) => {
        if (i === index) {
          dot.classList.remove("bg-white/30");
          dot.classList.add("bg-[#c7a64b]");
        } else {
          dot.classList.remove("bg-[#c7a64b]");
          dot.classList.add("bg-white/30");
        }
      });

      plugrevCurrentIndex = index;
    }

    function plugrevStartAutoSlide() {
      plugrevInterval = setInterval(() => {
        const nextIndex = (plugrevCurrentIndex + 1) % plugrevTotalSlides;
        plugrevUpdateSlide(nextIndex);
      }, 4000);
    }

    function plugrevResetAutoSlide() {
      clearInterval(plugrevInterval);
      plugrevStartAutoSlide();
    }

    plugrevDots.forEach((dot) => {
      dot.addEventListener("click", function () {
        const slideIndex = Number(this.getAttribute("data-plugrev-slide"));
        plugrevUpdateSlide(slideIndex);
        plugrevResetAutoSlide();
      });
    });

    plugrevUpdateSlide(0);
    plugrevStartAutoSlide();
  });
