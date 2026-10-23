# Codex handoff: woodland portfolio redesign

## Current milestone — stop for owner review

Branch: `feature/interactive-portfolio-redesign`. Milestone 4 refines the existing woodland identity and content hierarchy. The owner explicitly requested a feature-branch commit only: do not merge, push or deploy to main. Main remains at `ac15e03`. Previous publication approvals were for earlier milestones, not this one.

## Implemented

- Real centered portrait and kinetic identity ring preserved. Desktop stage is 520px maximum, portrait 80% of stage; ring typography 22 SVG units desktop / 24 mobile, full-circle spacing. Name/title colors preserved.
- 60-second rotation, independent scroll offset up to 12 degrees and portrait translation up to 18px. Pause control moved to hero utility row to avoid obscuring letters. Reduced-motion and no-JS fallbacks preserved.
- Introduction/metadata emphasize full-stack work, integrations and advanced troubleshooting. Existing apprenticeship claim and schedule remain as secondary content.
- Three concise Judge.me highlights and a separate freelance card. All original experience details remain in a native disclosure.
- Distinct Enterprise and Shopify/Sanity panels; full architecture, technologies, scope and caveats remain in disclosures / case study. New Shopify/Sanity visual is a labelled architecture diagram, not a screenshot. Existing Technical Studies screenshot and app unchanged.
- 14 core skill cards initially, remaining 17 inside a native “View all skills” disclosure, plus all six original descriptions. Server-rendered logo data, no new client boundary or dependency. Hover enhancement remains delegated; grid-level reveal avoids excessive repeated animation.
- Skills/About navigation, active-section state and stable-height sticky header. Narrow screens use a two-row link grid next to the wordmark.
- `app/editorial.css` owns the new presentation/disclosure layouts. `woodland.css` owns portrait/motion. Shared tokens remain in `globals.css`.

## Facts awaiting approval

See `CONTENT_REVIEW.md`. July 2026 versus owner-mentioned August 7, 2026 promotion; official Master's titles/dates/status; 10,000+ ticket source and period; current location; employment duration; CDI versus alternance availability. No uncertain factual values were changed. Do not replace dates or claim CDI availability without owner confirmation.

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

Keep untracked `AGENTS.md`, `CLAUDE.md`, `public/fonts/` untouched and uncommitted. Do not modify portrait bytes, CVs, Shopify app source, project selection or deployment workflow. Stop for owner review of this milestone and factual correction list.
