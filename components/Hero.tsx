import Link from "next/link";

export default function Hero() {
  return (
    <section
      id="hero"
      className="relative min-h-screen z-[1] max-[900px]:flex max-[900px]:flex-col max-[900px]:justify-center max-[900px]:px-5 max-[900px]:pt-24 max-[900px]:pb-24 max-[900px]:text-center"
      style={{
        display: "grid",
        gridTemplateColumns: "1fr 1fr",
        gap: "60px",
        padding: "0 40px",
      }}
    >
      <div
        className="flex flex-col justify-center z-[2] pl-10 max-[900px]:pl-0 max-[900px]:items-center"
        style={{ display: "flex" }}
      >
        <div
          className="font-mono text-[10px] tracking-[3px] uppercase text-txt-muted mb-8"
          style={{
            animation: "fadeUp 1s cubic-bezier(0.2,0.7,0.2,1) 0.2s both",
          }}
        >
          Fullstack Developer / UI·UX Designer
        </div>

        <h1
          className="font-sans font-extrabold leading-[0.88] tracking-[-3px] uppercase text-txt mb-5"
          style={{
            fontSize: "clamp(44px, 7vw, 96px)",
            animation: "fadeUp 1s cubic-bezier(0.2,0.7,0.2,1) 0.4s both",
          }}
        >
          !Aøki
          <br />
          <span className="text-accent">gahara</span>
        </h1>

        <p
          className="font-sans text-[15px] leading-[1.7] tracking-[-0.3px] text-txt-muted max-w-[460px] mb-14 max-[900px]:mx-auto"
          style={{
            animation: "fadeUp 1s cubic-bezier(0.2,0.7,0.2,1) 0.6s both",
          }}
        >
          I build fullstack applications — from database schema and REST API to
          responsive UI. Clean code, real projects, daily improvement.
        </p>

        <Link
          href="#projects"
          className="hero-cta"
          style={{
            animation: "fadeUp 1s cubic-bezier(0.2,0.7,0.2,1) 0.8s both",
          }}
        >
          View Work <span className="arrow">→</span>
        </Link>
      </div>

      {/* ── Right column (ASCII canvas visible through) ──────── */}
      <div className="flex items-center justify-center relative overflow-hidden max-[900px]:hidden" />

      {/* ── Bottom meta bar ──────────────────────────────────── */}
      <div className="absolute bottom-9 left-10 right-10 flex justify-between font-mono text-[10px] tracking-[3px] uppercase text-txt-muted z-[2] max-[900px]:left-5 max-[900px]:right-5 max-[900px]:bottom-5">
        <div>Handcrafted with precision</div>
        <div>© 2026</div>
      </div>
    </section>
  );
}
