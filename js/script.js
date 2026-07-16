// Initialize Lenis Smooth Scroll
let lenis;
if (typeof Lenis !== "undefined") {
  lenis = new Lenis({
    duration: 1.2,
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), // fluid easeOutExponential profile
    direction: "vertical",
    gestureDirection: "vertical",
    smooth: true,
    autoRaf: true,
  });

  // Smooth scroll to anchor links using Lenis scrollTo
  document.addEventListener("click", (e) => {
    const target = e.target.closest('a[href^="#"]');
    if (!target) return;

    const id = target.getAttribute("href");
    if (id === "#") return;

    const el = document.querySelector(id);
    if (el) {
      e.preventDefault();
      lenis.scrollTo(el, {
        duration: 1.2,
        offset: -100, // Matches the sticky header offset
      });
    }
  });
}

// Toggle Visibility Of Navbar When Button Clicked
const navToggle = document.querySelector(".navbar-toggle");
const portfolioNavbar = document.querySelector(".portfolio-navbar");

if (navToggle && portfolioNavbar) {
  navToggle.addEventListener("click", function (event) {
    event.stopPropagation();
    const isOpen = portfolioNavbar.classList.toggle("show");
    navToggle.setAttribute("aria-expanded", String(isOpen));
  });

  portfolioNavbar.addEventListener("click", (event) => {
    const clickedLink = event.target.closest("a.navbar-link");
    if (clickedLink) {
      portfolioNavbar.classList.remove("show");
      navToggle.setAttribute("aria-expanded", "false");
    }
  });

  document.addEventListener("click", (event) => {
    const clickedInsideMenu = portfolioNavbar.contains(event.target);
    const clickedToggle = navToggle.contains(event.target);
    if (!clickedInsideMenu && !clickedToggle) {
      portfolioNavbar.classList.remove("show");
      navToggle.setAttribute("aria-expanded", "false");
    }
  });
}

// Tab Interface For Resume
const resumeHeading = document.querySelector(".resume-heading");
const resumeTabs = document.querySelectorAll(".resume-tab");

if (resumeHeading) {
  resumeHeading.onclick = (event) => {
    event.preventDefault();
    const clickedItemId = event.target.dataset.id;
    if (!clickedItemId) {
      return;
    }

    const currentActive = resumeHeading.querySelector(".active");
    if (currentActive) {
      currentActive.classList.remove("active");
    }
    event.target.classList.add("active");

    resumeTabs.forEach((tab) => {
      tab.classList.remove("active");
    });
    const correspondingTab = document.getElementById(clickedItemId);
    if (correspondingTab) {
      correspondingTab.classList.add("active");
    }
  };
}

// Portfolio and Research Filters
const filterGroups = document.querySelectorAll(
  ".portfolio-filter-nav[data-filter-group]",
);

filterGroups.forEach((filterContainer) => {
  const selector = filterContainer.getAttribute("data-filter-group");
  if (!selector) {
    return;
  }

  const galleryItems = document.querySelectorAll(selector);
  if (!galleryItems.length) {
    return;
  }

  const applyFilter = (filterValue) => {
    galleryItems.forEach((item) => {
      if (item.classList.contains(filterValue) || filterValue === "all") {
        item.classList.remove("hide");
        item.classList.add("show");
      } else {
        item.classList.remove("show");
        item.classList.add("hide");
      }
    });

    if (selector === ".research-card") {
      document
        .querySelectorAll("#research .research-group")
        .forEach((group) => {
          const hasVisibleCard =
            group.querySelectorAll(".research-card:not(.hide)").length > 0;
          group.style.display = hasVisibleCard ? "" : "none";
        });
    }
  };

  const initiallyActiveButton = filterContainer.querySelector(
    "button[data-id].active",
  );
  if (initiallyActiveButton) {
    applyFilter(initiallyActiveButton.getAttribute("data-id") || "all");
  } else {
    applyFilter("all");
  }

  filterContainer.addEventListener("click", (event) => {
    const targetButton = event.target.closest("button[data-id]");
    if (!targetButton) {
      return;
    }

    event.preventDefault();
    const activeButton = filterContainer.querySelector(".active");
    if (activeButton) {
      activeButton.classList.remove("active");
    }

    targetButton.classList.add("active");
    const filterValue = targetButton.getAttribute("data-id");
    applyFilter(filterValue);
  });
});

// Send Email
const msg = document.querySelector(".form-message");
const contactForm = document.getElementById("contact-form");
const formLoader = document.querySelector(".loader");
const EMAILJS_PUBLIC_KEY = "uunnnvA_9NRaqUan0";
const EMAILJS_SERVICE_ID = "service_739uioh";
const EMAILJS_TEMPLATE_ID = "template_xfi56wr";

function buildMailtoLink(recipient, name, email, subject, message) {
  const mailSubject = subject || "Portfolio contact";
  const mailBody = [`Name: ${name}`, `Email: ${email}`, "", message].join("\n");

  return `mailto:${recipient}?subject=${encodeURIComponent(
    mailSubject,
  )}&body=${encodeURIComponent(mailBody)}`;
}

if (typeof emailjs !== "undefined") {
  emailjs.init(EMAILJS_PUBLIC_KEY);
}

if (contactForm && msg && formLoader) {
  contactForm.addEventListener("submit", async function (event) {
    event.preventDefault();

    const formData = new FormData(contactForm);
    const name = String(formData.get("name") || "").trim();
    const email = String(formData.get("email") || "").trim();
    const subject = String(formData.get("subject") || "").trim();
    const message = String(formData.get("message") || "").trim();

    if (!name || !email || !subject || !message) {
      msg.innerHTML =
        "<span class='error-msg'>Please fill all required fields.</span>";
      msg.classList.add("show");
      return;
    }

    formLoader.classList.add("show");

    if (typeof emailjs === "undefined") {
      msg.innerHTML =
        "<span class='error-msg'>Email service is unavailable. Opening your email app instead.</span>";
      msg.classList.add("show");
      window.location.href = buildMailtoLink(
        "pushpanathmr@gmail.com",
        name,
        email,
        subject,
        message,
      );
      formLoader.classList.remove("show");
      return;
    }

    try {
      await emailjs.send(
        EMAILJS_SERVICE_ID,
        EMAILJS_TEMPLATE_ID,
        {
          name,
          from_name: name,
          email,
          from_email: email,
          reply_to: email,
          subject,
          message,
        },
        EMAILJS_PUBLIC_KEY,
      );

      contactForm.reset();
      msg.innerHTML =
        "<span class='success-msg'>Email Sent Successfully</span>";
      msg.classList.add("show");
      setTimeout(() => msg.classList.remove("show"), 2500);
    } catch (error) {
      console.error("EmailJS send error:", error);
      const errorText = String(error?.text || error?.message || "");
      const isScopeError =
        /gmail_api|insufficient authentication scopes|412/i.test(errorText);

      if (isScopeError) {
        msg.innerHTML =
          "<span class='error-msg'>Email service authorization expired. Opening your email app to send the message.</span>";
        msg.classList.add("show");
        window.location.href = buildMailtoLink(
          "pushpanathmr@gmail.com",
          name,
          email,
          subject,
          message,
        );
      } else {
        msg.innerHTML =
          "<span class='error-msg'>Message not sent. Please try again or email me directly at pushpanathmr@gmail.com.</span>";
        msg.classList.add("show");
      }
    } finally {
      formLoader.classList.remove("show");
    }
  });
}

// Navbar Header Sticky While Scroll
function stickyNav() {
  var headerHeight = document.querySelector("#about").offsetHeight / 2;
  var navbar = document.querySelector("header");
  var scrollValue = window.scrollY;

  if (scrollValue > headerHeight) {
    navbar.classList.add("header-sticky");
  } else if (scrollValue < headerHeight) {
    navbar.classList.remove("header-sticky");
  }
}
window.addEventListener("scroll", stickyNav);

// Active Link On Page Scroll
const sections = document.querySelectorAll("section[id]");

function scrollTracker() {
  const currentYScroll = window.scrollY;

  sections.forEach((section) => {
    const sectionHeight = section.offsetHeight;
    const sectionTop = section.offsetTop - 100;
    const id = section.getAttribute("id");
    const currentNavLink = document.querySelector(
      `header .portfolio-navbar a[href*="#${id}"]`,
    );

    if (!currentNavLink) {
      return;
    }

    if (
      currentYScroll > sectionTop &&
      currentYScroll <= sectionTop + sectionHeight
    ) {
      currentNavLink.classList.add("active-link");
    } else {
      currentNavLink.classList.remove("active-link");
    }
  });
}
window.addEventListener("scroll", scrollTracker);

// Dark and Light Theme Toggle
function isLight() {
  return localStorage.getItem("dark-mode");
}
function toggleRootClass() {
  document.querySelector("body").classList.toggle("dark");
}
function toggleLocalStorageItem() {
  if (isLight()) {
    localStorage.removeItem("dark-mode");
  } else {
    localStorage.setItem("dark-mode", "set");
  }
}

const themeToggleButton = document.querySelector(".theme-toggle");

function syncThemeToggleAccessibility() {
  if (!themeToggleButton) {
    return;
  }

  const isDarkMode = document.body.classList.contains("dark");
  themeToggleButton.setAttribute("aria-pressed", String(isDarkMode));
  themeToggleButton.setAttribute(
    "aria-label",
    isDarkMode ? "Switch to light mode" : "Switch to dark mode",
  );
}

if (isLight()) {
  toggleRootClass();
}

syncThemeToggleAccessibility();

if (themeToggleButton) {
  themeToggleButton.addEventListener("click", () => {
    toggleLocalStorageItem();
    toggleRootClass();
    syncThemeToggleAccessibility();
  });
}

// Scroll Reveal
if (typeof ScrollReveal !== "undefined") {
  const sr = ScrollReveal({
    reset: false,
    distance: "28px",
    duration: 850,
    delay: 120,
    viewFactor: 0.06,
    cleanup: true,
  });

  sr.reveal(".about-intro", { origin: "left" });
  sr.reveal(
    ".resume-heading,.resume-text,.skill-card,.portfolio-item,.research-card",
    { origin: "bottom", interval: 90 },
  );
  sr.reveal(".resume-body", { origin: "top" });
}

// Safety net: ensure bottom sections are visible even after rapid scrolls.
const criticalVisibilitySelectors = [
  "#projects .portfolio-wrapper",
  "#research .research-groups",
  "#research .research-card",
  "#achievements .portfolio-wrapper",
  "#achievements .achievements-item",
  "#contact .contact-general",
  "#contact #contact-form",
];

function clearRevealInlineStyles(element) {
  const inlineStyle = element.getAttribute("style");
  if (!inlineStyle || !/(opacity|visibility|transform)/i.test(inlineStyle)) {
    return;
  }

  element.style.removeProperty("opacity");
  element.style.removeProperty("visibility");
  element.style.removeProperty("transform");

  const remainingStyle = element.getAttribute("style");
  if (!remainingStyle || !remainingStyle.trim()) {
    element.removeAttribute("style");
  }
}

function ensureCriticalSectionsVisible() {
  const viewportThreshold = window.innerHeight + 160;

  criticalVisibilitySelectors.forEach((selector) => {
    document.querySelectorAll(selector).forEach((element) => {
      const rect = element.getBoundingClientRect();
      if (rect.top <= viewportThreshold) {
        clearRevealInlineStyles(element);
      }
    });
  });
}

window.addEventListener("scroll", ensureCriticalSectionsVisible, {
  passive: true,
});
window.addEventListener("resize", ensureCriticalSectionsVisible);
window.addEventListener("load", () => {
  requestAnimationFrame(ensureCriticalSectionsVisible);
  setTimeout(ensureCriticalSectionsVisible, 300);
  setTimeout(ensureCriticalSectionsVisible, 1200);
});

ensureCriticalSectionsVisible();

// ðŸŽ‰ Career Popup Click Celebration
const popup = document.querySelector(".career-popup");

if (popup) {
  popup.addEventListener("click", () => {
    popup.style.display = "none";

    // ðŸŽŠ Confetti burst
    const duration = 2000;
    const end = Date.now() + duration;

    (function frame() {
      confetti({
        particleCount: 5,
        angle: 60,
        spread: 55,
        origin: { x: 0 },
      });
      confetti({
        particleCount: 5,
        angle: 120,
        spread: 55,
        origin: { x: 1 },
      });
      if (Date.now() < end) {
        requestAnimationFrame(frame);
      }
    })();

    // ðŸŽ‰ Toast message
    const congrats = document.createElement("div");
    congrats.className = "toast-message"; // Add class for CSS styling

    congrats.innerHTML = `
  <strong>Thank You! ðŸ¤—</strong><br>
  <small>Really appreciate your wishes! ðŸ™Œâœ¨</small>
`;

    document.body.appendChild(congrats);

    // Remove after 4.5s (matches CSS animation)
    setTimeout(() => congrats.remove(), 4500);
  });
}

const downloadBtn = document.getElementById("cvDownloadBtn");
const resumeDownloadUrl =
  "https://drive.google.com/uc?export=download&id=1sZCUg3V8W-aKVUwfBNA3cbFwoPB_nhQB";
let isResumeDownloadTriggered = false;

if (downloadBtn) {
  downloadBtn.setAttribute("href", resumeDownloadUrl);

  downloadBtn.addEventListener("click", function (e) {
    e.preventDefault();

    if (isResumeDownloadTriggered) {
      return;
    }
    isResumeDownloadTriggered = true;

    const existingToast = document.querySelector(".custom-toast");
    if (existingToast) {
      existingToast.remove();
    }

    const toast = document.createElement("div");
    toast.innerHTML = `
      <div class="toast-icon" aria-hidden="true">
        <i class="fas fa-download"></i>
      </div>
      <div class="toast-content">
        <p class="toast-title">Resume Download Started</p>
        <p class="toast-subtitle">Resume download will start now.</p>
        <span class="toast-progress"></span>
      </div>
      <button type="button" class="toast-close" aria-label="Dismiss">
        <i class="fas fa-times"></i>
      </button>
    `;
    toast.className = "custom-toast";
    document.body.appendChild(toast);

    const closeToast = () => {
      toast.classList.add("hide-toast");
      setTimeout(() => toast.remove(), 360);
    };

    const closeButton = toast.querySelector(".toast-close");
    if (closeButton) {
      closeButton.addEventListener("click", closeToast);
    }

    // Remove after a short display window
    setTimeout(() => {
      if (document.body.contains(toast)) {
        closeToast();
      }
    }, 3200);

    // Single download path to avoid duplicate parallel downloads.
    window.location.assign(resumeDownloadUrl);

    // Safety reset in case navigation is blocked by the browser.
    setTimeout(() => {
      isResumeDownloadTriggered = false;
    }, 3000);
  });
}

const cursorCanvas = document.getElementById("tech-cursor-canvas");
const supportsFinePointer = window.matchMedia(
  "(hover: hover) and (pointer: fine)",
).matches;
const prefersReducedMotion = window.matchMedia(
  "(prefers-reduced-motion: reduce)",
).matches;
const enableCursorEffects = supportsFinePointer && !prefersReducedMotion;

if (enableCursorEffects && cursorCanvas) {
  document.body.classList.add("cursor-effects-enabled");

  let lastDotAt = 0;
  document.addEventListener("mousemove", function (event) {
    const now = performance.now();
    if (now - lastDotAt < 28) {
      return;
    }
    lastDotAt = now;

    const dot = document.createElement("div");
    dot.className = "magic-dot";

    const skewX = (Math.random() - 0.5) * 20;
    const skewY = (Math.random() - 0.5) * 20;

    dot.style.left = `${event.clientX}px`;
    dot.style.top = `${event.clientY}px`;
    dot.style.transform = `translate(-50%, -50%) rotateX(${skewY}deg) rotateY(${skewX}deg) scale(1)`;

    document.body.appendChild(dot);

    setTimeout(() => {
      dot.remove();
    }, 800);
  });

  const ctx = cursorCanvas.getContext("2d");

  if (ctx) {
    let width = (cursorCanvas.width = window.innerWidth);
    let height = (cursorCanvas.height = window.innerHeight);

    window.addEventListener("resize", () => {
      width = cursorCanvas.width = window.innerWidth;
      height = cursorCanvas.height = window.innerHeight;
    });

    let particles = [];

    const techColors = [
      "rgba(0,255,255,0.9)",
      "rgba(0,255,150,0.9)",
      "rgba(0,150,255,0.9)",
      "rgba(255,255,255,0.9)",
    ];

    class Particle {
      constructor(x, y) {
        this.x = x;
        this.y = y;
        this.size = Math.random() * 2 + 1.5;
        this.velocityX = (Math.random() - 0.5) * 3;
        this.velocityY = (Math.random() - 0.5) * 3;
        this.life = 1;
        this.color = techColors[Math.floor(Math.random() * techColors.length)];
      }

      update() {
        this.x += this.velocityX;
        this.y += this.velocityY;
        this.life -= 0.03;
      }

      draw() {
        if (this.life <= 0) return;
        ctx.globalAlpha = this.life;
        ctx.shadowColor = this.color;
        ctx.shadowBlur = 10;
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
        ctx.globalAlpha = 1;
      }
    }

    function addParticles(x, y) {
      for (let i = 0; i < 4; i++) {
        particles.push(new Particle(x, y));
      }
    }

    function animate() {
      ctx.clearRect(0, 0, width, height);
      particles = particles.filter((particle) => particle.life > 0);
      particles.forEach((particle) => {
        particle.update();
        particle.draw();
      });
      requestAnimationFrame(animate);
    }

    let lastParticleAt = 0;
    document.addEventListener("mousemove", (event) => {
      const now = performance.now();
      if (now - lastParticleAt < 20) {
        return;
      }
      lastParticleAt = now;
      addParticles(event.clientX, event.clientY);
    });

    animate();
  }
} else if (cursorCanvas) {
  cursorCanvas.style.display = "none";
}
