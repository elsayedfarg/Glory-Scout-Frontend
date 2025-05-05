document.addEventListener("DOMContentLoaded", function () {
    // Password Toggle
    const togglePasswordButtons = document.querySelectorAll(".toggle-password");
    togglePasswordButtons.forEach(button => {
        button.addEventListener("click", function () {
            const passwordInput = this.previousElementSibling;
            const type = passwordInput.getAttribute("type") === "password" ? "text" : "password";
            passwordInput.setAttribute("type", type);
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
        passwordInput.addEventListener("focus", function () {
            passwordRequirements.style.display = "block";
        });

        passwordRequirements.addEventListener("click", function (e) {
            e.stopPropagation();
        });

        document.addEventListener("click", function (e) {
            if (e.target !== passwordInput && !passwordRequirements.contains(e.target)) {
                passwordRequirements.style.display = "none";
            }
        });

        passwordInput.addEventListener("input", function () {
            passwordRequirements.style.display = "block";
            const value = this.value;
            lengthReq.classList.toggle("valid", value.length >= 8);
            uppercaseReq.classList.toggle("valid", /[A-Z]/.test(value));
            lowercaseReq.classList.toggle("valid", /[a-z]/.test(value));
            numberReq.classList.toggle("valid", /[0-9]/.test(value));
            specialReq.classList.toggle("valid", /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(value));
        });
    }

    // File Upload and Image Preview
    const fileInput = document.getElementById("profileImage");
    const fileNameDisplay = fileInput?.nextElementSibling;

    if (fileInput) {
        fileInput.addEventListener("change", function () {
            if (this.files.length > 0) {
                const file = this.files[0];
                fileNameDisplay.textContent = file.name;

                if (file.type.startsWith("image/")) {
                    const reader = new FileReader();
                    reader.onload = function (e) {
                        let preview = document.querySelector(".image-preview");
                        if (!preview) {
                            preview = document.createElement("img");
                            preview.className = "image-preview";
                            preview.style.maxWidth = "200px";
                            preview.style.maxHeight = "200px";
                            preview.style.marginTop = "10px";
                            preview.style.borderRadius = "4px";
                            fileInput.parentNode.appendChild(preview);
                        }
                        preview.src = e.target.result;
                    };
                    reader.readAsDataURL(file);
                }
            } else {
                fileNameDisplay.textContent = "No File Chosen";
                const preview = document.querySelector(".image-preview");
                if (preview) preview.remove();
            }
        });
    }

    // Mobile Menu Toggle
    const menuToggle = document.querySelector(".menu-toggle");
    if (menuToggle) {
        menuToggle.addEventListener("click", function () {
            if (!document.querySelector(".mobile-menu")) createMobileMenu();
            document.querySelector(".mobile-menu").classList.add("active");
        });
    }

    // Form validation and submission
    const signupForm = document.getElementById("signupForm");
    if (signupForm) {
        signupForm.addEventListener("submit", async function (e) {
            e.preventDefault();

            const formElements = {
                username: document.getElementById("username"),
                email: document.getElementById("email"),
                phone: document.getElementById("phone"),
                password: document.getElementById("password"),
                confirmPassword: document.getElementById("confirmPassword"),
                age: document.getElementById("age"),
                height: document.getElementById("height"),
                weight: document.getElementById("weight"),
                position: document.getElementById("position"),
                profileImage: document.getElementById("profileImage")
            };

            const values = {
                username: formElements.username.value.trim(),
                email: formElements.email.value.trim(),
                phone: formElements.phone.value.trim(),
                password: formElements.password.value,
                confirmPassword: formElements.confirmPassword.value,
                age: parseInt(formElements.age.value),
                height: parseInt(formElements.height.value),
                weight: parseInt(formElements.weight.value),
                position: formElements.position.value.trim(),
                profileImage: formElements.profileImage.files[0]
            };

            const errors = [];

            if (!values.username) errors.push("Username is required");
            if (!values.email) errors.push("Email is required");
            if (!values.phone) errors.push("Phone number is required");
            if (!values.password) errors.push("Password is required");
            if (!values.confirmPassword) errors.push("Confirm Password is required");
            if (isNaN(values.age)) errors.push("Age is required");
            if (isNaN(values.height)) errors.push("Height is required");
            if (isNaN(values.weight)) errors.push("Weight is required");
            if (!values.position) errors.push("Position is required");
            if (!values.profileImage) errors.push("Profile image is required");

            if (values.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email)) {
                errors.push("Please enter a valid email address");
            }

            if (values.phone && !/^[0-9]{10,15}$/.test(values.phone)) {
                errors.push("Phone number must be 10-15 digits");
            }

            if (values.password && values.password !== values.confirmPassword) {
                errors.push("Passwords do not match");
            }

            if (values.password) {
                const requirements = [];
                if (values.password.length < 8) requirements.push("8+ characters");
                if (!/[A-Z]/.test(values.password)) requirements.push("1 uppercase letter");
                if (!/[a-z]/.test(values.password)) requirements.push("1 lowercase letter");
                if (!/[0-9]/.test(values.password)) requirements.push("1 number");
                if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(values.password)) requirements.push("1 special character");
                if (requirements.length > 0) {
                    errors.push(`Password needs: ${requirements.join(", ")}`);
                }
            }

            if (values.age && (values.age < 10 || values.age > 50)) {
                errors.push("Age must be between 10-50");
            }

            if (values.height && (values.height < 120 || values.height > 220)) {
                errors.push("Height must be between 120-220 cm");
            }

            if (values.weight && (values.weight < 30 || values.weight > 150)) {
                errors.push("Weight must be between 30-150 kg");
            }

            if (values.profileImage && !values.profileImage.type.startsWith("image/")) {
                errors.push("Profile image must be an image file (JPEG, PNG, etc.)");
            }

            if (errors.length > 0) {
                alert("Please fix the following errors:\n\n" + errors.join("\n"));
                return;
            }

            const formData = new FormData();
            formData.append("UserName", values.username);
            formData.append("Email", values.email);
            formData.append("PhoneNumber", values.phone);
            formData.append("Password", values.password);
            formData.append("Age", values.age);
            formData.append("Height", values.height);
            formData.append("Weight", values.weight);
            formData.append("Position", values.position);
            formData.append("profilePhoto", values.profileImage);

            const submitBtn = document.querySelector('button[type="submit"]');
            const originalBtnText = submitBtn.innerHTML;
            submitBtn.disabled = true;
            submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Registering...';

            try {
                const response = await axios.post("http://glory-scout.tryasp.net/api/Auth/register-player", formData, {
                    headers: { "Content-Type": "multipart/form-data" }
                });

                const token = response.data.token;
                if (token) {
                    localStorage.setItem("token", token);
                }

                alert("Registration successful! Redirecting...");
                window.location.href = "./player-home.html";
            } catch (error) {
                let errorMsg = "Registration failed. Please try again.";
                if (error.response) {
                    console.log(error.response);  // Log full error for debugging
                    if (error.response.data?.errors) {
                        errorMsg = "Validation Errors: \n" + Object.values(error.response.data.errors).join('\n');
                    } else if (error.response.data?.message) {
                        errorMsg = error.response.data.message;
                    }
                } else if (error.request) {
                    errorMsg = "No response from server. Please check your network connection.";
                } else {
                    errorMsg = "An unexpected error occurred. Please try again.";
                }
                alert(errorMsg);
            } finally {
                submitBtn.disabled = false;
                submitBtn.innerHTML = originalBtnText;
            }
        });
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
    SetupUI();


    // Testimonial Slider
    const testimonialCards = document.querySelector(".testimonial-cards");
    const prevBtn = document.querySelector(".slider-arrow.prev");
    const nextBtn = document.querySelector(".slider-arrow.next");

    if (testimonialCards && prevBtn && nextBtn) {
        let currentIndex = 0;
        const cloneCards = () => {
            const cards = document.querySelectorAll(".testimonial-card");
            cards.forEach(card => {
                const clone = card.cloneNode(true);
                testimonialCards.appendChild(clone);
            });
        };
        cloneCards();

        const initSlider = () => {
            const cards = document.querySelectorAll(".testimonial-card");
            const cardWidth = 100 / cards.length;
            cards.forEach(card => {
                card.style.flex = `0 0 ${cardWidth}%`;
            });
            testimonialCards.style.width = `${cards.length * 100}%`;
        };
        initSlider();

        const moveToSlide = (index) => {
            const cards = document.querySelectorAll(".testimonial-card");
            const cardWidth = 100 / cards.length;
            testimonialCards.style.transform = `translateX(-${index * cardWidth}%)`;
            currentIndex = index;
        };

        nextBtn.addEventListener("click", () => {
            const cards = document.querySelectorAll(".testimonial-card");
            if (currentIndex === cards.length - 1) {
                testimonialCards.style.transition = "none";
                moveToSlide(0);
                setTimeout(() => {
                    testimonialCards.style.transition = "transform 0.5s ease";
                }, 10);
            } else {
                moveToSlide(currentIndex + 1);
            }
        });

        prevBtn.addEventListener("click", () => {
            const cards = document.querySelectorAll(".testimonial-card");
            if (currentIndex === 0) {
                testimonialCards.style.transition = "none";
                moveToSlide(cards.length - 1);
                setTimeout(() => {
                    testimonialCards.style.transition = "transform 0.5s ease";
                }, 10);
            } else {
                moveToSlide(currentIndex - 1);
            }
        });

        const tabBtns = document.querySelectorAll(".tab-btn");
        tabBtns.forEach(btn => {
            btn.addEventListener("click", () => {
                tabBtns.forEach(b => b.classList.remove("active"));
                btn.classList.add("active");
                moveToSlide(0);
            });
        });
    }
});