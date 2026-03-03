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

        // --- Dynamic Urgency Date ---
        const urgencyEl = section.querySelector('.velo-urgency');
        if (urgencyEl) {
            const now = new Date();
            // Next business day (if today is Fri/Sat/Sun, jump to Monday)
            const daysToAdd = now.getDay() === 5 ? 3 : now.getDay() === 6 ? 2 : 1;
            const nextDay = new Date(now);
            nextDay.setDate(now.getDate() + daysToAdd);
            const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
            const dateStr = months[nextDay.getMonth()] + ' ' + nextDay.getDate();
            urgencyEl.innerHTML = urgencyEl.innerHTML.replace(/\[date\]/g, '<strong>' + dateStr + '</strong>');
        }
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
   VELO Lightbox — Clickable Image Enlargement
   ============================================= */
(function () {
    'use strict';

    const lightbox = document.getElementById('veloLightbox');
    if (!lightbox) return;

    const backdrop = lightbox.querySelector('.velo-lightbox-backdrop');
    const closeBtn = lightbox.querySelector('.velo-lightbox-close');
    const prevBtn = lightbox.querySelector('.velo-lightbox-prev');
    const nextBtn = lightbox.querySelector('.velo-lightbox-next');
    const img = lightbox.querySelector('.velo-lightbox-img');

    let images = [];
    let current = 0;

    function collectImages() {
        images = Array.from(document.querySelectorAll('.velo-lightbox-trigger'));
    }

    function openAt(index) {
        collectImages();
        if (!images.length) return;
        current = ((index % images.length) + images.length) % images.length;
        const trigger = images[current];
        img.src = trigger.dataset.src || trigger.href;
        img.alt = trigger.dataset.alt || '';
        lightbox.classList.add('is-open');
        document.body.style.overflow = 'hidden';
        img.focus();
    }

    function close() {
        lightbox.classList.remove('is-open');
        document.body.style.overflow = '';
        img.src = '';
    }

    // Attach click listeners (delegated for dynamic content)
    document.addEventListener('click', function (e) {
        const trigger = e.target.closest('.velo-lightbox-trigger');
        if (trigger) {
            e.preventDefault();
            collectImages();
            const idx = images.indexOf(trigger);
            openAt(idx >= 0 ? idx : 0);
        }
    });

    if (closeBtn) closeBtn.addEventListener('click', close);
    if (backdrop) backdrop.addEventListener('click', close);
    if (prevBtn) prevBtn.addEventListener('click', function () { openAt(current - 1); });
    if (nextBtn) nextBtn.addEventListener('click', function () { openAt(current + 1); });

    document.addEventListener('keydown', function (e) {
        if (!lightbox.classList.contains('is-open')) return;
        if (e.key === 'Escape') close();
        if (e.key === 'ArrowLeft') openAt(current - 1);
        if (e.key === 'ArrowRight') openAt(current + 1);
    });
})();

