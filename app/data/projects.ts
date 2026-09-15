export const GITHUB_PROFILE = "https://github.com/ouastihamza";
export interface Project {
  id: string;
  title: string;
  category: string;
  description: string;
  architecture: string;
  technologies: string[];
  challenges: string;
  note: string;
  githubUrl: string | null;
  liveUrl: string | null;
  repositoryName: string | null;
  featured: boolean;
  status: string;
  year: number;
  detailUrl: string | null;
  projectUrl?: string;
  screenshot?: string;
  screenshotAlt?: string;
}
export const projects: Project[] = [
  {
    id: "enterprise-ai-assistant",
    title: "Enterprise AI Assistant",
    category: "AI / INTERNAL KNOWLEDGE",
    description:
      "Turn scattered company documents into a searchable knowledge base. Teams can upload internal files, ask questions, and inspect the retrieved sources behind an answer.",
    architecture:
      "Next.js interface → FastAPI services → PostgreSQL application data + ChromaDB retrieval → OpenAI answers.",
    technologies: [
      "FastAPI",
      "Next.js / React",
      "PostgreSQL",
      "ChromaDB",
      "RAG",
      "Sentence Transformers",
      "JWT",
      "Docker Compose",
      "pytest",
    ],
    challenges:
      "Keeping retrieval within workspace boundaries, carrying source metadata through ingestion, and filtering weak matches before generation.",
    note: "Prototype. The case study covers the public main branch.",
    githubUrl: `${GITHUB_PROFILE}/enterprise-ai-assistant`,
    liveUrl: null,
    repositoryName: "enterprise-ai-assistant",
    featured: true,
    status: "Prototype",
    year: 2026,
    detailUrl: "/projects/enterprise-ai-assistant",
  },
  {
    id: "shopify-technical-studies",
    title: "Shopify Technical Studies",
    category: "SHOPIFY / TECHNICAL DEMONSTRATIONS",
    description: "An interactive technical portfolio explaining structured product data, storefront debugging and resilient integrations through animated, step-by-step demonstrations.",
    architecture: "React and TypeScript with Framer Motion: six sections and paired merchant/technical views. Built with Vite.",
    technologies: ["React 18", "TypeScript", "Framer Motion", "Vite", "CSS"],
    challenges: "Coordinating scroll-driven stories, section navigation and merchant/technical views while keeping the experience readable on mobile.",
    note: "Illustrative store data; no live Shopify connection or checkout.",
    githubUrl: null,
    liveUrl: null,
    repositoryName: null,
    featured: true,
    status: "Interactive portfolio",
    year: 2026,
    detailUrl: null,
    projectUrl: "/projects/shopify-technical-studies",
    screenshot: "/images/shopify-technical-studies.webp",
    screenshotAlt: "Shopify Technical Studies interface with section navigation and Shopify technical problem-solving overview.",
  },
  {
    id: "shopify-sanity-hydrogen-starter",
    title: "Shopify Sanity Hydrogen Starter",
    category: "HEADLESS COMMERCE / CMS",
    description:
      "Connect Shopify’s product catalog with Sanity’s editorial content, giving a storefront product pages that combine commerce data and rich content.",
    architecture:
      "Hydrogen + React Router storefront → Shopify Storefront GraphQL for products and cart actions + Sanity GROQ for editorial content.",
    technologies: [
      "TypeScript",
      "React Router 7",
      "Shopify Hydrogen",
      "Sanity",
      "GraphQL",
      "GROQ",
      "Vite",
    ],
    challenges:
      "Joining content by product handle, connecting cart actions, and configuring content previews across the storefront and Studio.",
    note: "Integration prototype built on the Hydrogen skeleton and Sanity Shopify Studio starters. Public code includes add-to-cart wiring; checkout has not been independently verified.",
    githubUrl: `${GITHUB_PROFILE}/shopify-sanity-hydrogen-starter`,
    liveUrl: null,
    repositoryName: "shopify-sanity-hydrogen-starter",
    featured: true,
    status: "Integration prototype",
    year: 2025,
    detailUrl: null,
  },
];
