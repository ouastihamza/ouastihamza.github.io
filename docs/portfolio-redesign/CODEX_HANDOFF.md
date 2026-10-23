## 2026-10-23 — Wheel stall fix and view switching

- Bug (owner, real trackpad/mouse in Chrome): with the pointer held still, the wheel sometimes did nothing, neither a step change nor page scroll, until the mouse moved.
- Root cause, reproduced in Playwright: the gesture lock only reset after 220ms of wheel silence. A steady wheel spin (notches 60–180ms apart) changed one step, then every later notch was cancelled for as long as the spin lasted. Moving the mouse "fixed" it only by creating a pause.
- Second cause, found by the new regression test: in Technical View, the old nested-scroll `.simulation-board__viewport` (`overflow: hidden`, `overscroll-behavior: contain`, content 10px taller than the box) acted as a scroll boundary. At step 1 and the last step the preview released the wheel, but the page still did not scroll. `publication.css` now resets it to `overflow: visible; overscroll-behavior: auto`.
- Ruled out: wheel events delivered to removed nodes (none observed, including over content rebuilt between steps), and the "explanation on screen" check (it releases the wheel to the page, never cancels it). Real trackpad scroll phases cannot be emulated headlessly, so latching is also guarded against defensively.
- Fix in `WalkthroughPreview.tsx`:
  - Input that keeps arriving at notch strength (40px or more, not fading), or rises for three events in a row, counts as a new push. A steady spin changes a step about every 550ms. Fading trackpad momentum is still absorbed as one gesture.
  - As a last resort, input is never held back for more than 3s after a step; after that it scrolls the page.
  - One window-level listener hit-tests the pointer against the preview, and falls back to `elementFromPoint` if the event target is no longer in the page.
  - Findings badges (`StudyFindings`) keep fixed positional slots, so step changes update text instead of replacing nodes under the pointer.
- Change: switching between Merchant View and Technical View restarts the walkthrough at step 1 (reverses "switching keeps the step"). Clicking the active view does nothing.
- Test: new still-pointer block in `tests/shopify-scroll.browser.js`. For every lab and view, with the pointer fixed over changing content: a 30-notch steady spin and repeated flicks through every step and back. Fails if any wheel event hits a removed node, or input runs without moving the step or the page for more than 1s (spin) or 3.2s (flicks, whose fading tail is absorbed). Events where the step is at an end and the page is already at its limit are excluded. Each view also fails if any preview element sets `overscroll-behavior`. View-switch checks now expect step 1.
- Limitation: a non-passive wheel listener on window makes every page wheel event wait for the main thread. The page is light and no jank was observed, but it is a trade-off for latching safety.

## 2026-10-23 — Dual scrolling and coordinated walkthrough layout

Supersedes the scrolling repair below on wheel behaviour: the owner revised the brief to ask for intentional dual scrolling.

- Wheel model (`apps/portfolio-2/src/components/WalkthroughPreview.tsx`, shared by all three labs):
  - Desktop with a fine pointer (1121px and wider) only. Wheel over the preview moves one step; wheel anywhere else scrolls the page.
  - One step per gesture: 40px of wheel travel accepts a step, then the gesture is consumed until 220ms of wheel silence and at least 550ms since the last step. Line and page delta modes are normalised.
  - Step 1 and the last step release the wheel to the page. Momentum from the gesture that reached the boundary is still consumed, so the page does not jump.
  - Inputs, selects, textareas, contenteditable, textbox/combobox/listbox roles, `[data-wheel-passthrough]` and nested scroll areas keep their own wheel. Ctrl+wheel and horizontal scrolling are ignored. Steps never change while the explanation is off screen.
  - One non-passive listener per preview, removed on unmount; current step read through a ref, so no stale state.
- Layout: desktop is 37% explanation / 63% preview. Explanation panel has a fixed height (250px, 226px from 1280px) so Previous / Next never move. Stacked layouts (1120px and narrower) put the explanation directly above the preview (8px gap) and keep the step bar at the bottom of the screen while the lab is in view; no wheel interception, no nested scrolling.
- Clarity: shared `StudyStep` component shows step number, title, what to look at and "Why this matters". Structured Data has separate Merchant and Technical copy for all 13 steps; switching views kept the step (changed below: now restarts at step 1). Every step highlights its exact element with one `is-focus` outline; inactive areas stay readable.
- Lifecycle and integration labs: absolute overlays replaced by a reserved findings strip, product cards compacted, long caveats moved into "Notes and sources" disclosures below each lab. Structured Data merchant preview gained a product thumbnail for the image step; the enhanced result now repeats the real description instead of placeholder copy.
- Audit: only Structured Data (13 steps), Storefront DOM lifecycle (6) and Integration coexistence (7) exist. No performance, webhook, metafield or metaobject labs exist yet; nothing was created for them.
- Verification: lint, root typecheck, Vite typecheck, production build and `git diff --check` pass. `tests/shopify-scroll.browser.js` passes with no console errors: 1366×768, 1440×900, 1920×1080 × three labs (both Structured Data views), touch 375×812, 390×844, 768×1024, plus exclusion fixtures. It checks wheel inside/outside, trackpad flick and momentum, boundaries, buttons, keyboard, reduced motion, view switching, explanation + highlight + controls visible together on every step, controls and preview not moving, layout shift score under 0.1, mobile gap, sticky step bar, no nested scrolling and no overflow. Screenshots reviewed at all sizes.
- Not tested: physical trackpads and mouse wheels, Safari, Firefox, screen readers. Momentum is simulated with decaying wheel events.
- The test now runs every check and throws once with all failures. Run it as before (browser_run_code on port 4173), or with any Playwright runner that passes a page.
- Stop for owner review. Content expansion (older brief milestones 2–5) not started. Do not merge or deploy.

## 2026-10-23 — Scrolling repair, milestone 1 (wheel behaviour superseded above)

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
