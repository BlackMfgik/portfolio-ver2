import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "!Aøkigahara — Fullstack Developer",
  description:
    "!Aokigahara — portfolio of Dmytro Lanovyi, a junior fullstack developer from Cherkasy, Ukraine. Next.js · TypeScript · React · Fastify · PostgreSQL. Open to work, remote-friendly.",
  keywords: [
    "!Aokigahara", "Aokigahara", "!Aøkigahara", "Dmytro Lanovyi",
    "fullstack developer", "Next.js developer", "React developer",
    "TypeScript", "Fastify", "PostgreSQL", "portfolio", "Ukraine", "Cherkasy",
    "junior developer",
  ],
  authors: [{ name: "Dmytro Lanovyi" }],
  robots: "index, follow",
  metadataBase: new URL("https://portfolio-nu-ashen-35.vercel.app"),
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    url: "https://portfolio-nu-ashen-35.vercel.app",
    siteName: "!Aøkigahara",
    title: "!Aøkigahara — Dmytro Lanovyi | Fullstack Developer",
    description:
      "Junior fullstack developer from Ukraine. Next.js · TypeScript · React · Fastify · PostgreSQL. Open to work and remote positions.",
    locale: "en_US",
  },
  twitter: {
    card: "summary",
    title: "!Aøkigahara — Fullstack Developer Portfolio",
    description:
      "Junior fullstack developer from Ukraine. Next.js · TypeScript · Fastify. Open to work.",
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Person",
      "@id": "https://portfolio-nu-ashen-35.vercel.app/#person",
      name: "Dmytro Lanovyi",
      alternateName: ["!Aokigahara", "!Aøkigahara", "Aokigahara"],
      jobTitle: "Fullstack Developer",
      description:
        "Junior fullstack developer specialising in Next.js, React, TypeScript, Fastify, Drizzle ORM and PostgreSQL.",
      url: "https://portfolio-nu-ashen-35.vercel.app/",
      email: "lanovui0902@gmail.com",
      address: { "@type": "PostalAddress", addressLocality: "Cherkasy", addressCountry: "UA" },
      knowsAbout: [
        "React", "React 19", "Next.js", "TypeScript", "JavaScript",
        "Fastify", "Node.js", "PostgreSQL", "Drizzle ORM", "Zustand",
        "TanStack Query", "Tailwind CSS", "Zod", "JWT", "Vitest",
        "Vite", "REST API", "Git", "Vercel", "Railway", "Cloudinary",
      ],
      sameAs: [
        "https://github.com/BlackMfgik",
        "https://www.linkedin.com/in/%D0%B4%D0%BC%D0%B8%D1%82%D1%80%D0%BE-%D0%BB%D0%B0%D0%BD%D0%BE%D0%B2%D0%B8%D0%B9-75a16638a/",
      ],
    },
    {
      "@type": "WebSite",
      "@id": "https://portfolio-nu-ashen-35.vercel.app/#website",
      name: "!Aøkigahara",
      url: "https://portfolio-nu-ashen-35.vercel.app/",
      author: { "@id": "https://portfolio-nu-ashen-35.vercel.app/#person" },
    },
  ],
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <head>
        {/* Favicon */}
        <link rel="icon" type="image/svg+xml" href="/favicon.svg" />

        {/* Google Search Console */}
        <meta name="google-site-verification" content="googlec72bb84fadc85dad" />

        {/* Fonts */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Syne:wght@400;500;600;700;800&family=DM+Mono:ital,wght@0,300;0,400;0,500;1,300;1,400;1,500&display=swap"
          rel="stylesheet"
        />

        {/* Devicons */}
        <link
          rel="stylesheet"
          href="https://cdn.jsdelivr.net/npm/devicon@2.15.1/devicon.min.css"
        />

        {/* JSON-LD */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="bg-bg text-txt antialiased overflow-x-hidden" suppressHydrationWarning>
        {children}
      </body>
    </html>
  );
}
