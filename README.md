# Amanotte Theme

This repository contains the current Amanotte Shopify OS 2.0 theme. It is based on Dawn and includes a custom single-product funnel built around the `velo-*` section family, while still carrying older Kova, VELO, and GemPages artifacts from previous iterations.

Use this file as the start-here document. It is intentionally written so future work can begin from the documentation without rescanning the entire repo.

## Current State

- Platform: Shopify OS 2.0 theme built on Dawn.
- Storefront state: Amanotte content is live in theme-managed JSON templates and store settings.
- Custom funnel surface: the active custom section family is still mostly named `velo-*` even though the store branding is now Amanotte.
- Legacy artifacts still present: `kova-*` sections/assets, GemPages templates/snippets, and older VELO/Kova wording in some runtime files.

## Start Here

If you need to update the theme, read files in this order:

1. `README.md`
2. `templates/index.json`
3. `templates/product.json`
4. `layout/theme.liquid`
5. Relevant `sections/velo-*.liquid` and matching `assets/velo-*`
6. `config/settings_schema.json` and `config/settings_data.json`

That is the minimum surface needed to understand how the current Amanotte storefront is assembled.

## Repo Map

### Core theme structure

- `layout/` - Dawn layout files and global theme shell.
- `templates/` - Shopify JSON/Liquid templates that define page composition.
- `sections/` - Theme sections, including the custom Amanotte landing-page sections.
- `snippets/` - Reusable Liquid fragments.
- `assets/` - CSS and JavaScript used by Dawn and custom sections.
- `config/` - Theme settings schema and live theme data.
- `locales/` - Translation files.

### Current live storefront surfaces

- `templates/index.json` - Homepage composition. The current homepage order is driven by `velo_*` sections.
- `templates/product.json` - Product-page composition. The main product experience uses `velo-product-hero`.
- `layout/theme.liquid` - Global Dawn shell plus custom VELO animation assets.
- `config/settings_data.json` - Current theme settings in use, including fonts, colors, and page width.

### Main custom section family

The active custom landing-page system is the `velo-*` family:

- `sections/velo-product-hero.liquid`
- `sections/velo-rich-text.liquid`
- `sections/velo-trust-strip.liquid`
- `sections/velo-feature-grid.liquid`
- `sections/velo-body-built.liquid`
- `sections/velo-comparison.liquid`
- `sections/velo-how-to-steps.liquid`
- `sections/velo-details-grid.liquid`
- `sections/velo-risk-free-card.liquid`
- `sections/velo-testimonials.liquid`
- `sections/velo-whats-included.liquid`
- `sections/velo-faq.liquid`
- `sections/velo-sticky-atc.liquid`

These sections are supported by matching `assets/velo-*` CSS and JS files.

## Source Of Truth Rules

Use these rules when deciding where to look and what to edit:

- `README.md` is the maintainer-facing source of truth for repo structure and editing guidance.
- `templates/*.json`, `sections/header-group.json`, `sections/footer-group.json`, and `config/settings_data.json` are Shopify-managed or editor-managed files. Read them to understand the live storefront, but edit them carefully because Shopify can overwrite them.
- `sections/*.liquid`, `snippets/*.liquid`, and `assets/*` are the safest places for durable implementation changes.
- Do not use old scratch notes or branch logs as documentation. They were intentionally removed in this cleanup.

## Auto-Generated And Fragile Files

These files are important for understanding the live storefront, but they are not good long-term documentation:

- `config/settings_data.json`
- `templates/index.json`
- `templates/product.json`
- `templates/*.gp-template-*.json`
- `templates/*.gem-*.json`
- `sections/header-group.json`
- `sections/footer-group.json`

Treat them as runtime state and configuration, not as the place to explain architecture.

## Legacy Artifacts To Be Aware Of

These files exist in the repo but are not the primary Amanotte maintainer surface:

- `sections/kova-*.liquid` and `assets/kova-*` - older Kova-branded copies.
- `layout/theme.gempages.*.liquid`, `templates/*.gp-template-*.json`, `templates/*.gem-*.json`, and `sections/gp-section-*.liquid` - GemPages-generated artifacts and backups.
- VELO wording inside some runtime files - historical naming that still maps to the current custom section family.

Do not delete or rename legacy runtime files casually. Some may still be referenced by templates, backups, or store-editor state.

## Current Theme Defaults

From the current live settings in `config/settings_data.json`:

- Heading font: Jost
- Body font: Muli
- Page width: 1400px
- Primary dark brand color: `#122442`
- Animations: reveal-on-scroll enabled

## Known Notes

- The custom section family is still technically named `velo-*`, even though the storefront branding is Amanotte.
- The inherited Shopify CLA workflow was removed from `.github/workflows/cla.yml` because it did not match this repo's current maintainership setup.

Keep these repo-level caveats documented so future sessions do not have to rediscover them.

## Safe Update Workflow

When making future changes:

1. Confirm whether the change belongs in a Shopify-managed JSON file or in durable Liquid/CSS/JS source.
2. Inspect the matching `sections/velo-*` file and any paired `assets/velo-*` file.
3. Check whether a similar `kova-*` or GemPages artifact exists before assuming duplication is accidental.
4. Keep repo-facing documentation in `README.md` up to date when the main edit surface changes.

## Development Notes

Typical local development uses Shopify CLI against a connected store:

```bash
shopify theme dev --store your-store.myshopify.com
```

If GitHub integration is used for deployment, verify the connected branch and store setup before assuming `main` is the deploy branch. This repository currently includes multiple long-lived branches.
