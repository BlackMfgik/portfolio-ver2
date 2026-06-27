const stats = [
  { value: "4+", label: "Pet Projects" },
  { value: "∞", label: "Commits" },
  { value: "4", label: "Core Skills" },
  { value: "0", label: "Days Without Coding" },
];

export default function About() {
  return (
    <section
      id="about"
      className="relative py-[140px] px-10 z-[1] max-[900px]:py-[100px] max-[900px]:px-5"
    >
      <div className="section-number">001</div>
      <div className="section-label reveal">About</div>
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
            Building <span className="text-accent">digital</span>
            <br />
            experiences
          </h2>
          <p className="font-sans text-[15px] leading-[1.7] tracking-[-0.2px] text-txt-muted mb-5">
            Fullstack developer with a passion for clean architecture and
            thoughtful design. I bridge the gap between backend reliability and
            frontend elegance.
          </p>
          <p className="font-sans text-[15px] leading-[1.7] tracking-[-0.2px] text-txt-muted">
            Every project starts with understanding the problem, continues with
            careful technical decisions, and ends with a product that simply
            works. No shortcuts, no tutorial-only skills.
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
                {value}
              </div>
              <div className="font-mono text-[10px] tracking-[3px] uppercase text-txt-muted">
                {label}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
