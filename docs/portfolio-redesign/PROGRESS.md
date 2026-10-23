# Portfolio redesign: progress

## Shopify Commerce Engineering — Milestone 1 (2026-10-23)

Implemented in the commit containing this entry: `feat: establish Shopify commerce engineering publication`. Existing feature branch fast-forwarded to published portfolio main before work. No merge or deployment for this milestone.

- Audited all six original sections and confirmed independent React 18/Vite static sub-app architecture.
- Dark editorial homepage, audience/search directory, official-source directory and independent-publication identity. Shopify Technical Studies name and canonical URL retained for continuity.
- Original three technical stories, merchant/technical tabs, diagrams, methodology and contact retained. Native hash navigation replaces outer scroll interception; final steps accessible on all widths.
- High-priority caveats added for theme-editor-only event and non-guaranteed Google results; deeper content modernization remains pending.
- Root lint/typecheck/build and Vite typecheck/build pass. Chromium desktop/tablet/mobile, filters, empty state, keyboard controls, direct loads/refresh, history and legacy redirect verified. Zero overflow/console errors in final static checks.
- Detailed findings: `docs/shopify-commerce-engineering/AUDIT.md`; maintenance boundaries: `EDITORIAL_WORKFLOW.md`.
- Static preview: http://127.0.0.1:4173/projects/shopify-technical-studies/ . Hot reload: http://127.0.0.1:5173/portfolio-2-assets/ .
- Stop for owner visual review. News feed, researched guides, editable labs, automation and static article URLs are not implemented.

## Publication approval (2026-10-23)

Owner approved publishing the polish milestone and requested removal of the pause/resume button. Removed its UI, React state and unused CSS; automatic reduced-motion support remains. Prior milestone review-only restrictions are superseded by this approval.

## Owner clarification (2026-10-23)

Tier 2 promotion confirmed as July 2026. Existing site copy is correct; review notes updated. Other factual questions remain pending.

## Milestone 4 — editorial polish and recruiter hierarchy (2026-10-23)

Implemented in the commit containing this entry, `feat: refine portfolio hierarchy and recruiter experience`. Work is on `feature/interactive-portfolio-redesign`, fast-forwarded to the published mobile fix `ac15e03` before editing. No main merge, push or deployment for this milestone.

- [x] Existing woodland palette, actual portrait, all projects, CVs and case-study content preserved
- [x] Larger portrait/ring composition, stronger type, subtle independent scroll translation and 12-degree maximum ring offset; pause control moved out of the ring after mobile QA caught an overlap
- [x] Development-led introduction and metadata; existing availability information reduced in visual prominence, not changed factually
- [x] Shared editorial heading/body/metadata rhythm and improved muted text contrast
- [x] Judge.me role/company, three source-supported highlights, supporting tags and expandable original context; separate freelance panel
- [x] Enterprise and Shopify/Sanity project panels have distinct surface treatments, concise implementation focus, primary technologies and expandable technical details
- [x] Real Technical Studies screenshot retained; new commerce architecture graphic explicitly labelled, not a fake application screenshot
- [x] 14 core skill cards initially; all 31 cards and full descriptions accessible via native disclosure, including without JavaScript
- [x] Logo sizing / dark-mark contrast refinements; delegated hover interactions preserved, one shared core-grid reveal avoids repeated entrances
- [x] Skills/About navigation, active-section state including Contact at page bottom, stable header height and mobile two-row link grid
- [x] Lint, typecheck, production build and git diff --check pass
- [x] Chromium 1440, 768, 390 and 360px: no horizontal overflow; desktop/tablet/mobile and section screenshots inspected
- [x] Keyboard skip link, disclosure Enter toggling, 14-to-31 inventory, pause/resume and navigation verified
- [x] Runtime reduced-motion changes disable movement; no-JS fallback keeps portrait, static ring and expandable inventory
- [x] Static production homepage, Enterprise and Shopify routes / refreshes, both CV links pass; no console/page errors recorded
- [x] Original vs updated screenshots compared: availability moved below introduction, portrait enlarged, long experience copy grouped, Shopify starter now visually distinct, skills condensed from six open groups to two desktop rows
- [x] CONTENT_REVIEW.md lists factual approval questions; no uncertain dates, statistics, location or CDI availability invented
- [ ] Owner visual approval and factual corrections

Local preview: http://localhost:3000/ . Static preview: http://127.0.0.1:4173/ . Screenshots from this session are in `/private/tmp/polish-*`; these are QA artifacts, not website assets. Checked Chromium; no Safari/Firefox, screen-reader or formal Lighthouse performance score is claimed. Image dimensions and constant header height reserve layout space; decorative movement uses transforms and the existing rAF listeners, not scroll pinning or a new animation dependency.

## Mobile ring refinement (2026-10-23)

Enlarged mobile ring type from 17 to 24 SVG units, applied full-circumference spacing to textPath, and raised the ring above the portrait. Rotation is now 60 seconds instead of 80. Lint, typecheck and static build pass; Chromium widths 360, 390, 768 and 1440 have no horizontal overflow. Mobile screenshot inspected; reduced-motion fallback retained.

## Identity ring color refinement (2026-10-22)

Owner approved merging and publishing this milestone. Ring segments now use off-white for the name, sage for Full-Stack Developer and muted sand for Software Engineer, with neutral separators. Lint, typecheck, build and responsive Chromium checks pass; no horizontal overflow at 390 and 1440px.

## Milestone 3 — centered portrait and circular identity (2026-10-22)

Implemented in the commit containing this entry, titled `feat: center portrait with rotating identity ring`. Existing feature branch fast-forwarded to latest main before editing, preserving the About correction; main itself was not changed.

- [x] Centered desktop/mobile portrait composition, readable title/summary and original CTAs below
- [x] SVG identity ring with name and titles, 80-second rotation and subtle scroll depth
- [x] Approved refined transparent portrait reused byte-for-byte, with gentle float, shadow and pointer parallax
- [x] Keyboard-accessible pause/resume; runtime reduced-motion changes and static no-JavaScript fallback
- [x] Handwritten signature source, build generator, font and unused opentype.js dependency removed
- [x] All other portfolio content, navigation, CVs, projects, skills and woodland styling retained
- [x] Final lint, typecheck, production static build and git diff --check pass
- [x] Chromium at 360, 390, 768 and 1440px: no horizontal overflow; desktop/tablet/mobile screenshots inspected
- [x] Static production preview: keyboard pause, resume, reduced motion and restoring motion verified; no page errors
- [x] No-JavaScript portrait loads visibly, ring is static and pause control hidden
- [x] Both CVs, portrait, Enterprise detail and Shopify route return HTTP 200
- [ ] Owner visual review before proceeding

Preview: http://localhost:3000/ . Feature branch only; no main merge or production deployment. Browser checks are Chromium, not a claim of Safari/Firefox or assistive-technology testing.

## Milestone 2 — coherent woodland identity and real portrait (2026-10-22)

Implemented in the commit containing this entry, titled `feat: unify portfolio woodland design and real portrait`. This direction supersedes the purple proposal; stop for owner visual approval before adding more complex effects.

- [x] Exact photo retrieved from GitHub main without a merge; original retained separately
- [x] Photo inspected and representative sweatshirt, moss, sky, woodland and scarf colors sampled (see handoff)
- [x] Shared woodland tokens applied to header, hero, projects, Enterprise case study, skills, experience, education, contact, footer, buttons and favicon
- [x] Handwritten hero replaced by modern text typography
- [x] Responsive real-photo hero with restrained ambient depth, sparse botanical outlines, pointer movement, float and scroll parallax
- [x] Original technology brand colors restored, with neutral backings where needed; purple styling and starfield removed
- [x] Portrait mask refined after owner feedback: BiRefNet portrait segmentation via rembg 2.0.86, alpha matting, and targeted manual mask corrections removing the two background branches beside the head; no face generation
- [x] Original opaque subject pixels retained; soft edge color cleanup confined to the transparency boundary; WebP compression applied afterward
- [x] Final cutout: 958 × 822 transparent WebP, 107,288 bytes. Enlarged ear/hair inspection on forest and fog backgrounds, then inspected in the actual browser
- [x] Lint, typecheck, production build and diff whitespace checks pass
- [x] Chromium widths 360, 390, 768, 1024 and 1440px: zero horizontal overflow
- [x] Desktop/tablet/mobile and main section screenshots inspected; dark brand-logo legibility corrected
- [x] Pointer movement and scroll offset measured; reduced motion stops animations and clears transforms, and re-enabling restores float
- [x] No-JavaScript fallback retains the name, portrait and 31 cards; keyboard skip link remains available
- [x] Enterprise and Shopify pages load without page errors; CVs and portrait return HTTP 200
- [x] Existing portfolio content, project selection, links, CVs and Shopify app source preserved
- [ ] Owner visual approval of this milestone
- [ ] Broader Safari/Firefox, assistive-technology and Lighthouse review

Development preview: http://localhost:3000/ (webpack). Static export preview: http://127.0.0.1:4173/. No changes to main or production deployment. No runtime dependencies added for image processing. The rough macOS cutout and generative attempt were rejected; neither is shipped. The source and final image are under `public/images/hamza-woodland-original.jpeg` and `public/images/hamza-woodland-cutout.webp`.

The extraction model and temporary processing tools are outside the repository. [rembg](https://github.com/danielgatis/rembg) generated a mask locally, not a replacement person. Original source coordinates for the two manually corrected boundary regions were approximately x=510–534/y=445–516 and x=795–809/y=380–526.

## Historical milestone 1 status (superseded where noted above)

## Milestone 1 — interactive technology cards (2026-10-22)

Implemented in the commit containing this entry, titled `feat: add interactive technology cards`. Base: `47f7ce8`, branch: `feature/interactive-portfolio-redesign`.

- [x] Repository analysis and handoff reviewed independently
- [x] Confirmed existing feature branch descends from `portfolio-refresh`
- [x] Technology grid: 31 cards drawn from the existing skills, grouped under the six original headings
- [x] Original detailed skill descriptions preserved verbatim
- [x] Dark starfield, scoped purple palette, inline logos and generic icons for non-brand concepts
- [x] Hover glow, cursor light and up to five degrees of tilt per axis (fine pointers only)
- [x] Existing progressive scroll reveal reused on card wrappers, independently of card transforms
- [x] Responsive Chromium checks at 360, 390, 768, 1024, 1280 and 1440px: no horizontal overflow
- [x] Desktop, tablet and mobile screenshots visually inspected
- [x] Reduced motion and changing the preference after load: transforms disabled, variables cleared, animation resumes when re-enabled
- [x] JavaScript disabled and Next scripts blocked: all card content readable
- [x] Keyboard skip-link focus checked; informational cards do not add tab stops; decorative SVGs hidden from assistive technology
- [x] Production homepage, Enterprise detail and Shopify sub-app loaded without page errors; local links and both CVs return HTTP 200
- [x] `npm run lint`, `npm run typecheck`, `npm run build`, `git diff --check` pass
- [x] Development preview confirmed on the already-running server: http://localhost:3000/#skills
- [x] Correct GitHub account selected (`ouastihamza`), repository push permission verified
- [ ] Owner visual review before the next milestone
- [ ] Portrait asset supplied and approved; no fake image added
- [ ] Portrait motion, star parallax and scroll storytelling
- [ ] Broader Safari/Firefox, assistive technology and Lighthouse review
- [ ] Production deployment approved (not requested; do not deploy)

## Scope and implementation notes

The purple palette is confined to Skills for this first review. Section order and navigation remain unchanged. Hero/signature, projects, experience, education, contact, CVs and Shopify source are untouched. `simple-icons@16.35.0` is the only new dependency; icon data stays in the server component. The small client enhancement uses one delegated pointer listener, rAF and no React state or permanent `will-change`.

Performance review for this milestone is structural, not a Lighthouse score: no animation library, continuous animation, extra font or image requests. No simple-icons logo data appears in client JS. Full performance benchmarking remains pending.

`npm audit` reports five advisories (two high, three critical) in existing packages: next, oxfmt, sharp, source-map-js, tinypool. No affected package/version was introduced by this change. Dependency remediation is separate work.

Preexisting untracked `AGENTS.md`, `CLAUDE.md` and `public/fonts/` are intentionally excluded. No changes were made to the old checkout, main, the deployment workflow or production hosting.
