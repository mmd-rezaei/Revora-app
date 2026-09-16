"use client";

import { useEffect, useRef } from "react";
import Box from "@mui/material/Box";
import gsap from "gsap";
import { prefersReducedMotion, registerGsapPlugins } from "@/lib/gsap/gsapUtils";
import { MOTION } from "@/lib/gsap/tokens";

export default function PageReveal({ children }: { children: React.ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    registerGsapPlugins();
    const el = ref.current;
    if (!el || prefersReducedMotion()) return;

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: MOTION.ease.out } });
      tl.fromTo(el, { opacity: 0, clipPath: "inset(0 0 100% 0)" }, { opacity: 1, clipPath: "inset(0 0 0% 0)", duration: 0.75 })
        .from(
          el.querySelectorAll(".page-child"),
          { y: 28, opacity: 0, duration: 0.55, stagger: MOTION.stagger.tight, ease: MOTION.ease.outSoft },
          "-=0.35",
        );
    }, el);

    return () => ctx.revert();
  }, []);

  return (
    <Box ref={ref} className="page-reveal-root">
      {children}
    </Box>
  );
}
