# Codex handoff: woodland portfolio redesign

## Current direction — supersedes the purple proposal

The owner rejected the split purple/green styling and requested one natural visual identity inspired by their real portrait. The original ANALYSIS.md and DESIGN_PLAN.md are historical references. This document and the latest PROGRESS.md entry describe the implemented direction.

Work only on `feature/interactive-portfolio-redesign`, based on `portfolio-refresh`. Never merge, force-push, deploy or push main without a new user request. The GitHub account `ouastihamza` has push access. The owner subsequently approved the centered ring, requested distinct muted colors for the three text segments, and authorized pushing and merging this milestone into main for publication.

## Implemented

- One forest-charcoal, sage, olive and fog palette throughout the main portfolio and Enterprise case study. Removed purple/starfield and neon-green theme colors. Original technology brand colors are preserved, with light backings for dark marks.
- Centered real portrait with an SVG text-on-path identity ring: name and titles rotate once every 80 seconds. Accessible H1 mirrors the decorative ring; readable role, summary and original CTAs sit below. Handwritten signature component, generator, bundled font and opentype.js dependency removed.
- Centered composition on desktop and mobile with restrained woodland atmosphere. Ring and portrait use separate transform layers.
- Actual transparent portrait, separate from the original photo, with soft ambient depth and a bottom fade. No generative portrait is used.
- Sparse decorative botanical SVG outlines at hero/contact edges, 5.5% opacity, hidden from accessibility APIs.
- Desktop 4px float; pointer movement limited to 5px horizontally and 4px vertically; scroll offset capped at 24px; branch scroll offset capped at 12px. No face/body rotation or distortion. Ring rotation and float have a keyboard-accessible pause/resume control. Reduced motion disables movement, including when changed at runtime. Without JavaScript the portrait and ring remain visible and static, and the motion control is hidden.
- Existing 31 skill cards, labels, detailed descriptions, hover tilt and progressive reveal preserved. All experience/project/education/contact content, links and CV files preserved. The standalone Shopify project keeps its own original design and code.

## Files and boundaries

- `app/globals.css`: shared palette and existing styles, obsolete signature CSS removed.
- `app/woodland.css`: hero composition, portrait layers, botanical placement and shared surface refinements.
- `app/hero-portrait.tsx`: server-rendered photo and decorative layers.
- `app/portrait-motion.tsx`: small client enhancement; passive listeners, rAF throttling, complete cleanup and live motion-preference handling.
- `app/botanical.tsx`: lightweight inline vector decoration.
- `app/tech-grid.tsx` / `.css`: original brand colors and shared forest surfaces. Icon library remains server-side.
- `app/page.tsx`, `app/layout.tsx`, `public/favicon.svg`: composition, stylesheet import and matching favicon.
- No added dependency, framework or deployment changes; removed unused signature dependency and build hooks.

## Photo provenance and processing

Source from GitHub main, retrieved as a single file without merging:
`public/images/WhatsApp Image 2026-10-22 at 14.18.17.jpeg`.

Local original: `public/images/hamza-woodland-original.jpeg`.
Site asset: `public/images/hamza-woodland-cutout.webp`.

A built-in image-editing attempt was rejected because it changed facial detail. A macOS foreground mask retained the source image but left a fringe; the owner explicitly requested finer ear/hair edges. The final mask refinement is documented in PROGRESS.md. Preserve the actual source subject; never substitute a generated face. Processing tools are offline and outside the project dependencies; the site serves only the optimized asset.

Measured median source samples: sweatshirt `#67927f`, moss `#464e2e`, sky `#d5dce0`, woodland `#9a9b81`, scarf `#020816`. UI tokens deliberately adjust those colors for dark surfaces and text contrast: background `#111813`, surface `#1c2720`, card `#202c25`, sage `#739884`, text accent `#9eb9a8`, olive `#a5a897`, fog `#dee1da`, text `#f0f1ec`, muted `#acb6ad`.

## Preview and verification

Use Node >=22.13. `npm run lint`, `npm run typecheck`, `npm run build`.
Dev: http://localhost:3000/ — started with `npm run dev -- --webpack --port 3000`.
Static export: http://127.0.0.1:4173/ via `npm start`.

Chromium responsive checks cover 360, 390, 768, 1024 and 1440px; no horizontal overflow. Desktop/tablet/mobile and all main sections were visually inspected. Motion, preference switching, no-JS fallback, CV/image responses and project routes were checked. No page errors found. Safari/Firefox, assistive-technology testing and Lighthouse benchmarking are not claimed.

## Stop here

The centered identity-ring milestone is approved for publication. Name/title ring colors are off-white, sage and muted sand. Do not add elaborate transitions, a new font, scroll pinning, new content or further project curation without that review.

Keep untracked `AGENTS.md`, `CLAUDE.md`, `public/fonts/` untouched and uncommitted. Keep CV paths, project screenshots, Shopify source, static-export configuration and deployment workflow unchanged. Existing dependency advisories noted in the prior milestone are separate work.
