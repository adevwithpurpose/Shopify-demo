/**
 * VELO Product Hero — Variant Switching & Interactivity
 */
(function () {
    'use strict';

    document.querySelectorAll('.velo-section').forEach(function (section) {
        const sectionId = section.querySelector('[id^="veloBuyBox-"]');
        if (!sectionId) return;

        const id = sectionId.id.replace('veloBuyBox-', '');
        const variantJsonEl = document.getElementById('veloVariantJson-' + id);
        const variantIdInput = document.getElementById('veloVariantId-' + id);
        const priceEl = document.getElementById('veloPrice-' + id);

        if (!variantJsonEl) return;

        let variants;
        try {
            variants = JSON.parse(variantJsonEl.textContent);
        } catch (e) {
            return;
        }

        // --- Variant Switching ---
        const swatchInputs = section.querySelectorAll('.velo-swatch-input');
        swatchInputs.forEach(function (input) {
            input.addEventListener('change', function () {
                // Update swatch visual
                const group = input.closest('.velo-option-values');
                group.querySelectorAll('.velo-swatch').forEach(function (s) {
                    s.classList.remove('velo-swatch--active');
                });
                input.closest('.velo-swatch').classList.add('velo-swatch--active');

                // Update label
                const optionIndex = input.dataset.optionIndex;
                const labelEl = document.getElementById('veloOptionLabel-' + id + '-' + optionIndex);
                if (labelEl) labelEl.textContent = input.value;

                // Find matching variant
                const selectedOptions = [];
                section.querySelectorAll('.velo-option-group').forEach(function (group) {
                    const checked = group.querySelector('.velo-swatch-input:checked');
                    if (checked) selectedOptions.push(checked.value);
                });

                const matchedVariant = variants.find(function (v) {
                    return v.options.every(function (opt, i) {
                        return selectedOptions[i] === opt;
                    });
                });

                if (matchedVariant && variantIdInput) {
                    variantIdInput.value = matchedVariant.id;

                    // Update price
                    if (priceEl) {
                        const formatted = Shopify.formatMoney
                            ? Shopify.formatMoney(matchedVariant.price)
                            : '$' + (matchedVariant.price / 100).toFixed(2);
                        priceEl.textContent = formatted;
                    }

                    // Update compare price & save badge
                    const compareEl = section.querySelector('.velo-price-compare');
                    const saveEl = section.querySelector('.velo-save-badge');
                    if (matchedVariant.compare_at_price && matchedVariant.compare_at_price > matchedVariant.price) {
                        const compareFormatted = Shopify.formatMoney
                            ? Shopify.formatMoney(matchedVariant.compare_at_price)
                            : '$' + (matchedVariant.compare_at_price / 100).toFixed(2);
                        const savings = matchedVariant.compare_at_price - matchedVariant.price;
                        const savingsFormatted = Shopify.formatMoney
                            ? Shopify.formatMoney(savings)
                            : '$' + (savings / 100).toFixed(2);

                        if (compareEl) {
                            compareEl.textContent = compareFormatted;
                            compareEl.style.display = '';
                        }
                        if (saveEl) {
                            saveEl.textContent = 'SAVE ' + savingsFormatted;
                            saveEl.style.display = '';
                        }
                    } else {
                        if (compareEl) compareEl.style.display = 'none';
                        if (saveEl) saveEl.style.display = 'none';
                    }

                    // Update ATC button price
                    const atcPrice = section.querySelector('.velo-atc-price');
                    if (atcPrice) {
                        const priceFormatted = Shopify.formatMoney
                            ? Shopify.formatMoney(matchedVariant.price)
                            : '$' + (matchedVariant.price / 100).toFixed(2);
                        atcPrice.textContent = '— ' + priceFormatted;
                    }

                    // Update ATC availability
                    const atcBtn = section.querySelector('.velo-atc-btn');
                    if (atcBtn) {
                        if (matchedVariant.available) {
                            atcBtn.disabled = false;
                            if (atcBtn.querySelector('.velo-atc-price')) {
                                atcBtn.querySelector('.velo-atc-price').style.display = '';
                            }
                        } else {
                            atcBtn.disabled = true;
                            atcBtn.textContent = 'Sold Out';
                        }
                    }

                    // Update browser URL without reload
                    const url = new URL(window.location);
                    url.searchParams.set('variant', matchedVariant.id);
                    window.history.replaceState({}, '', url);

                    // Highlight matching media (if media IDs correspond)
                    if (matchedVariant.featured_media) {
                        const mediaItems = section.querySelectorAll('.velo-media-item');
                        mediaItems.forEach(function (item) {
                            item.classList.remove('velo-media-item--featured');
                            if (item.dataset.mediaId == matchedVariant.featured_media.id) {
                                item.classList.add('velo-media-item--featured');
                                item.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
                            }
                        });
                    }
                }
            });
        });


        // --- Media Slider Navigation ---
        const slider = section.querySelector('.velo-media-slider');
        const prevBtn = section.querySelector('.velo-slider-prev');
        const nextBtn = section.querySelector('.velo-slider-next');

        if (slider && prevBtn && nextBtn) {
            const scrollAmount = 200; // Adjust as needed
            prevBtn.addEventListener('click', function () {
                slider.scrollBy({ left: -scrollAmount, behavior: 'smooth' });
            });
            nextBtn.addEventListener('click', function () {
                slider.scrollBy({ left: scrollAmount, behavior: 'smooth' });
            });
        }
    });
})();

/* =============================================
   VELO Lightbox — Production Grade
   ============================================= */
(function () {
    'use strict';

    const lightbox = document.getElementById('veloLightbox');
    if (!lightbox) return;

    const backdrop = lightbox.querySelector('.velo-lightbox-backdrop');
    const closeBtn = lightbox.querySelector('.velo-lightbox-close');
    const prevBtn = lightbox.querySelector('.velo-lightbox-prev');
    const nextBtn = lightbox.querySelector('.velo-lightbox-next');
    const imgEl = lightbox.querySelector('.velo-lightbox-img');

    // Inject counter element
    let counterEl = lightbox.querySelector('.velo-lightbox-counter');
    if (!counterEl) {
        counterEl = document.createElement('div');
        counterEl.className = 'velo-lightbox-counter';
        lightbox.appendChild(counterEl);
    }

    let images = [];
    let current = 0;
    let touchStartX = 0;

    /** Collect unique image srcs (avoid duplicates from desktop+mobile galleries) */
    function collectImages() {
        const seen = new Set();
        images = Array.from(document.querySelectorAll('.velo-lightbox-trigger')).filter(function (el) {
            const src = el.dataset.src || el.href;
            if (seen.has(src)) return false;
            seen.add(src);
            return true;
        });
    }

    function updateCounter() {
        if (images.length > 1) {
            counterEl.textContent = (current + 1) + ' / ' + images.length;
            counterEl.style.display = '';
        } else {
            counterEl.style.display = 'none';
        }
    }

    function openAt(index) {
        collectImages();
        if (!images.length) return;
        current = ((index % images.length) + images.length) % images.length;
        const trigger = images[current];

        // Reset for spring-entrance animation
        imgEl.style.transition = 'none';
        imgEl.style.opacity = '0';
        imgEl.style.transform = 'scale(0.92)';

        imgEl.src = trigger.dataset.src || trigger.href;
        imgEl.alt = trigger.dataset.alt || '';

        lightbox.classList.add('is-open');
        document.body.style.overflow = 'hidden';
        updateCounter();

        // Trigger transition after paint
        requestAnimationFrame(function () {
            requestAnimationFrame(function () {
                imgEl.style.transition = '';
                imgEl.style.opacity = '';
                imgEl.style.transform = '';
            });
        });
    }

    function close() {
        lightbox.classList.remove('is-open');
        document.body.style.overflow = '';
        // Clear src after transition to avoid flash
        setTimeout(function () {
            if (!lightbox.classList.contains('is-open')) imgEl.src = '';
        }, 300);
    }

    function navigate(dir) {
        collectImages();
        openAt(current + dir);
    }

    // Click delegation
    document.addEventListener('click', function (e) {
        const trigger = e.target.closest('.velo-lightbox-trigger');
        if (!trigger) return;
        e.preventDefault();
        collectImages();
        const idx = images.findIndex(function (el) {
            return (el.dataset.src || el.href) === (trigger.dataset.src || trigger.href);
        });
        openAt(idx >= 0 ? idx : 0);
    });

    if (closeBtn) closeBtn.addEventListener('click', close);
    if (backdrop) backdrop.addEventListener('click', close);
    if (prevBtn) prevBtn.addEventListener('click', function () { navigate(-1); });
    if (nextBtn) nextBtn.addEventListener('click', function () { navigate(1); });

    // Keyboard
    document.addEventListener('keydown', function (e) {
        if (!lightbox.classList.contains('is-open')) return;
        if (e.key === 'Escape') close();
        if (e.key === 'ArrowLeft') navigate(-1);
        if (e.key === 'ArrowRight') navigate(1);
    });

    // Touch swipe for mobile
    lightbox.addEventListener('touchstart', function (e) {
        touchStartX = e.changedTouches[0].clientX;
    }, { passive: true });

    lightbox.addEventListener('touchend', function (e) {
        const diff = touchStartX - e.changedTouches[0].clientX;
        if (Math.abs(diff) > 50) navigate(diff > 0 ? 1 : -1);
    }, { passive: true });
})();


