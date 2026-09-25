"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { prefersReducedMotion, registerGsapPlugins } from "@/lib/gsap/gsapUtils";
import { revealUp, staggerChildren, refreshScrollTriggers } from "@/lib/gsap/presets";
import { MOTION, SCROLL } from "@/lib/gsap/tokens";

type Options = {
  selector?: string;
  y?: number;
  stagger?: number;
  start?: string;
  once?: boolean;
};

export function useScrollReveal(options: Options = {}) {
  const rootRef = useRef<HTMLDivElement>(null);
  const { selector = ".gsap-reveal", y = MOTION.distance.md, stagger = 0, start = SCROLL.start, once = true } = options;

  useEffect(() => {
    registerGsapPlugins();
    const root = rootRef.current;
    if (!root || prefersReducedMotion()) return;

    const ctx = gsap.context(() => {
      revealUp(root, selector, { y, start, stagger, once });
    }, root);

    return () => ctx.revert();
  }, [selector, y, stagger, start, once]);

  return rootRef;
}

export function useStaggerReveal(deps: unknown[] = []) {
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    registerGsapPlugins();
    const root = rootRef.current;
    if (!root || prefersReducedMotion()) return;

    const ctx = gsap.context(() => {
      staggerChildren(root, ".gsap-stagger-container", { stagger: MOTION.stagger.tight });
    }, root);

    refreshScrollTriggers();
    return () => ctx.revert();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);

  return rootRef;
}

function scrollToTop() {
  if (typeof window === "undefined") return;
  window.scrollTo({ top: 0, left: 0, behavior: "auto" });
  document.documentElement.scrollTop = 0;
  document.body.scrollTop = 0;
}

export function useRouteScrollRefresh(pathname: string) {
  useEffect(() => {
    if (typeof window === "undefined") return;

    if ("scrollRestoration" in window.history) {
      window.history.scrollRestoration = "manual";
    }

    scrollToTop();
    requestAnimationFrame(scrollToTop);

    registerGsapPlugins();
    refreshScrollTriggers(150);
  }, [pathname]);
}
