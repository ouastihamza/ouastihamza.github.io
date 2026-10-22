# Portfolio redesign: progress

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
