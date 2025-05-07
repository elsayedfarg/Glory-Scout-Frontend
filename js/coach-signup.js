import { initTestimonialSlider } from "./Common/Testimonial-Slider.js";
document.addEventListener('DOMContentLoaded', function () {
    // Password Toggle
    const togglePasswordButtons = document.querySelectorAll('.toggle-password');
    togglePasswordButtons.forEach(button => {
        button.addEventListener('click', function () {
            const passwordInput = this.previousElementSibling;
            const type = passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';
            passwordInput.setAttribute('type', type);
            this.classList.toggle('fa-eye');
            this.classList.toggle('fa-eye-slash');
        });
    });

    // File Upload
    const fileInput = document.getElementById('profileImage');
    const fileName = document.querySelector('.file-name');

    if (fileInput && fileName) {
        fileInput.addEventListener('change', function () {
            if (this.files.length > 0) {
                fileName.textContent = this.files[0].name;

                const reader = new FileReader();
                reader.onload = function (e) {
                    // Optional: preview logic can go here
                };
                reader.readAsDataURL(this.files[0]);
            } else {
                fileName.textContent = 'No File Chosen';
            }
        });
    }

    // Mobile Menu Toggle
    const menuToggle = document.querySelector('.menu-toggle');
    if (menuToggle) {
        menuToggle.addEventListener('click', function () {
            if (!document.querySelector('.mobile-menu')) {
                createMobileMenu();
            }
            document.querySelector('.mobile-menu').classList.add('active');
        });
    }

    // Tab Buttons
    const tabBtns = document.querySelectorAll('.tab-btn');
    tabBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            tabBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            currentIndex = 0;
            if (testimonialCards) moveToSlide(0);
        });
    });

    // Signup Form Validation
    const signupForm = document.getElementById('signupForm');
    if (signupForm) {
        signupForm.addEventListener('submit', function (e) {
            e.preventDefault();

            const username = document.getElementById('username').value.trim();
            const email = document.getElementById('email').value.trim();
            const password = document.getElementById('password').value;
            const confirmPassword = document.getElementById('confirmPassword').value;
            const specialization = document.getElementById('specialization').value;
            const experience = document.getElementById('experience').value;
            const clubName = document.getElementById('clubName').value;
            const coachingSpecialty = document.getElementById('coachingSpecialty').value;

            if (!username || !email || !password || !confirmPassword || !specialization || !experience || !clubName || !coachingSpecialty) {
                alert('Please fill in all required fields');
                return;
            }

            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(email)) {
                alert('Please enter a valid email address');
                return;
            }

            if (password !== confirmPassword) {
                alert('Passwords do not match');
                return;
            }

            if (password.length < 8) {
                alert('Password must be at least 8 characters long');
                return;
            }

            console.log('Signup attempt:', {
                username,
                email,
                password,
                specialization,
                experience,
                clubName,
                coachingSpecialty
            });

            window.location.href = "home coach.html";
        });
    }

    // Create Mobile Menu
    function createMobileMenu() {
        const mobileMenu = document.createElement('div');
        mobileMenu.className = 'mobile-menu';

        mobileMenu.innerHTML = `
            <div class="mobile-menu-header">
                <div class="logo">
                    <img src="your-logo.png" alt="Glory Scout">
                </div>
                <button class="mobile-menu-close">
                    <i class="fas fa-times"></i>
                </button>
            </div>

            <nav class="mobile-nav-links">
                <a href="index.html">Home</a>
                <a href="#">Players</a>
                <a href="#" class="active">Coaches</a>
                <a href="#">About Us</a>
            </nav>

            <div class="mobile-auth-buttons">
                <a href="index.html" class="mobile-login-btn">Login</a>
            </div>
        `;

        document.body.appendChild(mobileMenu);

        const closeBtn = mobileMenu.querySelector('.mobile-menu-close');
        closeBtn.addEventListener('click', function () {
            mobileMenu.classList.remove('active');
        });
    }
    initTestimonialSlider({
        defaultActiveTab: 2
    });
});
