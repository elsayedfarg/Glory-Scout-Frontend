document.addEventListener("DOMContentLoaded", () => {
  const resetEmail = localStorage.getItem("resetEmail") || "your email";
  const subtitle = document.querySelector("#verification-section .subtitle");
  if (subtitle) {
    subtitle.innerHTML = `We've sent a verification code to <strong>${resetEmail}</strong>. Please enter the code below to continue.`;
  }

  // Sections
  const verificationSection = document.getElementById("verification-section");
  const newPasswordSection = document.getElementById("new-password-section");
  const successSection = document.getElementById("success-section");

  // Forms
  const verifyForm = document.getElementById("verify-form");
  const passwordForm = document.getElementById("password-form");

  // Inputs
  const codeInputs = document.querySelectorAll(".code-input");
  const newPassword = document.getElementById("new-password");
  const confirmPassword = document.getElementById("confirm-password");

  // Password strength
  const strengthSegments = document.querySelectorAll(".strength-segment");
  const passwordRequirements = {
    length: document.getElementById("req-length"),
    uppercase: document.getElementById("req-uppercase"),
    lowercase: document.getElementById("req-lowercase"),
    number: document.getElementById("req-number"),
    special: document.getElementById("req-special"),
  };

  // Resend elements
  const resendLink = document.getElementById("resend-link");
  const countdownEl = document.getElementById("countdown");
  const timerEl = document.getElementById("timer");

  // Visibility toggles
  const visibilityIcons = document.querySelectorAll(".visibility-icon");

  const correctCode = "123456"; // demo code

  verificationSection.classList.add("active");

  // Handle code input behavior
  codeInputs.forEach((input, index) => {
    input.addEventListener("click", () => input.select());

    input.addEventListener("input", (e) => {
      const value = e.target.value;
      if (!/^\d*$/.test(value)) {
        e.target.value = "";
        return;
      }
      if (value && index < codeInputs.length - 1) {
        codeInputs[index + 1].focus();
      }
      input.classList.remove("error");
    });

    input.addEventListener("keydown", (e) => {
      if (e.key === "Backspace" && !input.value && index > 0) {
        codeInputs[index - 1].focus();
      }
    });

    input.addEventListener("paste", (e) => {
      e.preventDefault();
      const pasteData = e.clipboardData.getData("text").match(/\d/g);
      if (pasteData) {
        codeInputs.forEach((input, i) => {
          input.value = pasteData[i] || "";
        });
        codeInputs[Math.min(pasteData.length - 1, codeInputs.length - 1)].focus();
      }
    });
  });

  // Countdown resend timer
  let countdownInterval;
  function startCountdown() {
    let countdown = 60;
    timerEl.textContent = countdown;
    countdownEl.style.display = "block";
    resendLink.style.pointerEvents = "none";
    resendLink.style.opacity = "0.5";

    countdownInterval = setInterval(() => {
      countdown--;
      timerEl.textContent = countdown;
      if (countdown <= 0) {
        clearInterval(countdownInterval);
        countdownEl.style.display = "none";
        resendLink.style.pointerEvents = "auto";
        resendLink.style.opacity = "1";
      }
    }, 1000);
  }
  startCountdown();

  resendLink.addEventListener("click", (e) => {
    e.preventDefault();
    showNotification("Verification code resent to your email", "success");
    startCountdown();
  });

  verifyForm.addEventListener("submit", (e) => {
    e.preventDefault();

    const enteredCode = Array.from(codeInputs).map(input => input.value).join("");

    if (enteredCode.length !== 6) {
      showNotification("Please enter the complete 6-digit code", "error");
      return;
    }

    if (enteredCode === correctCode) {
      const verifyBtn = verifyForm.querySelector(".verify-btn");
      verifyBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Verifying...';
      verifyBtn.disabled = true;

      setTimeout(() => {
        verificationSection.classList.remove("active");
        newPasswordSection.classList.add("active");
      }, 1500);
    } else {
      codeInputs.forEach(input => input.classList.add("error"));
      showNotification("Invalid verification code. Please try again.", "error");
    }
  });

  // Toggle visibility
  visibilityIcons.forEach(icon => {
    icon.addEventListener("click", () => {
      const input = document.getElementById(icon.dataset.for);
      const iconEl = icon.querySelector("i");
      const isPassword = input.type === "password";
      input.type = isPassword ? "text" : "password";
      iconEl.classList.toggle("fa-eye", !isPassword);
      iconEl.classList.toggle("fa-eye-slash", isPassword);
    });
  });

  // Password strength
  function checkPasswordStrength(password) {
    let strength = 0;
    const requirements = {
      length: password.length >= 8,
      uppercase: /[A-Z]/.test(password),
      lowercase: /[a-z]/.test(password),
      number: /[0-9]/.test(password),
      special: /[^A-Za-z0-9]/.test(password),
    };

    Object.entries(requirements).forEach(([key, valid]) => {
      passwordRequirements[key].classList.toggle("valid", valid);
      if (valid) strength++;
    });

    strengthSegments.forEach((segment, index) => {
      segment.className = "strength-segment";
      if (index < strength) {
        segment.classList.add(strength <= 2 ? "weak" : strength <= 4 ? "medium" : "strong");
      }
    });

    return strength;
  }

  if (newPassword) {
    newPassword.addEventListener("input", () => checkPasswordStrength(newPassword.value));
  }

  passwordForm.addEventListener("submit", (e) => {
    e.preventDefault();

    const password = newPassword.value;
    const confirmPwd = confirmPassword.value;

    const strength = checkPasswordStrength(password);

    if (strength < 3) {
      showNotification("Please create a stronger password", "warning");
      return;
    }

    if (password !== confirmPwd) {
      showNotification("Passwords do not match", "error");
      return;
    }

    const resetBtn = passwordForm.querySelector(".reset-btn");
    resetBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Resetting...';
    resetBtn.disabled = true;

    setTimeout(() => {
      newPasswordSection.classList.remove("active");
      successSection.classList.add("active");
    }, 1500);
  });

  // Notification
  function showNotification(message, type) {
    const existing = document.querySelector(".notification");
    if (existing) existing.remove();

    const notification = document.createElement("div");
    notification.className = `notification ${type}`;
    notification.textContent = message;
    document.body.appendChild(notification);

    setTimeout(() => notification.classList.add("show"), 10);
    setTimeout(() => {
      notification.classList.remove("show");
      setTimeout(() => notification.remove(), 300);
    }, 3000);
  }
});
