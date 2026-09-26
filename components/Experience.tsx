import BlackHoleText from "@/components/BlackHoleText";

interface Engagement {
  title: string;
  client: string;
  period: string;
  points: string[];
  stack: string[];
}

const engagements: Engagement[] = [
  {
    title: "Okrip World",
    client: "Ukrainian Minecraft network · 3 servers",
    period: "2026",
    points: [
      "Built the website and a player verification system: Discord OAuth → application with Minecraft nickname → moderation in Telegram → whitelist on the game server.",
      "Designed a Turborepo monorepo: Next.js web app, Fastify API with a background worker, shared Zod contracts.",
      "Wrote a Java 21 Paper/Purpur plugin with reliable command delivery, so approved players are never lost between services.",
      "Integrated live Dynmap world maps through a server-side proxy with a custom themed skin.",
    ],
    stack: [
      "Next.js",
      "Fastify",
      "PostgreSQL",
      "Drizzle",
      "Zod",
      "Java",
      "Turborepo",
    ],
  },
  {
    title: "Come By Shop",
    client: "Food ordering platform · Ukraine",
    period: "2025",
    points: [
      "Delivered a full food e-commerce product: menu, combos, cart, user accounts and an admin panel.",
      "Implemented auth with JWT and Google OAuth, online payments via WayForPay, SMS and email notifications.",
      "Built the Fastify REST API with PostgreSQL + Drizzle ORM and an SSR frontend on Next.js App Router.",
      "Covered frontend and backend with Vitest tests; deployed on Railway.",
    ],
    stack: [
      "Next.js",
      "Fastify",
      "PostgreSQL",
      "Drizzle",
      "WayForPay",
      "Vitest",
    ],
  },
];

export default function Experience() {
  return (
    <section
      id="experience"
      className="relative py-[140px] px-10 z-[1] max-[900px]:py-[100px] max-[900px]:px-5"
    >
      <div className="section-number">002</div>
      <div className="section-label reveal">
        <BlackHoleText text="Experience" />
      </div>
      <div className="max-w-[1200px] mx-auto">
        <div className="reveal mb-16 max-[900px]:mb-10">
          <h2
            className="font-sans font-extrabold leading-[0.9] tracking-[-2px] uppercase mb-6"
            style={{ fontSize: "clamp(36px, 5vw, 64px)" }}
          >
            <BlackHoleText text="Freelance" />
            <br />
            <BlackHoleText text="Fullstack" className="text-ghost" />{" "}
            <BlackHoleText text="Developer" />
          </h2>
          <p className="font-mono text-[11px] tracking-[3px] uppercase text-txt-muted">
            2025 — Present · Remote · Commercial projects for clients
          </p>
        </div>

        <div className="reveal border-t border-line">
          {engagements.map(({ title, client, period, points, stack }) => (
            <article
              key={title}
              className="grid gap-10 py-12 border-b border-line max-[900px]:flex max-[900px]:flex-col max-[900px]:gap-6 max-[900px]:py-10"
              style={{ gridTemplateColumns: "minmax(0, 1fr) minmax(0, 2fr)" }}
            >
              <div>
                <div className="font-mono text-[10px] tracking-[3px] uppercase text-accent mb-4">
                  <BlackHoleText text={period} />
                </div>
                <h3
                  className="font-sans font-bold leading-[0.95] tracking-[-1px] uppercase text-txt mb-3"
                  style={{ fontSize: "clamp(24px, 2.6vw, 34px)" }}
                >
                  <BlackHoleText text={title} />
                </h3>
                <div className="font-mono text-[11px] leading-[1.6] tracking-[0.3px] text-txt-muted">
                  {client}
                </div>
              </div>

              <div>
                <ul className="flex flex-col gap-3 mb-6 list-none p-0">
                  {points.map((point) => (
                    <li
                      key={point}
                      className="relative pl-5 font-sans text-[14.5px] leading-[1.7] tracking-[-0.2px]"
                      style={{ color: "var(--color-txt-skill-desc)" }}
                    >
                      <span className="absolute left-0 top-[0.8em] w-2 h-px bg-accent" />
                      {point}
                    </li>
                  ))}
                </ul>
                <div className="flex flex-wrap gap-2">
                  {stack.map((tag) => (
                    <span
                      key={tag}
                      className="font-mono text-[9px] tracking-[2px] uppercase text-txt-muted px-[14px] py-[7px] border border-line rounded-full"
                    >
                      <BlackHoleText text={tag} />
                    </span>
                  ))}
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
