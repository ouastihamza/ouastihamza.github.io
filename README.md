# Hamza Ouasti — GitHub Pages portfolio

Public destination: https://ouastihamza.github.io

This is an independent deployment copy of the existing portfolio. Its design, content, CV, project pages and Shopify Technical Studies application are preserved. The existing hosted site and its source checkout are unchanged.

## Run and verify

Use Node.js 22.13 or newer (Node 22 is used by Actions).

```sh
npm install
npm run lint
npm run build
npm run typecheck
npm start
```

The production build uses Next.js’s supported Webpack mode to avoid a local Turbopack CSS-worker port restriction, and writes `out/`. `npm start` serves that directory at http://127.0.0.1:4173, with normal directory-index behavior and real 404 responses, not an SPA fallback. Use it to preview the complete site, including Shopify.

## Static compatibility

The original checkout used Vinext, Cloudflare and Next-compatible App Router source, with an empty next.config.ts. It had no configured Git remote; Sites source had been pushed to a private Sites Git endpoint with per-command authentication. This copy has its own Git history and GitHub origin.

This deployment uses Next.js 16.3.4 with `output: 'export'`, `trailingSlash: true` and unoptimized static images. There is no basePath. The home and Enterprise AI pages render at build time. There are no dynamic routes, server actions, cookies, runtime environment variables, persistent backend or data-fetching APIs in the portfolio.

The original Shopify route handler served a complete Vite-built HTML document. The build now copies that same document to `out/projects/shopify-technical-studies/index.html`. Its React 18 runtime, original components, CSS and hashed assets remain independent. No iframe is used. `scripts/finalize-static.mjs` also writes an HTML redirect for the old `/projects/portfolio-2/` URL; GitHub Pages cannot emit the former custom HTTP 308 response. The redirect includes a usable fallback link.

Fonts remain the original Google Fonts/Fontshare fonts with fallback fonts. They are external HTTPS assets, not server dependencies. The screenshot and supplied CV are local static files. No custom OpenGraph image existed, so no image URL is invented; OpenGraph titles/descriptions and canonical URLs use the GitHub Pages origin. robots.txt and sitemap.xml use the same origin. Existing public GitHub and LinkedIn links remain unchanged.

## Deploy

The repository must be named exactly `ouastihamza.github.io` and public for this free GitHub Pages setup.

GitHub CLI authentication was invalid during preparation, so no repository was created or pushed. The unauthenticated repository lookup returned 404; this does not establish whether an inaccessible private repository exists.

1. Sign in:

```sh
gh auth login --hostname github.com --web --git-protocol https
gh auth setup-git
```

2. Inspect the target before creating it:

```sh
gh repo view ouastihamza/ouastihamza.github.io
```

If it does not exist, create an empty public repository (no README or license initializer):

```sh
gh repo create ouastihamza/ouastihamza.github.io --public --description "Hamza Ouasti — software engineering portfolio"
```

If it already exists, inspect its contents and history first. Do not force-push or overwrite unrelated content.

3. From this folder, push the prepared main branch:

```sh
git remote -v
git push -u origin main
```

4. On GitHub open **ouastihamza.github.io → Settings → Pages → Build and deployment → Source → GitHub Actions**.

5. Open **Actions → Deploy portfolio to GitHub Pages → Run workflow → main**. Subsequent pushes to main deploy automatically. If the first push ran before Pages was enabled, rerun its failed workflow after step 4.

The workflow `.github/workflows/deploy-pages.yml` checks out the source, installs Node, uses `npm ci` (including the isolated Shopify dependencies), lints, builds, typechecks, uploads `out/` and deploys with official Pages actions. No access token needs to be stored as a repository secret.

## Verification performed

- npm install, lint, Next.js production export and TypeScript check.
- Playwright on a plain static server: home, Enterprise AI and Shopify at 1440×900 and 390×844, direct loads and reloads, no horizontal overflow, no page errors or failed HTTP responses in the recorded run.
- Shopify navigation, technical-view switching, return link, project screenshot loading and CV download.
- Visual inspection of desktop/mobile screenshots; design retained.

Dependency audit reported one high-severity transitive root dependency advisory (undici), and seven advisories in the inherited Vite sub-app toolchain. An optional compatible audit update was blocked by the environment's automatic approval usage limit. These dependencies were not silently upgraded. Only static output is deployed; no development server is published. Review the advisories before exposing local development servers.

References: [Next.js static export](https://nextjs.org/docs/app/guides/static-exports), [official Next.js Pages workflow](https://github.com/actions/starter-workflows/blob/main/pages/nextjs.yml).
