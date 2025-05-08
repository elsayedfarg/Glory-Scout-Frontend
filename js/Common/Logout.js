import { SetupUI } from "./SetupUI.js";
import { createMobileMenu } from "./Mobile-Menu.js";

export function logout() {
    // Remove the token from localStorage
    localStorage.removeItem("token");
    localStorage.removeItem("role")
    alert("Logged out successfully");

    // Clear the contact email display
    const emailSpan = document.getElementById('contactEmail');
    if (emailSpan) {
        emailSpan.textContent = '';
    }

    // Determine the current page
    const currentPage = window.location.pathname; // or use document.title

    const menuType = currentPage.includes("signup") ? "login" : "signup";

    SetupUI();
    createMobileMenu(menuType);  // Refresh mobile menu after logout with dynamic value
}
