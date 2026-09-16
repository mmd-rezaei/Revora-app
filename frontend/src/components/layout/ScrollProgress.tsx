"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { prefersReducedMotion, registerGsapPlugins } from "@/lib/gsap/gsapUtils";

export default function ScrollProgress() {
  const barRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    registerGsapPlugins();
    const bar = barRef.current;
    if (!bar || prefersReducedMotion()) return;

    const ctx = gsap.context(() => {
      ScrollTrigger.create({
        start: 0,
        end: "max",
        onUpdate: (self) => {
          gsap.set(bar, { scaleX: self.progress });
        },
      });
    });

    return () => ctx.revert();
  }, []);

  return (
    <div
      className="scroll-progress"
      aria-hidden
      ref={barRef}
      style={{ transform: "scaleX(0)", transformOrigin: "left center" }}
    />
  );
}
