import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { MOTION, SCROLL } from "./tokens";
import { prefersReducedMotion } from "./gsapUtils";

type Scope = HTMLElement;

export function revealUp(
  scope: Scope,
  selector: string,
  options?: { y?: number; start?: string; stagger?: number; once?: boolean },
) {
  if (prefersReducedMotion()) return;
  gsap.utils.toArray<HTMLElement>(selector, scope).forEach((el, i) => {
    gsap.from(el, {
      y: options?.y ?? MOTION.distance.md,
      opacity: 0,
      duration: MOTION.duration.base,
      delay: options?.stagger ? i * options.stagger : 0,
      ease: MOTION.ease.outSoft,
      scrollTrigger: {
        trigger: el,
        start: options?.start ?? SCROLL.start,
        once: options?.once ?? true,
      },
    });
  });
}

export function clipReveal(scope: Scope, selector: string, start = SCROLL.start) {
  if (prefersReducedMotion()) return;
  gsap.utils.toArray<HTMLElement>(selector, scope).forEach((el) => {
    gsap.fromTo(
      el,
      { clipPath: "inset(100% 0 0 0)", opacity: 0.6 },
      {
        clipPath: "inset(0% 0 0 0)",
        opacity: 1,
        duration: MOTION.duration.slow,
        ease: MOTION.ease.out,
        scrollTrigger: { trigger: el, start, once: true },
      },
    );
  });
}

export function scaleReveal(scope: Scope, selector: string) {
  if (prefersReducedMotion()) return;
  gsap.utils.toArray<HTMLElement>(selector, scope).forEach((el) => {
    gsap.from(el, {
      scale: 0.92,
      opacity: 0,
      duration: MOTION.duration.base,
      ease: MOTION.ease.out,
      scrollTrigger: { trigger: el, start: SCROLL.start, once: true },
    });
  });
}

export function staggerChildren(scope: Scope, selector: string, options?: { y?: number; stagger?: number }) {
  if (prefersReducedMotion()) return;
  gsap.utils.toArray<HTMLElement>(selector, scope).forEach((container) => {
    const items = container.querySelectorAll(".gsap-stagger-item");
    if (!items.length) return;
    gsap.from(items, {
      y: options?.y ?? 36,
      opacity: 0,
      duration: MOTION.duration.base,
      stagger: options?.stagger ?? MOTION.stagger.base,
      ease: MOTION.ease.outSoft,
      scrollTrigger: { trigger: container, start: SCROLL.startEarly, once: true },
    });
  });
}

export function scrubParallax(
  element: HTMLElement,
  trigger: HTMLElement,
  options?: { y?: number; start?: string; end?: string },
) {
  if (prefersReducedMotion()) return;
  return gsap.to(element, {
    y: options?.y ?? 80,
    ease: "none",
    scrollTrigger: {
      trigger,
      start: options?.start ?? "top top",
      end: options?.end ?? "bottom top",
      scrub: true,
    },
  });
}

export function horizontalScrollTrack(
  track: HTMLElement,
  trigger: HTMLElement,
  options?: { pin?: boolean; endExtra?: string },
) {
  if (prefersReducedMotion() || track.scrollWidth <= track.clientWidth) return;
  const distance = track.scrollWidth - track.clientWidth;
  return gsap.to(track, {
    x: () => -distance,
    ease: "none",
    scrollTrigger: {
      trigger,
      start: "top 75%",
      end: options?.endExtra ?? `+=${distance}`,
      scrub: SCROLL.scrub,
      pin: options?.pin ?? false,
    },
  });
}

export function animateRowProgress(
  bar: HTMLElement,
  progress: number,
  options?: { duration?: number },
) {
  if (prefersReducedMotion()) {
    bar.style.transform = `scaleX(${progress})`;
    return;
  }
  return gsap.to(bar, {
    scaleX: progress,
    duration: options?.duration ?? MOTION.duration.base,
    ease: MOTION.ease.outSoft,
    transformOrigin: "left center",
  });
}

export function pulseElement(el: HTMLElement, scale = 1.04) {
  if (prefersReducedMotion()) return;
  return gsap.fromTo(
    el,
    { scale: 1 },
    { scale, duration: 0.22, yoyo: true, repeat: 1, ease: MOTION.ease.outSoft },
  );
}

export function flashStats(el: HTMLElement) {
  if (prefersReducedMotion()) return;
  return gsap.fromTo(
    el,
    { y: 10, opacity: 0.5, filter: "blur(4px)" },
    { y: 0, opacity: 1, filter: "blur(0px)", duration: MOTION.duration.fast, ease: MOTION.ease.outSoft },
  );
}

export function drawerStagger(items: NodeListOf<Element> | Element[], open: boolean) {
  if (prefersReducedMotion()) return;
  const tl = gsap.timeline({ defaults: { ease: MOTION.ease.outSoft } });
  if (open) {
    tl.fromTo(items, { x: 32, opacity: 0 }, { x: 0, opacity: 1, duration: 0.4, stagger: 0.06 });
  } else {
    tl.to(items, { x: 24, opacity: 0, duration: 0.25, stagger: 0.04 });
  }
  return tl;
}

export function refreshScrollTriggers(delay = 100) {
  if (typeof window === "undefined") return;
  window.setTimeout(() => ScrollTrigger.refresh(), delay);
}
