import type { Metadata } from "next";
import "./globals.css";
import SmoothScroll from "@/components/SmoothScroll";

export const metadata: Metadata = {
  title: "Aokigahara — Fullstack Developer Portfolio",
  description:
    "Aokigahara (!Aøkigahara) — fullstack developer from Ukraine with commercial experience. Aokigahara builds web apps with Next.js · TypeScript · React · Fastify · PostgreSQL. Open to full-time and freelance work, remote.",
  applicationName: "Aokigahara",
  keywords: [
    "Aokigahara",
    "!Aokigahara",
    "!Aøkigahara",
    "Aokigahara developer",
    "Aokigahara portfolio",
    "Aokigahara dev",
    "aokigahara.dev",
    "fullstack developer",
    "Next.js developer",
    "React developer",
    "TypeScript",
    "Fastify",
    "PostgreSQL",
    "portfolio",
    "Ukraine",
  ],
  authors: [{ name: "Aokigahara", url: "https://aokigahara.dev" }],
  creator: "Aokigahara",
  publisher: "Aokigahara",
  robots: "index, follow",
  metadataBase: new URL("https://aokigahara.dev"),
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    url: "https://aokigahara.dev",
    siteName: "Aokigahara",
    title: "Aokigahara — Fullstack Developer Portfolio",
    description:
      "Aokigahara — fullstack developer from Ukraine with commercial projects in production. Next.js · TypeScript · React · Fastify · PostgreSQL. Open to full-time and freelance work.",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "Aokigahara — Fullstack Developer Portfolio",
    description:
      "Aokigahara — fullstack developer from Ukraine. Next.js · TypeScript · Fastify. Open to work.",
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Person",
      "@id": "https://aokigahara.dev/#person",
      name: "Aokigahara",
      alternateName: ["!Aøkigahara", "!Aokigahara", "Aokigahara dev"],
      jobTitle: "Fullstack Developer",
      description:
        "Aokigahara is a fullstack developer specialising in Next.js, React, TypeScript, Fastify, Drizzle ORM and PostgreSQL. Freelance commercial projects since 2025.",
      url: "https://aokigahara.dev/",
      image: "https://aokigahara.dev/opengraph-image",
      address: {
        "@type": "PostalAddress",
        addressCountry: "UA",
      },
      knowsAbout: [
        "React",
        "React 19",
        "Next.js",
        "TypeScript",
        "JavaScript",
        "Fastify",
        "Node.js",
        "PostgreSQL",
        "Drizzle ORM",
        "Zustand",
        "TanStack Query",
        "Tailwind CSS",
        "Zod",
        "JWT",
        "Vitest",
        "Vite",
        "REST API",
        "Git",
        "Vercel",
        "Railway",
        "Cloudinary",
      ],
      sameAs: ["https://github.com/BlackMfgik", "https://t.me/A0klgahara"],
    },
    {
      "@type": "WebSite",
      "@id": "https://aokigahara.dev/#website",
      name: "Aokigahara",
      alternateName: ["!Aøkigahara", "!Aokigahara", "aokigahara.dev"],
      url: "https://aokigahara.dev/",
      author: { "@id": "https://aokigahara.dev/#person" },
      publisher: { "@id": "https://aokigahara.dev/#person" },
    },
    {
      "@type": "ProfilePage",
      "@id": "https://aokigahara.dev/#profile",
      name: "Aokigahara — Fullstack Developer Portfolio",
      url: "https://aokigahara.dev/",
      isPartOf: { "@id": "https://aokigahara.dev/#website" },
      mainEntity: { "@id": "https://aokigahara.dev/#person" },
    },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Syne:wght@400;500;600;700;800&family=DM+Mono:ital,wght@0,300;0,400;0,500;1,300;1,400;1,500&display=swap"
          rel="stylesheet"
        />

        <link
          rel="stylesheet"
          href="https://cdn.jsdelivr.net/npm/devicon@2.15.1/devicon.min.css"
        />

        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body
        className="bg-bg text-txt antialiased overflow-x-hidden"
        suppressHydrationWarning
      >
        <SmoothScroll>{children}</SmoothScroll>
      </body>
    </html>
  );
}
