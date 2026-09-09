import { ArrowUpRight } from "lucide-react";
import { GITHUB_PROFILE } from "./data/projects";
export { GITHUB_PROFILE } from "./data/projects";
export function Header() {
  return (
    <>
      <a className="skip-link" href="#main">
        Skip to content
      </a>
      <header className="site-header wrap">
        <a className="wordmark" href="/" aria-label="Hamza Ouasti, home">
          h<span>↗</span>
        </a>
        <span className="header-name">
          HAMZA OUASTI
          <br />
          <span>SOFTWARE DEVELOPER</span>
        </span>
        <nav aria-label="Main navigation">
          <a href="/#experience">Experience</a>
          <a href="/#projects">Projects</a>
          <a href="/#contact">Contact</a>
          <a className="github-nav" href={GITHUB_PROFILE} target="_blank" rel="noreferrer">
            GitHub <ArrowUpRight size={16} />
          </a>
        </nav>
      </header>
    </>
  );
}
export function Footer() {
  return (
    <footer className="site-footer wrap">
      <span>© 2026 HAMZA OUASTI</span>
      <span>PARIS / VILLEJUIF, FRANCE</span>
      <a href={GITHUB_PROFILE} target="_blank" rel="noreferrer">
        GitHub <ArrowUpRight size={15} />
      </a>
    </footer>
  );
}
export function ArchitectureDiagram() {
  return (
    <div className="architecture-panel">
      <p className="diagram-label">RETRIEVAL PIPELINE</p>
      <div className="diagram-flow">
        {[
          ["01", "Documents", "PDF, DOCX, spreadsheets & text"],
          ["02", "Local embeddings", "Sentence Transformers · BGE-M3"],
          ["03", "Workspace search", "ChromaDB · semantic similarity"],
          ["04", "Answer + evidence", "OpenAI · retrieved source references"],
        ].map(([n, title, sub]) => (
          <div className="diagram-step" key={n}>
            <span>{n}</span>
            <div>
              <strong>{title}</strong>
              <small>{sub}</small>
            </div>
          </div>
        ))}
      </div>
      <p className="diagram-foot">AUTHENTICATED REQUEST → WORKSPACE ACCESS CHECK</p>
    </div>
  );
}
