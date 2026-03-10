/**
 * VELO Animation Controller
 * Handles scroll-triggered reveals for premium sections.
 */
document.addEventListener('DOMContentLoaded', function () {
    const revealElements = document.querySelectorAll('.velo-reveal');

    if ('IntersectionObserver' in window) {
        const revealObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('velo-reveal--visible');
                    // Once animated, no need to observe anymore
                    observer.unobserve(entry.target);
                }
            });
        }, {
            threshold: 0.05, // Trigger slightly earlier
            rootMargin: '0px 0px -20px 0px' // Less margin so it fires sooner on scroll
        });

        revealElements.forEach(el => revealObserver.observe(el));
    } else {
        // Fallback for older browsers
        revealElements.forEach(el => el.classList.add('velo-reveal--visible'));
    }
});
