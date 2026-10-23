// Execute this function with Playwright browser_run_code against the static build (port 4173).
// It runs every check, then throws once with all failures; on success it returns the per-area results.
/* eslint-disable no-unused-expressions */
async (page) => {
 const base='http://127.0.0.1:4173/projects/shopify-technical-studies/';
 const labs=[['simulation',13],['storefront-debugging',6],['stable-integrations',7]];
 const errors=[];const results=[];const fails=[];let ctx='';
 page.on('pageerror',e=>errors.push(e.message));page.on('console',m=>{if(m.type()==='error')errors.push(m.text());});
 const check=(ok,msg)=>{if(!ok)fails.push(`${ctx}: ${msg}`);};
 const pause=ms=>page.waitForTimeout(ms);
 const scrollY=()=>page.evaluate(()=>Math.round(window.scrollY));
 const next=()=>page.getByRole('button',{name:'Next →',exact:true});
 const prev=()=>page.getByRole('button',{name:'← Previous',exact:true});
 // A trackpad flick: one strong event followed by decaying momentum, 16ms apart.
 const flick=async(dir)=>{for(let i=0;i<36;i++){await page.mouse.wheel(0,dir*Math.max(2,Math.round(70*0.9**i)));await pause(16);}};
 // Explanation, every highlighted preview element and the step controls must share the viewport.
 const together=()=>page.evaluate(()=>{const inView=el=>{const r=el.getBoundingClientRect();return r.height>0&&r.top>=0&&r.bottom<=innerHeight;};
  const focus=[...document.querySelectorAll('.walkthrough-preview .is-focus,.walkthrough-preview .schema-card__line.is-active')];
  return {explanation:inView(document.querySelector('[aria-live="polite"]')),controls:inView(document.querySelector('.study-controls')),focus:focus.length>0&&focus.every(inView),
   controlsTop:Math.round(document.querySelector('.study-controls').getBoundingClientRect().top),previewTop:Math.round(document.querySelector('.walkthrough-preview').getBoundingClientRect().top)};});

 for(const [width,height] of [[1366,768],[1440,900],[1920,1080]]) {
  await page.setViewportSize({width,height});
  for(const [route,total] of labs) {
   ctx=`${width}x${height}/${route}`;
   await page.goto(`${base}?dual=${width}#${route}`);await page.reload();await pause(400);
   await page.evaluate(()=>{window.__cls=0;new PerformanceObserver(list=>{for(const e of list.getEntries())if(!e.hadRecentInput)window.__cls+=e.value;}).observe({type:'layout-shift'});});
   const step=async(n,label)=>check(await page.locator('output').textContent()===`Step ${n} of ${total}`,`${label}: expected step ${n}, saw "${await page.locator('output').textContent()}"`);
   const aim=async()=>{const b=await page.locator('.walkthrough-preview').boundingBox();await page.mouse.move(b.x+b.width/2,Math.min(height-40,b.y+160));};

   // 1, 4: one deliberate wheel inside the preview advances exactly one step and does not move the page.
   await aim();const y=await scrollY();
   await page.mouse.wheel(0,100);await pause(60);await step(2,'wheel down inside preview');
   for(let i=0;i<8;i++){await page.mouse.wheel(0,20);await pause(30);}
   await step(2,'continued gesture skipped a step');check(await scrollY()===y,'accepted gesture moved the page');
   // 3: wheel up after a pause returns one step.
   await pause(650);await page.mouse.wheel(0,-100);await pause(80);await step(1,'wheel up inside preview');
   // Trackpad momentum: one flick, one step, no page movement.
   await pause(650);await flick(1);await step(2,'trackpad flick down');check(await scrollY()===y,'flick moved the page');
   // Momentum that reaches step 1 must not continue into page scrolling.
   await pause(650);await flick(-1);await step(1,'trackpad flick up to step 1');check(await scrollY()===y,'momentum at step 1 scrolled the page');
   // 2: wheel outside the preview scrolls the document and never changes the step.
   await pause(650);await page.mouse.move(20,Math.round(height/2));await page.mouse.wheel(0,160);await pause(250);
   await step(1,'wheel outside preview');const scrolledTo=await scrollY();
   check(scrolledTo>0||await page.evaluate(()=>document.documentElement.scrollHeight<=innerHeight),'wheel outside preview did not scroll the page');
   // 5: a new upward gesture at step 1 belongs to the page.
   await aim();await page.mouse.wheel(0,-160);await pause(250);await step(1,'wheel up at step 1');
   check(scrolledTo===0||await scrollY()<scrolledTo,'step 1 trapped upward scrolling');

   // 6, 9, 12: buttons walk every step; explanation, highlight and controls stay together, and nothing shifts.
   const views=route==='simulation'?['Merchant View','Technical View']:[null];let firstTop=null;
   for(const view of views){
    if(view){await page.getByRole('tab',{name:view}).click();await pause(450);}
    await page.evaluate(()=>window.scrollTo(0,0));await pause(100);
    // A scroll boundary inside the preview would swallow wheel input the preview releases to the page.
    const boundaries=await page.evaluate(()=>[...document.querySelectorAll('.walkthrough-preview *')].filter(el=>getComputedStyle(el).overscrollBehaviorY!=='auto').map(el=>String(el.className).split(' ')[0]));
    check(boundaries.length===0,`${view??''} overscroll boundary inside preview: ${boundaries.join(', ')}`);
    for(let n=1;n<=total;n++){
     if(n>1){await next().click();await pause(260);}
     await step(n,`Next button${view?' in '+view:''}`);
     const v=await together();const where=`${view??''} step ${n}`;
     check(v.explanation,`${where}: explanation outside viewport`);check(v.focus,`${where}: highlighted element missing or outside viewport`);check(v.controls,`${where}: controls outside viewport`);
     firstTop??=v;check(Math.abs(v.controlsTop-firstTop.controlsTop)<=1,`${where}: controls moved ${v.controlsTop-firstTop.controlsTop}px`);check(Math.abs(v.previewTop-firstTop.previewTop)<=1,`${where}: preview moved`);
    }
   }
   const cls=await page.evaluate(()=>window.__cls);check(cls<0.1,`layout shift score ${cls.toFixed(3)}`);

   // 5: a new downward gesture at the final step belongs to the page.
   await page.evaluate(()=>window.scrollTo(0,0));await pause(650);await aim();await page.mouse.wheel(0,160);await pause(250);
   await step(total,'wheel down at final step');check(await scrollY()>0||await page.evaluate(()=>document.documentElement.scrollHeight<=innerHeight),'final step trapped downward scrolling');
   // 11: keyboard and reduced motion.
   await prev().focus();await page.keyboard.press('Enter');await step(total-1,'Enter on Previous');
   await next().focus();await page.keyboard.press('Space');await step(total,'Space on Next');
   await page.emulateMedia({reducedMotion:'reduce'});await prev().click();await step(total-1,'Previous with reduced motion');
   check(await page.evaluate(()=>getComputedStyle(document.querySelector('.study-step')).animationName)==='none','step animation runs with reduced motion');
   await page.emulateMedia({reducedMotion:'no-preference'});
   // 7: each view is its own walkthrough, so switching restarts at step 1.
   if(route==='simulation'){await page.getByRole('tab',{name:'Merchant View'}).click();await pause(450);await step(1,'switch to Merchant View');
    await next().click();await next().click();await step(3,'Next after switching');await page.getByRole('tab',{name:'Technical View'}).click();await pause(450);await step(1,'switch to Technical View');
    await page.getByRole('tab',{name:'Technical View'}).click();await pause(200);await step(1,'clicking the active view');}
   await page.evaluate(()=>window.scrollTo(0,0));await pause(300);
   check(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),'horizontal overflow');
   await page.screenshot({path:`/private/tmp/dual-${route}-${width}.png`});
   results.push(`${ctx}: done`);
  }
 }

 // Pointer held still over content that changes between steps: wheel must never stop working.
 // Covers a steady mouse-wheel spin (notches 120ms apart, never a gesture gap) and repeated trackpad flicks.
 await page.setViewportSize({width:1440,height:900});
 const spots=[['simulation','Merchant View','.merchant-result-card h3'],['simulation','Technical View','.preview-card__heading'],['storefront-debugging',null,'.study-findings'],['stable-integrations',null,'.study-findings']];
 for(const [route,view,selector] of spots){
  const total=labs.find(l=>l[0]===route)[1];
  for(const kind of ['spin','flicks']){
   ctx=`still pointer ${route}${view?'/'+view:''}/${kind}`;
   await page.goto(`${base}?still=${Date.now()}#${route}`);await pause(400);
   if(view){await page.getByRole('tab',{name:view}).click();await pause(450);}
   await page.evaluate(total=>{window.__wheel=[];addEventListener('wheel',e=>{const n=Number(document.querySelector('output').textContent.match(/\d+/)[0]);const maxY=document.documentElement.scrollHeight-innerHeight;
    // Nothing can move when the step is at an end and the page is already at its limit in the same direction.
    const blocked=(e.deltaY>0&&n===total&&scrollY>=maxY-1)||(e.deltaY<0&&n===1&&scrollY<=0);
    window.__wheel.push({t:performance.now(),detached:!e.target.isConnected,step:n,y:scrollY,blocked});},{capture:true});},total);
   const box=await page.locator(selector).first().boundingBox();await page.mouse.move(box.x+box.width/2,box.y+Math.min(box.height/2,20));
   if(kind==='spin'){for(let i=0;i<30;i++){await page.mouse.wheel(0,100);await pause(120);}}
   else for(const dir of [1,-1])for(let g=0;g<total+1;g++){await flick(dir);await pause(700);}
   const log=await page.evaluate(()=>window.__wheel);
   let stall=0,since=log[0].t;
   for(let i=1;i<log.length;i++){if(log[i].blocked||log[i].step!==log[i-1].step||Math.abs(log[i].y-log[i-1].y)>0)since=log[i].t;else stall=Math.max(stall,log[i].t-since);}
   check(log.every(e=>!e.detached),'wheel delivered to a removed node');
   check(stall<(kind==='spin'?1000:3200),`input for ${Math.round(stall)}ms moved neither the step nor the page`);
   const steps=new Set(log.map(e=>e.step)).size;
   if(kind==='spin')check(steps>=4,`steady spin reached only ${steps} steps`);
   else{check(steps===total,`flicks visited ${steps} of ${total} steps`);check(await page.locator('output').textContent()===`Step 1 of ${total}`,'flicks did not return to step 1');}
   results.push(`${ctx}: done`);
  }
 }

 // 8: inputs, editors and nested scroll areas keep their own wheel. The demos have none, so fixtures stand in.
 ctx='exclusions';await page.setViewportSize({width:1440,height:900});
 await page.goto(`${base}?exclusions#simulation`);await pause(400);await next().click();
 const owned=await page.evaluate(()=>{const region=document.querySelector('.walkthrough-preview');
  return ['input','select','textarea','div[contenteditable]'].map(spec=>{const [tag,attr]=spec.split('[');const el=document.createElement(tag);if(attr)el.setAttribute('contenteditable','true');region.append(el);
   const event=new WheelEvent('wheel',{deltaY:100,bubbles:true,cancelable:true});el.dispatchEvent(event);el.remove();return event.defaultPrevented?spec:null;}).filter(Boolean);});
 check(owned.length===0,`wheel intercepted on ${owned.join(', ')}`);
 await page.evaluate(()=>{const el=document.createElement('div');el.id='scroll-fixture';el.style.cssText='position:fixed;top:300px;right:120px;width:180px;height:100px;overflow:auto;z-index:100;background:#24382a';el.innerHTML='<div style="height:800px">Scrollable test fixture</div>';document.querySelector('.walkthrough-preview').append(el);});
 await page.mouse.move(1300,340);await page.mouse.wheel(0,100);await pause(250);
 check(await page.locator('#scroll-fixture').evaluate(el=>el.scrollTop)>0,'nested scroll area intercepted');
 check((await page.locator('output').innerText()).startsWith('Step 2'),'fixtures changed the step');
 results.push('exclusions: done');

 // 10: touch scrolls the page naturally; controls stay reachable; no wheel interception or nested scrolling.
 for(const [width,height] of [[375,812],[390,844],[768,1024]]) {
  const context=await page.context().browser().newContext({viewport:{width,height},isMobile:width<500,hasTouch:true});
  const mobile=await context.newPage();const cdp=await context.newCDPSession(mobile);
  mobile.on('pageerror',e=>errors.push(e.message));
  for(const [route] of labs) {
   ctx=`touch ${width}x${height}/${route}`;
   await mobile.goto(`${base}#${route}`);await mobile.waitForTimeout(400);const before=await mobile.locator('output').innerText();
   await cdp.send('Input.dispatchTouchEvent',{type:'touchStart',touchPoints:[{x:Math.round(width/2),y:height-150}]});
   for(let y=height-200;y>=250;y-=50){await cdp.send('Input.dispatchTouchEvent',{type:'touchMove',touchPoints:[{x:Math.round(width/2),y}]});await mobile.waitForTimeout(25);}
   await cdp.send('Input.dispatchTouchEvent',{type:'touchEnd',touchPoints:[]});await mobile.waitForTimeout(300);
   check(await mobile.evaluate(()=>scrollY)>0,'touch swipe did not scroll the page');check(await mobile.locator('output').innerText()===before,'touch swipe changed the step');
   const layout=await mobile.evaluate(()=>{const r=s=>document.querySelector(s).getBoundingClientRect();const panel=r('[class$="copy__panel"]'),preview=r('.walkthrough-preview'),controls=r('.study-controls');
    const nested=[...document.querySelectorAll('.publication-study *')].filter(el=>{const c=getComputedStyle(el);return /(auto|scroll)/.test(c.overflowY)&&el.scrollHeight>el.clientHeight+1;}).length;
    const wheel=new WheelEvent('wheel',{deltaY:100,bubbles:true,cancelable:true});document.querySelector('.walkthrough-preview').dispatchEvent(wheel);
    return {gap:Math.round(preview.top-panel.bottom),controlsVisible:controls.top>=0&&controls.bottom<=innerHeight,nested,wheelPrevented:wheel.defaultPrevented};});
   check(layout.gap>=0&&layout.gap<=16,`preview starts ${layout.gap}px below the explanation`);
   check(layout.controlsVisible,'step controls not visible while reading the preview');check(layout.nested===0,`${layout.nested} nested scroll containers`);
   check(!layout.wheelPrevented,'wheel intercepted on touch layout');
   await mobile.getByRole('button',{name:'Next →',exact:true}).click();check((await mobile.locator('output').innerText()).startsWith('Step 2'),'Next on touch layout');
   check(await mobile.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),'horizontal overflow');
   await mobile.screenshot({path:`/private/tmp/dual-${route}-${width}.png`});results.push(`${ctx}: done`);
  }
  await context.close();
 }
 ctx='console';check(errors.length===0,errors.join('\n'));
 if(fails.length)throw Error(`${fails.length} failed checks:\n${fails.join('\n')}`);
 return {results,errors};
}
