# Content maintenance and milestone boundaries

## Implemented in Milestone 1

The homepage catalogue lives in `apps/portfolio-2/src/data/publication.ts`: study titles, descriptions, audiences, prerequisite knowledge, step counts and official source links. It is version-controlled, bundled locally, and never fetched from an AI service. The original technical studies remain in `src/sections/`. The guide area currently links only to the existing methodology note. Intelligence is an explicitly labelled source directory, not a news feed.

Review editorial changes in Git, run the root lint/typecheck/build commands, inspect the static route on desktop and mobile, and commit to the feature branch. Do not publish without owner approval.

## Next content milestones (not implemented)

1. Modernize snippets and examples against current official docs; add cleanup/error cases and verification instructions. Resolve findings in AUDIT.md.
2. Curate a few current updates with primary-source research. The requested 2026-10 / events / cart webhooks / Hydrogen / AI security / checkout topics are research candidates, not approved articles.
3. Add actual static article routes and a small researched guide library. Hash navigation currently addresses walkthroughs within the existing page; it is not a replacement for future search-friendly article URLs.
4. Upgrade selected stories to useful editable tools, with safe parsing and explicit validation limits. No live credentials, arbitrary remote fetch or user-supplied HTML execution.

Each future intelligence record needs: id/slug, headline, original publication date, primary source URL, category, audience, impact level, factual summary, separately labelled author analysis (“Why this matters”), scoped recommended action, reviewed date and draft/reviewed status. Never infer publication date from crawl time or advertise a deadline without source-confirmed applicability.

Each guide needs audience and prerequisite knowledge, problem, practical steps, examples, common mistakes, checks, official sources, reviewed date, and plan/permission/availability qualifications. No private employer/customer data.

## Discovery automation decision

Deferred deliberately. No scheduled workflow, credentials, scraping pipeline or automatic summaries were added. A future scheduled GitHub workflow could compare official-source links/dates with an allowlisted index and open a review issue/PR containing candidate URLs only. Human review must supply original summaries, check dates and scope, and explicitly approve publication. Never auto-merge generated news or republish full source articles.

## Known limits

Current Vite output is client-rendered. The no-JS fallback provides identity and useful links, not the interactive app. Full static article rendering/structured metadata, broad browser testing, deeper lab accessibility/contrast audit, fresh project screenshots and performance benchmarking belong to later milestones. Do not describe these as completed.
