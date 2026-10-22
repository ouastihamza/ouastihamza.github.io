import { siJavascript, siTypescript, siPython, siPhp, siHtml5, siCss, siReact, siNextdotjs, siAngular, siTailwindcss, siNodedotjs, siExpress, siFastapi, siGraphql, siPostgresql, siMysql, siMongodb, siDocker, siGit, siVercel, siJira, siPytest, siShopify, siWoocommerce, siBigcommerce } from "simple-icons";
import { Database, BrainCircuit, Search, Layers, CodeXml } from "lucide-react";
import { skillGroups } from "./data/profile";
import { stagger } from "./stagger";
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
  return channels[0] * .2126 + channels[1] * .7152 + channels[2] * .0722 < .36;
}

export function TechGrid() {
  return (
    <section id="skills" className="tech-section" aria-labelledby="skills-heading">
      <div className="wrap tech-content">
        <div className="tech-heading" data-reveal>
          <p className="eyebrow">03 / SKILLS</p>
          <h2 id="skills-heading">Tools I work with</h2>
          <p className="tech-intro">From interfaces and APIs to data, AI and e-commerce.</p>
        </div>
        {skillGroups.map((group, index) => (
          <div className="tech-group" key={group.title}>
            <div className="tech-group-heading">
              <h3 id={`tech-group-${index}`}>{group.title}</h3>
              <p>{group.description}</p>
            </div>
            <ul className="tech-grid" aria-labelledby={`tech-group-${index}`}>
              {technologies[index].map((technology, cardIndex) => (
                <li key={technology.title} data-reveal style={stagger(cardIndex % 4)}>
                  <div className="tech-card">
                    <span className={`tech-logo${"hex" in technology && needsLightBacking(technology.hex) ? " tech-logo-neutral" : ""}`} style={"hex" in technology ? { color: `#${technology.hex}` } : undefined} aria-hidden="true">
                      {"path" in technology ? <svg viewBox="0 0 24 24" fill="currentColor" focusable="false"><path d={technology.path} /></svg> : <technology.Icon strokeWidth={1.5} />}
                    </span>
                    <span className="tech-name">{technology.title}</span>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <TechInteractions />
    </section>
  );
}
