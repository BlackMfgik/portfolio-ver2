const contactLinks = [
  { label: "Email", href: "mailto:lanovui0902@gmail.com" },
  { label: "GitHub", href: "https://github.com/BlackMfgik", external: true },
  {
    label: "LinkedIn",
    href: "https://www.linkedin.com/in/dmytro-lanovui-75a16638a/",
    external: true,
  },
  {
    label: "Discord",
    href: "https://discord.com/users/554465791358140417",
    external: true,
  },
];

export default function Contact() {
  return (
    <section
      id="contact"
      className="relative py-[140px] px-10 z-[1] max-[900px]:py-[100px] max-[900px]:px-5"
    >
      {/* Ghost section number */}
      <div className="section-number">004</div>

      {/* Section label */}
      <div className="section-label reveal">Contact</div>

      {/* Centered content */}
      <div className="max-w-[800px] mx-auto text-center reveal">
        <h2
          className="font-sans font-extrabold leading-[0.88] tracking-[-3px] uppercase mb-7"
          style={{ fontSize: "clamp(36px, 5vw, 64px)" }}
        >
          Let&apos;s build
          <br />
          <span className="text-ghost">something</span> together
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
              {label}
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
