// Inside Mobile-Menu.js

import { logout } from "../login.js";
import { SetupUI } from "./SetupUI.js";

export function createMobileMenu(type = null) {
    // Check if the mobile menu already exists and remove it
    const existingMenu = document.querySelector('.mobile-menu');
    if (existingMenu) {
        existingMenu.remove();
    }

    // Create a new mobile menu
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

        <div class="mobile-auth-buttons" id="mobileAuth"></div>
    `;

    document.body.appendChild(mobileMenu);

    const closeBtn = mobileMenu.querySelector('.mobile-menu-close');
    closeBtn.addEventListener('click', () => {
        mobileMenu.classList.remove('active');
    });

    const mobileAuth = document.getElementById("mobileAuth");
    const token = localStorage.getItem("token");

    // Update the auth button based on the login state
    if (token) {
        mobileAuth.innerHTML = `<a href="#" id="mobileLogoutBtn" class="logout-btn">Logout</a>`;
    } else {
        if (type === 'login') {
            mobileAuth.innerHTML = `<a href="./login.html" class="mobile-signup-btn">Login</a>`;
        } else if (type === 'signup') {
            mobileAuth.innerHTML = `<a href="./create-account.html" class="mobile-signup-btn">Sign Up</a>`;
        }
    }

    if (!token) SetupUI(); // Ensure main UI is updated if no token

    // Attach logout functionality to the mobile logout button
    const mobileLogoutBtn = document.getElementById("mobileLogoutBtn");
    if (mobileLogoutBtn) {
        mobileLogoutBtn.addEventListener('click', () => {
            logout();
            mobileMenu.classList.remove('active');
            createMobileMenu("signup"); // Recreate mobile menu after logout
        });
    }
}
