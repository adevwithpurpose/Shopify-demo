(function () {
    'use strict';

    function initLightbox(section) {
        const lightbox = document.getElementById('veloLightbox');
        if (!lightbox) return;

        const backdrop = lightbox.querySelector('.velo-lightbox-backdrop');
        const closeBtn = lightbox.querySelector('.velo-lightbox-close');
        const prevBtn = lightbox.querySelector('.velo-lightbox-prev');
        const nextBtn = lightbox.querySelector('.velo-lightbox-next');
        const imgEl = lightbox.querySelector('.velo-lightbox-img');
        let counterEl = lightbox.querySelector('.velo-lightbox-counter');
        if (!counterEl) {
            counterEl = document.createElement('div');
            counterEl.className = 'velo-lightbox-counter';
            lightbox.appendChild(counterEl);
        }

        let images = [];
        let current = 0;
        let touchStartX = 0;

        function collectImages() {
            const seen = new Set();
            let gallerySelector = '.velo-media-gallery:not(.velo-media-gallery--mobile)';
            if (window.innerWidth < 990 && section.querySelector('.velo-media-gallery--mobile')) {
                gallerySelector = '.velo-media-gallery--mobile';
            }
            const visibleGallery = section.querySelector(gallerySelector);
            if (!visibleGallery) {
                images = [];
                return;
            }
            images = Array.from(visibleGallery.querySelectorAll('.velo-lightbox-trigger'));
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

            imgEl.style.transition = 'none';
            imgEl.style.opacity = '0';
            imgEl.style.transform = 'scale(0.92)';

            imgEl.src = trigger.dataset.src || trigger.href;
            imgEl.alt = trigger.dataset.alt || '';

            lightbox.classList.add('is-open');
            document.body.style.overflow = 'hidden';
            updateCounter();

            requestAnimationFrame(() => {
                requestAnimationFrame(() => {
                    imgEl.style.transition = '';
                    imgEl.style.opacity = '';
                    imgEl.style.transform = '';
                });
            });
        }

        function close() {
            lightbox.classList.remove('is-open');
            document.body.style.overflow = '';
            setTimeout(() => {
                if (!lightbox.classList.contains('is-open')) imgEl.src = '';
            }, 300);
        }

        function navigate(dir) {
            openAt(current + dir);
        }

        section.addEventListener('click', function (e) {
            const trigger = e.target.closest('.velo-lightbox-trigger');
            if (!trigger) return;
            e.preventDefault();
            collectImages();
            const idx = images.findIndex(el => (el.dataset.src || el.href) === (trigger.dataset.src || trigger.href));
            openAt(idx >= 0 ? idx : 0);
        });

        if (closeBtn) closeBtn.addEventListener('click', close);
        if (backdrop) backdrop.addEventListener('click', close);
        if (prevBtn) prevBtn.addEventListener('click', () => navigate(-1));
        if (nextBtn) nextBtn.addEventListener('click', () => navigate(1));

        document.addEventListener('keydown', function (e) {
            if (!lightbox.classList.contains('is-open')) return;
            if (e.key === 'Escape') close();
            if (e.key === 'ArrowLeft') navigate(-1);
            if (e.key === 'ArrowRight') navigate(1);
        });

        lightbox.addEventListener('touchstart', e => { touchStartX = e.changedTouches[0].clientX; }, { passive: true });
        lightbox.addEventListener('touchend', e => {
            const diff = touchStartX - e.changedTouches[0].clientX;
            if (Math.abs(diff) > 50) navigate(diff > 0 ? 1 : -1);
        }, { passive: true });
    }

    document.querySelectorAll('.velo-product-hero').forEach(function (section) {
        const sectionId = section.querySelector('[id^="veloBuyBox-"]');
        if (!sectionId) return;

        const id = sectionId.id.replace('veloBuyBox-', '');
        const variantJsonEl = document.getElementById('veloVariantJson-' + id);
        if (!variantJsonEl) return;

        let variants;
        try {
            variants = JSON.parse(variantJsonEl.textContent);
        } catch (e) {
            return;
        }

        function setupThumbnailClicks(gallery) {
            const thumbnails = gallery.querySelectorAll('.velo-thumbnail-item');
            thumbnails.forEach(thumb => {
                thumb.addEventListener('click', () => {
                    const mediaId = thumb.dataset.mediaId;

                    gallery.querySelectorAll('.velo-media-main-item').forEach(item => {
                        item.style.display = item.dataset.mediaId === mediaId ? 'block' : 'none';
                    });

                    thumbnails.forEach(t => t.classList.remove('velo-thumbnail--active'));
                    thumb.classList.add('velo-thumbnail--active');
                });
            });
        }

        const desktopGallery = document.getElementById('veloMediaGallery-' + id);
        const mobileGallery = section.querySelector('.velo-media-gallery--mobile');

        if (desktopGallery) setupThumbnailClicks(desktopGallery);
        if (mobileGallery) setupThumbnailClicks(mobileGallery);

        function formatMoney(cents, id) {
            const settings = (window.veloSettings && window.veloSettings[id]) || {};
            const format = settings.moneyFormat || '${{amount}}';
            if (typeof cents === 'string') cents = cents.replace('.', '');
            let value = '';
            const placeholderRegex = /\{\{\s*(\w+)\s*\}\}/;

            function formatWithDelimiters(number, precision = 2, thousands = ',', decimal = '.') {
                if (isNaN(number) || number == null) return 0;
                number = (number / 100.0).toFixed(precision);
                const parts = number.split('.');
                const dollars = parts[0].replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1' + thousands);
                const centsVal = parts[1] ? (decimal + parts[1]) : '';
                return dollars + centsVal;
            }

            switch (format.match(placeholderRegex)[1]) {
                case 'amount': value = formatWithDelimiters(cents, 2); break;
                case 'amount_no_decimals': value = formatWithDelimiters(cents, 0); break;
                case 'amount_with_comma_separator': value = formatWithDelimiters(cents, 2, '.', ','); break;
                case 'amount_no_decimals_with_comma_separator': value = formatWithDelimiters(cents, 0, '.', ','); break;
            }
            return format.replace(placeholderRegex, value);
        }

        const swatchInputs = section.querySelectorAll('.velo-swatch-input');
        swatchInputs.forEach(input => {
            input.addEventListener('change', () => {
                input.closest('.velo-option-values').querySelectorAll('.velo-swatch').forEach(s => s.classList.remove('velo-swatch--active'));
                input.closest('.velo-swatch').classList.add('velo-swatch--active');

                const optionIndex = input.dataset.optionIndex;
                const labelEl = document.getElementById(`veloOptionLabel-${id}-${optionIndex}`);
                if (labelEl) labelEl.textContent = input.value;

                const selectedOptions = Array.from(section.querySelectorAll('.velo-option-group')).map(group => group.querySelector('.velo-swatch-input:checked')?.value);
                const matchedVariant = variants.find(v => v.options.every((opt, i) => selectedOptions[i] === opt));

                if (matchedVariant) {
                    const variantIdInput = document.getElementById('veloVariantId-' + id);
                    if (variantIdInput) variantIdInput.value = matchedVariant.id;

                    const priceEl = document.getElementById('veloPrice-' + id);
                    if (priceEl) priceEl.textContent = formatMoney(matchedVariant.price, id);

                    const compareEl = section.querySelector('.velo-price-compare');
                    const saveEl = section.querySelector('.velo-save-badge');

                    if (matchedVariant.compare_at_price > matchedVariant.price) {
                        const savePct = Math.round(((matchedVariant.compare_at_price - matchedVariant.price) * 100) / matchedVariant.compare_at_price);
                        const settings = (window.veloSettings && window.veloSettings[id]) || {};
                        if (compareEl) {
                            compareEl.textContent = formatMoney(matchedVariant.compare_at_price, id);
                            compareEl.style.display = '';
                        }
                        if (saveEl) {
                            saveEl.textContent = `${settings.saveText || 'SALVA'} ${savePct}%`;
                            saveEl.style.display = '';
                        }
                    } else {
                        if (compareEl) compareEl.style.display = 'none';
                        if (saveEl) saveEl.style.display = 'none';
                    }

                    const atcBtn = section.querySelector('.velo-atc-btn');
                    if (atcBtn) {
                        atcBtn.disabled = !matchedVariant.available;
                        atcBtn.textContent = matchedVariant.available ? (section.settings.atc_text || 'ACQUISTA ORA') : (section.settings.sold_out_text || 'ESAURITO');
                    }

                    const url = new URL(window.location);
                    url.searchParams.set('variant', matchedVariant.id);
                    window.history.replaceState({}, '', url);

                    if (matchedVariant.featured_media) {
                        const mediaId = matchedVariant.featured_media.id.toString();
                        [desktopGallery, mobileGallery].forEach(gallery => {
                            if (!gallery) return;
                            gallery.querySelectorAll('.velo-media-main-item').forEach(item => item.style.display = item.dataset.mediaId === mediaId ? 'block' : 'none');
                            gallery.querySelectorAll('.velo-thumbnail-item').forEach(thumb => thumb.classList.toggle('velo-thumbnail--active', thumb.dataset.mediaId === mediaId));
                        });
                    }
                }
            });
        });

        initLightbox(section);
    });
})();
