# KÖVA Freedom Theme

> A production-ready Shopify OS 2.0 theme based on Dawn, customized for a single-product landing page experience modeled after [kovachair.com](https://kovachair.com).

## Architecture

Built on top of **Shopify Dawn v15.4.1**, this theme inherits all of Dawn's production-ready features while adding custom KÖVA-specific sections for the landing page funnel.

### What Dawn Provides (Out of the Box)
- ✅ Full cart page with AJAX cart drawer
- ✅ Product page with media gallery, variant picker
- ✅ Collection & collection list pages
- ✅ Blog & article templates
- ✅ 404 page
- ✅ Search page with predictive search
- ✅ Gift card template
- ✅ Announcement bar (rotating messages)
- ✅ Complete header with cart count, account, search
- ✅ Footer with newsletter, social, payments, policies
- ✅ Full color scheme system (5 palettes)
- ✅ Typography system (heading + body fonts)
- ✅ Responsive everything
- ✅ Accessibility (WCAG compliant)
- ✅ SEO meta tags, social sharing
- ✅ Performance optimized (lazy loading, critical CSS)
- ✅ Localization (20+ languages)

### Custom KÖVA Sections (Added)
| Section | File | Purpose |
|---------|------|---------|
| **KÖVA Product Hero** | `kova-product-hero.liquid` | Split-screen product landing with sticky buy box, gift bundles, urgency, accordions |
| **KÖVA Feature Grid** | `kova-feature-grid.liquid` | "Who KÖVA Is For?" — 6-card persona grid |
| **KÖVA Comparison** | `kova-comparison.liquid` | "Built for How Your Body Actually Works" — feature list + media |
| **KÖVA Details Grid** | `kova-details-grid.liquid` | "Designed Down to Every Detail" — 6-card product specs |
| **KÖVA What's Included** | `kova-whats-included.liquid` | Value stack pricing breakdown with FREE gift tags |
| **KÖVA Trust Strip** | `kova-trust-strip.liquid` | Shipping/Returns/Warranty trust bar |

### Design Tokens
- **Heading Font:** Jost
- **Body Font:** Muli
- **Primary Color:** #000000 (Black)
- **Accent Color:** #1a233b (Dark Navy)
- **Page Width:** 1400px

## Deployment

### Using Shopify CLI
```bash
shopify theme dev --store your-store.myshopify.com
```

### Using GitHub Integration
1. Connect this repo to your Shopify store
2. Push to `main` branch → auto-deploys

## Next Steps
1. Connect to Shopify store and create the product
2. Upload product images and videos
3. Replace placeholder content with actual client data
4. Set up navigation menus (main-menu, footer)
5. Configure social links and policies
6. Install Judge.me for reviews
7. Test checkout flow
