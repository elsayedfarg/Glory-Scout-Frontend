document.addEventListener('DOMContentLoaded', function () {
    // Password Toggle
    const togglePassword = document.querySelector('.toggle-password');
    const passwordInput = document.getElementById('password');

    if (togglePassword && passwordInput) {
        togglePassword.addEventListener('click', function () {
            const type = passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';
            passwordInput.setAttribute('type', type);

            // Toggle icon
            this.classList.toggle('fa-eye');
            this.classList.toggle('fa-eye-slash');
        });
    }

    // Mobile Menu Toggle
    const menuToggle = document.querySelector('.menu-toggle');

    if (menuToggle) {
        menuToggle.addEventListener('click', function () {
            // Create mobile menu only if it doesn't already exist
            if (!document.querySelector('.mobile-menu')) {
                createMobileMenu();
            }

            const mobileMenu = document.querySelector('.mobile-menu');
            mobileMenu.classList.toggle('active'); // Toggle active class to show/hide menu
        });
    }

    // Testimonial Slider
    const testimonialCards = document.querySelector('.testimonial-cards');
    const prevBtn = document.querySelector('.slider-arrow.prev');
    const nextBtn = document.querySelector('.slider-arrow.next');

    if (testimonialCards && prevBtn && nextBtn) {
        let currentIndex = 0;
        const totalSlides = document.querySelectorAll('.testimonial-card').length;

        // Clone the testimonial cards for infinite loop
        const cloneCards = () => {
            const cards = document.querySelectorAll('.testimonial-card');
            cards.forEach(card => {
                const clone = card.cloneNode(true);
                testimonialCards.appendChild(clone);
            });
        };

        // Initialize slider
        const initSlider = () => {
            const cards = document.querySelectorAll('.testimonial-card');
            const cardWidth = 100 / cards.length;
            cards.forEach(card => {
                card.style.flex = `0 0 ${cardWidth}%`;
            });
            testimonialCards.style.width = `${cards.length * 100}%`;
        };

        // Move to slide
        const moveToSlide = (index) => {
            const cards = document.querySelectorAll('.testimonial-card');
            const cardWidth = 100 / cards.length;
            testimonialCards.style.transform = `translateX(-${index * cardWidth}%)`;
            currentIndex = index;
        };

        // Next slide
        nextBtn.addEventListener('click', () => {
            const cards = document.querySelectorAll('.testimonial-card');
            if (currentIndex === cards.length - 1) {
                // Reset to first slide instantly without animation
                testimonialCards.style.transition = 'none';
                moveToSlide(0);
                setTimeout(() => {
                    testimonialCards.style.transition = 'transform 0.5s ease';
                }, 10);
            } else {
                moveToSlide(currentIndex + 1);
            }
        });

        // Previous slide
        prevBtn.addEventListener('click', () => {
            const cards = document.querySelectorAll('.testimonial-card');
            if (currentIndex === 0) {
                // Go to last slide instantly without animation
                testimonialCards.style.transition = 'none';
                moveToSlide(cards.length - 1);
                setTimeout(() => {
                    testimonialCards.style.transition = 'transform 0.5s ease';
                }, 10);
            } else {
                moveToSlide(currentIndex - 1);
            }
        });

        // Tab buttons
        const tabBtns = document.querySelectorAll('.tab-btn');
        tabBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                tabBtns.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                moveToSlide(0); // Reset slider to first slide on tab change
            });
        });

        // Form submission
        const loginForm = document.getElementById('loginForm');
        if (loginForm) {
            loginForm.addEventListener('submit', function (e) {
                e.preventDefault();

                const email = document.getElementById('email').value;
                const password = document.getElementById('password').value;

                // Validate form
                if (!email || !password) {
                    alert('Please fill in all fields');
                    return;
                }

                // Simulate form submission (you can replace this with real submission logic)
                console.log('Login attempt:', { email, password });
                alert('Login successful!');
            });
        }

        // Initialize slider and clone testimonial cards for infinite loop
        cloneCards();
        initSlider();
    }

    // Function to create mobile menu
    function createMobileMenu() {
        const mobileMenu = document.createElement('div');
        mobileMenu.className = 'mobile-menu';

        mobileMenu.innerHTML = `
            <div class="mobile-menu-header">
                <div class="logo">
                    <!-- Replace with your logo path -->
                    <img src="your-logo.png" alt="Glory Scout">
                </div>
                <button class="mobile-menu-close">
                    <i class="fas fa-times"></i>
                </button>
            </div>
            
            <nav class="mobile-nav-links">
                <a href="#" class="active">Home</a>
                <a href="#">Players</a>
                <a href="#">Coaches</a>
                <a href="#">About Us</a>
            </nav>
            
            <div class="mobile-auth-buttons">
                <a href="#" class="mobile-login-btn">Login</a>
                <a href="#" class="mobile-signup-btn">Sign Up</a>
            </div>
        `;

        document.body.appendChild(mobileMenu);

        // Close mobile menu
        const closeBtn = mobileMenu.querySelector('.mobile-menu-close');
        closeBtn.addEventListener('click', function () {
            mobileMenu.classList.remove('active');
        });
    }
});
