import Image from "next/image";
import { ArrowUpRight, ArrowDownRight } from "lucide-react";
import { Header, Footer, ArchitectureDiagram } from "./site-components";
import { stagger } from "./stagger";
import { Signature, SignatureScript } from "./signature";
import { education, experience, profile, skillGroups } from "./data/profile";
import { projects, type Project } from "./data/projects";
export default function Home() {
  const lead = projects[0];
  return (
    <>
      <SignatureScript />
      <Header />
      <main id="main">
        <section className="hero wrap">
          <div className="availability">
            <p className="availability-pill">
              <span className="availability-dot" aria-hidden="true" />
              <strong>{profile.availability}</strong>
              <span className="availability-sep" aria-hidden="true">·</span>
              Work-study apprenticeship (alternance)
            </p>
            <p className="availability-details">
              {profile.rhythm} · {profile.programme}
            </p>
          </div>
          <div className="hero-layout">
            <h1 className="signature-heading">
              <span className="sr-only">{profile.name}</span>
              <Signature />
            </h1>
            <div className="hero-aside">
              <p>
                Full-Stack Developer<br />Software Engineer
              </p>
              <p className="muted">{profile.summary}</p>
            </div>
          </div>
          <div className="hero-actions actions">
            <a className="button primary" href={profile.links.cvEnglish} download hrefLang="en">
              Download my CV (PDF) <ArrowUpRight size={17} />
            </a>
            <a className="button secondary" href={profile.links.cvFrench} download hrefLang="fr">
              CV in French (PDF) <ArrowUpRight size={17} />
            </a>
            <a className="text-link" href={`mailto:${profile.email}`}>
              Email me <ArrowUpRight size={17} />
            </a>
            <a className="text-link" href={profile.links.linkedin} target="_blank" rel="noreferrer">
              LinkedIn <ArrowUpRight size={17} />
            </a>
          </div>
          <div className="hero-bottom">
            <a href="#projects">
              SCROLL TO SELECTED WORK <ArrowDownRight size={16} />
            </a>
            <span>JAVASCRIPT / TYPESCRIPT / REACT / NODE.JS</span>
          </div>
        </section>
        <section id="experience" className="experience wrap">
          <div className="section-heading" data-reveal><p className="eyebrow">01 / EXPERIENCE</p><h2>Five years at Judge.me</h2></div>
          <div className="experience-grid" data-reveal>
            <div>
              <h3>{experience.role}</h3>
              <p className="muted">
                {experience.period} · {experience.company}, {experience.companyNote}
              </p>
              <p className="experience-summary">{experience.summary}</p>
              <dl className="experience-facts">
                {experience.facts.map((fact) => (
                  <div key={fact.value}>
                    <dt>{fact.value}</dt>
                    <dd>{fact.label}</dd>
                  </div>
                ))}
              </dl>
            </div>
            <div>
              <p>{experience.about}</p>
              <ul>
                {experience.highlights.map((highlight) => (
                  <li key={highlight}>{highlight}</li>
                ))}
              </ul>
            </div>
          </div>
          <p className="freelance" data-reveal>
            <strong>{experience.freelance.role}</strong>
            <br />
            <span className="muted">
              {experience.freelance.period} · {experience.freelance.clients}. {experience.freelance.description}
            </span>
          </p>
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
                project.compact ? (
                  <article className="project-row" id={project.id} key={project.id} data-reveal>
                    <p className="eyebrow">{project.year} / {project.status}</p>
                    <h3>{project.title}</h3>
                    <p className="project-description">{project.description}</p>
                    <p className="architecture">{project.technologies.join(" · ")}</p>
                  </article>
                ) : <article className="project-row" id={project.id} key={project.id} data-reveal style={stagger(index)}>
                  {project.secondary && <p className="eyebrow">SECONDARY WORK</p>}
                  {project.screenshot && <a className="project-screenshot" href={project.projectUrl}><Image unoptimized src={project.screenshot} alt={project.screenshotAlt || project.title} loading="lazy" width="1440" height="900" /><span>Explore the technical walkthroughs ↗</span></a>}
                  <div className="project-heading">
                    {!project.secondary && <span className="project-number">0{index + 2}</span>}
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
        <section id="about" className="practice wrap"><div className="sticky-heading" data-reveal><p className="eyebrow">04 / ABOUT & EDUCATION</p><h2>Development and diagnosis</h2></div><div data-reveal><p>My work connects application code, APIs and data. Production debugging informs how I approach software development and integrations.</p><p>Based in {profile.location}.</p><p>Languages: {profile.languages}.</p><div id="education" className="education"><h3>Education</h3>{education.map((entry) => (<p key={entry.title}><strong>{entry.title}</strong>{entry.details.map((detail) => (<span key={detail}><br />{detail}</span>))}</p>))}</div><p className="authorship">Projects use open-source tools and AI-assisted development. Headless Shopify + Sanity Starter extends the Hydrogen and Sanity starters.</p></div></section>
        <section id="contact" className="contact wrap" data-reveal>
          <p className="eyebrow">05 / CONTACT</p>
          <h2>Contact me.</h2>
          <p>{profile.name} · {profile.location}</p>
          <a className="contact-email" href={`mailto:${profile.email}`}>{profile.email}</a>
          <p className="contact-phone"><a className="text-link" href={profile.phone.href}>{profile.phone.display}</a></p>
          <div className="actions">
            <a className="text-link" href={profile.links.github} target="_blank" rel="noreferrer">GitHub <ArrowUpRight size={17} /></a>
            <a className="text-link" href={profile.links.linkedin} target="_blank" rel="noreferrer">LinkedIn <ArrowUpRight size={17} /></a>
            <a className="text-link" href={profile.links.cvEnglish} download hrefLang="en">CV · English (PDF) <ArrowUpRight size={17} /></a>
            <a className="text-link" href={profile.links.cvFrench} download hrefLang="fr">CV · French (PDF) <ArrowUpRight size={17} /></a>
          </div>
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
