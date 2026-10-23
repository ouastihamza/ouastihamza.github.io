import { ArrowUpRight } from "lucide-react";
import { GITHUB_PROFILE } from "./data/projects";
import { profile } from "./data/profile";
export { GITHUB_PROFILE } from "./data/projects";
export { Header } from "./header";

export function Footer() {
  return (
    <footer className="site-footer wrap">
      <span>© 2026 {profile.name.toUpperCase()}</span>
      <span>{profile.location.toUpperCase()}</span>
      <a href={GITHUB_PROFILE} target="_blank" rel="noreferrer">
        GitHub <ArrowUpRight size={15} />
      </a>
    </footer>
  );
}
export function ArchitectureDiagram() {
  return (
    <div className="architecture-panel" data-reveal>
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

export function CommerceDiagram() {
  return <aside className="commerce-diagram" aria-label="Shopify and Sanity integration architecture">
    <p className="eyebrow">COMMERCE + EDITORIAL</p>
    <div className="commerce-sources"><div><strong>Shopify</strong><span>Products &amp; cart</span><small>Storefront GraphQL</small></div><span aria-hidden="true">+</span><div><strong>Sanity</strong><span>Editorial content</span><small>GROQ</small></div></div>
    <span className="commerce-connector" aria-hidden="true">↓</span>
    <div className="commerce-destination"><strong>Hydrogen storefront</strong><span>Product data meets editorial content</span></div>
    <p className="diagram-caption">Integration architecture · not a live storefront preview</p>
  </aside>;
}
