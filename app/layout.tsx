import type { Metadata } from "next";
import "./globals.css";
import "./tech-grid.css";
import "./woodland.css";
import "./editorial.css";
import "./mobile-navigation.css";
import { ScrollReveal } from "./scroll-reveal";
export const metadata: Metadata = {
  metadataBase: new URL("https://ouastihamza.github.io"),
  title: "Hamza Ouasti — Full-Stack Developer & Software Engineer",
  description:
    "Full-stack development, e-commerce integrations and advanced production troubleshooting. Explore Hamza Ouasti’s projects, engineering experience and technical skills.",
  alternates: { canonical: "/" },
  openGraph: { title: "Hamza Ouasti — Full-Stack Developer & Software Engineer", description: "Full-stack applications, commerce integrations and production problem-solving with JavaScript, TypeScript, React and Node.js.", url: "/", type: "website", locale: "en_US" },
  twitter: { card: "summary", title: "Hamza Ouasti — Full-Stack Developer & Software Engineer", description: "Full-stack applications, e-commerce integrations and advanced technical troubleshooting." },
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
