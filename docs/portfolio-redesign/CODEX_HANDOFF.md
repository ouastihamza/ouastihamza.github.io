## 2026-10-23 — Scrolling repair, milestone 1

- Reproduced on the static build: wheel at (700,400) advanced Structured Data 1 → 2 while window.scrollY remained 0.
- Root cause: all three labs derived activeStep from nested section scrollTop, with tall invisible tracks, sticky shells and negative viewport margins. No remaining wheel interceptor was required to produce the bug.
- Removed the three scroll-to-state listeners and invisible tracks. Previous/Next alone selects steps. Explanations and counters now use the same immediate state, with polite announcements instead of delayed exit transitions.
- All publication sections now use document flow, including author notes/contact. Removed nested viewport sizing and sticky lab surfaces; retained the publication header. No wheel/touch prevention added. Structured Data tab arrow handling and the skip-link preventDefault remain intentional.
- Source inventory: only Structured Data (13), Storefront DOM lifecycle (6), and integration coexistence (7) walkthroughs exist. No performance, metafield, webhook/event labs, article library, modal, carousel or collapsed mobile menu is implemented. Guides/Intelligence are index/reference sections.
- Passed lint, root typecheck, Vite typecheck and full static production build. Chromium regression: 375/768/1280/1440 × all three labs, every forward/back step, wheel over five target areas + reversals, PageDown/PageUp, Enter/Tab, boundary buttons, reduced-motion changes, direct routes and browser back. No console/page errors. Technical View final step has no horizontal overflow or nested vertical scrolling at all four widths.
- Additional actual browser checks: touch-emulated swipes on each lab (document moved >680px; step unchanged); home/guides/intelligence/labs/author/contact routes have no nested vertical scroll regions. Reviewed desktop technical, mobile merchant and tablet lifecycle screenshots. Physical devices, Safari/Firefox and screen readers not tested.
- Regression source: tests/shopify-scroll.browser.js. With the static server on 4173, pass its file contents as the Playwright browser_run_code `code` argument (async function accepting page). It asserts failures and returns 12 results, and writes screenshots under /private/tmp.
- Preview: http://127.0.0.1:4173/projects/shopify-technical-studies/#simulation — reload existing tabs to load the rebuilt bundle.
- Stop here for owner scrolling review. Content research, new guides, news and broader visual polishing remain milestones 2–5. Do not merge or deploy.

# Codex handoff: woodland portfolio redesign

## Active work — Shopify Commerce Engineering Milestone 1

Work on `feature/interactive-portfolio-redesign` only. The newest request prohibits main merge/deployment and requires stopping after Milestone 1 for visual review. Previous publication approval below applies only to the already-published main portfolio polish.

The standalone Vite app now has a dark editorial homepage and hash-addressable studies. See `docs/shopify-commerce-engineering/AUDIT.md` and `EDITORIAL_WORKFLOW.md`; `apps/portfolio-2/README.integration.md` documents exact build/preview paths. Do not mistake the Next dev homepage at port 3000 for the Vite source preview.

Preview the built integrated route at http://127.0.0.1:4173/projects/shopify-technical-studies/ or use Vite hot reload at http://127.0.0.1:5173/portfolio-2-assets/ . All original study components are retained; mobile step access and final desktop steps fixed. Guides and intelligence are explicitly limited to the existing methodology and official-source directory. No new articles, platform news summaries, live store access or scheduled automation is implemented.

Validation: lint, root/Vite typecheck and production static build pass. Chromium 1440/768/390/360px home and three studies have no horizontal overflow, console errors or failed requests. Keyboard, reduced motion, deep link/refresh/history, filters and alias checked. Stop for review before Milestone 2.

## Current milestone — approved for publication

Branch: `feature/interactive-portfolio-redesign`. Milestone 4 refines the existing woodland identity and content hierarchy. The owner approved publication on 23 October 2026 and requested removal of the pause/resume button. Merge this completed polish into main and publish via the existing GitHub Pages workflow.

## Implemented

- Real centered portrait and kinetic identity ring preserved. Desktop stage is 520px maximum, portrait 80% of stage; ring typography 22 SVG units desktop / 24 mobile, full-circle spacing. Name/title colors preserved.
- 60-second rotation, independent scroll offset up to 12 degrees and portrait translation up to 18px. Manual pause/resume control removed at the owner’s request. Reduced-motion and no-JS fallbacks preserved.
- Introduction/metadata emphasize full-stack work, integrations and advanced troubleshooting. Existing apprenticeship claim and schedule remain as secondary content.
- Three concise Judge.me highlights and a separate freelance card. All original experience details remain in a native disclosure.
- Distinct Enterprise and Shopify/Sanity panels; full architecture, technologies, scope and caveats remain in disclosures / case study. New Shopify/Sanity visual is a labelled architecture diagram, not a screenshot. Existing Technical Studies screenshot and app unchanged.
- 14 core skill cards initially, remaining 17 inside a native “View all skills” disclosure, plus all six original descriptions. Server-rendered logo data, no new client boundary or dependency. Hover enhancement remains delegated; grid-level reveal avoids excessive repeated animation.
- Skills/About navigation, active-section state and stable-height sticky header. Narrow screens use a two-row link grid next to the wordmark.
- `app/editorial.css` owns the new presentation/disclosure layouts. `woodland.css` owns portrait/motion. Shared tokens remain in `globals.css`.

## Facts awaiting approval

Owner confirmed the Tier 2 promotion was July 2026 on 23 October 2026; current website wording is correct.

Remaining questions in `CONTENT_REVIEW.md`: official Master's titles/dates/status; 10,000+ ticket source and period; current location; employment duration; CDI versus alternance availability. No uncertain factual values were changed. Do not replace dates or claim CDI availability without owner confirmation.

## Photo provenance and processing

Source from GitHub main, retrieved as a single file without merging:
`public/images/WhatsApp Image 2026-10-22 at 14.18.17.jpeg`.

Local original: `public/images/hamza-woodland-original.jpeg`.
Site asset: `public/images/hamza-woodland-cutout.webp`.

A built-in image-editing attempt was rejected because it changed facial detail. A macOS foreground mask retained the source image but left a fringe; the owner explicitly requested finer ear/hair edges. The final mask refinement is documented in PROGRESS.md. Preserve the actual source subject; never substitute a generated face. Processing tools are offline and outside the project dependencies; the site serves only the optimized asset.

Measured median source samples: sweatshirt `#67927f`, moss `#464e2e`, sky `#d5dce0`, woodland `#9a9b81`, scarf `#020816`. UI tokens deliberately adjust those colors for dark surfaces and text contrast: background `#111813`, surface `#1c2720`, card `#202c25`, sage `#739884`, text accent `#9eb9a8`, olive `#a5a897`, fog `#dee1da`, text `#f0f1ec`, muted `#acb6ad`.

## Verification and preview

Node >=22.13. Run `npm run lint`, `npm run typecheck`, `npm run build`.
Development preview: http://localhost:3000/ (existing webpack dev server).
Static export preview: http://127.0.0.1:4173/ .

Chromium widths 360, 390, 768 and 1440px passed overflow checks. Inspected desktop/tablet/mobile screenshots against the baseline. Keyboard disclosures and skip link, active navigation, pause/resume, live reduced-motion changes and no-JS fallback tested. Static homepage, Enterprise and Shopify routes/refreshes plus CV downloads pass without recorded console/page errors. No cross-engine, screen-reader or Lighthouse benchmark claims.

## Boundaries

Keep untracked `AGENTS.md`, `CLAUDE.md`, `public/fonts/` untouched and uncommitted. Do not modify portrait bytes, CVs, Shopify app source, project selection or deployment workflow. Other factual correction questions remain pending; do not change those claims without approval.
