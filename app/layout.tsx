import type { Metadata } from "next";
import "./globals.css";
import SmoothScroll from "@/components/SmoothScroll";

export const metadata: Metadata = {
  title: "!Aøkigahara — Fullstack Developer",
  description:
    "!Aokigahara — portfolio of Dmytro Lanovyi, a fullstack developer from Cherkasy, Ukraine with commercial experience. Next.js · TypeScript · React · Fastify · PostgreSQL. Open to full-time and freelance work, remote.",
  keywords: [
    "!Aokigahara",
    "Aokigahara",
    "!Aøkigahara",
    "Dmytro Lanovyi",
    "fullstack developer",
    "Next.js developer",
    "React developer",
    "TypeScript",
    "Fastify",
    "PostgreSQL",
    "portfolio",
    "Ukraine",
    "Cherkasy",
    "junior developer",
  ],
  authors: [{ name: "Dmytro Lanovyi" }],
  icons: {
    icon: [{ url: "/favicon.svg", type: "image/svg+xml" }],
  },
  robots: "index, follow",
  metadataBase: new URL("https://aokigahara.dev"),
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    url: "https://aokigahara.dev",
    siteName: "!Aøkigahara",
    title: "!Aøkigahara — Dmytro Lanovyi | Fullstack Developer",
    description:
      "Fullstack developer from Ukraine with commercial projects in production. Next.js · TypeScript · React · Fastify · PostgreSQL. Open to full-time and freelance work.",
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
      "@id": "https://aokigahara.dev/#person",
      name: "Dmytro Lanovyi",
      alternateName: ["!Aokigahara", "!Aøkigahara", "Aokigahara"],
      jobTitle: "Fullstack Developer",
      description:
        "Fullstack developer specialising in Next.js, React, TypeScript, Fastify, Drizzle ORM and PostgreSQL. Freelance commercial projects since 2025.",
      url: "https://aokigahara.dev/",
      email: "lanovui0902@gmail.com",
      address: {
        "@type": "PostalAddress",
        addressLocality: "Cherkasy",
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
      sameAs: [
        "https://github.com/BlackMfgik",
        "https://www.linkedin.com/in/dmytro-lanovyi/",
        "https://t.me/A0klgahara",
      ],
    },
    {
      "@type": "WebSite",
      "@id": "https://aokigahara.dev/#website",
      name: "!Aøkigahara",
      url: "https://aokigahara.dev/",
      author: { "@id": "https://aokigahara.dev/#person" },
    },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
        <meta
          name="google-site-verification"
          content="googlec72bb84fadc85dad"
        />

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
