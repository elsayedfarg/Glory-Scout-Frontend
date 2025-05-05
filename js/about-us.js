document.addEventListener('DOMContentLoaded', function () {
    const header = document.querySelector('header');
    const nav = document.querySelector('nav');

    // Smooth scrolling for all nav links
    const handleAnchorClick = function (e) {
        e.preventDefault();
        const targetId = this.getAttribute('href').substring(1);
        const targetElement = document.getElementById(targetId);

        if (targetElement) {
            window.scrollTo({
                top: targetElement.offsetTop - 80,
                behavior: 'smooth'
            });

            // Close mobile nav if open
            if (window.innerWidth < 768) {
                nav.classList.remove('active');
                const mobileBtn = document.querySelector('.mobile-menu-btn');
                if (mobileBtn) {
                    mobileBtn.classList.remove('active');
                }
            }
        }
    };

    // Attach smooth scroll listener to nav links
    const attachNavListeners = () => {
        nav.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.removeEventListener('click', handleAnchorClick); // avoid duplicate
            anchor.addEventListener('click', handleAnchorClick);
        });
    };

    // Create the mobile menu button if needed
    const createMobileMenu = () => {
        if (!document.querySelector('.mobile-menu-btn')) {
            const mobileMenuBtn = document.createElement('div');
            mobileMenuBtn.className = 'mobile-menu-btn';
            mobileMenuBtn.innerHTML = '<span></span><span></span><span></span>';
            header.insertBefore(mobileMenuBtn, nav);

            mobileMenuBtn.addEventListener('click', function () {
                nav.classList.toggle('active');
                this.classList.toggle('active');
            });
        }
    };

    // Responsive setup
    const setupResponsiveMenu = () => {
        if (window.innerWidth < 768) {
            createMobileMenu();
        }
        attachNavListeners();
    };

    setupResponsiveMenu();

    // Reapply on resize
    window.addEventListener('resize', setupResponsiveMenu);
});
