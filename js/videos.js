  document.addEventListener("DOMContentLoaded", function () {
    const ppGameItems = document.querySelectorAll(".ppGameItem");
    const ppGameVideo = document.getElementById("ppGameVideo");
    const ppGameVideoSource = document.getElementById("ppGameVideoSource");

    function closeAllItems() {
      ppGameItems.forEach((item) => {
        item.classList.remove("ppGameActive");

        const content = item.querySelector(".ppGameContent");
        const symbol = item.querySelector(".ppGameSymbol");

        if (content) {
          content.style.maxHeight = "0px";
          content.style.opacity = "0";
        }

        if (symbol) {
          symbol.textContent = "+";
          symbol.classList.remove("text-[#c7a64b]");
          symbol.classList.add("text-white/60");
        }
      });
    }

    function openItem(item) {
      item.classList.add("ppGameActive");

      const content = item.querySelector(".ppGameContent");
      const symbol = item.querySelector(".ppGameSymbol");

      if (content) {
        content.style.maxHeight = content.scrollHeight + "px";
        content.style.opacity = "1";
      }

      if (symbol) {
        symbol.textContent = "−";
        symbol.classList.remove("text-white/60");
        symbol.classList.add("text-[#c7a64b]");
      }
    }

    function playDesktopVideo(videoPath, posterPath) {
      if (!ppGameVideo || !ppGameVideoSource || window.innerWidth < 1024) return;
      if (!videoPath) return;

      ppGameVideo.classList.add("opacity-0");

      setTimeout(() => {
        ppGameVideo.pause();
        ppGameVideoSource.src = videoPath;
        ppGameVideo.setAttribute("poster", posterPath || "");
        ppGameVideo.load();

        const playPromise = ppGameVideo.play();
        if (playPromise !== undefined) {
          playPromise.catch(() => {
            ppGameVideo.muted = true;
            ppGameVideo.play().catch(() => {});
          });
        }

        ppGameVideo.classList.remove("opacity-0");
      }, 180);
    }

    ppGameItems.forEach((item) => {
      item.addEventListener("click", function () {
        if (this.classList.contains("ppGameActive")) return;

        closeAllItems();
        openItem(this);

        const videoPath = this.getAttribute("data-video");
        const posterPath = this.getAttribute("data-poster");
        playDesktopVideo(videoPath, posterPath);
      });
    });

    const firstActiveItem = document.querySelector(".ppGameActive") || ppGameItems[0];

    if (firstActiveItem) {
      closeAllItems();
      openItem(firstActiveItem);

      const firstVideo = firstActiveItem.getAttribute("data-video");
      const firstPoster = firstActiveItem.getAttribute("data-poster");
      playDesktopVideo(firstVideo, firstPoster);
    }
  });
