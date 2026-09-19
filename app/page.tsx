import Image from "next/image";
import { ArrowUpRight, ArrowDownRight } from "lucide-react";
import { Header, Footer, ArchitectureDiagram, GITHUB_PROFILE } from "./site-components";
import { stagger } from "./stagger";
import { skillGroups } from "./data/profile";
import { projects, type Project } from "./data/projects";
export default function Home() {
  const lead = projects[0];
  return (
    <>
      <Header />
      <main id="main">
        <section className="hero wrap">
          <div className="eyebrow">
            <span /> PARIS / ÎLE-DE-FRANCE
          </div>
          <div className="hero-layout">
            <h1>
              Hamza<br /><em>Ouasti.</em>
            </h1>
            <div className="hero-aside">
              <ArrowDownRight size={76} strokeWidth={1} />
              <p>
                Full-Stack Developer<br />Software Engineer
              </p>
              <p className="muted">
                I build software with JavaScript, TypeScript, React and Node.js, drawing on five years in international e-commerce SaaS and complex production debugging.
              </p>
              <a className="text-link" href={GITHUB_PROFILE} target="_blank" rel="noreferrer">
                Explore my GitHub <ArrowUpRight size={18} />
              </a>
            </div>
          </div>
          <p className="apprenticeship-callout"><strong>Seeking a Bac+5 apprenticeship · September 2026</strong><br />3 weeks in company / 1 week at school · Ingetis Paris</p>
          <div className="hero-actions actions"><a className="button primary" href="/Hamza_Ouasti_CV_FR.pdf" download hrefLang="fr">CV · French (PDF) <ArrowUpRight size={17} /></a><a className="text-link" href="/Hamza_Ouasti_CV_EN.pdf" download hrefLang="en">CV · English (PDF) <ArrowUpRight size={17} /></a><a className="text-link" href="https://linkedin.com/in/ouastihamza" target="_blank" rel="noreferrer">LinkedIn <ArrowUpRight size={17} /></a></div>
          <div className="hero-bottom">
            <a href="#projects">
              SCROLL TO SELECTED WORK <ArrowDownRight size={16} />
            </a>
            <span>JAVASCRIPT / TYPESCRIPT / REACT / NODE.JS</span>
          </div>
        </section>
        <section id="experience" className="experience wrap">
          <div className="section-heading" data-reveal><p className="eyebrow">01 / EXPERIENCE</p><h2>Judge.me</h2></div>
          <div className="experience-grid" data-reveal><div><h3>Tier 2 Technical Support Engineer<br />Full-Stack Developer & QA</h3><p className="muted">2021–present · Judge.me Product Reviews<br />Promoted to Tier 2 in July 2026</p><p className="experience-stat">10,000+<span>technical cases resolved</span></p></div>
          <div><p>Judge.me is a product reviews application for e-commerce stores, built by an international team.</p><ul><li>Build fixes, scripts and customizations with JavaScript, TypeScript, React, Node.js, PHP and Liquid.</li><li>Investigate complex production incidents: reproduce bugs, trace root causes through REST and GraphQL APIs and SQL/MongoDB data, and validate fixes with product and engineering.</li><li>Work with Shopify Admin and Storefront APIs, metafields and JSON-LD. Prioritize bugs in Jira and run regression tests before release.</li><li>Write technical documentation in English and French, and deliver webinars and demonstrations.</li></ul></div></div>
          <p className="freelance" data-reveal><strong>Shopify / E-commerce Developer · Freelance</strong><br /><span className="muted">2022–present · Store customization, third-party integrations, structured data and production bug fixes.</span></p>
        </section>
        <section id="projects" className="projects-section wrap">
          <div className="section-heading" data-reveal>
            <p className="eyebrow">02 / SELECTED WORK</p>
            <h2>
              Selected projects.
            </h2>
          </div>
          <article className="lead-project" data-reveal>
            <div className="project-heading">
              <span className="project-number">01</span>
              <div>
                <p className="eyebrow">
                  {lead.category} / {lead.year}
                </p>
                <h3>{lead.title}</h3>
              </div>
              <span className="status">{lead.status}</span>
            </div>
            <div className="lead-grid">
              <div className="project-copy">
                <p className="project-description">{lead.description}</p>
                <p className="architecture">{lead.architecture}</p>
                <div className="tags">
                  {lead.technologies.map((t) => (
                    <span key={t}>{t}</span>
                  ))}
                </div>
                <div className="engineering-focus">
                  <h4>Engineering focus</h4>
                  <p>{lead.challenges}</p>
                </div>
                <p className="project-note">{lead.note}</p>
                <ProjectLinks project={lead} />
                <p className="repository-name">{lead.repositoryName}</p>
              </div>
              <ArchitectureDiagram />
            </div>
          </article>
          <div className="more-projects">
            {projects
              .filter((project) => project.featured && project.id !== lead.id)
              .map((project, index) => (
                <article className="project-row" id={project.id} key={project.id} data-reveal style={stagger(index)}>
                  {project.screenshot && <a className="project-screenshot" href={project.projectUrl}><Image unoptimized src={project.screenshot} alt={project.screenshotAlt || project.title} loading="lazy" width="1440" height="900" /><span>Explore the technical walkthroughs ↗</span></a>}
                  <div className="project-heading">
                    <span className="project-number">0{index + 2}</span>
                    <div>
                      <p className="eyebrow">
                        {project.category} / {project.year}
                      </p>
                      <h3>{project.title}</h3>
                    </div>
                    <span className="status">{project.status}</span>
                  </div>
                  <div className="secondary-grid">
                    <div>
                      <p className="project-description">{project.description}</p>
                      <p className="architecture">{project.architecture}</p>
                      <ProjectLinks project={project} />
                      {project.repositoryName && (
                        <p className="repository-name">{project.repositoryName}</p>
                      )}
                    </div>
                    <div className="project-specs">
                      <div className="tags">
                        {project.technologies.map((t) => (
                          <span key={t}>{t}</span>
                        ))}
                      </div>
                      <div className="engineering-focus">
                        <h4>Engineering focus</h4>
                        <p>{project.challenges}</p>
                      </div>
                      <p className="project-note">{project.note}</p>
                    </div>
                  </div>
                </article>
              ))}
          </div>
        </section>
        <section id="skills" className="practice wrap">
          <div className="sticky-heading" data-reveal><p className="eyebrow">03 / SKILLS</p><h2>Tools I work with</h2></div>
          <dl className="skills-list" data-reveal>{skillGroups.map(({ title, description }) => <div key={title}><dt>{title}</dt><dd>{description}</dd></div>)}</dl>
        </section>
        <section id="about" className="practice wrap"><div className="sticky-heading" data-reveal><p className="eyebrow">04 / ABOUT & EDUCATION</p><h2>Development and diagnosis</h2></div><div data-reveal><p>My work connects application code, APIs and data. Production debugging informs how I approach software development and integrations.</p><p>Based in Villejuif, Greater Paris. I work in Arabic, French and English.</p><div id="education" className="education"><h3>Education</h3><p><strong>Master’s in Software Architecture and Development · Bac+5</strong><br />Ingetis Paris · 2026–2027<br />Apprenticeship schedule: 3 weeks in company / 1 week at school.</p><p><strong>Master — Software Engineering & Web Applications</strong><br />Faculty of Sciences and Technology, Settat · 2019–2022<br />Final project: full-stack carpooling application with Java, Angular, REST API and SQL.</p><p><strong>Preparatory programme in Mathematics & Physics, then Bachelor in General Engineering</strong><br />Yncréa Maroc, Rabat · 2016–2019</p></div><p className="authorship">Projects use open-source tools and AI-assisted development. Shopify Sanity Hydrogen Starter extends the Hydrogen and Sanity starters.</p></div></section>
        <section id="contact" className="contact wrap" data-reveal>
          <p className="eyebrow">05 / CONTACT</p>
          <h2>Contact me.</h2>
          <p>Hamza Ouasti · Paris / Villejuif, France</p>
          <a className="contact-email" href="mailto:ouastihamza27@gmail.com">ouastihamza27@gmail.com</a>
          <div className="actions"><a className="text-link" href={GITHUB_PROFILE} target="_blank" rel="noreferrer">GitHub <ArrowUpRight size={17} /></a><a className="text-link" href="https://linkedin.com/in/ouastihamza" target="_blank" rel="noreferrer">LinkedIn <ArrowUpRight size={17} /></a><a className="text-link" href="/Hamza_Ouasti_CV_FR.pdf" download hrefLang="fr">CV · French (PDF) <ArrowUpRight size={17} /></a><a className="text-link" href="/Hamza_Ouasti_CV_EN.pdf" download hrefLang="en">CV · English (PDF) <ArrowUpRight size={17} /></a></div>
        </section>
      </main>
      <Footer />
    </>
  );
}

function ProjectLinks({ project }: { project: Project }) {
  return (
    <div className="actions">
      {project.projectUrl && <a className="button primary" href={project.projectUrl}>View Project <ArrowUpRight size={17} /></a>}
      {project.detailUrl && (
        <a className="button primary" href={project.detailUrl}>
          Read the case study <ArrowUpRight size={17} />
        </a>
      )}
      {project.githubUrl && (
        <a
          className="text-link"
          href={project.githubUrl}
          target="_blank"
          rel="noreferrer"
          aria-label={`View source for ${project.title} (opens in a new tab)`}
        >
          View source <ArrowUpRight size={17} />
        </a>
      )}
      {project.liveUrl && (
        <a className="text-link" href={project.liveUrl} target="_blank" rel="noreferrer">
          Live project <ArrowUpRight size={17} />
        </a>
      )}
    </div>
  );
}
