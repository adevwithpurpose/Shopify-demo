# Contributing

This repository contains the Amanotte storefront theme, built on Shopify Dawn with a custom `velo-*` landing-page layer and some retained legacy artifacts.

Read `README.md` before making changes. It documents the active theme surface, Shopify-managed files, and legacy Kova / GemPages leftovers that should not be cleaned up casually.

## Scope

Use this repository for work that is directly related to the Amanotte theme itself:

- Dawn-based Liquid, JSON template, CSS, and JavaScript changes
- Amanotte storefront copy or layout changes
- fixes to the active `velo-*` section family
- safe maintenance of inherited legacy artifacts when they are still referenced

Do not use this repo as a generic Shopify support desk. General store operations, app configuration, or merchant support should stay outside the code repo unless the problem requires a theme change.

## Working Rules

- Prefer web-native theme code: Liquid, HTML, CSS, and minimal JavaScript.
- Keep changes small and easy to review.
- Treat `templates/*.json`, `sections/header-group.json`, `sections/footer-group.json`, and `config/settings_data.json` as Shopify-managed state. Read them to understand the live storefront, but edit them carefully.
- Prefer durable source changes in `sections/*.liquid`, `snippets/*.liquid`, `assets/*`, and maintainer docs.
- Preserve existing behavior unless the change explicitly intends to replace it.

## Local Development

Typical local development uses Shopify CLI against a connected store:

```sh
shopify theme dev --store your-store.myshopify.com
```

Recommended flow:

1. Create a branch for the change.
2. Read `README.md` and inspect the specific live template/section files you are changing.
3. Make the smallest safe change that solves the problem.
4. Verify the result in the relevant storefront surface.
5. Open a pull request with clear testing notes.

## Reporting Bugs

Open an issue in this repository with:

- a clear title
- affected template, section, snippet, asset, or workflow path
- the current behavior
- the expected behavior
- reproduction steps
- screenshots or screen recordings when useful

If the bug touches storefront rendering, include whether it happens on the homepage, product page, collection page, cart, or theme editor preview.

## Pull Requests

Before opening a pull request:

- review your own diff first
- verify that the change matches the actual Amanotte repo structure
- note whether you touched Shopify-managed JSON or only durable source files
- include manual testing steps
- mention any legacy artifact interactions (`kova-*`, GemPages, Dawn defaults) that reviewers should be aware of

## Known Repo Caveats

- The active storefront still uses a `velo-*` section family even though branding is now Amanotte.
- Legacy `kova-*` and GemPages artifacts remain in the repo.

## Removed Inherited Workflow

- The old Shopify-specific CLA workflow was removed because it enforced Shopify infrastructure that does not match this repository's current maintainership setup.

## Review Expectations

Reviews should focus on correctness, storefront safety, and whether the change respects the live Amanotte theme structure.

- Be respectful and specific.
- Discuss the code and behavior, not the person.
- Call out risks around legacy artifacts or Shopify-managed files explicitly.
