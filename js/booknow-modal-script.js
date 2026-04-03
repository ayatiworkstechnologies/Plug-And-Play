document.addEventListener("DOMContentLoaded", function () {
  /* =========================
     MODAL OPEN / CLOSE
  ========================= */
  const openButtons = document.querySelectorAll(".openBookingModal");
  const modal = document.getElementById("bookingModal");
  const closeBtn = document.getElementById("closeBookingModal");
  const overlay = document.getElementById("bookingModalOverlay");

  function openModal() {
    if (!modal) return;
    modal.classList.remove("hidden");
    modal.classList.add("flex");
    document.body.classList.add("overflow-hidden");
  }

  function closeModal() {
    if (!modal) return;
    modal.classList.add("hidden");
    modal.classList.remove("flex");
    document.body.classList.remove("overflow-hidden");
  }

  if (openButtons.length && modal) {
    openButtons.forEach((button) => {
      button.addEventListener("click", function (e) {
        e.preventDefault();
        openModal();
      });
    });

    if (closeBtn) {
      closeBtn.addEventListener("click", closeModal);
    }

    if (overlay) {
      overlay.addEventListener("click", closeModal);
    }

    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && !modal.classList.contains("hidden")) {
        closeModal();
      }
    });
  }

  /* =========================
     MULTIPLE FORM AJAX SUBMIT
  ========================= */
  const forms = document.querySelectorAll(".ajaxContactForm");
  if (!forms.length) return;

  forms.forEach((form) => {
    const wrap = form.closest(".ajaxFormWrap");
    if (!wrap) return;

    const submitBtn = form.querySelector('button[type="submit"]');
    const originalText = submitBtn ? submitBtn.textContent : "Send Message";

    const toast = wrap.querySelector(".formToast");
    const toastBox = wrap.querySelector(".formToastBox");
    const toastTitle = wrap.querySelector(".formToastTitle");
    const toastText = wrap.querySelector(".formToastText");

    let toastTimer;

    function showToast(type, message) {
      if (!toast || !toastBox || !toastTitle || !toastText) return;

      clearTimeout(toastTimer);

      toastTitle.textContent =
        type === "success"
          ? "Success"
          : type === "warning"
          ? "Warning"
          : "Error";

      toastText.textContent = message;

      toastBox.className =
        "formToastBox min-w-[280px] rounded-[14px] border px-5 py-4 shadow-[0_18px_50px_rgba(0,0,0,0.35)] " +
        (
          type === "success"
            ? "border-emerald-400/30 bg-[#08140f]"
            : type === "warning"
            ? "border-amber-400/30 bg-[#161108]"
            : "border-red-400/30 bg-[#180b0b]"
        );

      toast.classList.remove("pointer-events-none", "translate-y-[-20px]", "opacity-0");
      toast.classList.add("translate-y-0", "opacity-100");

      toastTimer = setTimeout(() => {
        toast.classList.add("pointer-events-none", "translate-y-[-20px]", "opacity-0");
        toast.classList.remove("translate-y-0", "opacity-100");
      }, 3500);
    }

    form.addEventListener("submit", async function (e) {
      e.preventDefault();

      const nameInput = form.querySelector('[name="name"]');
      const emailInput = form.querySelector('[name="email"]');
      const mobileInput = form.querySelector('[name="mobile"]');
      const subjectInput = form.querySelector('[name="subject"]');
      const messageInput = form.querySelector('[name="message"]');

      const name = nameInput ? nameInput.value.trim() : "";
      const email = emailInput ? emailInput.value.trim() : "";
      const mobile = mobileInput ? mobileInput.value.trim() : "";
      const subject = subjectInput ? subjectInput.value.trim() : "";
      const message = messageInput ? messageInput.value.trim() : "";

      if (!name || !email || !mobile || !subject || !message) {
        showToast("error", "Please fill in all fields.");
        return;
      }

      if (!/^\S+@\S+\.\S+$/.test(email)) {
        showToast("error", "Please enter a valid email address.");
        return;
      }

      if (!/^\d{10}$/.test(mobile)) {
        showToast("error", "Phone number must be 10 digits.");
        return;
      }

      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.textContent = "Sending...";
      }

      try {
        const formData = new FormData(form);

        const response = await fetch("contact-form.php", {
          method: "POST",
          body: formData
        });

        const raw = await response.text();
        let data;

        try {
          data = JSON.parse(raw);
        } catch (err) {
          console.error("Invalid JSON response:", raw);
          showToast("error", "Server returned an invalid response.");
          return;
        }

        if (data.status === "success") {
          showToast("success", data.message || "Message sent successfully.");
          form.reset();

          if (modal && modal.contains(form)) {
            setTimeout(() => {
              closeModal();
            }, 1200);
          }
        } else if (data.status === "warning") {
          showToast("warning", data.message || "Saved, but email failed.");
          form.reset();

          if (modal && modal.contains(form)) {
            setTimeout(() => {
              closeModal();
            }, 1200);
          }
        } else {
          showToast("error", data.message || "Something went wrong.");
        }
      } catch (error) {
        console.error("Form submit error:", error);
        showToast("error", "Unable to submit the form right now. Please try again.");
      } finally {
        if (submitBtn) {
          submitBtn.disabled = false;
          submitBtn.textContent = originalText;
        }
      }
    });
  });
});
