Dawn 15.4.1 introduces improvements for performance monitoring.

## [Unreleased]

### Fixed

- Replaced hardcoded "VELO" name with dynamic `{{ shop.name }}` in social media previews, page titles, and headers.
- Fixed incorrect default price display on `velo-product-hero` section (was showing minimum price instead of selected variant price).
- Fixed issue where variant switching reverted currency to USD and language to English. Now uses shop's money format and configured text.
- Updated social sharing meta tags to prioritize product featured image over site logo on product pages.
