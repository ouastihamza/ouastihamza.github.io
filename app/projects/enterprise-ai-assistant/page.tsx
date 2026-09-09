import type { Metadata } from "next";
import { ArrowLeft, ArrowUpRight } from "lucide-react";
import { Header, Footer, ArchitectureDiagram, GITHUB_PROFILE } from "../../site-components";
export const metadata: Metadata = {
  title: "Enterprise AI Assistant — Hamza Ouasti",
  alternates: { canonical: "/projects/enterprise-ai-assistant" },
  openGraph: { title: "Enterprise AI Assistant — Hamza Ouasti", description: "Document ingestion, workspace-scoped retrieval and source-grounded answers.", url: "/projects/enterprise-ai-assistant", type: "website" },
  twitter: { card: "summary", title: "Enterprise AI Assistant — Hamza Ouasti", description: "FastAPI, Next.js, PostgreSQL and ChromaDB." },
  description:
    "Inside a full-stack internal knowledge platform: document ingestion, workspace-aware retrieval, local embeddings, and answers with source references.",
};
const repo = `${GITHUB_PROFILE}/enterprise-ai-assistant`;
export default function EnterpriseCaseStudy() {
  return (
    <>
      <Header />
      <main id="main" className="case-study wrap">
        <a className="text-link back-link" href="/#projects">
          <ArrowLeft size={17} /> Back to selected work
        </a>
        <header className="case-header">
          <p className="eyebrow">PROJECT 01 / AI & INTERNAL KNOWLEDGE / 2026</p>
          <h1>
            Enterprise<br /><span>AI Assistant</span>
          </h1>
          <p className="case-intro">
            Enterprise AI Assistant brings document ingestion, semantic retrieval and a
            conversational interface into one full-stack internal knowledge platform.
          </p>
          <div className="actions">
            <a className="button primary" href={repo} target="_blank" rel="noreferrer">
              View source <ArrowUpRight size={17} />
            </a>
            <span className="status">Prototype · Public repository</span>
          </div>
        </header>
        <section className="case-row">
          <div>
            <p className="eyebrow">THE PROBLEM</p>
            <h2>
              From scattered files
              <br />
              to useful context.
            </h2>
          </div>
          <div>
            <p>
              Policies, procedures and operational documents can be difficult to navigate as a
              collection. A general chatbot has no access to that internal knowledge by default.
            </p>
            <p>
              This application lets a team upload documents into a workspace, index their content,
              and ask questions against that collection. Answers arrive with retrieved document
              names and excerpts so the reader has a path back to the underlying material.
            </p>
          </div>
        </section>
        <section className="case-architecture">
          <div>
            <p className="eyebrow">THE ARCHITECTURE</p>
            <h2>
              Frontend, API<br />and retrieval.
            </h2>
            <div className="architecture-key">
              <p>
                <strong>Next.js 16 / React 19</strong>
                <br />
                Authentication screens, dashboard, knowledge library, assistant and settings.
              </p>
              <p>
                <strong>FastAPI + PostgreSQL</strong>
                <br />
                Protected APIs and relational records for users, workspaces, documents, settings and
                conversations. Raw SQL through psycopg2.
              </p>
              <p>
                <strong>ChromaDB + local file storage</strong>
                <br />A persistent vector collection per workspace, with uploaded files and
                processed artifacts stored on disk.
              </p>
            </div>
          </div>
          <ArchitectureDiagram />
        </section>
        <section className="case-row">
          <div>
            <p className="eyebrow">THE RETRIEVAL PIPELINE</p>
            <h2>
              Keep the source
              <br />
              attached to the answer.
            </h2>
          </div>
          <ol className="pipeline-list">
            <li>
              <strong>Read and normalize</strong>
              <p>
                A reader factory selects parsers for PDF, DOCX, TXT, Markdown, CSV, XLSX, HTML,
                JSON, XML and PPTX. Extracted text moves through cleaning and
                paragraph/sentence-aware chunking with overlap.
              </p>
            </li>
            <li>
              <strong>Embed and index</strong>
              <p>
                Sentence Transformers runs BAAI/bge-m3 locally. Normalized embeddings are computed
                in batches, then upserted into ChromaDB using stable workspace, source and chunk
                identifiers.
              </p>
            </li>
            <li>
              <strong>Retrieve relevant material</strong>
              <p>
                The question is embedded with the same model. Search queries the active workspace
                collection, converts cosine distance to similarity, and filters matches below a
                relevance threshold.
              </p>
            </li>
            <li>
              <strong>Generate with references</strong>
              <p>
                Retrieved chunks form labeled context for the OpenAI Responses API. The prompt asks
                for source citations and an admission when context is insufficient. Empty retrieval
                returns a no-information answer without calling the LLM.
              </p>
            </li>
          </ol>
        </section>
        <section className="case-row">
          <div>
            <p className="eyebrow">ENGINEERING DECISIONS</p>
            <h2>
              Engineering decisions
            </h2>
          </div>
          <div className="decision-list">
            <article>
              <h3>Workspace boundaries</h3>
              <p>
                JWT authentication identifies the user; document and assistant endpoints check
                workspace access before processing a request. Separate Chroma collections keep
                retrieval scoped to that workspace. The code includes a superuser exception.
              </p>
            </article>
            <article>
              <h3>Document lifecycle consistency</h3>
              <p>
                Source metadata must survive parsing, chunking and indexing. Deletion coordinates
                the document registry, uploaded file, processed artifacts and vector entries, so
                deleted content can be removed from retrieval.
              </p>
            </article>
            <article>
              <h3>Retrieval quality versus context size</h3>
              <p>
                Similarity filtering and an approximate context budget limit weak or excessive
                context. Local embeddings offer control over retrieval, with a large model download
                and CPU cost as tradeoffs.
              </p>
            </article>
            <article>
              <h3>Reproducible local services</h3>
              <p>
                Docker and Docker Compose define the frontend, API and PostgreSQL services. Health
                checks sequence startup, while persistent volumes preserve database and document
                storage.
              </p>
            </article>
          </div>
        </section>
        <section className="case-row">
          <div>
            <p className="eyebrow">TESTING & BOUNDARIES</p>
            <h2>
              Testing and
              <br />
              clear limits.
            </h2>
          </div>
          <div>
            <p>
              The pytest suite includes authentication, workspace authorization, document
              upload/deletion and assistant endpoint tests. Its fixtures exercise PostgreSQL and
              local embedding/ChromaDB services; the LLM response is replaced by a fixed test response.
            </p>
            <div className="case-callout">
              <strong>Designed for source-grounded answers</strong>
              <p>
                Citations make retrieved evidence inspectable. They do not prove every returned
                statement is correct. The repository does not establish measured answer accuracy,
                production scale, or a security audit.
              </p>
            </div>
            <p>
              Application records are in PostgreSQL, while text and JSON processing artifacts remain
              on disk. Schema creation happens in services rather than through a migration
              framework.
            </p>
            <p>
              The public main branch stores conversation history, but does not pass that history
              into the RAG call. Its context budget and source list also leave room for tighter
              citation alignment. These are concrete next engineering steps.
            </p>
            <p className="muted">
              The implementation and test source were inspected for this case study. The
              application’s full integration suite was not rerun for this portfolio.
            </p>
          </div>
        </section>
        <section className="case-row">
          <div>
            <p className="eyebrow">FURTHER WORK</p>
            <h2>
              A platform
              <br />
              to build on.
            </h2>
          </div>
          <div>
            <p>
              An inspected local feature branch extends the system with customer profiles and sites,
              customer-filtered retrieval, a combination of semantic and lexical search, and
              streaming answers. These additions are separate from the public main-branch experience
              described above.
            </p>
            <p>
              For the public version, the next priorities are schema migrations, stricter alignment
              between cited sources and supplied context, and an evaluation set of representative
              questions and expected evidence.
            </p>
            <p className="muted">
              Development uses open-source libraries and AI assistance.
            </p>
          </div>
        </section>
        <div className="case-closing">
          <div>
            <p className="eyebrow">EXPLORE THE IMPLEMENTATION</p>
            <h2>Follow the code.</h2>
            <p>enterprise-ai-assistant · public main</p>
          </div>
          <div className="actions">
            <a className="button primary" href={repo} target="_blank" rel="noreferrer">
              View source <ArrowUpRight size={17} />
            </a>
            <a className="text-link" href="/#projects">
              All selected work <ArrowUpRight size={17} />
            </a>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
