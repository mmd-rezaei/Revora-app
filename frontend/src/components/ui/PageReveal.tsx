"use client";

import { useEffect, useRef } from "react";
import Box from "@mui/material/Box";
import gsap from "gsap";

export default function PageReveal({ children }: { children: React.ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const ctx = gsap.context(() => {
      gsap.fromTo(el, { opacity: 0, y: 16 }, { opacity: 1, y: 0, duration: 0.55, ease: "power2.out" });
    }, el);
    return () => ctx.revert();
  }, []);

  return <Box ref={ref}>{children}</Box>;
}
