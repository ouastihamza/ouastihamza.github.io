// Playwright browser_run_code evaluates this function with its managed page.
/* eslint-disable no-unused-expressions */
async (page) => {
  const base = 'http://127.0.0.1:4173/projects/shopify-technical-studies/';
  const results = [];
  const errors = [];
  page.on('pageerror', error => errors.push(error.message));
  page.on('console', message => { if (message.type() === 'error') errors.push(message.text()); });
  const assert = (condition, message) => { if (!condition) throw new Error(message); };
  for (const width of [375, 768, 1280, 1440]) {
    await page.setViewportSize({ width, height: 900 });
    for (const [route, total, prefix] of [['simulation',13,'simulation'],['storefront-debugging',6,'debugging'],['stable-integrations',7,'stable']]) {
      await page.goto(base + '?qa=' + width + '#' + route);
      await page.reload();
      await page.waitForTimeout(350);
      const output = page.locator('.study-controls output');
      const step = async n => assert(await output.textContent() === `Step ${n} of ${total}`, `${width}/${route}: expected step ${n}`);
      await step(1);
      assert(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), `${width}/${route}: horizontal overflow`);
      // Wheel over background, explanatory copy, preview, controls and buttons.
      for (const selector of ['.study-context', `.${prefix}-copy`, `.${prefix}-board`, '.study-controls', '.study-controls button:last-child']) {
        const target = page.locator(selector).first();
        await target.scrollIntoViewIfNeeded();
        const box = await target.boundingBox();
        await page.mouse.move(Math.min(width-5,box.x+box.width/2),Math.min(850,Math.max(170,box.y+20)));
        const before = await page.evaluate(() => window.scrollY);
        const max = await page.evaluate(() => document.documentElement.scrollHeight-innerHeight);
        const delta = before < max-20 ? 180 : -180;
        await page.mouse.wheel(0,delta); await page.waitForTimeout(200);
        const after = await page.evaluate(() => window.scrollY);
        assert(delta > 0 ? after > before : after < before, `${width}/${route}/${selector}: wheel trapped`);
        await step(1);
        await page.mouse.wheel(0,-delta); await page.waitForTimeout(150); await step(1);
      }
      for (let n=2;n<=total;n++) {
        await page.getByRole('button',{name:'Next →',exact:true}).click();
        await step(n);
        assert((await page.locator(`.${prefix}-copy__eyebrow`).textContent()).trim() === `Step ${String(n).padStart(2,'0')}`, `${route}: copy out of sync`);
      }
      assert(await page.getByRole('button',{name:'Next →',exact:true}).isDisabled(), 'Next boundary');
      for (let n=total-1;n>=1;n--) { await page.getByRole('button',{name:'← Previous',exact:true}).click(); await step(n); }
      assert(await page.getByRole('button',{name:'← Previous',exact:true}).isDisabled(), 'Previous boundary');
      await page.getByRole('button',{name:'Next →',exact:true}).focus();
      await page.keyboard.press('Enter'); await step(2);
      await page.keyboard.press('Tab');
      await page.locator('#publication-main').focus();
      await page.evaluate(()=>window.scrollTo(0,0));
      await page.keyboard.press('PageDown');await page.waitForTimeout(300);
      assert(await page.evaluate(()=>scrollY)>0,'PageDown did not scroll');await step(2);
      await page.keyboard.press('PageUp');await page.waitForTimeout(300);await step(2);
      await page.emulateMedia({reducedMotion:'reduce'});await page.getByRole('button',{name:'Next →',exact:true}).click();await step(3);
      await page.emulateMedia({reducedMotion:'no-preference'});await step(3);
      await page.evaluate(()=>window.scrollTo(0,0));
      await page.screenshot({path:`/private/tmp/scroll-${route}-${width}.png`,fullPage:true});
      await page.getByRole('link',{name:'← All walkthroughs'}).click();
      await page.waitForTimeout(150);assert(page.url().endsWith('#labs'),'Labs link');
      await page.goBack();await page.waitForTimeout(200);assert(page.url().endsWith('#'+route),'Browser back');
      results.push(`${width}/${route}: passed`);
    }
  }
  assert(errors.length===0,errors.join('\n'));
  return {results,errors};
}
