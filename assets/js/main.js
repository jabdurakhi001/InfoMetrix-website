// -------------------------
// Mobile menu toggle
// -------------------------
const mobileToggle = document.getElementById("mobileToggle");
const mobileMenu = document.getElementById("mobileMenu");

function closeMenu() {
  if (!mobileMenu || !mobileToggle) return;
  mobileMenu.classList.add("hidden");
  mobileToggle.setAttribute("aria-expanded", "false");
  const icon = mobileToggle.querySelector(".material-symbols-outlined");
  if (icon) icon.textContent = "menu";
}

function openMenu() {
  if (!mobileMenu || !mobileToggle) return;
  mobileMenu.classList.remove("hidden");
  mobileToggle.setAttribute("aria-expanded", "true");
  const icon = mobileToggle.querySelector(".material-symbols-outlined");
  if (icon) icon.textContent = "close";
}

if (mobileToggle && mobileMenu) {
  mobileToggle.addEventListener("click", () => {
    const isOpen = !mobileMenu.classList.contains("hidden");
    if (isOpen) closeMenu();
    else openMenu();
  });

  // Close when clicking a menu link
  mobileMenu.addEventListener("click", (e) => {
    const target = e.target.closest("a");
    if (target) closeMenu();
  });

  // Close on ESC
  window.addEventListener("keydown", (e) => {
    if (e.key === "Escape") closeMenu();
  });

  // Close menu when resizing to desktop
  window.addEventListener("resize", () => {
    if (window.innerWidth >= 1024) closeMenu();
  });
}

// -------------------------
// Formspree AJAX submit (contact page)
// -------------------------
const contactForm = document.getElementById("contactForm");
const formStatus = document.getElementById("formStatus");

if (contactForm && formStatus) {
  contactForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    formStatus.textContent = "Sending...";

    const formData = new FormData(contactForm);

    try {
      const response = await fetch(contactForm.action, {
        method: "POST",
        body: formData,
        headers: { Accept: "application/json" },
      });

      if (response.ok) {
        formStatus.textContent = "Thanks — message sent. We'll be in touch shortly.";
        formStatus.className = "text-sm text-green-600 text-center mt-3";
        contactForm.reset();
      } else {
        formStatus.textContent = "Something went wrong. Please try again or book a call.";
        formStatus.className = "text-sm text-red-500 text-center mt-3";
      }
    } catch {
      formStatus.textContent = "Network error. Please try again later.";
      formStatus.className = "text-sm text-red-500 text-center mt-3";
    }
  });
}

// -------------------------
// Smooth scroll for anchor links
// -------------------------
document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
  anchor.addEventListener("click", function (e) {
    const targetId = this.getAttribute("href");
    if (targetId === "#") return;
    const target = document.querySelector(targetId);
    if (target) {
      e.preventDefault();
      target.scrollIntoView({ behavior: "smooth" });
      closeMenu();
    }
  });
});
