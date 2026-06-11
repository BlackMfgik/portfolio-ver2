import Link from "next/link";

interface Project {
  index: string;
  year: string;
  title: string;
  description: string;
  tags?: string[];
  href: string;
  coming?: boolean;
}

const projects: Project[] = [
  {
    index: "01 / 04",
    year: "2025",
    title: "Come By Shop",
    description:
      "Full-featured food ordering app. Next.js App Router (SSR), Fastify REST API, PostgreSQL + Drizzle ORM, JWT + Google OAuth, Zustand, TanStack Query, Resend email, Cloudinary image upload. Covered with Vitest.",
    tags: ["Next.js", "Fastify", "PostgreSQL", "JWT", "Vitest"],
    href: "https://come-by-shop-production.up.railway.app",
  },
  {
    index: "02 / 04",
    year: "2026",
    title: "Okrip World",
    description:
      "Ukrainian Minecraft network with three servers — Vanilla, Modded and Creative. Live world maps, custom mascot OiOi and an active community on Discord and Telegram.",
    tags: ["Minecraft", "Community", "Live Maps"],
    href: "https://okrip-world.vercel.app",
  },
  {
    index: "03 / 04",
    year: "2026",
    title: "Coming Soon",
    description: "Next project in development. Stay tuned for updates.",
    href: "#",
    coming: true,
  },
  {
    index: "04 / 04",
    year: "2026",
    title: "Coming Soon",
    description: "Next project in development. Stay tuned for updates.",
    href: "#",
    coming: true,
  },
];

function ProjectCard({
  index,
  year,
  title,
  description,
  tags,
  href,
  coming,
}: Project) {
  const inner = (
    <div
      className={[
        "project-card reveal h-full flex flex-col px-11 pt-11 pb-9 gap-5 border-b border-line",
        "max-[900px]:px-7 max-[900px]:py-8 max-[900px]:gap-4",
        coming ? "opacity-35 cursor-default" : "hover:bg-surface",
      ].join(" ")}
    >
      <div className="flex justify-between items-start font-mono text-[10px] tracking-[3px] uppercase text-txt-muted">
        <span className="text-accent">{index}</span>
        <span>{year}</span>
      </div>

      <h3
        className="font-sans font-bold leading-[0.95] tracking-[-1px] uppercase text-txt"
        style={{ fontSize: "clamp(28px, 3.5vw, 46px)" }}
      >
        {title}
      </h3>

      <p
        className="flex-1 font-sans text-[14px] leading-[1.7] tracking-[-0.2px] max-w-[380px]"
        style={{ color: "var(--color-txt-skill-desc)" }}
      >
        {description}
      </p>

      {tags && tags.length > 0 && (
        <div className="flex flex-wrap gap-2 mt-1">
          {tags.map((tag) => (
            <span
              key={tag}
              className="font-mono text-[9px] tracking-[2px] uppercase text-txt-muted px-[14px] py-[7px] border border-line rounded-full"
            >
              {tag}
            </span>
          ))}
        </div>
      )}
    </div>
  );

  if (coming) return <div className="h-full">{inner}</div>;

  return (
    <Link
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="no-underline text-inherit block h-full"
    >
      {inner}
    </Link>
  );
}

export default function Projects() {
  return (
    <section
      id="projects"
      className="relative py-[140px] px-10 z-[1] max-[900px]:py-[100px] max-[900px]:px-5"
    >
      {/* Ghost section number */}
      <div className="section-number">003</div>

      {/* Section label */}
      <div className="section-label reveal">Selected Work</div>

      <div className="max-w-[1200px] mx-auto">
        {/* Grid */}
        <div className="projects-grid grid grid-cols-2 border-t border-line max-[900px]:grid-cols-1">
          {projects.map((p) => (
            <ProjectCard key={p.index} {...p} />
          ))}
        </div>
      </div>
    </section>
  );
}
