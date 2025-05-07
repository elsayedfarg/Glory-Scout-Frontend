export function MobileMenuToggle() {
    const menuToggle = document.querySelector('.menu-toggle');
    if (menuToggle) {
        menuToggle.addEventListener('click', function () {
            if (!document.querySelector('.mobile-menu')) {
                createMobileMenu("login");
            }
            document.querySelector('.mobile-menu').classList.toggle('active');
        });
    }
}