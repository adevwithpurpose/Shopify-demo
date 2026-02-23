/**
 * VELO Sticky ATC Controller
 * Shows the sticky bar when the main ATC button is not in sight.
 */
document.addEventListener('DOMContentLoaded', function () {
    const stickyAtc = document.querySelector('.velo-sticky-atc');
    const mainAtcBtn = document.querySelector('.velo-atc-btn');

    if (!stickyAtc || !mainAtcBtn) return;

    // Function to handle the actual ATC action when sticky button is clicked
    const stickyBtn = stickyAtc.querySelector('.velo-sticky-atc-btn');
    if (stickyBtn) {
        stickyBtn.addEventListener('click', function () {
            // Trigger the main ATC button click
            mainAtcBtn.click();
        });
    }

    // Observer to show/hide sticky bar
    if ('IntersectionObserver' in window) {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    // Main ATC is visible, hide sticky
                    stickyAtc.classList.remove('velo-sticky-atc--visible');
                } else {
                    // Main ATC is hidden (scrolled past), show sticky
                    // But only if we are below the main ATC (not above it at page top)
                    if (window.scrollY > entry.boundingClientRect.top + window.scrollY) {
                        stickyAtc.classList.add('velo-sticky-atc--visible');
                    } else {
                        stickyAtc.classList.remove('velo-sticky-atc--visible');
                    }
                }
            });
        }, {
            threshold: 0,
            rootMargin: '0px'
        });

        observer.observe(mainAtcBtn);
    } else {
        // Fallback for older browsers
        window.addEventListener('scroll', function () {
            const mainAtcRect = mainAtcBtn.getBoundingClientRect();
            if (mainAtcRect.bottom < 0) {
                stickyAtc.classList.add('velo-sticky-atc--visible');
            } else {
                stickyAtc.classList.remove('velo-sticky-atc--visible');
            }
        });
    }
});
