# Codex handoff: interactive portfolio redesign

Read this first. It assumes you haven't seen any earlier conversation. Then read `ANALYSIS.md` (facts about the code) and `DESIGN_PLAN.md` (the proposal). Track progress in `PROGRESS.md`.

Labels used below:

- **[Confirmed]**: checked in the repository on 2026-10-22.
- **[Proposal]**: a plan the owner hasn't built yet. Owner approval is still needed where noted.

## 1. What this project is

- **[Confirmed]** The personal portfolio of Hamza Ouasti, a Full-Stack Developer / Software Engineer in Greater Paris who is looking for a work-study apprenticeship.
  - Live at https://ouastihamza.github.io/ (deployed from `main`).
  - Repo: https://github.com/ouastihamza/ouastihamza.github.io
- **[Confirmed]** Next.js 16 + React 19 + TypeScript, **static export** to GitHub Pages. Plain CSS in `app/globals.css`, no Tailwind, no animation library.
- **[Confirmed]** A separate Vite + React 18 + Framer Motion app lives in `apps/portfolio-2/`. It's served at `/projects/shopify-technical-studies/`. **It's out of scope for this redesign.**

## 2. What the owner wants

**[Proposal]** A modern, interactive, polished developer portfolio that still reads as a serious engineer's site:

- A dark background with subtle stars.
- A **technology grid** of purple-bordered cards with logos, glow on hover and a slight 3D tilt.
- The owner's **real photo as a floating 2.5D cutout** in the hero.
- **Scroll-driven storytelling**: the hero portrait shifts as you scroll, tech cards stagger in, background layers move at different speeds, and later sections reveal smoothly.
- Keep all existing content: experience, projects, education, contact and CVs. Don't cut content to look minimal.

## 3. Design references

- **[Confirmed]** No reference screenshots are in the repo. The owner described them in words:
  - A dark, possibly starry background.
  - A responsive grid of rounded rectangular cards with purple borders, each with a logo and a name.
  - On hover: a purple glow or gradient and a slight 3D tilt.
  - Smooth, not flashy.
- Use the references for **look and feel only**. Don't copy their technology list.
- If screenshots are added later, they go in `docs/portfolio-redesign/references/`.

## 4. Technology cards

**[Proposal]** Full spec in `DESIGN_PLAN.md` section 3. Summary:

- Content comes **only** from technologies the repo backs up (`app/data/profile.ts` `skillGroups`, experience and project data). See `ANALYSIS.md` section 9.
  - **Don't add** Playwright, GitHub or Java unless the owner confirms.
- Groups: Languages, Frontend, Backend, Databases, Tools, Platforms (and AI, optional).
- Card: 16px radius, dark fill, thin purple border, monochrome logo + name. Grid uses `repeat(auto-fill, minmax(140px, 1fr))`.
- Hover:
  - Border brightens, purple glow, a cursor-following soft light, about 3px lift.
  - Tilt up to about 8 degrees, only for fine pointers, and off with reduced motion.
  - One delegated, rAF-throttled pointer listener writes CSS variables. No per-card React state.
- Entrance: reuse `ScrollReveal` with `data-reveal` + `stagger()`. Short fade + rise, about 50 to 70 ms between cards.
- Logos: the `simple-icons` package, inlined at build time by a server component. Monogram or `lucide-react` fallback where there's no logo.

## 5. The owner's portrait

- **[Confirmed]** **The photo isn't in the repo.** There's no portrait file anywhere. This is a **missing asset**.
- **[Proposal]** Expected location of the original: `public/images/hamza-original.jpg`.
  - Warning: everything in `public/` is deployed and public. Ask the owner whether the original may be committed. The recommendation is to keep it out of git (add it to `.gitignore`) and commit only the cutout.
- **[Proposal]** The processed file: `public/images/hamza-cutout.webp`.
  - Transparent background, about 900 to 1200px tall, under about 150 kB.
- **Never** create a placeholder, stock image or AI-generated face and present it as the owner.
  - Until the real cutout exists, build the portrait component so it renders nothing, or a clearly neutral empty stage, when the image is missing.
- Background removal is a one-off offline step, not part of the build.
  - It must keep the face and features exactly: no retouching, no regeneration.
  - The owner approves the result.
- Effect: **layered 2.5D, not Three.js.** Layers, back to front:
  - Glow.
  - Orbit ring(s).
  - Cutout with a subtle purple rim light.
  - Contact shadow.
  - Optional small floating chips.
- Motion:
  - Slow CSS float (6 to 8 s, about 8px).
  - Pointer tilt/parallax ±6 degrees, fine pointers only.
  - Scroll: rise, shrink to about 0.85 and fade slightly as the hero leaves.
  - All off under reduced motion.

## 6. Scroll interactions

**[Proposal]** Full sequence in `DESIGN_PLAN.md` section 5.

- New section order (owner to confirm):
  1. Hero
  2. Skills
  3. Experience
  4. Projects
  5. About & Education
  6. Contact
- Renumber the eyebrows (`01 / ...`). Add a Skills link to `app/header.tsx`.
- **No pinning and no scroll-jacking.** Keep normal scroll length.
- Scroll-linked effects:
  - Use CSS scroll-driven animations inside `@supports (animation-timeline: view())`.
  - Fallback: one small client component that sets `--hero-progress` from a passive rAF-throttled scroll listener (copy the pattern in `app/header.tsx`).
  - With neither, the page is static and fully readable.

## 7. Branch

- **[Confirmed]** Work on **`feature/interactive-portfolio-redesign`**.
  - It was created from `portfolio-refresh` (`d7bf753`). If `git ls-remote origin feature/interactive-portfolio-redesign` shows nothing, it has not been pushed yet; ask the owner.
- **[Confirmed]** `portfolio-refresh` holds 10 newer commits that aren't on `main` (CVs, `profile.ts`, signature hero). That's why it's the base.
- **[Confirmed]** `main` is what's live. **Don't push or merge to `main`.** Pushing `main` deploys the site.

## 8. Already done

- **[Confirmed]** Repository analysis (`ANALYSIS.md`).
- **[Confirmed]** Design plan (`DESIGN_PLAN.md`).
- **[Confirmed]** Branch created locally. The first push attempt (2026-10-22) was refused by GitHub (wrong account); the owner pushes it.
- **[Confirmed]** Baseline on the base commit: `npm run lint`, `npm run typecheck` and `npm run build` all passed (locally on Node 20.19.6; CI uses Node 22).
- **Nothing in the redesign is implemented.** No site code was changed.

## 9. Not done yet

- Purple palette tokens and star background.
- Tech grid data, component, logos and styles.
- Card hover, glow, tilt and staggered entrance.
- Portrait asset: photo missing, cutout not made.
- Portrait component and motion.
- Scroll-linked hero → skills transition and star parallax.
- Section reorder and nav link.
- Responsive, accessibility and performance passes. Final production build check.

## 10. Files to read first

1. `app/page.tsx`: the whole home page and the current section order.
2. `app/globals.css`: tokens (top of file), hero, signature, reduced-motion blocks, breakpoints (1000 / 900 / 680px).
3. `app/data/profile.ts`: `skillGroups` is the source of truth for skills.
4. `app/data/projects.ts`: project technologies.
5. `app/scroll-reveal.tsx` and `app/stagger.ts`: the existing entrance animation system.
6. `app/header.tsx`: the rAF scroll pattern and nav.
7. `app/signature.tsx`: the hero name. Keep it.
8. `app/layout.tsx`: metadata, and where to import new CSS files.
9. `package.json`, `next.config.ts`, `.github/workflows/deploy-pages.yml`.

## 11. Dependencies

- **[Proposal]** Add only `simple-icons` (for logos). Pin an exact version, matching how `package.json` pins everything else.
- Don't add GSAP, Three.js, particle libraries or Framer Motion to the main site.
- If CSS turns out not to be enough for scroll effects, the fallback is the `motion` package's vanilla `scroll`/`animate` API. Ask the owner first.
- Don't migrate frameworks. Don't touch `apps/portfolio-2` dependencies.

## 12. Code to reuse

- `ScrollReveal` + `data-reveal` + `stagger()` for all entrances.
  - Note: it skips `[data-reveal]` nested inside another `[data-reveal]`.
  - It caps the stagger at 3 steps (`Math.min(stagger, 3) * 70`). Raise the cap or add a CSS delay for grid cards. Don't break the existing sections.
- Tokens `--ease-out`, `--duration-*` and the reduced-motion media query patterns.
- The rAF-throttled scroll listener in `header.tsx`.
- `lucide-react` (already installed) for non-brand fallback icons.

## 13. Implementation order

Follow `DESIGN_PLAN.md` section 10:

1. Palette tokens + star background + section reorder + Skills nav link.
2. Static tech grid (data, component, logos, responsive).
3. Card interactions (glow, tilt, entrance, reduced motion).
4. Portrait component, built to handle a missing image. Stop and ask for the photo.
5. Portrait motion (float, pointer parallax).
6. Scroll-linked hero → skills effect and star parallax.
7. Responsive, accessibility and performance passes.
8. Production build check. Then hand back to the owner.

Commit in small steps, one milestone per commit. Tick `PROGRESS.md` as each step is actually done.

## 14. Run, build, test

Use Node 22.13+ (per `package.json` `engines`) and npm:

```sh
npm ci                 # also builds the signature and installs apps/portfolio-2 deps
npm run dev            # dev server (builds the sub-app first)
npm run lint           # oxlint
npm run typecheck      # tsc --noEmit
npm run build          # full static export to out/ (+ sub-app + checks)
npm start              # serve out/ at http://127.0.0.1:4173
```

- All of `lint`, `build` and `typecheck` must pass. CI runs them on `main`.
- Manual checks:
  - Widths 360 / 390 / 768 / 1024 / 1280 / 1440 px.
  - Keyboard-only navigation.
  - OS reduced-motion setting turned on.
  - Lighthouse (mobile).
  - Chrome, Safari and Firefox.

## 15. Do not change or delete

- Don't push to, merge into or rewrite `main`. Don't force-push any branch. Don't delete `portfolio-refresh`.
- Don't remove or reword real content (experience, projects, education, contact, CV links) unless the owner asks.
- Don't rename or move `public/Hamza_Ouasti_CV_EN.pdf`, `public/Hamza_Ouasti_CV_FR.pdf`, `public/robots.txt`, `public/sitemap.xml` or `public/images/shopify-technical-studies.webp`.
  - `scripts/finalize-static.mjs` checks they exist.
- Don't change `apps/portfolio-2/`, `scripts/finalize-static.mjs`, `scripts/build-signature.mjs`, `next.config.ts` (static export) or the deploy workflow unless the task requires it.
- Keep the signature hero (`app/signature.tsx`) and the `sr-only` name in the `h1`.
- Don't commit `public/fonts/`. It's the owner's untracked local experiment, and it may not exist in your checkout.
- Don't commit `.env*`, `.context/`, `out/`, `.next/` or generated files (see `.gitignore`).
- Don't name the real client company behind the AI project anywhere. The case study describes it generically on purpose.
- Don't invent skills, and don't use a fake portrait.

## 16. Open decisions and limits

- Purple across the whole site, or only the skills section? (Recommended: whole site, as a token swap.)
- Move Skills up to right after the hero? (Recommended: yes.)
- Playwright, GitHub or Java cards? (Default: no.)
- Where the original photo lives, and who removes the background. (Recommended: keep the original out of git.)
- Adopt a web font such as Geist? (Separate task, not required.)
- Reference screenshots aren't available. The design is based on the written description.
- CSS scroll-driven animations aren't supported in every browser. That's why the JS fallback and static fallback are required.
