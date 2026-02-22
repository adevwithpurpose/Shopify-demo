/**
 * KÖVA Product Hero — Variant Switching & Interactivity
 */
(function () {
    'use strict';

    document.querySelectorAll('.kova-section').forEach(function (section) {
        const sectionId = section.querySelector('[id^="KovaBuyBox-"]');
        if (!sectionId) return;

        const id = sectionId.id.replace('KovaBuyBox-', '');
        const variantJsonEl = document.getElementById('KovaVariantJson-' + id);
        const variantIdInput = document.getElementById('KovaVariantId-' + id);
        const priceEl = document.getElementById('KovaPrice-' + id);

        if (!variantJsonEl) return;

        let variants;
        try {
            variants = JSON.parse(variantJsonEl.textContent);
        } catch (e) {
            return;
        }

        // --- Variant Switching ---
        const swatchInputs = section.querySelectorAll('.kova-swatch-input');
        swatchInputs.forEach(function (input) {
            input.addEventListener('change', function () {
                // Update swatch visual
                const group = input.closest('.kova-option-values');
                group.querySelectorAll('.kova-swatch').forEach(function (s) {
                    s.classList.remove('kova-swatch--active');
                });
                input.closest('.kova-swatch').classList.add('kova-swatch--active');

                // Update label
                const optionIndex = input.dataset.optionIndex;
                const labelEl = document.getElementById('KovaOptionLabel-' + id + '-' + optionIndex);
                if (labelEl) labelEl.textContent = input.value;

                // Find matching variant
                const selectedOptions = [];
                section.querySelectorAll('.kova-option-group').forEach(function (group) {
                    const checked = group.querySelector('.kova-swatch-input:checked');
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
                    const compareEl = section.querySelector('.kova-price-compare');
                    const saveEl = section.querySelector('.kova-save-badge');
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
                    const atcPrice = section.querySelector('.kova-atc-price');
                    if (atcPrice) {
                        const priceFormatted = Shopify.formatMoney
                            ? Shopify.formatMoney(matchedVariant.price)
                            : '$' + (matchedVariant.price / 100).toFixed(2);
                        atcPrice.textContent = '— ' + priceFormatted;
                    }

                    // Update ATC availability
                    const atcBtn = section.querySelector('.kova-atc-btn');
                    if (atcBtn) {
                        if (matchedVariant.available) {
                            atcBtn.disabled = false;
                            atcBtn.querySelector('.kova-atc-price').style.display = '';
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
                        const mediaItems = section.querySelectorAll('.kova-media-item');
                        mediaItems.forEach(function (item) {
                            item.classList.remove('kova-media-item--featured');
                            if (item.dataset.mediaId == matchedVariant.featured_media.id) {
                                item.classList.add('kova-media-item--featured');
                                item.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
                            }
                        });
                    }
                }
            });
        });

        // --- Dynamic Urgency Date ---
        const urgencyEl = section.querySelector('.kova-urgency');
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
    });
})();
