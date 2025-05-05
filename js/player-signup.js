document.addEventListener("DOMContentLoaded", function() {
    // Password Toggle
    const togglePasswordButtons = document.querySelectorAll(".toggle-password");
    
    togglePasswordButtons.forEach(button => {
        button.addEventListener("click", function() {
            const passwordInput = this.previousElementSibling;
            const type = passwordInput.getAttribute("type") === "password" ? "text" : "password";
            passwordInput.setAttribute("type", type);
            
            // Toggle icon
            this.classList.toggle("fa-eye");
            this.classList.toggle("fa-eye-slash");
        });
    });
    
    // Password Requirements
    const passwordInput = document.getElementById("password");
    const passwordRequirements = document.querySelector(".password-requirements");
    const lengthReq = document.getElementById("length");
    const uppercaseReq = document.getElementById("uppercase");
    const lowercaseReq = document.getElementById("lowercase");
    const numberReq = document.getElementById("number");
    const specialReq = document.getElementById("special");
    
    if (passwordInput && passwordRequirements) {
        // Show requirements on focus
        passwordInput.addEventListener("focus", function() {
            passwordRequirements.style.display = "block";
        });
        
        // عدم إخفاء المتطلبات عند النقر عليها
        passwordRequirements.addEventListener("click", function(e) {
            e.stopPropagation();
        });
        
        // Hide requirements when clicking outside
        document.addEventListener("click", function(e) {
            if (e.target !== passwordInput && !passwordRequirements.contains(e.target)) {
                passwordRequirements.style.display = "none";
            }
        });
        
        // عرض المتطلبات دائمًا عند الكتابة في حقل كلمة المرور
        passwordInput.addEventListener("input", function() {
            passwordRequirements.style.display = "block";
            
            const value = this.value;
            
            // التحقق من الطول
            if (value.length >= 8) {
                lengthReq.classList.add("valid");
            } else {
                lengthReq.classList.remove("valid");
            }
            
            // التحقق من الحروف الكبيرة
            if (/[A-Z]/.test(value)) {
                uppercaseReq.classList.add("valid");
            } else {
                uppercaseReq.classList.remove("valid");
            }
            
            // التحقق من الحروف الصغيرة
            if (/[a-z]/.test(value)) {
                lowercaseReq.classList.add("valid");
            } else {
                lowercaseReq.classList.remove("valid");
            }
            
            // التحقق من الأرقام
            if (/[0-9]/.test(value)) {
                numberReq.classList.add("valid");
            } else {
                numberReq.classList.remove("valid");
            }
            
            // التحقق من الرموز الخاصة
            if (/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(value)) {
                specialReq.classList.add("valid");
            } else {
                specialReq.classList.remove("valid");
            }
        });
    }
    
    // File Upload
    const fileInputs = document.querySelectorAll(".file-upload-input");
    
    fileInputs.forEach(input => {
        input.addEventListener("change", function() {
            const fileName = this.nextElementSibling;
            
            if (this.files.length > 0) {
                fileName.textContent = this.files[0].name;
                
                // Preview image if needed
                if (this.id === "profileImage" && this.files[0].type.startsWith("image/")) {
                    const reader = new FileReader();
                    reader.onload = function(e) {
                        // You can add image preview here if needed
                        // const preview = document.createElement('img');
                        // preview.src = e.target.result;
                        // document.querySelector('.preview-container').appendChild(preview);
                    };
                    reader.readAsDataURL(this.files[0]);
                }
            } else {
                fileName.textContent = "No File Chosen";
            }
        });
    });
    
    // Mobile Menu Toggle
    const menuToggle = document.querySelector(".menu-toggle");
    
    if (menuToggle) {
        menuToggle.addEventListener("click", function() {
            // Create mobile menu if it doesn't exist
            if (!document.querySelector(".mobile-menu")) {
                createMobileMenu();
            }
            
            const mobileMenu = document.querySelector(".mobile-menu");
            mobileMenu.classList.add("active");
        });
    }
    
    // Testimonial Slider
    const testimonialCards = document.querySelector(".testimonial-cards");
    const prevBtn = document.querySelector(".slider-arrow.prev");
    const nextBtn = document.querySelector(".slider-arrow.next");
    
    if (testimonialCards && prevBtn && nextBtn) {
        let currentIndex = 0;
        const totalSlides = document.querySelectorAll(".testimonial-card").length;
        
        // Clone the testimonial cards for infinite loop
        const cloneCards = () => {
            const cards = document.querySelectorAll(".testimonial-card");
            cards.forEach(card => {
                const clone = card.cloneNode(true);
                testimonialCards.appendChild(clone);
            });
        };
        
        // Initialize slider
        const initSlider = () => {
            // Set width for each card
            const cards = document.querySelectorAll(".testimonial-card");
            const cardWidth = 100 / cards.length;
            cards.forEach(card => {
                card.style.flex = `0 0 ${cardWidth}%`;
            });
            
            // Set width for the slider
            testimonialCards.style.width = `${cards.length * 100}%`;
        };
        
        // Move to slide
        const moveToSlide = (index) => {
            const cards = document.querySelectorAll(".testimonial-card");
            const cardWidth = 100 / cards.length;
            testimonialCards.style.transform = `translateX(-${index * cardWidth}%)`;
            currentIndex = index;
        };
        
        // Next slide
        nextBtn.addEventListener("click", () => {
            const cards = document.querySelectorAll(".testimonial-card");
            if (currentIndex === cards.length - 1) {
                // Reset to first slide instantly without animation
                testimonialCards.style.transition = "none";
                moveToSlide(0);
                setTimeout(() => {
                    testimonialCards.style.transition = "transform 0.5s ease";
                }, 10);
            } else {
                moveToSlide(currentIndex + 1);
            }
        });
        
        // Previous slide
        prevBtn.addEventListener("click", () => {
            const cards = document.querySelectorAll(".testimonial-card");
            if (currentIndex === 0) {
                // Go to last slide instantly without animation
                testimonialCards.style.transition = "none";
                moveToSlide(cards.length - 1);
                setTimeout(() => {
                    testimonialCards.style.transition = "transform 0.5s ease";
                }, 10);
            } else {
                moveToSlide(currentIndex - 1);
            }
        });
        
        // Tab buttons
        const tabBtns = document.querySelectorAll(".tab-btn");
        tabBtns.forEach(btn => {
            btn.addEventListener("click", () => {
                tabBtns.forEach(b => b.classList.remove("active"));
                btn.classList.add("active");
                
                // Here you would typically load different testimonials
                // For demo purposes, we'll just reset the slider
                moveToSlide(0);
            });
        });
        
        // Form validation
        const signupForm = document.getElementById("signupForm");
        if (signupForm) {
            signupForm.addEventListener("submit", function(e) {
                e.preventDefault();
                
                const username = document.getElementById("username").value;
                const email = document.getElementById("email").value;
                const password = document.getElementById("password").value;
                const confirmPassword = document.getElementById("confirmPassword").value;
                const age = document.getElementById("age").value;
                const height = document.getElementById("height").value;
                const weight = document.getElementById("weight").value;
                const position = document.getElementById("position").value;
                
                // Validate form
                let isValid = true;
                let errorMessage = "";
                
                // Check required fields
                if (!username || !email || !password || !confirmPassword || !age || !height || !weight || !position) {
                    errorMessage = "Please fill in all required fields";
                    isValid = false;
                }
                
                // Validate email format
                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                if (isValid && !emailRegex.test(email)) {
                    errorMessage = "Please enter a valid email address";
                    isValid = false;
                }
                
                // Validate password match
                if (isValid && password !== confirmPassword) {
                    errorMessage = "Passwords do not match";
                    isValid = false;
                }
                
                // Validate password strength - IMPROVED CHECK
                const hasLength = password.length >= 8;
                const hasUppercase = /[A-Z]/.test(password);
                const hasLowercase = /[a-z]/.test(password);
                const hasNumber = /[0-9]/.test(password);
                const hasSpecial = /[!@#$%^&*()_+\-=[\]{};':"\\|,.<>\/?]/.test(password);
                
                if (isValid && !(hasLength && hasUppercase && hasLowercase && hasNumber && hasSpecial)) {
                    errorMessage = "Password must meet all requirements:\n";
                    if (!hasLength) errorMessage += "- At least 8 characters\n";
                    if (!hasUppercase) errorMessage += "- At least 1 uppercase letter\n";
                    if (!hasLowercase) errorMessage += "- At least 1 lowercase letter\n";
                    if (!hasNumber) errorMessage += "- At least 1 number\n";
                    if (!hasSpecial) errorMessage += "- At least 1 special character\n";
                    isValid = false;
                }
                
                // Validate age
                if (isValid && (age < 10 || age > 50)) {
                    errorMessage = "Age must be between 10 and 50";
                    isValid = false;
                }
                
                // Validate height
                if (isValid && (height < 120 || height > 220)) {
                    errorMessage = "Height must be between 120 and 220 cm";
                    isValid = false;
                }
                
                // Validate weight
                if (isValid && (weight < 30 || weight > 150)) {
                    errorMessage = "Weight must be between 30 and 150 kg";
                    isValid = false;
                }
                
                // If validation fails, show error
                if (!isValid) {
                    alert(errorMessage);
                    return;
                }
                
                // If all validations pass
                console.log("Signup attempt:", {
                    username,
                    email,
                    password,
                    age,
                    height,
                    weight,
                    position
                });
               window.location.href="home player.html";
            });
            
        }
        
        // Initialize
        cloneCards();
        initSlider();
    }
    
    // Function to create mobile menu
    function createMobileMenu() {
        const mobileMenu = document.createElement("div");
        mobileMenu.className = "mobile-menu";
        
        mobileMenu.innerHTML = `
            <div class="mobile-menu-header">
                <div class="logo">
                    <!-- ضع مسار صورة اللوجو الخاصة بك هنا -->
                    <img src="your-logo.png" alt="Glory Scout">
                </div>
                <button class="mobile-menu-close">
                    <i class="fas fa-times"></i>
                </button>
            </div>
            
            <nav class="mobile-nav-links">
                <a href="index.html">Home</a>
                <a href="#" class="active">Player</a>
                <a href="#">Coaches</a>
                <a href="#">About Us</a>
            </nav>
            
            <div class="mobile-auth-buttons">
                <a href="#" class="mobile-player-btn">For Players</a>
                <a href="signup-coach.html" class="mobile-coach-btn">For Coaches</a>
                <a href="index.html" class="mobile-login-btn">Login</a>
            </div>
        `;
        
        document.body.appendChild(mobileMenu);
        
        // Close mobile menu
        const closeBtn = mobileMenu.querySelector(".mobile-menu-close");
        closeBtn.addEventListener("click", function() {
            mobileMenu.classList.remove("active");
        });
    }
});