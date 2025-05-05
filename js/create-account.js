document.addEventListener('DOMContentLoaded', function () {
    // Profile picture upload preview
    const profileUpload = document.getElementById('profile-upload');
    const profileImage = document.getElementById('profile-image');
    const profilePicture = document.querySelector('.profile-picture');

    if (profileUpload && profileImage && profilePicture) {
        profileUpload.addEventListener('change', function (event) {
            const file = event.target.files[0];
            if (file) {
                const reader = new FileReader();

                reader.onload = function (e) {
                    profileImage.src = e.target.result;

                    // Add a subtle animation
                    profilePicture.style.transform = 'scale(1.05)';
                    setTimeout(() => {
                        profilePicture.style.transform = 'scale(1)';
                    }, 300);
                };

                reader.readAsDataURL(file);
            }
        });
    }

    // Form submission with validation
    const editProfileForm = document.getElementById('edit-profile-form');

    if (editProfileForm) {
        editProfileForm.addEventListener('submit', function (event) {
            event.preventDefault();

            const usernameInput = document.getElementById('username');
            const emailInput = document.getElementById('email');

            const username = usernameInput?.value || '';
            const email = emailInput?.value || '';

            if (!username) {
                showError('Username is required');
                return;
            }

            if (!validateEmail(email)) {
                showError('Please enter a valid email address');
                return;
            }

            const submitBtn = document.querySelector('.submit-btn');
            const originalText = submitBtn.innerHTML;
            submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Saving...';
            submitBtn.disabled = true;

            setTimeout(() => {
                const formData = new FormData(editProfileForm);
                const profileData = {};
                for (const [key, value] of formData.entries()) {
                    profileData[key] = value;
                }

                console.log('Profile data to be saved:', profileData);

                submitBtn.innerHTML = originalText;
                submitBtn.disabled = false;

                showSuccess('Profile updated successfully!');
            }, 1500);
        });
    }

    function validateEmail(email) {
        const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return re.test(String(email).toLowerCase());
    }

    function showError(message) {
        const alert = document.createElement('div');
        alert.className = 'alert error';
        alert.innerHTML = `<i class="fas fa-exclamation-circle"></i> ${message}`;
        insertAlert(alert);
    }

    function showSuccess(message) {
        const alert = document.createElement('div');
        alert.className = 'alert success';
        alert.innerHTML = `<i class="fas fa-check-circle"></i> ${message}`;
        insertAlert(alert);
    }

    function insertAlert(alert) {
        const existingAlerts = document.querySelectorAll('.alert');
        existingAlerts.forEach(el => el.remove());

        const form = document.getElementById('edit-profile-form');
        if (form) {
            form.insertBefore(alert, form.firstChild);
        }

        setTimeout(() => {
            alert.style.opacity = '0';
            setTimeout(() => {
                alert.remove();
            }, 300);
        }, 3000);
    }

    // Add alert styles
    const style = document.createElement('style');
    style.textContent = `
        .alert {
            padding: 12px 15px;
            margin-bottom: 20px;
            border-radius: 6px;
            display: flex;
            align-items: center;
            opacity: 1;
            transition: opacity 0.3s;
        }
        .alert i {
            margin-right: 10px;
            font-size: 18px;
        }
        .alert.error {
            background-color: rgba(220, 38, 38, 0.1);
            border-left: 4px solid #dc2626;
            color: #ef4444;
        }
        .alert.success {
            background-color: rgba(74, 222, 128, 0.1);
            border-left: 4px solid #4ade80;
            color: #4ade80;
        }
    `;
    document.head.appendChild(style);
});
