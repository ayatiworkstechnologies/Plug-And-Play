document.addEventListener("DOMContentLoaded", function () {
  const ppGameItems = document.querySelectorAll(".ppGameItem");
  const ppGameVideo = document.getElementById("ppGameVideo");
  const ppGameVideoSource = document.getElementById("ppGameVideoSource");

  if (!ppGameItems.length) return;

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
    if (!item) return;

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
    }, 220);
  }

  function activateItem(item) {
    if (!item) return;

    closeAllItems();
    openItem(item);

    const videoPath = item.getAttribute("data-video");
    const posterPath = item.getAttribute("data-poster");
    playDesktopVideo(videoPath, posterPath);
  }

  ppGameItems.forEach((item) => {
    item.addEventListener("click", function () {
      if (this.classList.contains("ppGameActive")) return;
      activateItem(this);
    });
  });

  const firstActiveItem =
    document.querySelector(".ppGameItem.ppGameActive") || ppGameItems[0];

  activateItem(firstActiveItem);

  let resizeTimeout;
  window.addEventListener("resize", function () {
    clearTimeout(resizeTimeout);

    resizeTimeout = setTimeout(() => {
      const activeItem =
        document.querySelector(".ppGameItem.ppGameActive") || ppGameItems[0];

      if (activeItem && window.innerWidth >= 1024) {
        const activeVideo = activeItem.getAttribute("data-video");
        const activePoster = activeItem.getAttribute("data-poster");
        playDesktopVideo(activeVideo, activePoster);
      }
    }, 180);
  });
});