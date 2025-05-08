import { logout } from "./Logout.js";
import { SetupUI } from "./SetupUI.js";

export function createMobileMenu(type = null) {
    // Remove existing mobile menu if any
    const existingMenu = document.querySelector('.mobile-menu');
    if (existingMenu) {
        existingMenu.remove();
    }

    // Create mobile menu wrapper
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
            <a href="./index.html">Home</a>
            <a href="./player-home.html">Players</a>
            <a href="./coach-home.html">Coaches</a>
            <a href="./about-us.html">About Us</a>
        </nav>

        <div class="mobile-auth-buttons" id="mobileAuth"></div>
    `;

    document.body.appendChild(mobileMenu);

    // Close button handler
    const closeBtn = mobileMenu.querySelector('.mobile-menu-close');
    closeBtn.addEventListener('click', () => {
        mobileMenu.classList.remove('active');
    });

    const mobileAuth = document.getElementById("mobileAuth");
    const token = localStorage.getItem("token");

    if (token) {
        // Show logout if token exists
        mobileAuth.innerHTML = `<a href="#" id="mobileLogoutBtn" class="logout-btn">Logout</a>`;
    } else {
        // Show login or signup depending on page
        if (type === "login") {
            mobileAuth.innerHTML = `<a href="./login.html" class="mobile-login-btn">Login</a>`;
        } else {
            mobileAuth.innerHTML = `<a href="./create-account.html" class="mobile-signup-btn">Sign Up</a>`;
        }
    }

    // Attach logout logic
    const mobileLogoutBtn = document.getElementById("mobileLogoutBtn");
    if (mobileLogoutBtn) {
        mobileLogoutBtn.addEventListener('click', () => {
            logout();
            mobileMenu.classList.remove('active');
        });
    }

    // Optional: Refresh main UI elements
    SetupUI();
}
