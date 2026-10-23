export const audiences = ['All readers', 'Merchants', 'Plus / enterprise', 'Developers', 'Leaders & agencies'] as const;
export type Audience = typeof audiences[number];
export const studies = [
  { id: 'simulation', number: '01', title: 'The product behind the search result', topic: 'Structured data', description: 'Trace a product’s visible information into JSON-LD. Compare the merchant view with the technical representation.', knowledge: 'Basic product-page knowledge; JSON helpful', audiences: ['Merchants', 'Developers', 'Leaders & agencies'], steps: 13 },
  { id: 'storefront-debugging', number: '02', title: 'When a storefront update breaks the interface', topic: 'Theme lifecycle', description: 'Follow a collection update from working controls to detached behavior, then inspect the reinitialization pattern.', knowledge: 'HTML, DOM and JavaScript events', audiences: ['Developers', 'Plus / enterprise', 'Leaders & agencies'], steps: 6 },
  { id: 'stable-integrations', number: '03', title: 'Multiple apps. One shared storefront.', topic: 'Integration reliability', description: 'Investigate how shared selectors, initialization and rendering can produce symptoms far from their source.', knowledge: 'Storefront concepts; JavaScript for the code example', audiences: ['Merchants', 'Plus / enterprise', 'Developers', 'Leaders & agencies'], steps: 7 },
] as const;
export const officialSources = [
  { title: 'Developer changelog', description: 'Platform changes at their source', url: 'https://shopify.dev/changelog' },
  { title: 'API release notes', description: 'Version-specific changes and migration details', url: 'https://shopify.dev/changelog/release-notes' },
  { title: 'Developer announcements', description: 'Context from Shopify’s developer team', url: 'https://shopify.dev/changelog/blog' },
  { title: 'Shopify Editions', description: 'Product announcements across commerce', url: 'https://www.shopify.com/editions' },
  { title: 'Shopify Help Center', description: 'Merchant setup, eligibility and availability', url: 'https://help.shopify.com/en/' },
];
