import type { Metadata } from "next";
import "./globals.css";
import { ScrollReveal } from "./scroll-reveal";
export const metadata: Metadata = {
  metadataBase: new URL("https://ouastihamza.github.io"),
  title: "Hamza Ouasti — Full-Stack Developer & Software Engineer",
  description:
    "JavaScript, TypeScript, React and Node.js developer in Greater Paris. Seeking a Bac+5 apprenticeship from September 2026. Projects, experience and CV.",
  alternates: { canonical: "/" },
  openGraph: { title: "Hamza Ouasti — Full-Stack Developer & Software Engineer", description: "JavaScript, TypeScript, React and Node.js. Seeking a Bac+5 apprenticeship from September 2026: 3 weeks in company / 1 week at school.", url: "/", type: "website", locale: "en_US" },
  twitter: { card: "summary", title: "Hamza Ouasti — Full-Stack Developer & Software Engineer", description: "Full-stack developer in Greater Paris. JavaScript, TypeScript, React and Node.js. Bac+5 apprenticeship from September 2026." },
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
