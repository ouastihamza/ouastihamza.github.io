import Image from "next/image";
import { ArrowUpRight, ArrowDownRight } from "lucide-react";
import { Header, Footer, ArchitectureDiagram, GITHUB_PROFILE } from "./site-components";
import { projects, type Project } from "./data/projects";
export default function Home() {
  const lead = projects[0];
  return (
    <>
      <Header />
      <main id="main">
        <section className="hero wrap">
          <div className="eyebrow">
            <span /> PARIS / VILLEJUIF, FRANCE
          </div>
          <div className="hero-layout">
            <h1>
              Hamza<br /><em>Ouasti.</em>
            </h1>
            <div className="hero-aside">
              <ArrowDownRight size={76} strokeWidth={1} />
              <p>
                Software Engineer<br />Full-Stack Developer<br />Technical Support Engineer
              </p>
              <p className="muted">
                I investigate SaaS issues and build applications using APIs, Shopify and AI retrieval.
              </p>
              <a className="text-link" href={GITHUB_PROFILE} target="_blank" rel="noreferrer">
                Explore my GitHub <ArrowUpRight size={18} />
              </a>
            </div>
          </div>
          <div className="hero-actions actions"><a className="button primary" href="/Hamza_Ouasti.pdf" download lang="fr" hrefLang="fr">CV · Français (PDF) <ArrowUpRight size={17} /></a><a className="text-link" href="/Hamza_Ouasti_CV_English.pdf" download hrefLang="en">CV · English (PDF) <ArrowUpRight size={17} /></a><a className="text-link" href="https://linkedin.com/in/ouastihamza" target="_blank" rel="noreferrer">LinkedIn <ArrowUpRight size={17} /></a></div>
          <div className="hero-bottom">
            <a href="#projects">
              SCROLL TO SELECTED WORK <ArrowDownRight size={16} />
            </a>
            <span>FULL-STACK / SAAS / TECHNICAL SUPPORT</span>
          </div>
        </section>
        <section id="experience" className="experience wrap">
          <div className="section-heading"><p className="eyebrow">01 / EXPERIENCE</p><h2>Judge.me</h2></div>
          <div className="experience-grid"><div><h3>Tier 2 Technical Support<br />Full-Stack Development & QA</h3><p className="muted">2021–present · Judge.me Product Reviews</p><p className="experience-stat">10,000+<span>technical cases resolved</span></p></div>
          <ul><li>Investigate complex Shopify and SaaS issues: reproduce bugs, trace root causes and validate fixes with product and engineering.</li><li>Troubleshoot APIs, integrations, app conflicts and storefront behavior using JavaScript, CSS, Liquid and data inspection.</li><li>Write documentation in French and English, and deliver webinars and technical demonstrations.</li></ul></div>
          <p className="freelance"><strong>Shopify / E-commerce Developer · Freelance</strong><br /><span className="muted">2022–present · Store customization, third-party integrations, structured data and production bug fixes.</span></p>
        </section>
        <section id="projects" className="projects-section wrap">
          <div className="section-heading">
            <p className="eyebrow">02 / SELECTED WORK</p>
            <h2>
              Selected projects.
            </h2>
          </div>
          <article className="lead-project">
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
                <article className="project-row" id={project.id} key={project.id}>
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
          <div><p className="eyebrow">03 / SKILLS</p><h2>Tools I work with</h2></div>
          <dl className="skills-list"><div><dt>Full-stack</dt><dd>TypeScript, JavaScript, React, Next.js, Python, FastAPI, Node.js, SQL and PostgreSQL</dd></div><div><dt>Commerce & integrations</dt><dd>Shopify, Liquid, Hydrogen, REST APIs, GraphQL and Sanity</dd></div><div><dt>AI & delivery</dt><dd>RAG, embeddings, ChromaDB, LLM APIs, Docker, Docker Compose, Git and pytest</dd></div><div><dt>Technical support</dt><dd>Bug reproduction, root cause analysis, QA, accessibility and documentation</dd></div></dl>
        </section>
        <section id="about" className="practice wrap"><div><p className="eyebrow">04 / ABOUT & EDUCATION</p><h2>Development and diagnosis</h2></div><div><p>I work across software development and technical support. At Judge.me, I investigate failures across storefront code, integrations and data. My projects explore internal knowledge retrieval, commerce and data pipelines.</p><p>Based in Paris / Villejuif, France. I speak Arabic, French and English.</p><div id="education" className="education"><h3>Education</h3><p><strong>Expert en Architecture et Développement Logiciel · Bac+5</strong><br />Ingetis Paris · 2026–2027<br />Apprenticeship schedule: 3 weeks in company / 1 week at school.</p><p><strong>Master — Software Engineering & Web Applications</strong><br />Faculté des Sciences et Techniques, Settat · 2019–2022</p><p><strong>Bachelor — General Engineering</strong><br />Yncréa Maroc, Rabat · 2018–2019</p></div><p className="authorship">Projects use open-source tools and AI-assisted development. Shopify Sanity Hydrogen Starter extends the Hydrogen and Sanity starters.</p></div></section>
        <section id="contact" className="contact wrap">
          <p className="eyebrow">LET’S CONNECT</p>
          <h2>Contact me.</h2>
          <p>Hamza Ouasti · Paris / Villejuif, France</p>
          <a className="contact-email" href="mailto:ouastihamza27@gmail.com">ouastihamza27@gmail.com</a>
          <div className="actions"><a className="text-link" href={GITHUB_PROFILE} target="_blank" rel="noreferrer">GitHub <ArrowUpRight size={17} /></a><a className="text-link" href="https://linkedin.com/in/ouastihamza" target="_blank" rel="noreferrer">LinkedIn <ArrowUpRight size={17} /></a><a className="text-link" href="/Hamza_Ouasti.pdf" download lang="fr" hrefLang="fr">CV · Français (PDF) <ArrowUpRight size={17} /></a><a className="text-link" href="/Hamza_Ouasti_CV_English.pdf" download hrefLang="en">CV · English (PDF) <ArrowUpRight size={17} /></a></div>
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
