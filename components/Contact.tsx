import BlackHoleText from "@/components/BlackHoleText";

const contactLinks = [
  { label: "Email", href: "mailto:lanovui0902@gmail.com" },
  { label: "GitHub", href: "https://github.com/BlackMfgik", external: true },
  {
    label: "LinkedIn",
    href: "https://www.linkedin.com/in/dmytro-lanovui-75a16638a/",
    external: true,
  },
  {
    label: "Telegram",
    href: "https://t.me/A0klgahara",
    external: true,
  },
];

export default function Contact() {
  return (
    <section
      id="contact"
      className="relative py-[140px] px-10 z-[1] max-[900px]:py-[100px] max-[900px]:px-5"
    >
      <div className="section-number">005</div>
      <div className="section-label reveal">
        <BlackHoleText text="Contact" />
      </div>
      <div className="max-w-[800px] mx-auto text-center reveal">
        <h2
          className="font-sans font-extrabold leading-[0.88] tracking-[-3px] uppercase mb-7"
          style={{ fontSize: "clamp(36px, 5vw, 64px)" }}
        >
          <BlackHoleText text="Let's build" />
          <br />
          <BlackHoleText text="something" className="text-ghost" />{" "}
          <BlackHoleText text="together" />
        </h2>

        <p className="font-sans text-[15px] leading-[1.7] tracking-[-0.2px] text-txt-muted mb-[52px]">
          Open for collaborations, freelance projects, and interesting
          opportunities. Let&apos;s discuss how I can help bring your ideas to
          life.
        </p>

        <div className="flex justify-center gap-6 flex-wrap max-[900px]:flex-col max-[900px]:items-center">
          {contactLinks.map(({ label, href, external }) => (
            <a
              key={label}
              href={href}
              target={external ? "_blank" : undefined}
              rel={external ? "noopener noreferrer" : undefined}
              className="contact-pill"
            >
              <BlackHoleText text={label} />
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
