import BlackHoleText from "@/components/BlackHoleText";

const stats = [
  { value: "2", label: "Commercial Projects" },
  { value: "6+", label: "Projects Built" },
  { value: "3", label: "Apps in Production" },
  { value: "2025", label: "Freelancing Since" },
];

export default function About() {
  return (
    <section
      id="about"
      className="relative py-[140px] px-10 z-[1] max-[900px]:py-[100px] max-[900px]:px-5"
    >
      <div className="section-number">001</div>
      <div className="section-label reveal">
        <BlackHoleText text="About" />
      </div>
      <div
        className="max-w-[1200px] mx-auto items-start max-[900px]:flex max-[900px]:flex-col max-[900px]:gap-14"
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: "100px",
        }}
      >
        <div className="reveal">
          <h2
            className="font-sans font-bold leading-[0.9] tracking-[-2px] uppercase mb-9 max-[900px]:text-[32px] max-[900px]:tracking-[-1.5px]"
            style={{ fontSize: "42px" }}
          >
            <BlackHoleText text="Building" />{" "}
            <BlackHoleText text="digital" className="text-accent" />
            <br />
            <BlackHoleText text="experiences" />
          </h2>
          <p className="font-sans text-[15px] leading-[1.7] tracking-[-0.2px] text-txt-muted mb-5">
            Fullstack developer from Cherkasy, Ukraine. I take a product from an
            empty repository to production: database schema, REST API,
            integrations, responsive UI, deployment.
          </p>
          <p className="font-sans text-[15px] leading-[1.7] tracking-[-0.2px] text-txt-muted">
            I&apos;ve built commercial projects for clients — a food ordering
            platform with online payments and a verification system for a
            Minecraft network with Discord, Telegram and a custom Java plugin.
            Now looking for a team where I can grow as an engineer.
          </p>
        </div>
        <div
          className="reveal grid grid-cols-2 max-[900px]:gap-8"
          style={{ gap: "48px" }}
        >
          {stats.map(({ value, label }) => (
            <div key={label} className="border-t border-line pt-6">
              <div
                className="font-sans font-extrabold leading-[0.88] tracking-[-3px] text-txt mb-2.5 max-[900px]:text-[48px] max-[900px]:tracking-[-2px]"
                style={{ fontSize: "64px" }}
              >
                <BlackHoleText text={value} />
              </div>
              <div className="font-mono text-[10px] tracking-[3px] uppercase text-txt-muted">
                <BlackHoleText text={label} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
