# Shopify Commerce Engineering — baseline audit

Reviewed 23 October 2026 before Milestone 1 edits. Source of truth is `apps/portfolio-2/src`, not a Next.js page or a Shopify theme.

## Architecture and publishing

React 18 + TypeScript + Framer Motion 11, Vite 5; parent portfolio uses Next.js 16/React 19. Separate bundle avoids mixing React versions. `vite.config.ts` emits `public/portfolio-2-assets` with absolute root asset URLs. Parent prebuild builds Vite; `scripts/finalize-static.mjs` copies its HTML to `/projects/shopify-technical-studies/index.html` and retains `/projects/portfolio-2/` redirect. No API calls, live store credentials, environment variables, backend, Shopify SDK or iframe. Existing canonical URL is correct. Keep this architecture and inbound URL.

## Complete existing content inventory

| Source | Behavior / content | Findings |
| --- | --- | --- |
| HomeSection | Intro + coverage list | Says four studies, but only three technical demo sections exist. White visual system conflicts with portfolio; no independent-publication disclaimer. |
| SimulationSection | 13-step JSON-LD walkthrough; merchant/technical tabs; field-to-preview connection lines | Fixed illustrative inputs, not an inspector or crawler. Before/after and “Validated”/“eligible” text overstate what is checked. Product / Offer / AggregateRating sample fields are plausible illustrative schema, not complete Google compliance validation. Description text differs between visible product and JSON-LD; reconcile in Milestone 2. Real-looking ateliercommerce.com sample is not verified/owned. No Google guarantee caveat or source links. |
| StorefrontDebuggingSection | Six-step markup replacement and reinitialization story | `shopify:section:load` is emitted by the theme editor, not a universal storefront filter lifecycle event. Example has undefined `bindCard`, no cleanup/idempotency and no initial init call: illustrative sketch, not production-ready. |
| StableIntegrationsSection | Seven-step integration conflict story, marked-ready guard snippet | A useful conceptual demonstration, not actual app/network diagnostics. `bindIntegration` is undefined; marking ready before a successful bind is a failure/retry caveat. Cleanup, replaced nodes and lifecycle ownership need deeper treatment. No evidence for quantitative claims is supplied or needed; do not invent outcomes. |
| HowIWorkSection | Reproduce/diagnose/validate method | Author's process/recommendations, not a platform guarantee or full guide library. Retain. |
| EndingSection | Contact links sourced from portfolio profile | Retain identity/contact; label publication independent rather than suggesting Shopify affiliation. |

No explicit Shopify API release version, authenticated request, webhook payload, Functions or Plus entitlement claim exists in the baseline. There is no outdated version string to mechanically replace. Proposed 2026-10 news topics need independent primary-source research in Milestone 3; they are not verified news entries in Milestone 1.

## Navigation, usability and accessibility

- App.tsx intercepts wheel, PageUp/PageDown, space and arrow keys, moving a translated viewport-height track. Trackpad threshold is eight pixels. Section selection is React state only: no deep links, refresh persistence or history.
- Desktop walkthroughs use native inner scroll positions to advance stories; preserve those progressions while removing outer wheel interception.
- Mobile forces final step for all three demos, hiding intermediate explanations; add explicit step controls across widths.
- Sidebar is ~100px wide on narrow screens, consuming valuable content width. Replace with compact publication header and study navigation.
- Hidden sections use inert/aria-hidden, tabs already support arrow/Home/End. Preserve tab keyboard semantics. Avoid loading all hidden walkthroughs concurrently.
- Existing motion hooks vary; home/contact have unconditional entrances, typewriter is not reduced-motion aware, and scan bar repeats forever. Respect system preference globally and avoid repeated faux scanning.
- Two external font providers are loaded. Use system typography for this milestone, no extra font requests.

## SEO / links / integrity

Existing title, description, OG and canonical are present; no article URLs or structured data. Only schema/sample URLs and contact links exist inside the source; no technical documentation citations to validate. Real-looking sample domain should become reserved example.com. Shell is client-rendered: add meaningful no-JS fallback, but do not claim SSR/article indexing is solved. Search-friendly static article pages are a later milestone.

## Primary-source checks (23 October 2026)

- Shopify theme-editor event scope: https://shopify.dev/docs/storefronts/themes/best-practices/editor/integrate-sections-and-blocks
- Shopify section rendering returns HTML; caller owns integration lifecycle: https://shopify.dev/docs/api/ajax/section-rendering
- Google product snippet requirements and no rich-result guarantee: https://developers.google.com/search/docs/appearance/structured-data/product-snippet
- Official discovery sources resolve: https://shopify.dev/changelog ; https://shopify.dev/changelog/release-notes ; https://shopify.dev/changelog/blog ; https://www.shopify.com/editions ; https://help.shopify.com/en/

Milestone 1 adds explicit illustrative labels and the high-priority event/Google caveats. Detailed snippet modernization, full guide research, news entries and editable validators remain milestones 2–4. Never describe these existing stories as a live performance audit, webhook explorer or credential-connected Shopify tool.

## Milestone 1 resolutions and validation

- Replaced the global wheel/key interceptor and translated track with a native document shell plus hash-addressable study views. Existing inner desktop scroll stories remain.
- Retained all three technical components, methodology and contact sections. Added native search/audience controls to the catalogue; no pretend content entries.
- Added step navigation on mobile and desktop. QA found the original debugging/integration track could clamp before its final step; tail space now permits every final state.
- Clarified the theme-editor event scope without pretending the snippet is production-complete. Marked search previews/example loading as illustrative, added Google no-guarantee guidance, and replaced the unverified domain with example.com.
- Removed remote font imports; established dark shared tokens. The demo's gradient product placeholders remain illustrative; no generated screenshot was introduced.
- Added metadata wording, an independence disclaimer and meaningful no-JS fallback. Canonical URL and legacy redirect preserved.
- Final root lint/typecheck/build pass; Vite build also runs its own TypeScript project check. Static browser checks at 1440/768/390/360px for homepage and every technical study: zero horizontal overflow, no console/page errors or failed resource requests. Keyboard skip link, native buttons, arrow-key tabs, reduced-motion preference changes, search empty/reset, back/refresh, original alias and parent homepage tested.
- All 13/6/7 steps reached on mobile; final stages reached on desktop after the track-length fix. Screenshots inspected for homepage and studies on desktop/mobile; tablet layout checked. Chromium only; full cross-browser, performance scoring and deeper accessibility review remain pending.

Remaining issues for Milestone 2+: sample description consistency; complete lifecycle cleanup and retry-safe snippets; richer source/verification metadata per study; contrast/readability audit of all historic low-emphasis states; proper static article routing/rendering. Future performance, webhook and metafield tools do not exist yet.
