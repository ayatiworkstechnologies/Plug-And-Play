
      const cards = document.querySelectorAll(".vibe-card");
      const nextBtn = document.getElementById("nextBtn");
      const prevBtn = document.getElementById("prevBtn");

      let activeIndex = 0;

      function updateCards(index) {
        activeIndex = index;

        cards.forEach((card, i) => {
          card.classList.remove("active");

          if (window.innerWidth < 640) {
            // mobile
            if (i === activeIndex) {
              card.className =
                "vibe-card active relative min-w-0 cursor-pointer overflow-hidden rounded-[22px] basis-[70%]";
            } else {
              card.className =
                "vibe-card relative min-w-0 cursor-pointer overflow-hidden rounded-[22px] basis-[15%]";
            }
          } else if (window.innerWidth < 1024) {
            // tablet
            if (i === activeIndex) {
              card.className =
                "vibe-card active relative min-w-0 cursor-pointer overflow-hidden rounded-[22px] basis-[58%]";
            } else {
              card.className =
                "vibe-card relative min-w-0 cursor-pointer overflow-hidden rounded-[22px] basis-[21%]";
            }
          } else {
            // desktop
            if (i === activeIndex) {
              card.className =
                "vibe-card active relative min-w-0 cursor-pointer overflow-hidden rounded-[22px] basis-[56%]";
            } else {
              card.className =
                "vibe-card relative min-w-0 cursor-pointer overflow-hidden rounded-[22px] basis-[22%]";
            }
          }
        });
      }

      cards.forEach((card, index) => {
        card.addEventListener("click", () => {
          updateCards(index);
        });
      });

      nextBtn.addEventListener("click", () => {
        const nextIndex = (activeIndex + 1) % cards.length;
        updateCards(nextIndex);
      });

      prevBtn.addEventListener("click", () => {
        const prevIndex = (activeIndex - 1 + cards.length) % cards.length;
        updateCards(prevIndex);
      });

      window.addEventListener("resize", () => {
        updateCards(activeIndex);
      });

      updateCards(activeIndex);
  