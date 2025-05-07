// Setup UI based on login status
export function SetupUI() {
    const token = localStorage.getItem("token");

    const loginBtn = document.getElementById("loginBtn");
    const signupBtn = document.getElementById("signupBtn");
    const logoutBtn = document.getElementById("logoutBtn");

    if (token) {
        if (loginBtn) loginBtn.classList.add('hidden');
        if (signupBtn) signupBtn.classList.add('hidden');
        if (logoutBtn) {
            logoutBtn.classList.remove('hidden');
            logoutBtn.style.display = 'inline-block';
        }
    } else {
        if (loginBtn) loginBtn.classList.remove('hidden');
        if (signupBtn) signupBtn.classList.remove('hidden');
        if (logoutBtn) {
            logoutBtn.classList.add('hidden');
            logoutBtn.style.display = 'none';
        }
    }
}