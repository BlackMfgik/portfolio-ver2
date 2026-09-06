"use client";

import { useEffect } from "react";
import Lenis from "lenis";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

export default function SmoothScroll({
  children,
}: {
  children: React.ReactNode;
}) {
  useEffect(() => {
    // Lenis замінює нативний скрол власним, плавно інтерпольованим —
    // тому дискретні "дьоргані" wheel-дельти (кожен тік коліщатка/трекпада)
    // перетворюються на неперервний рух ще ДО того, як їх побачить
    // ScrollTrigger. Це офіційно рекомендований GSAP спосіб отримати
    // "маслянисту" прокрутку разом зі scrub/snap-анімаціями.
    const lenis = new Lenis({
      // duration 1.1 означав, що Lenis ще ~1.1с "доводив" інерцію після того,
      // як користувач фактично зупинив коліщатко, і весь цей час продовжував
      // емітити 'scroll' — ScrollTrigger бачив це як безперервний скрол і не
      // міг визначити momент "зупинки", тому snap-логіка в Projects
      // запускалася лише після повного згасання інерції Lenis. Звідси й
      // відчутна затримка перед перескоком картки. Коротша тривалість дає
      // Lenis "заспокоїтись" набагато швидше, і snap реагує майже одразу.
      duration: 0.7,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      wheelMultiplier: 1,
      touchMultiplier: 1.2,
    });

    lenis.on("scroll", ScrollTrigger.update);

    const rafCallback = (time: number) => {
      lenis.raf(time * 1000);
    };
    gsap.ticker.add(rafCallback);
    // Вимикаємо GSAP-івське згладжування лагів тікера — Lenis уже сам
    // відповідає за плавність, подвійне згладжування лише додає затримку.
    gsap.ticker.lagSmoothing(0);

    return () => {
      gsap.ticker.remove(rafCallback);
      lenis.destroy();
    };
  }, []);

  return <>{children}</>;
}
