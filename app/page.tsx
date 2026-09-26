import Hero from "@/components/Hero";
import About from "@/components/About";
import Experience from "@/components/Experience";
import Skills from "@/components/Skills";
import Projects from "@/components/Projects";
import Contact from "@/components/Contact";
import DesignModeController from "@/components/DesignModeController";
import ScrollRevealInit from "@/components/ScrollRevealInit";
import CustomCursor from "@/components/CustomCursor";

export default function Home() {
  return (
    <>
      <DesignModeController />
      <CustomCursor />
      <ScrollRevealInit />
      <main className="relative z-[1]">
        <Hero />
        <About />
        <Experience />
        <Skills />
        <Projects />
        <Contact />
      </main>
      <footer className="relative z-[1] py-10 px-10 flex justify-between font-mono text-[10px] tracking-[3px] uppercase text-txt-muted border-t border-line max-[900px]:px-5">
        <div>!Aøkigahara © 2026</div>
        <div>Handcrafted with precision</div>
      </footer>
    </>
  );
}
