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

    // Mobile Menu Toggle
    const menuToggle = document.querySelector('.menu-toggle');
    if (menuToggle) {
        menuToggle.addEventListener('click', function () {
            if (!document.querySelector('.mobile-menu')) {
                createMobileMenu();
            }
            document.querySelector('.mobile-menu').classList.toggle('active');
        });
    }

    // Testimonial Slider
    const testimonialCards = document.querySelector('.testimonial-cards');
    const prevBtn = document.querySelector('.slider-arrow.prev');
    const nextBtn = document.querySelector('.slider-arrow.next');

    if (testimonialCards && prevBtn && nextBtn) {
        let currentIndex = 0;

        const cloneCards = () => {
            const cards = document.querySelectorAll('.testimonial-card');
            cards.forEach(card => {
                const clone = card.cloneNode(true);
                testimonialCards.appendChild(clone);
            });
        };

        const initSlider = () => {
            const cards = document.querySelectorAll('.testimonial-card');
            const cardWidth = 100 / cards.length;
            cards.forEach(card => {
                card.style.flex = `0 0 ${cardWidth}%`;
            });
            testimonialCards.style.width = `${cards.length * 100}%`;
        };

        const moveToSlide = (index) => {
            const cards = document.querySelectorAll('.testimonial-card');
            const cardWidth = 100 / cards.length;
            testimonialCards.style.transform = `translateX(-${index * cardWidth}%)`;
            currentIndex = index;
        };

        nextBtn.addEventListener('click', () => {
            const cards = document.querySelectorAll('.testimonial-card');
            if (currentIndex === cards.length - 1) {
                testimonialCards.style.transition = 'none';
                moveToSlide(0);
                setTimeout(() => {
                    testimonialCards.style.transition = 'transform 0.5s ease';
                }, 10);
            } else {
                moveToSlide(currentIndex + 1);
            }
        });

        prevBtn.addEventListener('click', () => {
            const cards = document.querySelectorAll('.testimonial-card');
            if (currentIndex === 0) {
                testimonialCards.style.transition = 'none';
                moveToSlide(cards.length - 1);
                setTimeout(() => {
                    testimonialCards.style.transition = 'transform 0.5s ease';
                }, 10);
            } else {
                moveToSlide(currentIndex - 1);
            }
        });

        const tabBtns = document.querySelectorAll('.tab-btn');
        tabBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                tabBtns.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                moveToSlide(0);
            });
        });

        cloneCards();
        initSlider();
    }

    // Login Form
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
                    alert("You have logged in successfully");
                    document.getElementById('email').value = '';
                    document.getElementById('password').value = '';

                    if (emailSpan) {
                        emailSpan.textContent = response.data.email;
                    }

                    SetupUI();
                })
                .catch((error) => {
                    alert("Login failed: " + (error.response ? error.response.data : error.message));
                })
                .finally(() => {
                    // Revert button state regardless of success or error
                    submitBtn.disabled = false;
                    submitBtn.innerHTML = originalBtnText;
                });
        });
    }


    // Setup UI based on login status
    function SetupUI() {
        const token = localStorage.getItem("token");

        // Always re-fetch buttons in case DOM changed
        const loginBtn = document.getElementById("loginBtn");
        const signupBtn = document.getElementById("signupBtn");
        const logoutBtn = document.getElementById("logoutBtn");

        if (token) {
            if (loginBtn) loginBtn.classList.add('hidden');
            if (signupBtn) signupBtn.classList.add('hidden');
            if (logoutBtn) {
                logoutBtn.classList.remove('hidden');
                logoutBtn.style.display = 'inline-block'; // <-- Show it explicitly
            }
        } else {
            if (loginBtn) loginBtn.classList.remove('hidden');
            if (signupBtn) signupBtn.classList.remove('hidden');
            if (logoutBtn) {
                logoutBtn.classList.add('hidden');
                logoutBtn.style.display = 'none'; // <-- Hide it explicitly
            }
        }

        // Update mobile buttons
        const mobileAuth = document.getElementById("mobileAuth");
        if (mobileAuth) {
            mobileAuth.innerHTML = token
                ? `<a href="#" id="mobileLogoutBtn" class="logout-btn">Logout</a>`
                : `
                    <a href="./login.html" class="mobile-login-btn">Login</a>
                    <a href="./create-account.html" class="mobile-signup-btn">Sign Up</a>
                `;
        }
    }

    // Logout logic
    function logout() {
        localStorage.removeItem("token");
        alert("Logged out successfully");
        const emailSpan = document.getElementById('contactEmail');
        if (emailSpan) {
            emailSpan.textContent = '';
        }
        SetupUI();
    }

    // Bind logout
    const logoutBtn = document.getElementById("logoutBtn");
    if (logoutBtn) {
        logoutBtn.addEventListener("click", logout);
    }

    // Create mobile menu
    function createMobileMenu() {
        const mobileMenu = document.createElement('div');
        mobileMenu.className = 'mobile-menu';

        mobileMenu.innerHTML = `
            <div class="mobile-menu-header">
                <div class="logo">
                    <img src="../images/Frame 38.png" alt="Glory Scout">
                </div>
                <button class="mobile-menu-close">
                    <i class="fas fa-times"></i>
                </button>
            </div>

            <nav class="mobile-nav-links">
                <a href="./index.html" class="active">Home</a>
                <a href="./player-home.html">Players</a>
                <a href="./coach-home.html">Coaches</a>
                <a href="./about-us.html">About Us</a>
            </nav>

            <div class="mobile-auth-buttons" id="mobileAuth">
            </div>
        `;

        document.body.appendChild(mobileMenu);

        const closeBtn = mobileMenu.querySelector('.mobile-menu-close');
        closeBtn.addEventListener('click', function () {
            mobileMenu.classList.remove('active');
        });

        const mobileAuth = document.getElementById("mobileAuth");
        const token = localStorage.getItem("token");
        mobileAuth.innerHTML = token ? `
                <a href="#" id="mobileLogoutBtn" class="logout-btn">Logout</a>
            ` : `
                <a href="./login.html" class="mobile-login-btn">Login</a>
                <a href="./create-account.html" class="mobile-signup-btn">Sign Up</a>
            `;

        SetupUI();


        const mobileLogoutBtn = document.getElementById("mobileLogoutBtn");
        if (mobileLogoutBtn) {
            mobileLogoutBtn.addEventListener('click', function () {
                logout();
                mobileMenu.classList.remove('active');
            });
        }
    }

    // Run on load
    SetupUI();
});
