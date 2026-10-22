import type { Metadata } from "next";
import "./globals.css";
import "./tech-grid.css";
import { ScrollReveal } from "./scroll-reveal";
export const metadata: Metadata = {
  metadataBase: new URL("https://ouastihamza.github.io"),
  title: "Hamza Ouasti — Full-Stack Developer & Software Engineer",
  description:
    "Full-stack developer (JavaScript, TypeScript, React, Node.js) in Greater Paris. Available now for a work-study apprenticeship (alternance): 3 weeks in company / 1 week at school, Master's in Software Architecture and Development at Ingetis Paris.",
  alternates: { canonical: "/" },
  openGraph: { title: "Hamza Ouasti — Full-Stack Developer & Software Engineer", description: "Available now for a work-study apprenticeship (alternance): 3 weeks in company / 1 week at school, Master's in Software Architecture and Development at Ingetis Paris. JavaScript, TypeScript, React and Node.js.", url: "/", type: "website", locale: "en_US" },
  twitter: { card: "summary", title: "Hamza Ouasti — Full-Stack Developer & Software Engineer", description: "Full-stack developer in Greater Paris. Available now for a work-study apprenticeship (alternance): 3 weeks in company / 1 week at school." },
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
