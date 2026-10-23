import { siJavascript, siTypescript, siPython, siPhp, siHtml5, siCss, siReact, siNextdotjs, siAngular, siTailwindcss, siNodedotjs, siExpress, siFastapi, siGraphql, siPostgresql, siMysql, siMongodb, siDocker, siGit, siVercel, siJira, siPytest, siShopify, siWoocommerce, siBigcommerce } from "simple-icons";
import { Database, BrainCircuit, Search, Layers, CodeXml } from "lucide-react";
import { skillGroups } from "./data/profile";
import { TechInteractions } from "./tech-interactions";

const technologies = [
  [siJavascript, siTypescript, siPython, siPhp, siHtml5, siCss],
  [siReact, siNextdotjs, siAngular, { title: "Hydrogen", Icon: Layers }, siTailwindcss],
  [siNodedotjs, siExpress, siFastapi, siGraphql, siPostgresql, siMysql, siMongodb],
  [siDocker, siGit, siVercel, siJira, siPytest],
  [{ title: "RAG", Icon: BrainCircuit }, { title: "Embeddings", Icon: Search }, { title: "ChromaDB", Icon: Database }, { title: "LLM APIs", Icon: CodeXml }],
  [siShopify, { title: "Liquid", Icon: CodeXml }, siWoocommerce, siBigcommerce],
];

// Dark brand marks need a light backing; preserve the logo's actual color.
function needsLightBacking(hex: string) {
  const channels = [0, 2, 4].map((offset) => Number.parseInt(hex.slice(offset, offset + 2), 16) / 255);
  const linear = channels.map(c => c <= .04045 ? c / 12.92 : ((c + .055) / 1.055) ** 2.4);
  return linear[0] * .2126 + linear[1] * .7152 + linear[2] * .0722 < .17;
}


const coreNames = new Set(["JavaScript", "TypeScript", "Python", "React", "Next.js", "Node.js", "FastAPI", "GraphQL", "PostgreSQL", "Docker", "Git", "Shopify", "Hydrogen", "RAG"]);
type Technology = (typeof technologies)[number][number];
function TechnologyCard({ technology }: { technology: Technology }) {
  return <li><div className="tech-card">
    <span data-logo={technology.title} className={`tech-logo${"hex" in technology && needsLightBacking(technology.hex) ? " tech-logo-neutral" : ""}`} style={"hex" in technology ? { color: `#${technology.hex}` } : undefined} aria-hidden="true">
      {"path" in technology ? <svg viewBox="0 0 24 24" fill="currentColor" focusable="false"><path d={technology.path} /></svg> : <technology.Icon strokeWidth={1.5} />}
    </span><span className="tech-name">{technology.title}</span>
  </div></li>;
}
export function TechGrid() {
  return <section id="skills" className="tech-section" aria-labelledby="skills-heading"><div className="wrap tech-content">
    <div className="tech-heading" data-reveal><p className="eyebrow">03 / SKILLS</p><h2 id="skills-heading">Tools behind the work.</h2><p className="tech-intro">A focused selection for interfaces, APIs, data and commerce.</p></div>
    <ul className="tech-grid core-technologies" aria-label="Core technologies" data-reveal>{technologies.flat().filter(t => coreNames.has(t.title)).map(t => <TechnologyCard key={t.title} technology={t} />)}</ul>
    <details className="disclosure skill-inventory"><summary><span className="when-closed">View all skills</span><span className="when-open">Show core skills only</span><span className="inventory-note">Complete inventory &amp; areas of practice</span></summary>
      {skillGroups.map((group, index) => <div className="tech-group" key={group.title}>
        <div className="tech-group-heading"><h3 id={`tech-group-${index}`}>{group.title}</h3><p>{group.description}</p></div>
        <ul className="tech-grid" aria-labelledby={`tech-group-${index}`}>{technologies[index].filter(t => !coreNames.has(t.title)).map(t => <TechnologyCard key={t.title} technology={t} />)}</ul>
      </div>)}
    </details>
  </div><TechInteractions /></section>;
}
