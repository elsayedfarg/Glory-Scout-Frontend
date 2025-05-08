import { initTestimonialSlider } from "./Common/Testimonial-Slider.js";
import { createMobileMenu } from "./Common/Mobile-Menu.js";
import { MobileMenuToggle } from "./Common/Mobile-Menu-Toggle.js"
import { SetupUI } from "./Common/SetupUI.js";
import { logout } from "./Common/Logout.js";

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
        signupForm.addEventListener('submit', async function (e) {
            e.preventDefault();

            const fields = {
                username: document.getElementById('username'),
                email: document.getElementById('email'),
                password: document.getElementById('password'),
                phone: document.getElementById("phone"),
                confirmPassword: document.getElementById('confirmPassword'),
                specialization: document.getElementById('specialization'),
                experience: document.getElementById('experience'),
                CurrentClubName: document.getElementById('clubName'),
                coachingSpecialty: document.getElementById('coachingSpecialty'),
                profileImage: document.getElementById("profileImage")
            }

            // Clear old error styles/messages
            document.querySelectorAll(".error-message").forEach(el => el.remove());
            Object.values(fields).forEach(f => f.classList.remove("input-error"));

            const getValue = (f) => f?.value?.trim();
            const values = {
                username: getValue(fields.username),
                email: getValue(fields.email),
                password: getValue(fields.password),
                phone: getValue(fields.phone),
                password: getValue(fields.password),
                confirmPassword: fields.confirmPassword.value,
                specialization: getValue(fields.specialization),
                experience: parseInt(fields.experience.value),
                CurrentClubName: getValue(fields.CurrentClubName),
                coachingSpecialty: getValue(fields.coachingSpecialty),
                profileImage: fields.profileImage.files[0]
            };

            if (
                !values.username ||
                !values.email ||
                !values.password ||
                !values.confirmPassword ||
                !values.specialization ||
                !values.experience ||
                !values.CurrentClubName ||
                !values.coachingSpecialty
            ) {
                alert('Please fill in all required fields');
                return;
            }

            if (values.password !== values.confirmPassword) {
                alert('Passwords do not match');
                return;
            }

            if (values.password.length < 8) {
                alert('Password must be at least 8 characters long');
                return;
            }


            const formData = new FormData();
            formData.append("UserName", values.username);
            formData.append("Email", values.email);
            formData.append("PhoneNumber", values.phone);
            formData.append("Password", values.password);
            formData.append("Specialization", values.specialization);
            formData.append("Experience", values.experience);
            formData.append("CurrentClubName", values.CurrentClubName);
            formData.append("CoachingSpecialty", values.coachingSpecialty);
            formData.append("profilePhoto", values.profileImage);

            const submitBtn = signupForm.querySelector('button[type="submit"]');
            const originalText = submitBtn.innerHTML;
            submitBtn.disabled = true;
            submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Registering...';

            try {
                const res = await axios.post("http://glory-scout.tryasp.net/api/Auth/register-coach", formData, {
                    headers: { "Content-Type": "multipart/form-data" }
                });

                const token = res.data.token;
                if (token) localStorage.setItem("token", token);
                localStorage.setItem("role", res.data.role);

                alert("Registration successful!");
                window.location.href = "./coach-home.html";
            } catch (error) {
                if (error.response) {
                    const { data } = error.response;

                    console.log("Error response from server:", data); // <-- Add this for debugging

                    if (data.errors) {
                        Object.entries(data.errors).forEach(([key, messages]) => {
                            alert(`${key}: ${messages.join(" ")}`);
                        });
                    } else if (data.message) {
                        alert(data.message);
                    } else if (typeof data === "string") {
                        alert(data); // in case the backend just returns plain text
                    } else {
                        alert("Email or username might already be used.");
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
    initTestimonialSlider({
        defaultActiveTab: 2
    });
});
