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

export function useRouteScrollRefresh(pathname: string) {
  useEffect(() => {
    registerGsapPlugins();
    refreshScrollTriggers(150);
  }, [pathname]);
}
