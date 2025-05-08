import { initTestimonialSlider } from './Common/Testimonial-Slider.js';
import { createMobileMenu } from './Common/Mobile-Menu.js';
import { logout } from './Common/Logout.js';
import { SetupUI } from './Common/SetupUI.js';
import { MobileMenuToggle } from './Common/Mobile-Menu-Toggle.js';

document.addEventListener("DOMContentLoaded", function () {
    // ========== Password Toggle ==========
    document.querySelectorAll(".toggle-password").forEach(button => {
        button.addEventListener("click", function () {
            const input = this.previousElementSibling;
            const type = input.type === "password" ? "text" : "password";
            input.type = type;
            this.classList.toggle("fa-eye");
            this.classList.toggle("fa-eye-slash");
        });
    });

    // ========== Image Upload Preview ==========
    const fileInput = document.getElementById("profileImage");
    const fileNameDisplay = fileInput?.nextElementSibling;

    fileInput?.addEventListener("change", function () {
        const file = this.files[0];
        if (file) {
            fileNameDisplay.textContent = file.name;
            if (file.type.startsWith("image/")) {
                const reader = new FileReader();
                reader.onload = function (e) {
                    let preview = document.querySelector(".image-preview");
                    if (!preview) {
                        preview = document.createElement("img");
                        preview.className = "image-preview";
                        preview.style.maxWidth = "200px";
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
            document.querySelector(".image-preview")?.remove();
        }
    });

    // ========== Form Submission ==========
    const signupForm = document.getElementById("signupForm");
    if (signupForm) {
        signupForm.addEventListener("submit", async function (e) {
            e.preventDefault();

            const fields = {
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

            // Clear old error styles/messages
            document.querySelectorAll(".error-message").forEach(el => el.remove());
            Object.values(fields).forEach(f => f.classList.remove("input-error"));

            const getValue = (f) => f?.value?.trim();
            const values = {
                username: getValue(fields.username),
                email: getValue(fields.email),
                phone: getValue(fields.phone),
                password: fields.password.value,
                confirmPassword: fields.confirmPassword.value,
                age: parseInt(fields.age.value),
                height: parseInt(fields.height.value),
                weight: parseInt(fields.weight.value),
                position: getValue(fields.position),
                profileImage: fields.profileImage.files[0]
            };

            const showError = (field, message) => {
                alert(message);
            };

            let hasError = false;

            if (!values.username) { alert("Username is required"); hasError = true; }
            if (!values.email) { alert("Email is required"); hasError = true; }
            else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email)) { showError(fields.email, "Invalid email format"); hasError = true; }

            if (!values.phone) { showError(fields.phone, "Phone number is required"); hasError = true; }
            else if (!/^[0-9]{10,15}$/.test(values.phone)) { showError(fields.phone, "Phone number must be 10–15 digits"); hasError = true; }

            if (!values.password) { showError(fields.password, "Password is required"); hasError = true; }
            else {
                const pwErrors = [];
                if (values.password.length < 8) pwErrors.push("8+ characters");
                if (!/[A-Z]/.test(values.password)) pwErrors.push("1 uppercase");
                if (!/[a-z]/.test(values.password)) pwErrors.push("1 lowercase");
                if (!/[0-9]/.test(values.password)) pwErrors.push("1 number");
                if (!/[!@#$%^&*]/.test(values.password)) pwErrors.push("1 special char");
                if (pwErrors.length > 0) {
                    showError(fields.password, `Password must have: ${pwErrors.join(", ")}`);
                    hasError = true;
                }
            }

            if (!values.confirmPassword) {
                showError(fields.confirmPassword, "Confirm your password");
                hasError = true;
            } else if (values.password !== values.confirmPassword) {
                showError(fields.confirmPassword, "Passwords do not match");
                hasError = true;
            }

            if (isNaN(values.age) || values.age < 10 || values.age > 50) {
                alert("Age must be between 10–50");
                hasError = true;
            }

            if (isNaN(values.height) || values.height < 120 || values.height > 220) {
                showError(fields.height, "Height must be 120–220 cm");
                hasError = true;
            }

            if (isNaN(values.weight) || values.weight < 30 || values.weight > 150) {
                alert("Weight must be 30–150 kg");
                hasError = true;
            }

            if (!values.position) {
                showError(fields.position, "Position is required");
                hasError = true;
            }

            if (!values.profileImage || !values.profileImage.type.startsWith("image/")) {
                showError(fields.profileImage, "Upload a valid image file");
                hasError = true;
            }

            if (hasError) return;

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

            const submitBtn = signupForm.querySelector('button[type="submit"]');
            const originalText = submitBtn.innerHTML;
            submitBtn.disabled = true;
            submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Registering...';

            try {
                const res = await axios.post("http://glory-scout.tryasp.net/api/Auth/register-player", formData, {
                    headers: { "Content-Type": "multipart/form-data" }
                });

                const token = res.data.token;
                if (token) localStorage.setItem("token", token);
                localStorage.setItem("role", res.data.role);

                alert("Registration successful!");
                window.location.href = "./player-home.html";
            } catch (error) {
                if (error.response) {
                    const { data } = error.response;

                    if (data.errors) {
                        const errors = data.errors;
                        Object.entries(errors).forEach(([key, messages]) => {
                            alert(`${key}: ${messages.join(" ")}`);
                        });

                    } else if (data.message) {
                        alert(data.message);
                    } else {
                        alert("Username and email must be unique (must not be used before)");
                    }
                } else {
                    alert("Network error or server not reachable.");
                }

            } finally {
                submitBtn.disabled = false;
                submitBtn.innerHTML = originalText;
            }
        });
    }

    MobileMenuToggle();
    createMobileMenu("login");
    SetupUI();
    document.getElementById("logoutBtn")?.addEventListener("click", logout);
    initTestimonialSlider({ defaultActiveTab: 1 });
});
