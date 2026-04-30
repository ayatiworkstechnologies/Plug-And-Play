
      const bookingModal = document.getElementById("bookingModal");
      const closeBookingModal = document.getElementById("closeBookingModal");
      const bookingModalOverlay = document.getElementById(
        "bookingModalOverlay",
      );

      function showBookingToast(message, type = "success") {
        const toast = document.getElementById("bookingToast");
        const title = document.getElementById("bookingToastTitle");
        const text = document.getElementById("bookingToastMessage");
        const icon = toast.querySelector(".bookingToastIcon");

        toast.classList.remove("success", "error", "warning", "show");
        toast.classList.add(type);

        title.innerText =
          type === "error"
            ? "Error"
            : type === "warning"
              ? "Warning"
              : "Success";

        icon.innerText = type === "success" ? "✓" : "!";
        text.innerText = message;

        setTimeout(() => toast.classList.add("show"), 50);

        clearTimeout(window.bookingToastTimer);
        window.bookingToastTimer = setTimeout(() => {
          toast.classList.remove("show");
        }, 3500);
      }

      function openBookingModal() {
        if (!bookingModal) return;
        bookingModal.classList.remove("hidden");
        bookingModal.classList.add("flex");
        document.body.classList.add("modal-open");
      }

      function closeModal() {
        if (!bookingModal) return;
        bookingModal.classList.add("hidden");
        bookingModal.classList.remove("flex");
        document.body.classList.remove("modal-open");
      }

      if (closeBookingModal) {
        closeBookingModal.addEventListener("click", closeModal);
      }

      if (bookingModalOverlay) {
        bookingModalOverlay.addEventListener("click", closeModal);
      }

      document.addEventListener("keydown", function (e) {
        if (e.key === "Escape") closeModal();
      });

      document.addEventListener("submit", async function (e) {
        const form = e.target;
        if (!form.classList.contains("bookingForm")) return;

        e.preventDefault();

        const playersInput = form.querySelector(".playersCount");
        const checkedGames = form.querySelectorAll(
          'input[name="games[]"]:checked',
        );
        const startTime = Number(form.querySelector(".startTime").value);
        const endTime = Number(form.querySelector(".endTime").value);
        const submitBtn = form.querySelector(".bookingSubmitBtn");
        const playersCount = Number(playersInput.value);

        if (checkedGames.length === 0) {
          showBookingToast("Please select at least one game.", "error");
          return;
        }

        if (playersCount < 1) {
          showBookingToast("Please enter at least 1 player.", "error");
          playersInput.focus();
          return;
        }

        if (playersCount > 15) {
          showBookingToast("Maximum 15 players only allowed.", "error");
          playersInput.focus();
          return;
        }

        if (!startTime || !endTime) {
          showBookingToast("Please select start time and end time.", "error");
          return;
        }

        if (endTime <= startTime) {
          showBookingToast("End time must be after start time.", "error");
          return;
        }

        if (endTime - startTime < 1) {
          showBookingToast("Minimum booking slot is 1 hour.", "error");
          return;
        }

        submitBtn.disabled = true;
        submitBtn.innerText = "Submitting...";

        try {
          const formData = new FormData(form);

          const res = await fetch("booking-form.php", {
            method: "POST",
            body: formData,
          });

          const data = await res.json();

          const toastType =
            data.status === "error"
              ? "error"
              : data.status === "warning"
                ? "warning"
                : "success";

          showBookingToast(
            data.message || "Booking submitted successfully.",
            toastType,
          );

          if (data.status === "success") {
            form.reset();

            setTimeout(() => {
              if (data.redirect) {
                window.location.href = data.redirect;
              } else {
                closeModal();
              }
            }, 1200);
          }
        } catch (error) {
          showBookingToast("Something went wrong. Please try again.", "error");
        } finally {
          submitBtn.disabled = false;
          submitBtn.innerText = "Book Now";
        }
      });
