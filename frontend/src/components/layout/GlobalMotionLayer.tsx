"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { prefersReducedMotion, registerGsapPlugins } from "@/lib/gsap/gsapUtils";

export default function GlobalMotionLayer() {
  const layerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    registerGsapPlugins();
    const layer = layerRef.current;
    if (!layer || prefersReducedMotion()) return;

    const ctx = gsap.context(() => {
      gsap.to(".motion-grid", {
        backgroundPosition: "120px 120px",
        duration: 24,
        repeat: -1,
        ease: "none",
      });
      gsap.to(".motion-streak", {
        x: "120vw",
        duration: 8,
        repeat: -1,
        ease: "none",
        stagger: { each: 2.4, from: "random" },
      });
    }, layer);

    return () => ctx.revert();
  }, []);

  return (
    <div ref={layerRef} className="motion-layer" aria-hidden>
      <div className="motion-grid" />
      <div className="motion-streak motion-streak--1" />
      <div className="motion-streak motion-streak--2" />
      <div className="motion-streak motion-streak--3" />
      <div className="motion-grain" />
    </div>
  );
}
