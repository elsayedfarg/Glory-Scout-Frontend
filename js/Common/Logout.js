import { SetupUI } from "./SetupUI.js";
import { createMobileMenu } from "./Mobile-Menu.js";

export function logout() {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    alert("Logged out successfully");

    const emailSpan = document.getElementById('contactEmail');
    if (emailSpan) {
        emailSpan.textContent = '';
    }

    const currentPage = window.location.pathname;

    if (currentPage.includes("player-home")) {
        const logoImg = document.querySelector(".logo img");
        if (logoImg) {
            logoImg.src = "";
        }
    }

    const menuType = currentPage.includes("signup") ? "login" : "signup";

    // Redirect to login page
    window.location = "./login.html";

    SetupUI();
    createMobileMenu(menuType);
}