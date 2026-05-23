"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

const navLinks = [
  { href: "#about",    label: "About"   },
  { href: "#skills",   label: "Skills"  },
  { href: "#projects", label: "Work"    },
];

export default function Nav() {
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onResize = () => { if (window.innerWidth >= 900) setMenuOpen(false); };
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [menuOpen]);

  return (
    <>
      {/* ── Main navbar ─────────────────────────────────────── */}
      <nav
        className="fixed top-0 left-0 right-0 z-[100] px-10 py-7 flex justify-between items-center font-mono text-[10px] tracking-[3px] uppercase text-txt-muted max-[900px]:px-5 max-[900px]:py-5"
        style={{ background: "linear-gradient(to bottom, #0a0a0a 50%, transparent)" }}
      >
        <Link href="#hero" className="nav-link">!Aøkigahara</Link>

        {/* Desktop links */}
        <div className="flex items-center gap-9 max-[900px]:hidden">
          {navLinks.map(({ href, label }) => (
            <Link key={label} href={href} className="nav-link">{label}</Link>
          ))}
          <div className="w-12 h-px bg-current opacity-25" />
          <Link href="#contact" className="nav-link">Contact</Link>
        </div>

        {/* Burger */}
        <button
          onClick={() => setMenuOpen((v) => !v)}
          aria-label="Toggle menu"
          aria-expanded={menuOpen}
          className="hidden max-[900px]:flex flex-col justify-center items-end gap-1.5 w-10 h-10 bg-transparent border-0 p-1"
        >
          <span className={`block h-px bg-txt-muted transition-all duration-300 ${menuOpen ? "w-6 rotate-45 translate-y-[7px]" : "w-6"}`} />
          <span className={`block h-px bg-txt-muted transition-all duration-300 ${menuOpen ? "w-6 -rotate-45 -translate-y-[3px]" : "w-4"}`} />
        </button>
      </nav>

      {/* ── Mobile overlay ──────────────────────────────────── */}
      <div
        className={`fixed top-0 left-0 right-0 bottom-0 z-[90] flex-col justify-center items-center transition-opacity duration-300 pt-20 ${
          menuOpen ? "flex opacity-100 pointer-events-auto" : "hidden opacity-0 pointer-events-none"
        }`}
        style={{ background: "rgba(10,10,10,0.97)" }}
      >
        {[...navLinks, { href: "#contact", label: "Contact" }].map(({ href, label }, i) => (
          <Link
            key={label}
            href={href}
            onClick={() => setMenuOpen(false)}
            className={`font-mono text-[11px] tracking-[5px] uppercase text-txt-muted no-underline py-7 w-full text-center border-b border-line hover:text-txt hover:bg-surface transition-colors duration-200 ${
              i === 0 ? "border-t border-line" : ""
            }`}
          >
            {label}
          </Link>
        ))}
      </div>
    </>
  );
}
