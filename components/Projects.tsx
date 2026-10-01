"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import BlackHoleText from "@/components/BlackHoleText";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

interface Project {
  index: string;
  year: string;
  title: string;
  description: string;
  tags?: string[];
  href?: string;
  image: string;
  coming?: boolean;
  commercial?: boolean;
}

const projects: Project[] = [
  {
    index: "01 / 03",
    year: "2026",
    title: "Okrip World",
    description:
      "Site and player verification for a Minecraft network: Discord OAuth, Telegram moderation, custom Java plugin, live Dynmap maps.",
    tags: ["Next.js", "Fastify", "PostgreSQL", "Java", "Turborepo"],
    href: "https://okrip.world",
    image:
      "https://res.cloudinary.com/dk9yjgta3/image/upload/v1788809687/Screenshot_2026-09-07_223349_ew5p1b.png",
    commercial: true,
  },
  {
    index: "02 / 03",
    year: "2025",
    title: "Come By Shop",
    description:
      "Food ordering platform: SSR storefront, Fastify REST API, WayForPay payments, Google OAuth + 2FA, rate limiting, admin panel. Vitest.",
    tags: ["Next.js", "Fastify", "PostgreSQL", "Drizzle", "Vitest"],
    href: "https://come-by-shope-latest.vercel.app",
    image:
      "https://res.cloudinary.com/dk9yjgta3/image/upload/f_auto/q_auto/Screenshot_2026-08-31_093458_pp6ymh.png",
    commercial: true,
  },
  {
    index: "03 / 03",
    year: "2026",
    title: "Nami Gear",
    description:
      "Store for gaming mousepads and glides on Next.js 16: Neon PostgreSQL catalog, cart with Zustand, live stock sync via TanStack Query.",
    tags: ["Next.js 16", "Neon", "Zustand", "TanStack Query", "Tailwind 4"],
    href: "https://nami.wtf",
    image:
      "https://res.cloudinary.com/dk9yjgta3/image/upload/f_auto/q_auto/Screenshot_2026-08-28_001122_rzff0g.png",
  },
];

function ProjectCard({
  project,
  innerRef,
}: {
  project: Project;
  innerRef: (el: HTMLDivElement | null) => void;
}) {
  const {
    index,
    year,
    title,
    description,
    tags,
    href,
    image,
    coming,
    commercial,
  } = project;

  const inner = (
    <div
      ref={innerRef}
      className={[
        "project-slide",
        coming ? "opacity-60 cursor-default" : "",
      ].join(" ")}
    >
      <div className="project-slide-panel">
        <div className="project-slide-media">
          <Image
            src={image}
            alt={title}
            fill
            sizes="(max-width: 900px) 92vw, 82vw"
            className="project-slide-img"
            priority={index === "01 / 03"}
          />
        </div>

        <div className="project-slide-body flex flex-col flex-1 min-h-0 px-9 pt-7 pb-8 gap-4 max-[900px]:px-6 max-[900px]:pt-6 max-[900px]:pb-7">
          <div className="flex justify-between items-start font-mono text-[10px] tracking-[3px] uppercase text-txt-muted">
            <span className="flex items-center gap-4">
              <span className="text-accent">
                <BlackHoleText text={index} />
              </span>
              {commercial && (
                <span className="px-[10px] py-[4px] -my-[4px] border border-line rounded-full text-txt">
                  <BlackHoleText text="Commercial" />
                </span>
              )}
            </span>
            <span>
              <BlackHoleText text={year} />
            </span>
          </div>

          <div className="flex items-start justify-between gap-6 max-[900px]:flex-col max-[900px]:gap-2">
            <h3
              className="font-sans font-bold leading-[0.95] tracking-[-1px] uppercase text-txt"
              style={{ fontSize: "clamp(26px, 3vw, 40px)" }}
            >
              <BlackHoleText text={title} />
            </h3>

            <p
              className="shrink-0 max-w-[360px] mr-24 min-h-[70px] line-clamp-3 font-sans text-[13.5px] leading-[1.7] tracking-[-0.2px] text-right max-[900px]:mr-0 max-[900px]:text-left max-[900px]:max-w-none"
              style={{ color: "var(--color-txt-skill-desc)" }}
            >
              {description}
            </p>
          </div>

          {tags && tags.length > 0 && (
            <div className="flex flex-wrap gap-2 -mt-6">
              {tags.map((tag) => (
                <span
                  key={tag}
                  className="font-mono text-[9px] tracking-[2px] uppercase text-txt-muted px-[14px] py-[7px] border border-line rounded-full"
                >
                  <BlackHoleText text={tag} />
                </span>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );

  if (coming || !href) return inner;

  return (
    <Link
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="no-underline text-inherit contents"
    >
      {inner}
    </Link>
  );
}

export default function Projects() {
  const sectionRef = useRef<HTMLElement | null>(null);
  const viewportRef = useRef<HTMLDivElement | null>(null);
  const trackRef = useRef<HTMLDivElement | null>(null);
  const cardsRef = useRef<(HTMLDivElement | null)[]>([]);
  const scrollFillRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const section = sectionRef.current;
    const viewport = viewportRef.current;
    const track = trackRef.current;
    if (!section || !viewport || !track) return;

    const ctx = gsap.context(() => {
      const getScrollDistance = () =>
        Math.max(track.scrollWidth - viewport.clientWidth, 0);

      // Динамічні відступи зліва/справа треку так, щоб перша й остання
      // картка могли стати ТОЧНО по центру viewport на краях скролу
      // (замість фіксованих асиметричних значень у CSS).
      const setEdgePadding = () => {
        const firstCard = cardsRef.current.find(
          (c): c is HTMLDivElement => !!c,
        );
        if (!firstCard) return;
        const vWidth = viewport.clientWidth;
        const cardWidth = firstCard.getBoundingClientRect().width;
        const pad = Math.max(0, (vWidth - cardWidth) / 2);
        track.style.paddingLeft = `${pad}px`;
        track.style.paddingRight = `${pad}px`;
      };

      const BUFFER_PX = 400; // "мертва" відстань скролу до/після горизонтального руху

      // ВСІ виміри (scrollWidth/clientWidth/offsetLeft тощо) кешуються тут
      // і перераховуються ТІЛЬКИ на refresh. Під час самого скролу (onUpdate,
      // x, ease, snapTo) ми більше ніколи не читаємо DOM — тільки пишемо.
      // Раніше ці читання йшли одразу після запису transform у той самий
      // кадр і форсували layout recalculation на кожен тік скролу (layout
      // thrashing) — саме це й було причиною відчутної затримки snap.
      const distRef = { current: 0 };
      const vWidthRef = { current: 0 };
      const cardCentersRef = { current: [] as number[] };
      const cardWidthsRef = { current: [] as number[] };
      const cardFractionsRef = { current: [] as number[] };

      const refreshLayoutMeasurements = () => {
        const dist = getScrollDistance();
        const vWidth = viewport.clientWidth;
        distRef.current = dist;
        vWidthRef.current = vWidth;

        const centers: number[] = [];
        const widths: number[] = [];
        const fractions: number[] = [];
        cardsRef.current.forEach((card) => {
          if (!card) return;
          const center = card.offsetLeft + card.offsetWidth / 2;
          centers.push(center);
          widths.push(card.offsetWidth);
          const targetX = center - vWidth / 2;
          const clamped = gsap.utils.clamp(0, dist, targetX);
          fractions.push(dist > 0 ? clamped / dist : 0);
        });
        cardCentersRef.current = centers;
        cardWidthsRef.current = widths;
        cardFractionsRef.current = fractions;
      };

      // Наскільки сильно "гасяться" сусідні картки: менший степінь = різкіший спад.
      // Позицію треку беремо з внутрішнього кешу GSAP (без DOM-читання) —
      // getProperty не форсує reflow, бо GSAP вже тримає це значення в пам'яті
      // з моменту, коли сам його записав у this-таки кадрі.
      const updateCardScales = () => {
        const trackX = (gsap.getProperty(track, "x") as number) || 0;
        const vWidth = vWidthRef.current;
        const centerX = vWidth / 2;
        cardsRef.current.forEach((card, i) => {
          if (!card) return;
          const cardCenterLocal = cardCentersRef.current[i];
          if (cardCenterLocal === undefined) return;
          const cardCenterInViewport = cardCenterLocal + trackX;
          const dist = Math.abs(cardCenterInViewport - centerX);
          const cardWidth = cardWidthsRef.current[i] ?? 0;
          const maxDist = (vWidth / 2 + cardWidth / 2) * 0.82;
          const raw = maxDist > 0 ? gsap.utils.clamp(0, 1, dist / maxDist) : 0;
          // прискорена крива спаду — активна картка чіткіше виділяється
          const t = Math.pow(raw, 0.6);
          // Лише transform + opacity — їх обробляє композитор без
          // перемальовування. Анімований filter: blur() змушував браузер
          // заново растеризувати великі картки на кожен тік скролу.
          gsap.set(card, {
            scale: gsap.utils.interpolate(1, 0.62, t),
            opacity: gsap.utils.interpolate(1, 0.28, t),
          });
        });
      };

      // Виставляємо відступи ще до першого вимірювання дистанції скролу
      setEdgePadding();
      refreshLayoutMeasurements();

      const tween = gsap.to(track, {
        x: () => -distRef.current,
        ease: (p: number) => {
          const dist = distRef.current;
          const total = dist + BUFFER_PX * 2;
          const startFrac = total > 0 ? BUFFER_PX / total : 0;
          const endFrac = total > 0 ? (BUFFER_PX + dist) / total : 1;
          if (p <= startFrac) return 0;
          if (p >= endFrac) return 1;
          // лінійна відповідність прогресу скролу й зсуву треку —
          // потрібна для точного влучання snap-точок саме в центр картки
          return (p - startFrac) / (endFrac - startFrac);
        },
        scrollTrigger: {
          trigger: section,
          start: "top top",
          end: () => `+=${distRef.current + BUFFER_PX * 2}`,
          scrub: true,
          pin: true,
          anticipatePin: 1,
          invalidateOnRefresh: true,
          snap: {
            snapTo: (value) => {
              const dist = distRef.current;
              const total = dist + BUFFER_PX * 2;
              const startFrac = total > 0 ? BUFFER_PX / total : 0;
              const endFrac = total > 0 ? (BUFFER_PX + dist) / total : 1;
              if (value <= startFrac) return startFrac;
              if (value >= endFrac) return endFrac;
              const local = (value - startFrac) / (endFrac - startFrac || 1);
              const points = cardFractionsRef.current.length
                ? cardFractionsRef.current
                : [0, 1];
              const nearest = points.reduce((a, b) =>
                Math.abs(b - local) < Math.abs(a - local) ? b : a,
              );
              return startFrac + nearest * (endFrac - startFrac);
            },
            // Snap as soon as the wheel/scroll input stops. The previous
            // delay made the cards visibly wait before starting the snap.
            // Slightly longer duration + a smoother-decelerating ease turns
            // the snap into a gentle glide into place instead of an abrupt
            // jump, without reintroducing the old "waiting" feel (delay: 0).
            duration: { min: 0.35, max: 0.55 },
            delay: 0,
            ease: "power3.out",
          },
          onUpdate: (self) => {
            if (scrollFillRef.current) {
              scrollFillRef.current.style.transform = `scaleX(${self.progress})`;
            }
            updateCardScales();
          },
          onRefresh: () => {
            refreshLayoutMeasurements();
            updateCardScales();
          },
        },
      });

      updateCardScales();

      const handleRefreshInit = () => {
        setEdgePadding();
        refreshLayoutMeasurements();
      };
      ScrollTrigger.addEventListener("refreshInit", handleRefreshInit);

      return () => {
        ScrollTrigger.removeEventListener("refreshInit", handleRefreshInit);
        tween.scrollTrigger?.kill();
        tween.kill();
      };
    }, section);

    return () => {
      ctx.revert();
    };
  }, []);

  return (
    <section
      id="projects"
      ref={sectionRef}
      className="relative z-[1] min-h-screen flex flex-col justify-center py-[100px] max-[900px]:py-[80px]"
    >
      <div className="section-number px-10 max-[900px]:px-5">004</div>
      <div className="section-label reveal px-10 max-[900px]:px-5">
        <BlackHoleText text="Selected Work" />
      </div>

      <div ref={viewportRef} className="projects-viewport">
        <div ref={trackRef} className="projects-track">
          {projects.map((p, i) => (
            <ProjectCard
              key={p.index}
              project={p}
              innerRef={(el) => {
                cardsRef.current[i] = el;
              }}
            />
          ))}
        </div>
      </div>

      <div className="projects-scroll-meta px-10 max-[900px]:px-5">
        <span className="font-mono text-[10px] tracking-[3px] uppercase text-txt-muted">
          <BlackHoleText text="Scroll to explore" />
        </span>
        <div className="projects-scroll-track">
          <div
            ref={scrollFillRef}
            className="projects-scroll-fill"
            style={{ transform: "scaleX(0)" }}
          />
        </div>
      </div>
    </section>
  );
}
