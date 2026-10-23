import { MotionConfig } from 'framer-motion';
import { useEffect, useRef, useState } from 'react';
import { Sidebar } from './components/Sidebar';
import { EndingSection } from './sections/EndingSection';
import { HowIWorkSection } from './sections/HowIWorkSection';
import { HomeSection } from './sections/HomeSection';
import { SimulationSection } from './sections/SimulationSection';
import { StableIntegrationsSection } from './sections/StableIntegrationsSection';
import { StorefrontDebuggingSection } from './sections/StorefrontDebuggingSection';
import { studies } from './data/publication';

const readHash = () => window.location.hash.slice(1) || 'home';
const studyIds = ['simulation', 'storefront-debugging', 'stable-integrations', 'how-i-work', 'ending'];
export default function App() {
  const [route, setRoute] = useState(readHash);
  const [height, setHeight] = useState(() => window.innerHeight);
  const contentRef = useRef<HTMLElement>(null);
  const isStudy = studyIds.includes(route);
  const selected = studies.find(study => study.id === route);
  useEffect(() => {
    const change = () => setRoute(readHash());
    const resize = () => setHeight(window.innerHeight);
    window.addEventListener('hashchange', change);
    window.addEventListener('resize', resize);
    return () => { window.removeEventListener('hashchange', change); window.removeEventListener('resize', resize); };
  }, []);
  useEffect(() => {
    const frame = requestAnimationFrame(() => {
      if (isStudy) { window.scrollTo(0, 0); contentRef.current?.focus({ preventScroll: true }); }
      else if (route === 'home') window.scrollTo(0, 0);
      else document.getElementById(route)?.scrollIntoView();
    });
    return () => cancelAnimationFrame(frame);
  }, [route, isStudy]);
  const registerScrollArea = (node: HTMLDivElement | null) => {
    if (node) { node.setAttribute('role', 'region'); node.setAttribute('aria-label', 'Walkthrough content'); }
  };
  const props = { viewportHeight: Math.max(520, height), registerScrollArea };
  return <MotionConfig reducedMotion="user"><div className="publication-shell">
    <a className="publication-skip" href="#publication-main" onClick={event => { event.preventDefault(); contentRef.current?.focus(); }}>Skip to content</a>
    <Sidebar activeSection={isStudy && selected ? 'labs' : route} />
    <main id="publication-main" ref={contentRef} tabIndex={-1}>
      {!isStudy ? <HomeSection /> : <div className="publication-study" key={route}>
        <div className="study-toolbar"><a href="#labs">← All walkthroughs</a><span>{selected ? `${selected.topic} / Illustrative walkthrough` : 'Author’s notes'}</span></div>
        {selected && <p className="study-context">For {selected.audiences.join(' · ')}. <strong>Useful knowledge:</strong> {selected.knowledge}. This demonstration does not connect to or diagnose a live store.</p>}
        {route === 'simulation' && <SimulationSection {...props} isActive />}
        {route === 'storefront-debugging' && <StorefrontDebuggingSection {...props} isActive />}
        {route === 'stable-integrations' && <StableIntegrationsSection {...props} isActive />}
        {route === 'how-i-work' && <HowIWorkSection {...props} />}
        {route === 'ending' && <EndingSection {...props} />}
      </div>}
    </main>
    <footer className="publication-footer"><span>Shopify Commerce Engineering<br /><small>Originally Shopify Technical Studies</small></span><p>An independent publication by Hamza Ouasti. Not affiliated with, endorsed by, or speaking on behalf of Shopify.</p><a href="/">Portfolio ↗</a></footer>
  </div></MotionConfig>;
}
