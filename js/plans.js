document.addEventListener("DOMContentLoaded", () => {
  // Elements
  const menuToggle = document.getElementById("menu-toggle");
  const sidebar = document.getElementById("sidebar");
  const overlay = document.getElementById("overlay");
  const mainContent = document.getElementById("main-content");
  const notification = document.getElementById("notification");
  const planSelectBtns = document.querySelectorAll(".plan-select-btn");
  const paymentFormContainer = document.getElementById("payment-form-container");
  const backToPlanBtn = document.getElementById("back-to-plans-btn");
  const completePaymentBtn = document.getElementById("complete-payment-btn");
  const successModal = document.getElementById("success-modal");
  const successBtn = document.getElementById("success-btn");
  const paymentMethods = document.querySelectorAll(".payment-method");
  const cardPaymentMethod = document.getElementById("card-payment-method");
  const paypalPaymentMethod = document.getElementById("paypal-payment-method");
  const bankPaymentMethod = document.getElementById("bank-payment-method");

  // Card form elements
  const cardNumber = document.getElementById("card-number");
  const cardHolder = document.getElementById("card-holder");
  const cardExpiry = document.getElementById("card-expiry");
  const cardCvv = document.getElementById("card-cvv");
  const cardNumberDisplay = document.getElementById("card-number-display");
  const cardHolderDisplay = document.getElementById("card-holder-display");
  const cardExpiresDisplay = document.getElementById("card-expires-display");
  const cardCvvDisplay = document.getElementById("card-cvv-display");
  const creditCard = document.querySelector(".credit-card");

  // Initial state
  let sidebarOpen = false;
  let selectedPlan = "premium";

  // Toggle sidebar
  if (menuToggle) {
    menuToggle.addEventListener("click", (e) => {
      e.preventDefault();
      e.stopPropagation();

      sidebarOpen = !sidebarOpen;

      if (sidebarOpen) {
        sidebar.classList.add("active");
        overlay.classList.add("active");
        mainContent.classList.add("sidebar-active");
      } else {
        sidebar.classList.remove("active");
        overlay.classList.remove("active");
        mainContent.classList.remove("sidebar-active");
      }
    });
  }

  // Close sidebar when clicking overlay
  if (overlay) {
    overlay.addEventListener("click", () => {
      sidebarOpen = false;
      sidebar.classList.remove("active");
      overlay.classList.remove("active");
      mainContent.classList.remove("sidebar-active");
    });
  }

  // Plan selection
  planSelectBtns.forEach((btn) => {
    btn.addEventListener("click", function () {
      const plan = this.closest(".plan").getAttribute("data-plan");
      selectedPlan = plan;

      // Update order summary based on selected plan
      updateOrderSummary(plan);

      // Show payment form
      paymentFormContainer.style.display = "block";

      // Scroll to payment form
      paymentFormContainer.scrollIntoView({ behavior: "smooth" });

      // Add active class with a slight delay for animation
      setTimeout(() => {
        paymentFormContainer.classList.add("active");
      }, 100);
    });
  });

  // Back to plans button
  if (backToPlanBtn) {
    backToPlanBtn.addEventListener("click", () => {
      paymentFormContainer.classList.remove("active");

      // Hide payment form after animation
      setTimeout(() => {
        paymentFormContainer.style.display = "none";

        // Scroll back to plans
        document.querySelector(".pricing-plans").scrollIntoView({ behavior: "smooth" });
      }, 300);
    });
  }

  // Payment method selection
  paymentMethods.forEach((method) => {
    method.addEventListener("click", function () {
      // Remove active class from all methods
      paymentMethods.forEach((m) => m.classList.remove("active"));

      // Add active class to selected method
      this.classList.add("active");

      const methodType = this.getAttribute("data-method");

      // Hide all payment method details
      cardPaymentMethod.classList.remove("active");
      paypalPaymentMethod.classList.remove("active");
      bankPaymentMethod.classList.remove("active");

      // Show selected payment method details
      if (methodType === "card") {
        cardPaymentMethod.classList.add("active");
      } else if (methodType === "paypal") {
        paypalPaymentMethod.classList.add("active");
      } else if (methodType === "bank") {
        bankPaymentMethod.classList.add("active");
      }
    });
  });

  // Credit card form interactions
  if (cardNumber) {
    cardNumber.addEventListener("input", function () {
      // Format card number with spaces
      const value = this.value.replace(/\s+/g, "").replace(/[^0-9]/gi, "");
      let formattedValue = "";

      for (let i = 0; i < value.length; i++) {
        if (i > 0 && i % 4 === 0) {
          formattedValue += " ";
        }
        formattedValue += value[i];
      }

      this.value = formattedValue;

      // Update card display
      cardNumberDisplay.textContent = formattedValue || "•••• •••• •••• ••••";

      // Determine card type based on first digit
      const firstDigit = value[0];
      let cardTypeIcon = "fa-credit-card";

      if (firstDigit === "4") {
        cardTypeIcon = "fa-cc-visa";
      } else if (firstDigit === "5") {
        cardTypeIcon = "fa-cc-mastercard";
      } else if (firstDigit === "3") {
        cardTypeIcon = "fa-cc-amex";
      } else if (firstDigit === "6") {
        cardTypeIcon = "fa-cc-discover";
      }

      document.querySelector(".card-type i").className = `fab ${cardTypeIcon}`;
    });
  }

  if (cardHolder) {
    cardHolder.addEventListener("input", function () {
      cardHolderDisplay.textContent = this.value.toUpperCase() || "YOUR NAME";
    });
  }

  if (cardExpiry) {
    cardExpiry.addEventListener("input", function () {
      let value = this.value.replace(/[^0-9]/g, "");

      if (value.length > 2) {
        value = value.substring(0, 2) + "/" + value.substring(2, 4);
      }

      this.value = value;
      cardExpiresDisplay.textContent = value || "MM/YY";
    });
  }

  if (cardCvv) {
    cardCvv.addEventListener("focus", () => {
      creditCard.classList.add("flipped");
    });

    cardCvv.addEventListener("blur", () => {
      creditCard.classList.remove("flipped");
    });

    cardCvv.addEventListener("input", function () {
      this.value = this.value.replace(/[^0-9]/g, "");
      cardCvvDisplay.textContent = this.value || "•••";
    });
  }

  // Complete payment button
  if (completePaymentBtn) {
    completePaymentBtn.addEventListener("click", function () {
      // Validate form before processing
      if (!validateCardForm()) {
        showNotification("Please fill in all fields correctly.");
        return;
      }

      // Show loading state
      this.disabled = true;
      const btnText = this.querySelector(".btn-text");
      const originalText = btnText.textContent;
      btnText.textContent = "Processing...";

      // Simulate payment processing
      setTimeout(() => {
        // Generate random transaction ID
        const transactionId = "TRX" + Math.floor(Math.random() * 1000000000);
        document.getElementById("transaction-id").textContent = transactionId;

        // Set current date
        const currentDate = new Date().toLocaleDateString("en-US", {
          year: "numeric",
          month: "long",
          day: "numeric",
        });
        document.getElementById("payment-date").textContent = currentDate;

        // Show success modal
        successModal.style.display = "flex";
        setTimeout(() => {
          successModal.classList.add("active");
        }, 100);

        // Reset button state
        this.disabled = false;
        btnText.textContent = originalText;
      }, 2000);
    });
  }

  // Success button
  if (successBtn) {
    successBtn.addEventListener("click", () => {
      successModal.classList.remove("active");
      setTimeout(() => {
        successModal.style.display = "none";

        // Redirect to dashboard or show notification
        showNotification("You have been redirected to the dashboard");

        // Simulate redirect
        setTimeout(() => {
          window.location.href = "index.html";
        }, 2000);
      }, 300);
    });
  }

  // Update order summary based on selected plan
  function updateOrderSummary(plan) {
    let planName, planPrice, tax, total;

    switch (plan) {
      case "basic":
        planName = "Basic Plan";
        planPrice = 9.0;
        break;
      case "premium":
        planName = "Premium Plan";
        planPrice = 19.0;
        break;
      case "business":
        planName = "Business Plan";
        planPrice = 49.0;
        break;
      default:
        planName = "Premium Plan";
        planPrice = 19.0;
    }

    tax = planPrice * 0.1; // 10% tax
    total = planPrice + tax;

    // Update DOM elements
    document.querySelector(".summary-item .item-name").textContent = planName;
    document.querySelector(".summary-item .item-price").textContent = `$${planPrice.toFixed(2)}`;
    document.querySelector(".summary-item:nth-child(2) .item-price").textContent = `$${tax.toFixed(2)}`;
    document.querySelector(".total-price").textContent = `$${total.toFixed(2)}`;
    document.getElementById("payment-amount").textContent = `$${total.toFixed(2)}`;
  }

  // Show notification
  function showNotification(message) {
    notification.textContent = message;
    notification.classList.add("show");

    setTimeout(() => {
      notification.classList.remove("show");
    }, 3000);
  }

  // Validate credit card form
  function validateCardForm() {
    const isCardValid = cardNumber.value && cardHolder.value && cardExpiry.value && cardCvv.value;
    return isCardValid;
  }

  // Initialize with default plan
  updateOrderSummary(selectedPlan);

  // Add some animations to elements when they come into view
  const animateOnScroll = () => {
    const elements = document.querySelectorAll(".plan, .form-section");

    elements.forEach((element) => {
      const elementTop = element.getBoundingClientRect().top;
      const elementBottom = element.getBoundingClientRect().bottom;

      if (elementTop < window.innerHeight && elementBottom > 0) {
        element.style.opacity = "1";
        element.style.transform = "translateY(0)";
      }
    });
  };

  // Initial check for elements in view
  animateOnScroll();

  // Listen for scroll events with debounce to improve performance
  let debounceTimer;
  window.addEventListener("scroll", () => {
    clearTimeout(debounceTimer);
    debounceTimer = setTimeout(animateOnScroll, 100);
  });
});
