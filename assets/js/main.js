// -------------------------
// Mobile menu toggle + scroll-lock
// -------------------------
const mobileToggle = document.getElementById("mobileToggle");
const mobileMenu = document.getElementById("mobileMenu");

function closeMenu() {
  if (!mobileMenu || !mobileToggle) return;
  mobileMenu.classList.remove("open");
  mobileToggle.setAttribute("aria-expanded", "false");
  document.body.classList.remove("no-scroll");
}

function openMenu() {
  if (!mobileMenu || !mobileToggle) return;
  mobileMenu.classList.add("open");
  mobileToggle.setAttribute("aria-expanded", "true");
  document.body.classList.add("no-scroll");
}

if (mobileToggle && mobileMenu) {
  mobileToggle.addEventListener("click", () => {
    const isOpen = mobileMenu.classList.contains("open");
    if (isOpen) closeMenu();
    else openMenu();
  });

  // Close when clicking a menu link
  mobileMenu.addEventListener("click", (e) => {
    const target = e.target;
    if (target && target.tagName === "A") closeMenu();
  });

  // Close on ESC
  window.addEventListener("keydown", (e) => {
    if (e.key === "Escape") closeMenu();
  });

  // Safety: close menu when resizing to desktop
  window.addEventListener("resize", () => {
    if (window.innerWidth > 900) closeMenu();
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
        contactForm.reset();
      } else {
        formStatus.textContent = "Something went wrong. Please try again or book a call.";
      }
    } catch {
      formStatus.textContent = "Network error. Please try again later.";
    }
  });
}

// -------------------------
// Scroll-triggered fade-in animations
// -------------------------
const fadeElements = document.querySelectorAll(".fade-in");

if (fadeElements.length > 0 && "IntersectionObserver" in window) {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.1, rootMargin: "0px 0px -40px 0px" }
  );

  fadeElements.forEach((el) => observer.observe(el));
}

// -------------------------
// Navbar background on scroll
// -------------------------
const nav = document.querySelector(".nav");

if (nav) {
  const updateNav = () => {
    if (window.scrollY > 10) {
      nav.style.boxShadow = "0 1px 12px rgba(15,23,42,.08)";
    } else {
      nav.style.boxShadow = "none";
    }
  };

  window.addEventListener("scroll", updateNav, { passive: true });
  updateNav();
}
