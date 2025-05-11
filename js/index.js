import { SetupUI } from "./Common/SetupUI.js";
import { logout } from "./Common/Logout.js";

document.addEventListener("DOMContentLoaded", () => {
  // List of selectors to animate on scroll
  const animatedSelectors = [
    ".features-section",
    ".achievement-section",
    ".connect-section",
    ".players-world-section",
    ".built-section",
    ".built-players-section",
    ".app-showcase-section",
    ".start-journey-section"
  ];

  const elementsToAnimate = document.querySelectorAll(animatedSelectors.join(","));

  // Set initial styles for animation
  const setupAnimations = () => {
    elementsToAnimate.forEach((element) => {
      if (!element) return;
      element.style.opacity = "0";
      element.style.transform = "translateY(20px)";
      element.style.transition = "opacity 0.6s ease, transform 0.6s ease";
    });
  };

  // Animate elements on scroll
  const animateOnScroll = () => {
    const screenPosition = window.innerHeight / 1.3;
    elementsToAnimate.forEach((element) => {
      if (!element) return; // Ensure element exists
      const elementPosition = element.getBoundingClientRect().top;

      if (elementPosition < screenPosition) {
        element.style.opacity = "1";
        element.style.transform = "translateY(0)";
      }
    });
  };

  // Banner animation (duplicate banner items for scrolling effect)
  const setupBanner = () => {
    const bannerStrip = document.querySelector(".banner-strip");
    if (bannerStrip) {
      const bannerItems = bannerStrip.querySelectorAll(".banner-item");
      bannerItems.forEach((item) => {
        const clone = item.cloneNode(true);
        bannerStrip.appendChild(clone);
      });
    }
  };

  // Hero section animation (for fading and sliding)
  const animateHero = () => {
    const heroContent = document.querySelector(".hero-content");
    const heroImage = document.querySelector(".hero-image");

    if (heroContent && heroImage) {
      heroContent.style.opacity = "0";
      heroImage.style.opacity = "0";
      heroContent.style.transform = "translateX(-20px)";
      heroImage.style.transform = "translateX(20px)";

      heroContent.style.transition = "opacity 0.8s ease, transform 0.8s ease";
      heroImage.style.transition = "opacity 0.8s ease, transform 0.8s ease";

      setTimeout(() => {
        heroContent.style.opacity = "1";
        heroImage.style.opacity = "1";
        heroContent.style.transform = "translateX(0)";
        heroImage.style.transform = "translateX(0)";
      }, 300);
    }
  };

  // Animate FE icons with pulse animation
  const animateFeIcons = () => {
    const feIcons = document.querySelectorAll(".fe-icon");
    feIcons.forEach((icon) => {
      const delay = (Math.random() * 5).toFixed(2);
      icon.style.animation = `pulse 3s infinite ${delay}s`;
    });
  };

  // Add pulse animation keyframes to document head
  const addPulseAnimation = () => {
    const existing = document.getElementById("pulse-style");
    if (existing) return;

    const style = document.createElement("style");
    style.id = "pulse-style";
    style.textContent = `
      @keyframes pulse {
        0% { opacity: 0.3; transform: scale(1); }
        50% { opacity: 1; transform: scale(1.2); }
        100% { opacity: 0.3; transform: scale(1); }
      }
    `;
    document.head.appendChild(style);
  };

  // Initialize animations
  setupAnimations();
  setupBanner();
  animateHero();
  addPulseAnimation();
  animateFeIcons();

  // Trigger scroll animation on page load and scroll event
  window.addEventListener("scroll", animateOnScroll);
  animateOnScroll(); // Fire once on load to ensure elements in view are animated

  SetupUI();
  document.getElementById("logoutBtn")?.addEventListener("click", logout);
});
