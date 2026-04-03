document.addEventListener("DOMContentLoaded", function () {
  const form = document.getElementById("contactForm");
  if (!form) return;

  const submitBtn = form.querySelector('button[type="submit"]');
  const originalText = submitBtn ? submitBtn.textContent : "Send Message";

  const toast = document.getElementById("formToast");
  const toastBox = document.getElementById("formToastBox");
  const toastTitle = document.getElementById("formToastTitle");
  const toastText = document.getElementById("formToastText");

  let toastTimer;

  function showToast(type, message) {
    if (!toast || !toastBox || !toastTitle || !toastText) return;

    clearTimeout(toastTimer);

    toastTitle.textContent =
      type === "success" ? "Success" :
      type === "warning" ? "Warning" : "Error";

    toastText.textContent = message;

    toastBox.className =
      "min-w-[280px] rounded-[14px] border px-5 py-4 shadow-[0_18px_50px_rgba(0,0,0,0.35)] " +
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

    const name = form.querySelector('[name="name"]').value.trim();
    const email = form.querySelector('[name="email"]').value.trim();
    const mobile = form.querySelector('[name="mobile"]').value.trim();
    const subject = form.querySelector('[name="subject"]').value.trim();
    const message = form.querySelector('[name="message"]').value.trim();

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
      } else if (data.status === "warning") {
        showToast("warning", data.message || "Saved, but email failed.");
        form.reset();
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
