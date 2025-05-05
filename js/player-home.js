document.addEventListener("DOMContentLoaded", () => {
    // Animate elements on scroll
    const animateOnScroll = () => {
      const elements = document.querySelectorAll(
        ".features-section, .achievement-section, .connect-section, .players-world-section, .built-section, .built-players-section, .app-showcase-section, .start-journey-section",
      )
  
      elements.forEach((element) => {
        const elementPosition = element.getBoundingClientRect().top
        const screenPosition = window.innerHeight / 1.3
  
        if (elementPosition < screenPosition) {
          element.style.opacity = "1"
          element.style.transform = "translateY(0)"
        }
      })
    }
  
    // Set initial styles for animation
    const setupAnimations = () => {
      const elements = document.querySelectorAll(
        ".features-section, .achievement-section, .connect-section, .players-world-section, .built-section, .built-players-section, .app-showcase-section, .start-journey-section",
      )
  
      elements.forEach((element) => {
        element.style.opacity = "0"
        element.style.transform = "translateY(20px)"
        element.style.transition = "opacity 0.6s ease, transform 0.6s ease"
      })
    }
  
    // Banner animation (duplicate items for infinite scroll effect)
    const setupBanner = () => {
      const bannerStrip = document.querySelector(".banner-strip")
      if (bannerStrip) {
        const bannerItems = bannerStrip.querySelectorAll(".banner-item")
  
        // Clone banner items and append to create seamless loop
        bannerItems.forEach((item) => {
          const clone = item.cloneNode(true)
          bannerStrip.appendChild(clone)
        })
      }
    }
  
    // Hero section animation
    const animateHero = () => {
      const heroContent = document.querySelector(".hero-content")
      const heroImage = document.querySelector(".hero-image")
  
      if (heroContent && heroImage) {
        heroContent.style.opacity = "0"
        heroImage.style.opacity = "0"
        heroContent.style.transform = "translateX(-20px)"
        heroImage.style.transform = "translateX(20px)"
  
        heroContent.style.transition = "opacity 0.8s ease, transform 0.8s ease"
        heroImage.style.transition = "opacity 0.8s ease, transform 0.8s ease"
  
        setTimeout(() => {
          heroContent.style.opacity = "1"
          heroImage.style.opacity = "1"
          heroContent.style.transform = "translateX(0)"
          heroImage.style.transform = "translateX(0)"
        }, 300)
      }
    }
  
    // Animate FE icons in world map
    const animateFeIcons = () => {
      const feIcons = document.querySelectorAll(".fe-icon")
  
      feIcons.forEach((icon, index) => {
        // Random animation delay
        const delay = Math.random() * 5
  
        // Add animation
        icon.style.animation = `pulse 3s infinite ${delay}s`
      })
    }
  
    // Add pulse animation style
    const addPulseAnimation = () => {
      const style = document.createElement("style")
      style.textContent = `
        @keyframes pulse {
          0% { opacity: 0.3; transform: scale(1); }
          50% { opacity: 1; transform: scale(1.2); }
          100% { opacity: 0.3; transform: scale(1); }
        }
      `
      document.head.appendChild(style)
    }
  
    // Initialize
    setupAnimations()
    setupBanner()
    animateHero()
    addPulseAnimation()
    animateFeIcons()
  
    // Listen for scroll events
    window.addEventListener("scroll", animateOnScroll)
  
    // Trigger once on load
    animateOnScroll()
  })
  