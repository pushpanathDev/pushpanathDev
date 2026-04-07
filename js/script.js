// Toggle Visibility Of Navbar When Button Clicked
const navToggle = document.querySelector(".navbar-toggle");
navToggle.addEventListener("click", function () {
  document.querySelector(".portfolio-navbar").classList.toggle("show");
});

// Tab Interface For Resume
const resumeHeading = document.querySelector(".resume-heading");
const resumeTabs = document.querySelectorAll(".resume-tab");

resumeHeading.onclick = (event) => {
  event.preventDefault();
  const clickedItemId = event.target.dataset.id;
  if (clickedItemId) {
    resumeHeading.querySelector(".active").classList.remove("active");
    event.target.classList.add("active");

    resumeTabs.forEach((tab) => {
      tab.classList.remove("active");
    });
    const correspondingTab = document.getElementById(clickedItemId);
    correspondingTab.classList.add("active");
  }
};

// Portfolio Filter
const filterContainer = document.querySelector(".portfolio-filter-nav");
const galleryItems = document.querySelectorAll(".portfolio-item");

filterContainer.addEventListener("click", (e) => {
  e.preventDefault();
  filterContainer.querySelector(".active").classList.remove("active");
  e.target.classList.add("active");
  const filterValue = e.target.getAttribute("data-id");
  galleryItems.forEach((item) => {
    if (item.classList.contains(filterValue) || filterValue === "all") {
      item.classList.remove("hide");
      item.classList.add("show");
    } else {
      item.classList.remove("show");
      item.classList.add("hide");
    }
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
  const mailBody = [
    `Name: ${name}`,
    `Email: ${email}`,
    "",
    message,
  ].join("\n");

  return `mailto:${recipient}?subject=${encodeURIComponent(
    mailSubject
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
      msg.innerHTML = "<span class='error-msg'>Please fill all required fields.</span>";
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
        message
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
        EMAILJS_PUBLIC_KEY
      );

      contactForm.reset();
      msg.innerHTML = "<span class='success-msg'>Email Sent Successfully</span>";
      msg.classList.add("show");
      setTimeout(() => msg.classList.remove("show"), 2500);
    } catch (error) {
      console.error("EmailJS send error:", error);
      const errorText = String(error?.text || error?.message || "");
      const isScopeError = /gmail_api|insufficient authentication scopes|412/i.test(
        errorText
      );

      if (isScopeError) {
        msg.innerHTML =
          "<span class='error-msg'>Email service authorization expired. Opening your email app to send the message.</span>";
        msg.classList.add("show");
        window.location.href = buildMailtoLink(
          "pushpanathmr@gmail.com",
          name,
          email,
          subject,
          message
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
      `header .portfolio-navbar a[href*="#${id}"]`
    );
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
if (isLight()) {
  toggleRootClass();
}
document.querySelector(".theme-toggle").addEventListener("click", () => {
  toggleLocalStorageItem();
  toggleRootClass();
});

// Scroll Reveal
const sr = ScrollReveal({
  reset: true,
  distance: "60px",
  duration: 2500,
  delay: 400,
});
sr.reveal(".about-intro", { origin: "left" });
sr.reveal(
  ".resume-heading,.resume-text,.service-row,.portfolio-wrapper,.contact-general,#contact-form",
  { origin: "bottom" }
);
sr.reveal(".resume-body", { origin: "top" });

// 🎉 Career Popup Click Celebration
const popup = document.querySelector(".career-popup");

if (popup) {
  popup.addEventListener("click", () => {
    popup.style.display = "none";

    // 🎊 Confetti burst
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

    // 🎉 Toast message
    const congrats = document.createElement("div");
    congrats.className = "toast-message"; // Add class for CSS styling

    congrats.innerHTML = `
  <strong>Thank You! 🤗</strong><br>
  <small>Really appreciate your wishes! 🙌✨</small>
`;

    document.body.appendChild(congrats);

    // Remove after 4.5s (matches CSS animation)
    setTimeout(() => congrats.remove(), 4500);
  });
}

const downloadBtn = document.getElementById("cvDownloadBtn");
const resumeDownloadUrl =
  "https://drive.google.com/uc?export=download&id=1sZCUg3V8W-aKVUwfBNA3cbFwoPB_nhQB";

if (downloadBtn) {
  downloadBtn.setAttribute("href", resumeDownloadUrl);

  downloadBtn.addEventListener("click", function (e) {
    e.preventDefault();

    const toast = document.createElement("div");
    toast.innerHTML = `📥 <strong>Downloading Resume...</strong>`;
    toast.className = "custom-toast";
    document.body.appendChild(toast);

    // Remove after 4 seconds
    setTimeout(() => {
      toast.classList.add("hide-toast");
    }, 3000);
    setTimeout(() => toast.remove(), 4000);

    window.location.href = resumeDownloadUrl;
  });
}

document.addEventListener("mousemove", function (e) {
  const dot = document.createElement("div");
  dot.className = "magic-dot";

  // Add a little 3D-like skewing based on speed
  const skewX = (Math.random() - 0.5) * 20;
  const skewY = (Math.random() - 0.5) * 20;

  dot.style.left = `${e.clientX}px`;
  dot.style.top = `${e.clientY}px`;
  dot.style.transform = `translate(-50%, -50%) rotateX(${skewY}deg) rotateY(${skewX}deg) scale(1)`;

  document.body.appendChild(dot);

  // Remove after animation
  setTimeout(() => {
    dot.remove();
  }, 800);
});

const canvas = document.getElementById("tech-cursor-canvas");
const ctx = canvas.getContext("2d");

let width = (canvas.width = window.innerWidth);
let height = (canvas.height = window.innerHeight);

window.addEventListener("resize", () => {
  width = canvas.width = window.innerWidth;
  height = canvas.height = window.innerHeight;
});

let particles = [];

const techColors = [
  "rgba(0,255,255,0.9)", // Neon Cyan
  "rgba(0,255,150,0.9)", // Neon Green
  "rgba(0,150,255,0.9)", // Electric Blue
  "rgba(255,255,255,0.9)", // White sparks
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
  for (let i = 0; i < 6; i++) {
    particles.push(new Particle(x, y));
  }
}

function animate() {
  ctx.clearRect(0, 0, width, height);
  particles = particles.filter((p) => p.life > 0);
  particles.forEach((p) => {
    p.update();
    p.draw();
  });
  requestAnimationFrame(animate);
}

document.addEventListener("mousemove", (e) => {
  addParticles(e.clientX, e.clientY);
});

animate();
