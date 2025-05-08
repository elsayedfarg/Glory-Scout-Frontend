// login.js
import { initTestimonialSlider } from './Common/Testimonial-Slider.js';
import { createMobileMenu } from './Common/Mobile-Menu.js';
import { SetupUI } from './Common/SetupUI.js';
import { MobileMenuToggle } from './Common/Mobile-Menu-Toggle.js';
import { logout } from './Common/Logout.js';

document.addEventListener('DOMContentLoaded', function () {
    // Password Toggle
    const togglePassword = document.querySelector('.toggle-password');
    const passwordInput = document.getElementById('password');

    if (togglePassword && passwordInput) {
        togglePassword.addEventListener('click', function () {
            const type = passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';
            passwordInput.setAttribute('type', type);
            this.classList.toggle('fa-eye');
            this.classList.toggle('fa-eye-slash');
        });
    }

    MobileMenuToggle();
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', function (e) {
            e.preventDefault();

            const submitBtn = loginForm.querySelector('button[type="submit"]');
            const originalBtnText = submitBtn.innerHTML;
            submitBtn.disabled = true;
            submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Logging in...';

            const email = document.getElementById('email').value;
            const password = document.getElementById('password').value;

            const BaseURL = "http://glory-scout.tryasp.net/api";
            const emailSpan = document.getElementById('contactEmail');

            axios.post(`${BaseURL}/Auth/login`, { email, password }, {
                headers: { "Content-Type": "application/json" }
            })
                .then((response) => {
                    localStorage.setItem("token", response.data.token);
                    localStorage.setItem("role", response.data.role);
                    alert("You have logged in successfully");
                    document.getElementById('email').value = '';
                    document.getElementById('password').value = '';

                    if (emailSpan) {
                        emailSpan.textContent = response.data.email;
                    }

                    SetupUI(); // Update the main UI after login
                    createMobileMenu(); // Update mobile menu after login
                })
                .catch((error) => {
                    alert("Login failed: " + (error.response ? error.response.data : error.message));
                })
                .finally(() => {
                    submitBtn.disabled = false;
                    submitBtn.innerHTML = originalBtnText;
                });
        });
    }

    const logoutBtn = document.getElementById("logoutBtn");
    if (logoutBtn) {
        logoutBtn.addEventListener("click", logout);
    }

    createMobileMenu("signup");
    SetupUI();
    document.getElementById("logoutBtn")?.addEventListener("click", logout);

    initTestimonialSlider({
        defaultActiveTab: 0
    });
});

