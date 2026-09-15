# Hamza Ouasti: developer portfolio

A portfolio for recruiters and engineers to explore my projects, Shopify technical demonstrations and CV.

[View the portfolio](https://ouastihamza.github.io).

## Contents

- Experience, education, contact links and French and English CV downloads.
- An Enterprise AI Assistant case study based on its public default branch.
- A project overview linking to [Shopify Sanity Hydrogen Starter](https://github.com/ouastihamza/shopify-sanity-hydrogen-starter).
- Shopify Technical Studies: interactive demonstrations of storefront debugging, structured product data and integrations. The examples use illustrative data, with no live Shopify connection.

## Stack and structure

The main site uses Next.js, React and TypeScript with static export. Project entries are in `app/data/projects.ts`. The Shopify demonstrations live in `apps/portfolio-2/` and use their own React, Vite and Framer Motion build.

`npm run build` builds the demonstrations, exports Next.js and runs `scripts/finalize-static.mjs`. That script places the demonstrations at `/projects/shopify-technical-studies/`, writes a redirect from `/projects/portfolio-2/`, and checks that expected static files exist. There is no runtime backend.

## Run locally

Use Node.js 22.13 or newer and npm. No environment variables are required.

```sh
npm ci
npm run dev
```

For the complete static site, including the Shopify demonstrations:

```sh
npm run lint
npm run build
npm run typecheck
npm start
```

Open `http://127.0.0.1:4173`. The build writes `out/`; `npm start` serves that output with directory indexes and 404 responses. Installation also installs the nested Vite application's dependencies.

## Deployment

`.github/workflows/deploy-pages.yml` runs on pushes to `main` or manual dispatch. It installs dependencies on Node.js 22, lints, builds, typechecks and deploys `out/` to GitHub Pages. Repository Settings > Pages must use GitHub Actions as its source.

## Limitations

Project descriptions are static content and need updating when project code changes. Fonts are loaded from external services. Shopify Technical Studies is an educational interface with simulated data.

## License

[MIT](LICENSE).
