# Release Notes

## [Unreleased]

### Documentation

- Rewrote `README.md` to describe the current Amanotte theme instead of the earlier VELO build phase.
- Documented the live edit surface, Shopify-managed files, and legacy Kova / VELO / GemPages artifacts so future work can start from docs instead of a fresh repo scan.
- Removed obsolete build-planning and scratch-note files that were no longer reliable project documentation.
- Rewrote inherited `.github` maintainer docs and issue / PR templates so they describe Amanotte instead of Shopify Dawn.
- Removed the inherited Shopify CLA workflow because it did not match this repository's current maintainership setup.

### Maintenance Fixes

- Removed stray leading `Cr` text from `layout/theme.liquid`.
- Removed stray leading `ut` text from `assets/velo-product-hero.css`.

### Runtime History Worth Keeping In Mind

- Social previews and page-title metadata were previously updated to prefer dynamic shop data over hardcoded VELO naming.
- `velo-product-hero` previously received fixes around variant pricing, currency formatting, and featured-image sharing behavior.
