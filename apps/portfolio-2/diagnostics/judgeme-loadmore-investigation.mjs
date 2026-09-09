import { chromium, devices } from 'playwright';
import { mkdir, writeFile } from 'node:fs/promises';

const url = 'https://chessbazaar.com/products/tournament-series-staunton-chess-pieces-with-german-knight-in-sheesham-box-wood-3-75-king';
const outDir = new URL('./judgeme-output/', import.meta.url);

async function collectState(page, label) {
  return await page.evaluate((label) => {
    const widget = document.querySelector('#judgeme_product_reviews');
    const grid = document.querySelector('.jdgm-masonry-grid');
    const btn = document.querySelector('.jdgm-masonry-grid__btn');
    const footer = document.querySelector('.jdgm-masonry-grid__footer');
    const cards = Array.from(document.querySelectorAll('.jdgm-review-card'));
    const allReviewBits = Array.from(document.querySelectorAll('[class*="review-card"]'));
    const cssInfo = (el) => {
      if (!el) return null;
      const r = el.getBoundingClientRect();
      const cs = getComputedStyle(el);
      const centerX = r.x + r.width / 2;
      const centerY = r.y + r.height / 2;
      const hit = document.elementFromPoint(centerX, centerY);
      return {
        tag: el.tagName,
        id: el.id,
        className: String(el.className),
        text: (el.textContent || '').trim().slice(0, 160),
        disabled: Boolean(el.disabled),
        ariaDisabled: el.getAttribute('aria-disabled'),
        display: cs.display,
        visibility: cs.visibility,
        opacity: cs.opacity,
        pointerEvents: cs.pointerEvents,
        position: cs.position,
        zIndex: cs.zIndex,
        rect: { x: r.x, y: r.y, width: r.width, height: r.height, top: r.top, bottom: r.bottom },
        hitAtCenter: hit ? {
          tag: hit.tagName,
          id: hit.id,
          className: String(hit.className),
          text: (hit.textContent || '').trim().slice(0, 80),
          isSelfOrChild: hit === el || el.contains(hit),
        } : null,
      };
    };
    const visibleFixed = Array.from(document.querySelectorAll('*')).filter((el) => {
      const cs = getComputedStyle(el);
      if (cs.position !== 'fixed' && cs.position !== 'sticky') return false;
      const r = el.getBoundingClientRect();
      return r.width > 80 && r.height > 20 && r.bottom > 500 && cs.visibility !== 'hidden' && cs.display !== 'none';
    }).slice(0, 15).map(cssInfo);
    return {
      label,
      url: location.href,
      readyState: document.readyState,
      scrollY: window.scrollY,
      bodyHeight: document.body.scrollHeight,
      totalText: (widget?.textContent || '').match(/\d+\s+reviews/i)?.[0] || null,
      widget: cssInfo(widget),
      grid: cssInfo(grid),
      footer: cssInfo(footer),
      button: cssInfo(btn),
      reviewCardCount: cards.length,
      reviewCardTexts: cards.map((el, i) => ({
        i,
        text: (el.textContent || '').replace(/\s+/g, ' ').trim().slice(0, 220),
        rect: (() => {
          const r = el.getBoundingClientRect();
          return { x: r.x, y: r.y, width: r.width, height: r.height, top: r.top, bottom: r.bottom };
        })(),
      })),
      reviewClassElementCount: allReviewBits.length,
      visibleFixed,
    };
  }, label);
}

async function getButtonListeners(page) {
  const client = await page.context().newCDPSession(page);
  const evalResult = await client.send('Runtime.evaluate', {
    expression: 'document.querySelector(".jdgm-masonry-grid__btn")',
    objectGroup: 'judgeme',
  });
  if (!evalResult.result?.objectId) return [];
  const listeners = await client.send('DOMDebugger.getEventListeners', {
    objectId: evalResult.result.objectId,
    depth: 1,
    pierce: true,
  });
  await client.send('Runtime.releaseObjectGroup', { objectGroup: 'judgeme' });
  return listeners.listeners || [];
}

async function runCase(name, options = {}) {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext(options.context || {});
  const page = await context.newPage();
  const requests = [];
  const consoleLogs = [];
  const pageErrors = [];
  const clickEvents = [];
  const mutations = [];

  await page.exposeFunction('__recordJmClick', (payload) => clickEvents.push(payload));
  await page.exposeFunction('__recordJmMutation', (payload) => mutations.push(payload));
  await page.addInitScript(() => {
    document.addEventListener('click', (event) => {
      const btn = event.target && event.target.closest && event.target.closest('.jdgm-masonry-grid__btn');
      if (btn) {
        window.__recordJmClick({
          type: event.type,
          targetClass: String(event.target.className),
          buttonClass: String(btn.className),
          defaultPrevented: event.defaultPrevented,
          isTrusted: event.isTrusted,
          time: Date.now(),
        });
      }
    }, true);
    window.addEventListener('DOMContentLoaded', () => {
      const attach = () => {
        const grid = document.querySelector('.jdgm-masonry-grid');
        if (!grid || window.__jmObserved) return;
        window.__jmObserved = true;
        new MutationObserver((items) => {
          window.__recordJmMutation(items.map((m) => ({
            type: m.type,
            targetClass: String(m.target.className),
            added: m.addedNodes.length,
            removed: m.removedNodes.length,
            attr: m.attributeName,
            time: Date.now(),
          })));
        }).observe(grid, { childList: true, subtree: true, attributes: true, attributeFilter: ['class', 'style', 'disabled'] });
      };
      attach();
      const interval = setInterval(attach, 250);
      setTimeout(() => clearInterval(interval), 15000);
    });
  });

  page.on('console', (msg) => consoleLogs.push({ type: msg.type(), text: msg.text(), location: msg.location() }));
  page.on('pageerror', (error) => pageErrors.push({ message: error.message, stack: error.stack }));
  page.on('requestfailed', (request) => requests.push({
    kind: 'failed',
    url: request.url(),
    method: request.method(),
    failure: request.failure()?.errorText,
    resourceType: request.resourceType(),
  }));
  page.on('response', async (response) => {
    const req = response.request();
    const u = response.url();
    if (!/judge|jdgm|review|shopify|chessbazaar/i.test(u)) return;
    let body = null;
    if (/judge|jdgm|review/i.test(u) || /apps\/judgeme|api/.test(u)) {
      try { body = (await response.text()).slice(0, 5000); } catch (e) { body = `[[unreadable: ${e.message}]]`; }
    }
    requests.push({
      kind: 'response',
      url: u,
      method: req.method(),
      status: response.status(),
      ok: response.ok(),
      resourceType: req.resourceType(),
      timing: req.timing(),
      body,
    });
  });

  await page.goto(url, { waitUntil: 'load', timeout: 90000 });
  await page.waitForSelector('#judgeme_product_reviews.jdgm--done-setup-widget', { timeout: 60000 });
  await page.waitForSelector('.jdgm-masonry-grid__btn', { timeout: 60000 });
  await page.waitForTimeout(options.settleMs ?? 4000);

  await page.locator('#judgeme_product_reviews').scrollIntoViewIfNeeded();
  await page.waitForTimeout(750);
  const before = await collectState(page, 'before-click');
  await page.screenshot({ path: new URL(`${name}-before.png`, outDir), fullPage: false });
  const listenersBefore = await getButtonListeners(page);

  const clickResults = [];
  for (let i = 0; i < (options.clicks ?? 3); i += 1) {
    const buttonCount = await page.locator('.jdgm-masonry-grid__btn').count();
    if (!buttonCount) {
      clickResults.push({ i, skipped: 'button missing before click' });
      break;
    }
    await page.locator('.jdgm-masonry-grid__btn').scrollIntoViewIfNeeded();
    await page.waitForTimeout(300);
    const pre = await collectState(page, `pre-click-${i + 1}`);
    const requestStart = requests.length;
    const clickStart = clickEvents.length;
    const mutationStart = mutations.length;
    let clickError = null;
    try {
      await page.locator('.jdgm-masonry-grid__btn').click({ timeout: 10000 });
    } catch (e) {
      clickError = e.message;
    }
    await page.waitForTimeout(options.afterClickMs ?? 5000);
    const post = await collectState(page, `post-click-${i + 1}`);
    clickResults.push({
      i: i + 1,
      clickError,
      pre,
      post,
      newClickEvents: clickEvents.slice(clickStart),
      newMutations: mutations.slice(mutationStart),
      newRequests: requests.slice(requestStart),
    });
    await page.screenshot({ path: new URL(`${name}-after-click-${i + 1}.png`, outDir), fullPage: false });
    if (!post.button) break;
  }

  const after = await collectState(page, 'after-all-clicks');
  const result = {
    name,
    viewport: page.viewportSize(),
    before,
    after,
    listenersBefore,
    clickEvents,
    mutations,
    clickResults,
    consoleLogs,
    pageErrors,
    requests,
  };
  await writeFile(new URL(`${name}.json`, outDir), JSON.stringify(result, null, 2));
  await context.close();
  await browser.close();
  return result;
}

await mkdir(outDir, { recursive: true });

const runs = [];
runs.push(await runCase('desktop-normal-1', { clicks: 5, afterClickMs: 5000 }));
runs.push(await runCase('desktop-normal-2', { clicks: 5, afterClickMs: 5000 }));
runs.push(await runCase('desktop-normal-3', { clicks: 5, afterClickMs: 5000 }));
runs.push(await runCase('mobile-iphone-13', {
  context: { ...devices['iPhone 13'] },
  clicks: 5,
  afterClickMs: 5000,
}));

await writeFile(new URL('summary.json', outDir), JSON.stringify(runs.map((run) => ({
  name: run.name,
  beforeCards: run.before.reviewCardCount,
  beforeButton: run.before.button?.text,
  afterCards: run.after.reviewCardCount,
  afterButton: run.after.button?.text,
  pageErrors: run.pageErrors.length,
  failedRequests: run.requests.filter((r) => r.kind === 'failed' || r.ok === false).length,
  clickSummaries: run.clickResults.map((c) => ({
    i: c.i,
    clickError: c.clickError,
    preCards: c.pre?.reviewCardCount,
    postCards: c.post?.reviewCardCount,
    buttonBefore: c.pre?.button?.text,
    buttonAfter: c.post?.button?.text,
    clickEvents: c.newClickEvents?.length,
    mutations: c.newMutations?.flat?.().length ?? c.newMutations?.length,
    requests: c.newRequests?.map((r) => ({ url: r.url, status: r.status, failed: r.failure, bodyStart: r.body?.slice(0, 140) })),
  })),
})), null, 2));

console.log(`Wrote diagnostics to ${outDir.pathname}`);
