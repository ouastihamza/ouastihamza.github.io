// Run with Playwright browser_run_code against the static build on port 4173.
/* eslint-disable no-unused-expressions */
async (page) => {
 await page.emulateMedia({reducedMotion:"no-preference"});
 const check=(ok,message)=>{if(!ok)throw Error(message);};
 const results=[],errors=[];
 page.on('pageerror',e=>errors.push(e.message));page.on('console',m=>{if(m.type()==='error')errors.push(m.text());});
 for(const width of [320,375,390,430,768,820,821,1024,1440]) {
  await page.setViewportSize({width,height:900});await page.goto('http://127.0.0.1:4173/?nav='+width);await page.waitForTimeout(400);
  check(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),'Horizontal overflow '+width);
  const trigger=page.getByRole('button',{name:'Open navigation menu'});
  if(width<=820){
   check(await trigger.isVisible(),'Missing toggle '+width);await trigger.click();await page.waitForTimeout(220);
   check(await trigger.getAttribute('aria-expanded')==='true','Expanded state');
   check(await page.locator('dialog[open]').count()===1,'Dialog not open');
   check(await page.locator('dialog nav a').count()===5,'Missing section links');
   check(await page.locator('dialog nav a').first().evaluate(el=>el===document.activeElement),'Initial focus');
   const box=await page.locator('dialog').boundingBox();check(box.x>=0&&box.x+box.width<=width,'Clipped panel');
   await page.keyboard.press('Shift+Tab');await page.keyboard.press('Shift+Tab');
   check(await page.evaluate(()=>!!document.activeElement.closest('dialog')),'Focus escaped');
   await page.mouse.wheel(0,500);check(await page.evaluate(()=>document.body.style.position)==='fixed','Scroll unlocked');
   await page.screenshot({path:`/private/tmp/menu-${width}.png`});
   await page.keyboard.press('Escape');await page.waitForTimeout(220);
   check(await page.locator('dialog[open]').count()===0,'Escape failed');
   check(await trigger.evaluate(el=>el===document.activeElement),'Focus not restored');
   check(await page.evaluate(()=>document.body.style.position)!=='fixed','Scroll lock leaked');
   await trigger.click();await page.waitForTimeout(220);await page.mouse.click(2,850);await page.waitForTimeout(220);check(await page.locator('dialog[open]').count()===0,'Outside close failed');
   for(const id of ['experience','projects','skills','about','contact']) {
    await trigger.click();await page.locator(`dialog a[href="/#${id}"]`).click();await page.waitForTimeout(1000);
    check(page.url().endsWith('#'+id),'Incorrect hash '+id);check(await page.locator('dialog[open]').count()===0,'Did not close '+id);
    check(await page.evaluate(()=>document.body.style.position)!=='fixed','Lock after navigation');
    const position=await page.locator('#'+id).boundingBox();const header=await page.locator('.site-header').boundingBox();
    check(position.y>=header.height-3,'Section hidden by header '+id+' '+width+' '+position.y);
   }
   await page.goBack();await page.waitForTimeout(700);check(page.url().endsWith('#about'),'History back');await page.goForward();await page.waitForTimeout(700);check(page.url().endsWith('#contact'),'History forward');
  }else{check(!await trigger.isVisible(),'Desktop toggle visible');check(await page.locator('nav[aria-label="Main navigation"]').isVisible(),'Desktop navigation hidden');}
  results.push(width+': passed');
 }
 await page.setViewportSize({width:390,height:844});await page.goto('http://127.0.0.1:4173/');await page.emulateMedia({reducedMotion:'reduce'});await page.getByRole('button',{name:'Open navigation menu'}).click();check(await page.locator('dialog').evaluate(el=>parseFloat(getComputedStyle(el).transitionDuration)<=0.001),'Reduced motion');await page.setViewportSize({width:1024,height:900});await page.waitForTimeout(250);check(await page.locator('dialog[open]').count()===0,'Resize did not close');await page.emulateMedia({reducedMotion:'no-preference'});
 check(errors.length===0,errors.join('\n'));return {results,errors};
}
