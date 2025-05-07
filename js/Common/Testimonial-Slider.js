export function initTestimonialSlider({
    containerSelector = '.testimonial-cards',
    prevBtnSelector = '.slider-arrow.prev',
    nextBtnSelector = '.slider-arrow.next',
    tabBtnSelector = '.tab-btn',
    defaultActiveTab = 0 // ✅ new option
} = {}) {
    const testimonialCards = document.querySelector(containerSelector);
    const prevBtn = document.querySelector(prevBtnSelector);
    const nextBtn = document.querySelector(nextBtnSelector);
    const tabBtns = document.querySelectorAll(tabBtnSelector);

    if (testimonialCards && prevBtn && nextBtn) {
        let currentIndex = 0;

        const cloneCards = () => {
            const cards = testimonialCards.querySelectorAll('.testimonial-card');
            cards.forEach(card => {
                const clone = card.cloneNode(true);
                testimonialCards.appendChild(clone);
            });
        };

        const initSlider = () => {
            const cards = testimonialCards.querySelectorAll('.testimonial-card');
            const cardWidth = 100 / cards.length;
            cards.forEach(card => {
                card.style.flex = `0 0 ${cardWidth}%`;
            });
            testimonialCards.style.width = `${cards.length * 100}%`;
        };

        const moveToSlide = (index) => {
            const cards = testimonialCards.querySelectorAll('.testimonial-card');
            const cardWidth = 100 / cards.length;
            testimonialCards.style.transform = `translateX(-${index * cardWidth}%)`;
            currentIndex = index;
        };

        nextBtn.addEventListener('click', () => {
            const cards = testimonialCards.querySelectorAll('.testimonial-card');
            if (currentIndex === cards.length - 1) {
                testimonialCards.style.transition = 'none';
                moveToSlide(0);
                setTimeout(() => {
                    testimonialCards.style.transition = 'transform 0.5s ease';
                }, 10);
            } else {
                moveToSlide(currentIndex + 1);
            }
        });

        prevBtn.addEventListener('click', () => {
            const cards = testimonialCards.querySelectorAll('.testimonial-card');
            if (currentIndex === 0) {
                testimonialCards.style.transition = 'none';
                moveToSlide(cards.length - 1);
                setTimeout(() => {
                    testimonialCards.style.transition = 'transform 0.5s ease';
                }, 10);
            } else {
                moveToSlide(currentIndex - 1);
            }
        });

        // Setup tab click behavior
        tabBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                tabBtns.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                moveToSlide(0);
            });
        });

        // Set initial active tab (based on user config)
        tabBtns.forEach(btn => btn.classList.remove('active')); // clear all
        if (defaultActiveTab > 0 && defaultActiveTab <= tabBtns.length) {
            tabBtns[defaultActiveTab - 1].classList.add('active');
        }

        cloneCards();
        initSlider();
    }
}
