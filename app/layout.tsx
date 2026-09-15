import type { Metadata } from "next";
import "./globals.css";
import { ScrollReveal } from "./scroll-reveal";
export const metadata: Metadata = {
  metadataBase: new URL("https://ouastihamza.github.io"),
  title: "Hamza Ouasti — Software & Technical Support Engineer",
  description:
    "Full-stack software, internal AI and commerce integrations. Selected projects with architecture, engineering decisions and source code.",
  alternates: { canonical: "/" },
  openGraph: { title: "Hamza Ouasti — Software & Technical Support Engineer", description: "Full-stack development, Tier 2 technical support at Judge.me, and selected AI and commerce projects.", url: "/", type: "website", locale: "en_US" },
  twitter: { card: "summary", title: "Hamza Ouasti — Software & Technical Support Engineer", description: "Full-stack development, technical support, AI and commerce projects." },
  icons: { icon: "/favicon.svg" },
};
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        {children}
        <ScrollReveal />
      </body>
    </html>
  );
}
