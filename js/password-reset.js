document.addEventListener('DOMContentLoaded', function() {
    // Profile picture upload preview
    const profileUpload = document.getElementById('profile-upload');
    const profileImage = document.getElementById('profile-image');
    const profilePicture = document.querySelector('.profile-picture');
    
    profileUpload.addEventListener('change', function(event) {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            
            reader.onload = function(e) {
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
    
    // Form submission with validation
    const editProfileForm = document.getElementById('edit-profile-form');
    
    editProfileForm.addEventListener('submit', function(event) {
        event.preventDefault();
        
        // Basic validation
        const username = document.getElementById('username').value;
        const email = document.getElementById('email').value;
        
        if (!username) {
            showError('Username is required');
            return;
        }
        
        if (!validateEmail(email)) {
            showError('Please enter a valid email address');
            return;
        }
        
        // Show loading state
        const submitBtn = document.querySelector('.submit-btn');
        const originalText = submitBtn.innerHTML;
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Saving...';
        submitBtn.disabled = true;
        
        // Simulate API call
        setTimeout(() => {
            // Get form data
            const formData = new FormData(editProfileForm);
            const profileData = {};
            
            for (const [key, value] of formData.entries()) {
                profileData[key] = value;
            }
            
            // In a real application, you would send this data to a server
            console.log('Profile data to be saved:', profileData);
            
            // Reset button and show success
            submitBtn.innerHTML = originalText;
            submitBtn.disabled = false;
            
            showSuccess('Profile updated successfully!');
        }, 1500);
    });
    
    // Helper functions
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
        // Remove any existing alerts
        const existingAlerts = document.querySelectorAll('.alert');
        existingAlerts.forEach(el => el.remove());
        
        // Add the new alert at the top of the form
        const form = document.getElementById('edit-profile-form');
        form.insertBefore(alert, form.firstChild);
        
        // Auto remove after 3 seconds
        setTimeout(() => {
            alert.style.opacity = '0';
            setTimeout(() => {
                alert.remove();
            }, 300);
        }, 3000);
    }
    
    // Add this CSS for alerts
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
document.addEventListener("DOMContentLoaded", () => {
  // Toggle password visibility
  const visibilityIcon = document.querySelector(".visibility-icon")
  if (visibilityIcon) {
    visibilityIcon.addEventListener("click", function () {
      const input = this.parentElement.querySelector("input")
      const icon = this.querySelector("i")

      if (input.type === "password") {
        input.type = "text"
        icon.classList.remove("fa-eye")
        icon.classList.add("fa-eye-slash")
      } else {
        input.type = "password"
        icon.classList.remove("fa-eye-slash")
        icon.classList.add("fa-eye")
      }
    })
  }

  // Form submission
  const resetForm = document.querySelector(".reset-form")
  if (resetForm) {
    resetForm.addEventListener("submit", function (e) {
      e.preventDefault()

      const email = this.querySelector('input[type="email"]').value
      const remember = document.getElementById("remember").checked

      // Validate email
      if (!validateEmail(email)) {
        showNotification("Please enter a valid email address", "error")
        return
      }

      // Show loading state on button
      const submitBtn = document.querySelector(".reset-btn")
      const originalText = submitBtn.innerHTML
      submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...'
      submitBtn.disabled = true

      // Simulate sending reset link (wait 1.5 seconds)
      setTimeout(() => {
        // Show success notification
        showNotification("Password reset link sent to your email", "success")

        // Store email in localStorage to use on verification page
        localStorage.setItem("resetEmail", email)

        // Redirect to verification page after a short delay
        setTimeout(() => {
          window.location.href = "../html/verify.html"
        }, 1000)
      }, 1500)

      // You would typically send this data to your server
      console.log("Form submitted:", { email, remember })
    })
  }

  // Validate email function
  function validateEmail(email) {
    const re =
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    return re.test(String(email).toLowerCase())
  }

  // Show notification function
  function showNotification(message, type) {
    // Check if notification already exists and remove it
    const existingNotification = document.querySelector(".notification")
    if (existingNotification) {
      existingNotification.remove()
    }

    // Create notification element
    const notification = document.createElement("div")
    notification.className = `notification ${type}`
    notification.textContent = message

    // Add to body
    document.body.appendChild(notification)

    // Show notification
    setTimeout(() => {
      notification.classList.add("show")
    }, 10)

    // Hide and remove notification after 3 seconds
    setTimeout(() => {
      notification.classList.remove("show")
      setTimeout(() => {
        notification.remove()
      }, 300)
    }, 3000)
  }

  // Add notification styles
  const style = document.createElement("style")
  style.textContent = `
        .notification {
            position: fixed;
            bottom: 20px;
            left: 50%;
            transform: translateX(-50%) translateY(100px);
            padding: 12px 24px;
            border-radius: 4px;
            color: white;
            font-weight: 500;
            z-index: 1000;
            opacity: 0;
            transition: transform 0.3s, opacity 0.3s;
        }
        
        .notification.show {
            transform: translateX(-50%) translateY(0);
            opacity: 1;
        }
        
        .notification.success {
            background-color: #4ade80;
        }
        
        .notification.error {
            background-color: #ef4444;
        }
    `
  document.head.appendChild(style)

  // Social login buttons
  const socialButtons = document.querySelectorAll(".social-btn")
  socialButtons.forEach((button) => {
    button.addEventListener("click", function (e) {
      e.preventDefault()
      const platform = this.classList.contains("google")
        ? "Google"
        : this.classList.contains("facebook")
          ? "Facebook"
          : "Apple"
      showNotification(`Continuing with ${platform}...`, "success")
    })
  })

  // Add animation to the reset card
  const resetCard = document.querySelector(".reset-card")
  if (resetCard) {
    resetCard.style.opacity = "0"
    resetCard.style.transform = "translateY(20px)"
    resetCard.style.transition = "opacity 0.5s ease, transform 0.5s ease"

    setTimeout(() => {
      resetCard.style.opacity = "1"
      resetCard.style.transform = "translateY(0)"
    }, 100)
  }
})
