# Portfolio redesign: design plan

**Status: proposal.** Nothing in this file is implemented yet. Facts about the current code are in `ANALYSIS.md`.

## 1. Direction

- Keep the professional identity: Full-Stack Developer / Software Engineer. Keep all existing content: experience, projects, education, contact, CVs.
- Make it feel modern and alive:
  - A dark "space" background.
  - A purple-accented technology grid.
  - The owner's real photo as a floating 2.5D object in the hero.
  - Calm, scroll-linked motion.
- Motion supports the content. It must never block reading, navigation or the CV download.
- Stay on the current stack: Next.js static export + plain CSS + small client components. No migration.

## 2. Visual system

- Palette (needs owner approval, see Open decisions):
  - Background stays near-black. Shift it slightly towards blue/violet, for example `#0b0b12`.
  - New purple accent tokens:
    - `--accent: #a78bfa`
    - `--accent-strong: #7c3aed`
    - `--accent-glow: rgba(139, 92, 246, 0.35)`
  - Recommendation: make purple the main accent across the whole site, done as a token swap on `:root`. Then the tech grid isn't the odd one out.
    - The lime can stay as a small second accent (for example the "Available now" dot) or be dropped.
- Background: two or three layers of CSS-only stars (`radial-gradient` dots on large tiles), moving at different speeds on scroll. No canvas needed.
- Typography: keep the signature hero. Consider a real web font, self-hosted with `next/font/local` (for example Geist, which is OFL). That's optional and separate.

## 3. Technology section

### Content

Use only technologies backed by `app/data/profile.ts` and the project data. The list is in `ANALYSIS.md` section 9.

Proposed groups and cards:

- **Languages**: JavaScript, TypeScript, Python, PHP, SQL, HTML, CSS, Liquid
- **Frontend**: React, Next.js, Angular, Hydrogen, Tailwind CSS
- **Backend**: Node.js, Express, FastAPI, REST APIs, GraphQL
- **Databases**: PostgreSQL, MySQL, MongoDB, ChromaDB
- **Tools**: Git, Docker, CI/CD, Vercel, Vite, Jira, pytest
- **Platforms**: Shopify, WooCommerce, BigCommerce, Sanity
- **AI** (optional, could fold into Backend): RAG, LLM APIs, embeddings

Rules:

- Playwright and GitHub stay off until the owner confirms them.
- Java stays off the grid unless the owner wants it. It's academic only (capstone).
- Keep the detailed text (`skillGroups` descriptions) somewhere, for example as a line under each group heading. Recruiters scan for words like "Storefront API" and "metafields".

### Card design

- Rounded rectangle (`border-radius: 16px`), dark card fill, 1px purple border at low opacity.
- Logo (32 to 40px) above the name. Name in the body font, about 15px.
- Responsive grid: `grid-template-columns: repeat(auto-fill, minmax(140px, 1fr))`.
  - About 6 per row on desktop, 3 on tablet, 2 on phone.
- Group heading above each group, in the existing `eyebrow` monospace style.

### Interactions

- Hover / focus-visible:
  - Border brightens.
  - Purple glow (`box-shadow` with `--accent-glow`).
  - A soft gradient spot that follows the cursor (`radial-gradient` at `var(--x) var(--y)`).
  - Card lifts 2 to 4px.
- Tilt: up to about 8 degrees `rotateX/rotateY` from pointer position, with `perspective` on the grid.
  - Only on `(hover: hover) and (pointer: fine)`.
  - Off under reduced motion.
- One pointer listener on the grid (event delegation), throttled with `requestAnimationFrame`.
  - It writes CSS variables (`--rx`, `--ry`, `--x`, `--y`) on the hovered card. CSS does the rest.
- Entrance: reuse `ScrollReveal`. Each group gets `data-reveal`, and cards use `stagger(index)`.
  - Note that `ScrollReveal` skips `[data-reveal]` nested inside another one. Put `data-reveal` on the cards *or* the group, not both.
  - Today `ScrollReveal` caps stagger at 3 steps. For a grid, raise the cap or add a separate card-level delay in CSS.
- Cards aren't links. Don't make them focusable unless they gain an action. The glow can still show on `:hover`.

### Logos

- Recommended: the `simple-icons` package (CC0 SVG paths). Import the needed icons in a server component, so the SVG is inlined into the static HTML and adds no client JS.
- Check each slug exists before relying on it. Some brands have been removed or renamed over time.
- Fallback for items with no logo (SQL, REST APIs, CI/CD, RAG, LLM APIs, Liquid if missing): a clean monogram or a matching `lucide-react` icon (already installed).
- Show logos in one colour (accent or white), not brand colours. That keeps the grid calm and avoids clashes.

## 4. Portrait: floating 2.5D

### Approaches compared

| Approach | Look | Cost | Verdict |
|---|---|---|---|
| A. Transparent 2D cutout + CSS transforms | Clean, a bit flat | Tiny, no dependency | Good base |
| B. Layered 2.5D (cutout + glow + rings + shadow, each moving at its own depth) | Convincing depth, premium | Small: CSS + one small client component | **Recommended** |
| C. Three.js (photo on a plane or a depth-mapped mesh) | Can be striking | +150 kB or more JS, WebGL on mobile, needs a depth map to look 3D, harder to keep accessible | Not worth it here |

### Recommended composition (B)

Layers, back to front, inside one `.portrait-stage` with `perspective`:

1. Large soft purple/blue radial glow (blurred).
2. Thin orbit ring(s) or a faint grid disc, slightly tilted. Pure CSS borders/SVG.
3. The cutout photo (`<img>` with real `alt` text, `width`/`height` set, `fetchpriority="high"`). It's the LCP candidate.
4. Rim light: a subtle purple `drop-shadow` filter on the cutout edge.
5. Contact shadow: a blurred ellipse below the figure. It scales with the float.
6. Optional: 2 or 3 small floating tech chips (for example "TypeScript", "React", "Node.js") at different depths.

Motion:

- Float: slow `translateY` loop (6 to 8 s, about 8px), CSS keyframes. The shadow scales in sync.
- Pointer: the stage tilts ±6 degrees. Each layer moves by a different amount (`translate3d` by depth) for parallax.
  - Only for fine pointers. Throttled with rAF. Eases back to rest on pointer leave.
- Scroll: as the hero leaves the viewport, the portrait moves up a little, shrinks to about 0.85 and fades a little. Back layers move slower than the figure.
- Reduced motion: the static composition only. No float, tilt or parallax.

### Assets needed

- `public/images/hamza-original.jpg`: the owner's original photo. **Not in the repo yet.**
  - Only the processed cutout needs to be public. Decide whether the original may be committed (see Open decisions).
- `public/images/hamza-cutout.webp`: transparent cutout.
  - About 900 to 1200px tall, under about 150 kB.
  - Optionally also `.avif`, with a PNG fallback only if needed.
- Background removal is done once, offline, not in the build. The result must keep the face and features unchanged: no retouching, no AI regeneration.
  - Check the edges (hair, shoulders) by eye on a dark background.

## 5. Scroll story

Order of sections (proposed):

1. Hero
2. Skills (tech grid)
3. Experience
4. Projects
5. About & Education
6. Contact

Moving Skills up matches the requested story. Renumber the eyebrows and add "Skills" to the header nav.

Sequence:

- **Hero (first screen)**
  - Signature draws in (existing).
  - Title and summary fade up (existing `hero-in`).
  - Portrait fades/scales in and starts floating. Stars drift slowly.
- **Hero → Skills**
  - Scroll-linked, inside the hero's own height: portrait rises, shrinks and fades.
  - Star layers move at different speeds.
  - The Skills heading reveals as it enters.
- **Skills**
  - Groups reveal one after another.
  - Cards stagger in about 50 to 70 ms apart, with a short fade + small rise (no flips, no long fly-ins).
  - Hover and tilt are active.
- **Experience, Projects, About, Contact**: keep the existing `data-reveal` entrances. Optional: a subtle purple border glow on project cards on hover, to match the grid.

Pinning / sticky:

- **Don't pin the hero or the skills section.** Pinning adds scroll distance, hides the content behind an animation, and is fragile on mobile Safari.
- Keep the existing sticky header. Section headings already use `.sticky-heading` in Skills/About on desktop. Keep that or drop it per section, but don't add scroll-jacking.

How scroll progress is measured:

- First choice: CSS scroll-driven animations (`animation-timeline: view()`), inside `@supports (animation-timeline: view())`. Zero JS.
- Where unsupported: one small client component sets `--hero-progress` (0 to 1) on the hero from a passive, rAF-throttled scroll listener.
  - It copies the `header.tsx` pattern. It runs only while the hero is on screen (IntersectionObserver).
- If neither runs, the page is simply static. Nothing is hidden.

## 6. Libraries

| Option | Use here? | Why |
|---|---|---|
| Native CSS + Web Animations API | **Yes, the default** | Already used, no cost, fits a static export |
| CSS scroll-driven animations | **Yes, as an extra when supported** | Smooth, off the main thread, zero JS, with a fallback |
| `simple-icons` | **Yes (only new dependency)** | Logos as inline SVG at build time, no client JS |
| Motion (`motion` package) | Only if needed later | Fine if the CSS approach gets too complex. Prefer the small vanilla `animate`/`scroll` API over `motion/react` components |
| GSAP + ScrollTrigger | No | Best for pinning and timelines, which this plan avoids. Adds weight |
| Framer Motion | No (main site) | Used in the sub-app only. It would add a client bundle to every page for effects CSS can do |
| Three.js | No | See the portrait comparison |
| Particle libraries (tsParticles etc.) | No | CSS star layers give the look for free |

What works with the current setup, with no new dependency:

- Tech grid layout, cards, hover glow, tilt, staggered entrances.
- Portrait layers, float, pointer parallax, scroll parallax.
- Star background, palette change, section reorder, nav update.

What needs a dependency:

- Brand logos (`simple-icons`). This is avoidable by pasting SVG paths into a data file by hand, at a maintenance cost.

## 7. Proposed files

These follow the repo's flat `app/*.tsx` style.

```
app/data/technologies.ts     Groups and cards: name, group, icon key (data only)
app/tech-grid.tsx            Server component: renders groups and cards, inlines logos
app/tech-tilt.tsx            Client component: one delegated pointer listener for tilt/glow CSS variables
app/portrait.tsx             Server component: portrait stage markup and layers
app/portrait-motion.tsx      Client component: pointer parallax + --hero-progress fallback
app/starfield.tsx            Server component: CSS star layers (no JS)
app/tech-grid.css            Styles for the grid (imported in layout.tsx)
app/portrait.css             Styles for the portrait and stars (imported in layout.tsx)
public/images/hamza-cutout.webp   Processed portrait (owner-supplied)
```

- `app/page.tsx`: insert the portrait in the hero, replace the Skills `<dl>` with `<TechGrid />`, and reorder the sections.
- `app/header.tsx`: add a Skills link.
- `app/globals.css`: palette tokens only. New styles go in the new CSS files, to keep `globals.css` from growing.

## 8. Mobile and desktop

- Desktop (over 1000px):
  - Hero is two columns: text + signature on the left, portrait on the right.
  - Tilt and pointer parallax are on.
- Tablet (681 to 1000px):
  - Portrait sits next to or below the text at a smaller size.
  - No tilt on touch devices.
- Phone (680px and under):
  - Portrait goes above or below the title, at about 60 to 70% of the viewport width.
  - Float only, a shorter scroll effect, 2-column card grid.
  - Must not push the CV button below the first screen.
- Touch: no hover-only information. Everything visible on hover is also visible without it.

## 9. Accessibility and performance requirements

- `prefers-reduced-motion: reduce`: no float, tilt, parallax or scroll-linked transforms. Entrances are off (`ScrollReveal` already does this).
- Content is visible without JS and before animations run. Never start content at `opacity: 0` in CSS that only JS reverses.
- Portrait:
  - Meaningful `alt` (for example "Portrait of Hamza Ouasti").
  - Decorative layers get `aria-hidden="true"`.
- Tech cards:
  - Logos `aria-hidden`, the name is visible text.
  - The group is a list (`<ul>`) with a heading.
- Colour contrast: text on cards at least 4.5:1. Purple borders are decoration only.
- Keep the skip link, focus styles and the `sr-only` heading text.
- Performance budget:
  - No new client JS beyond the two small components.
  - Animate only `transform`, `opacity` and `filter` (sparingly).
  - Use `will-change` only during interaction.
  - Pause loops off-screen where possible.
- Portrait image under about 150 kB, with explicit dimensions (no layout shift). Preload only if it's the LCP.
- SEO: keep the metadata in `layout.tsx` and the heading structure (one `h1`, section `h2`s). Update `sitemap.xml` only if routes change (they shouldn't).
- Test in Chrome, Safari (including iOS) and Firefox. Check Lighthouse on mobile: performance, accessibility, CLS.

## 10. Milestones (in priority order)

1. **Palette and background**
   - Purple tokens on `:root`, CSS star layers, section reorder, Skills nav link.
   - Check: no visual regressions in other sections.
2. **Tech grid (static)**
   - `technologies.ts`, `tech-grid.tsx`, logos, responsive layout, group headings.
   - Replaces the Skills `<dl>`. Keep the detail text.
3. **Tech card interactions**
   - Hover glow, cursor light, tilt (`tech-tilt.tsx`), staggered entrance, reduced-motion handling.
4. **Portrait asset** (blocked on the owner's photo): cutout produced and approved by the owner.
5. **Portrait component**: layered stage, float, pointer parallax, mobile layout.
6. **Scroll effects**: hero → skills transition (scroll-driven CSS + fallback), star parallax.
7. **Responsive pass**: 360, 390, 768, 1024, 1280 and 1440 px widths; touch devices.
8. **Accessibility pass**: keyboard, screen reader headings, reduced motion, contrast.
9. **Performance pass**: Lighthouse mobile, bundle size check, image weight.
10. **Production build**: `npm run lint && npm run build && npm run typecheck`, then `npm start` and a manual check.
11. **Owner review**, then merge to `main` (this deploys). Only with the owner's approval.

## 11. Open decisions (owner)

- Purple for the whole site, or only for the skills section?
- Section order: move Skills to right after the hero?
- Include Playwright, GitHub or Java cards?
- Where the original photo lives: commit `public/images/hamza-original.jpg` (it becomes public on the site), or keep it out of git and commit only the cutout? Recommendation: keep it out of git and add it to `.gitignore`.
- Who removes the background, and with which tool. The owner approves the result before it's used.
- Adopt Geist as the site font, using the untracked `public/fonts/` files? Separate from this redesign.
- Reference screenshots: if the owner shares them, add them to `docs/portfolio-redesign/references/` and update this plan.
