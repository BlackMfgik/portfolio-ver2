interface SkillCard {
  icon: string;
  name: string;
  desc: string;
  level: string;
}

const frontend: SkillCard[] = [
  { icon: "TS",   name: "TypeScript",     desc: "Strict typing, interfaces, generics, utility types",           level: "Advanced"    },
  { icon: "R19",  name: "React 19",       desc: "RSC, hooks, context, suspense, transitions",                   level: "Advanced"    },
  { icon: "NXT",  name: "Next.js",        desc: "App Router, SSR, SSG, server actions, metadata API",           level: "Advanced"    },
  { icon: "ZST",  name: "Zustand",        desc: "Lightweight global state, slices, persist middleware",          level: "Proficient"  },
  { icon: "TSQ",  name: "TanStack Query", desc: "Server state, caching, mutations, optimistic updates",          level: "Proficient"  },
  { icon: "TW",   name: "Tailwind CSS",   desc: "Utility-first styling, custom design tokens, dark mode",        level: "Advanced"    },
  { icon: "ZOD",  name: "Zod",            desc: "Runtime schema validation, type inference, form parsing",       level: "Proficient"  },
];

const backend: SkillCard[] = [
  { icon: "FST",  name: "Fastify",        desc: "REST API, plugins, hooks, schema serialisation",               level: "Proficient"  },
  { icon: "NODE", name: "Node.js",        desc: "Event loop, streams, ESM, environment config",                 level: "Advanced"    },
  { icon: "PSQL", name: "PostgreSQL",     desc: "Relational schema design, joins, transactions, indices",        level: "Proficient"  },
  { icon: "DRZ",  name: "Drizzle ORM",    desc: "Type-safe queries, migrations, relations, SQL escape hatch",    level: "Proficient"  },
  { icon: "JWT",  name: "JWT Auth",       desc: "Access / refresh tokens, cookie strategy, Google OAuth",       level: "Proficient"  },
];

const tooling: SkillCard[] = [
  { icon: "VITE", name: "Vite",           desc: "HMR, build optimisation, plugins, env handling",               level: "Advanced"    },
  { icon: "VIT",  name: "Vitest",         desc: "Unit & integration tests, mocking, coverage reports",           level: "Intermediate"},
  { icon: "GIT",  name: "Git",            desc: "Branch strategy, conventional commits, rebase",                 level: "Proficient"  },
  { icon: "RLW",  name: "Railway",        desc: "PostgreSQL hosting, environment variables, logs",               level: "Proficient"  },
  { icon: "VRL",  name: "Vercel",         desc: "Deployments, preview URLs, edge config, analytics",            level: "Advanced"    },
  { icon: "CLD",  name: "Cloudinary",     desc: "Image upload, transformation, CDN delivery",                   level: "Proficient"  },
];

function CategoryBlock({ label, cards }: { label: string; cards: SkillCard[] }) {
  return (
    <div className="mb-16 last:mb-0">
      {/* Category header */}
      <div className="flex items-center gap-3 py-5 border-b border-line">
        <div className="w-1.5 h-1.5 rounded-full bg-accent opacity-50" />
        <span className="font-mono text-[10px] tracking-[4px] uppercase text-txt-muted">
          {label}
        </span>
      </div>

      {/* 2-column grid */}
      <div className="grid grid-cols-2 max-[900px]:grid-cols-1">
        {cards.map((card) => (
          <div key={card.name} className="skill-card">
            <span className="font-mono text-[13px] tracking-[1px] text-txt-muted opacity-60 block mb-3">
              {card.icon}
            </span>
            <div className="font-sans font-bold text-[17px] tracking-[-0.3px] uppercase text-txt mb-2">
              {card.name}
            </div>
            <div className="font-mono text-[11px] leading-[1.6] text-txt-muted tracking-[0.3px] mb-4">
              {card.desc}
            </div>
            <span className="font-mono text-[9px] tracking-[2px] uppercase text-txt-muted opacity-65">
              {card.level}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function Skills() {
  return (
    <section
      id="skills"
      className="relative py-[140px] px-10 z-[1] max-[900px]:py-[100px] max-[900px]:px-5"
    >
      {/* Ghost section number */}
      <div className="section-number">002</div>

      {/* Section label */}
      <div className="section-label reveal">Tech Stack</div>

      <div className="max-w-[1200px] mx-auto">
        {/* Header */}
        <div className="reveal mb-20 max-[900px]:mb-12">
          <h2
            className="font-sans font-extrabold leading-[0.9] tracking-[-2px] uppercase mb-6"
            style={{ fontSize: "clamp(44px, 8vw, 110px)" }}
          >
            <span>TECH</span>
            <br />
            <span className="text-ghost">STACK</span>
          </h2>
          <p className="font-mono text-[13px] text-txt-muted leading-[1.9] max-w-[500px]">
            Building production fullstack applications with these technologies.
            Every tool used in real projects — no tutorial-only skills.
          </p>
        </div>

        {/* Categories */}
        <div className="reveal">
          <CategoryBlock label="Frontend" cards={frontend} />
          <CategoryBlock label="Backend"  cards={backend}  />
          <CategoryBlock label="Tooling"  cards={tooling}  />
        </div>
      </div>
    </section>
  );
}
