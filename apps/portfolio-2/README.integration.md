# Shopify Commerce Engineering / Shopify Technical Studies

React 18 / TypeScript / Framer Motion / Vite standalone static sub-app. The parent Next.js build runs Vite first, then copies its HTML into `/projects/shopify-technical-studies/`. Assets stay at `/portfolio-2-assets/`. `/projects/portfolio-2/` remains a legacy redirect. No Shopify credentials, live store, iframe, backend or environment variables are required.

Milestone 1 adds a dark editorial homepage, source directory, audience/search filters and fragment-addressable walkthroughs. Existing structured-data, DOM lifecycle and integration stories retain their diagrams and interactions; explicit Previous/Next controls work on mobile and desktop. The outer page no longer intercepts wheel/key scrolling. The methodology and contact sections remain accessible.

Preview: `npm run build` at repository root, then `npm start` and open `http://127.0.0.1:4173/projects/shopify-technical-studies/`. For hot reload: `npm --prefix apps/portfolio-2 run dev -- --host 127.0.0.1 --port 5173`, then `/portfolio-2-assets/`. The parent Next dev server does not rebuild the standalone Vite bundle automatically.

No live inspector, performance analyzer or news feed is claimed. All depicted store data is illustrative. See `docs/shopify-commerce-engineering/AUDIT.md` and `EDITORIAL_WORKFLOW.md` for accuracy findings and deferred work. Work remains on the feature branch for visual review; no main merge/deployment.

## Walkthrough scrolling (2026-10-23)

On desktop with a mouse or trackpad, wheel over a walkthrough preview moves one step per gesture; wheel anywhere else scrolls the page, and step 1 and the last step release the wheel to the page. Touch and narrow layouts use the Previous / Next step bar only. The shared logic is `src/components/WalkthroughPreview.tsx`. Run `tests/shopify-scroll.browser.js` through Playwright browser_run_code against the built static server on port 4173; it reports every failed check at once. Details and limitations are in the redesign PROGRESS.md.
