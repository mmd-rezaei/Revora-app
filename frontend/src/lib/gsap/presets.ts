import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

import { MOTION, SCROLL } from "./tokens";
import { prefersReducedMotion } from "./gsapUtils";

type Scope = HTMLElement;

export function revealUp(
  scope: Scope,
  selector: string,
  options?: {
    y?: number;
    start?: string;
    stagger?: number;
    once?: boolean;
  },
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

export function clipReveal(
  scope: Scope,
  selector: string,
  start = SCROLL.start,
) {
  if (prefersReducedMotion()) return;

  gsap.utils.toArray<HTMLElement>(selector, scope).forEach((el) => {
    gsap.fromTo(
      el,
      {
        clipPath: "inset(100% 0 0 0)",
        opacity: 0.6,
      },
      {
        clipPath: "inset(0% 0 0 0)",
        opacity: 1,
        duration: MOTION.duration.slow,
        ease: MOTION.ease.out,

        scrollTrigger: {
          trigger: el,
          start,
          once: true,
        },
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

      scrollTrigger: {
        trigger: el,
        start: SCROLL.start,
        once: true,
      },
    });
  });
}

export function staggerChildren(
  scope: Scope,
  selector: string,
  options?: {
    y?: number;
    stagger?: number;
  },
) {
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

      scrollTrigger: {
        trigger: container,
        start: SCROLL.startEarly,
        once: true,
      },
    });
  });
}

export function scrubParallax(
  element: HTMLElement,
  trigger: HTMLElement,
  options?: {
    y?: number;
    start?: string;
    end?: string;
  },
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

/**
 * Horizontal scrolling section.
 *
 * The track moves horizontally while the page scrolls vertically.
 *
 * Returns the GSAP tween so callers can access:
 * - tween.scrollTrigger
 * - tween.progress()
 * - tween.kill()
 */
export function horizontalScrollTrack(
  track: HTMLElement,
  trigger: HTMLElement,
  options?: {
    pin?: boolean;
    endExtra?: string;
    start?: string;
    scrub?: boolean | number;
  },
) {
  if (prefersReducedMotion()) return;

  const distance = track.scrollWidth - track.clientWidth;

  if (distance <= 0) return;

  const tween = gsap.to(track, {
    x: () => -distance,
    ease: "none",

    scrollTrigger: {
      trigger,

      start: options?.start ?? "top top",

      /*
       * `endExtra` can be:
       *
       * "+=180%"
       * "+=2500"
       *
       * If it isn't provided, use the actual horizontal distance.
       */
      end: options?.endExtra ?? `+=${distance}`,

      scrub: options?.scrub ?? SCROLL.scrub,

      pin: options?.pin ?? false,

      anticipatePin: 1,

      invalidateOnRefresh: true,

      /*
       * Prevent the browser from trying to snap
       * the section while GSAP controls it.
       */
      preventOverlaps: true,
    },
  });

  return tween;
}

/**
 * Creates a cinematic horizontal card animation.
 *
 * Designed to be used with the ScrollTrigger created by
 * horizontalScrollTrack().
 *
 * The cards react to their horizontal position:
 * - center cards become larger
 * - side cards become smaller
 * - side cards become slightly rotated
 * - opacity changes with distance
 */
export function horizontalCardDepth(
  track: HTMLElement,
  options?: {
    selector?: string;
    strength?: number;
  },
) {
  if (prefersReducedMotion()) return;

  const selector = options?.selector ?? ".featured-card";
  const strength = options?.strength ?? 1;

  const cards = gsap.utils.toArray<HTMLElement>(selector, track);

  if (!cards.length) return;

  const updateCards = () => {
    const viewportCenter = window.innerWidth / 2;

    cards.forEach((card) => {
      const rect = card.getBoundingClientRect();
      const cardCenter = rect.left + rect.width / 2;

      const distanceFromCenter = cardCenter - viewportCenter;
      const normalizedDistance =
        distanceFromCenter / Math.max(window.innerWidth * 0.5, 1);

      const clamped = gsap.utils.clamp(-1, 1, normalizedDistance);

      const abs = Math.abs(clamped);

      const scale = gsap.utils.clamp(0.9, 1, 1 - abs * 0.05 * strength);
      const opacity = gsap.utils.clamp(0.72, 1, 1 - abs * 0.2 * strength);

      gsap.set(card, {
        scale,
        y: abs * 4 * strength,
        opacity,
        transformOrigin: "center center",
      });
    });
  };

  const trigger = ScrollTrigger.create({
    trigger: track,
    start: "top bottom",
    end: "bottom top",
    scrub: false,

    onUpdate: updateCards,

    onRefresh: updateCards,
  });

  window.addEventListener("resize", updateCards);

  updateCards();

  return () => {
    trigger.kill();
    window.removeEventListener("resize", updateCards);
  };
}

/**
 * Scroll-linked depth effect.
 *
 * Useful for:
 * - hero images
 * - car images
 * - large section backgrounds
 */
export function scrollDepth(
  element: HTMLElement,
  trigger: HTMLElement,
  options?: {
    y?: number;
    scale?: number;
    rotateX?: number;
    rotateY?: number;
    opacity?: number;
    start?: string;
    end?: string;
  },
) {
  if (prefersReducedMotion()) return;

  return gsap.to(element, {
    y: options?.y ?? -80,
    scale: options?.scale ?? 1.08,
    rotateX: options?.rotateX ?? 0,
    rotateY: options?.rotateY ?? 0,
    opacity: options?.opacity ?? 1,
    ease: "none",

    scrollTrigger: {
      trigger,
      start: options?.start ?? "top bottom",
      end: options?.end ?? "bottom top",
      scrub: true,
    },
  });
}

/**
 * Scroll-linked reveal.
 *
 * Unlike revealUp(), this one stays connected to scroll progress.
 */
export function scrubReveal(
  element: HTMLElement,
  trigger: HTMLElement,
  options?: {
    y?: number;
    scale?: number;
    start?: string;
    end?: string;
  },
) {
  if (prefersReducedMotion()) return;

  gsap.set(element, {
    y: options?.y ?? 80,
    scale: options?.scale ?? 0.92,
    opacity: 0,
  });

  return gsap.to(element, {
    y: 0,
    scale: 1,
    opacity: 1,
    ease: "none",

    scrollTrigger: {
      trigger,
      start: options?.start ?? "top 90%",
      end: options?.end ?? "top 55%",
      scrub: true,
    },
  });
}

/**
 * Scroll-linked clip-path reveal.
 *
 * More cinematic than a normal fade.
 */
export function scrubClipReveal(
  element: HTMLElement,
  trigger: HTMLElement,
  options?: {
    start?: string;
    end?: string;
    direction?: "up" | "down" | "left" | "right";
  },
) {
  if (prefersReducedMotion()) return;

  const direction = options?.direction ?? "up";

  const initialClip = {
    up: "inset(100% 0 0 0)",
    down: "inset(0 0 100% 0)",
    left: "inset(0 100% 0 0)",
    right: "inset(0 0 0 100%)",
  }[direction];

  return gsap.fromTo(
    element,
    {
      clipPath: initialClip,
      opacity: 0.5,
    },
    {
      clipPath: "inset(0% 0% 0% 0%)",
      opacity: 1,
      ease: "none",

      scrollTrigger: {
        trigger,
        start: options?.start ?? "top 90%",
        end: options?.end ?? "top 50%",
        scrub: true,
      },
    },
  );
}

/**
 * Scroll-linked text movement.
 *
 * Useful for large REVORA typography.
 */
export function scrollText(
  element: HTMLElement,
  trigger: HTMLElement,
  options?: {
    x?: number;
    y?: number;
    scale?: number;
    rotate?: number;
    start?: string;
    end?: string;
  },
) {
  if (prefersReducedMotion()) return;

  return gsap.fromTo(
    element,
    {
      x: options?.x ?? 0,
      y: options?.y ?? 80,
      scale: options?.scale ?? 0.9,
      rotate: options?.rotate ?? 0,
    },
    {
      x: 0,
      y: 0,
      scale: 1,
      rotate: 0,
      ease: "none",

      scrollTrigger: {
        trigger,
        start: options?.start ?? "top 90%",
        end: options?.end ?? "top 45%",
        scrub: true,
      },
    },
  );
}

/**
 * Adds a subtle horizontal "speed" movement.
 *
 * Useful for automotive section transitions.
 */
export function speedReveal(
  element: HTMLElement,
  trigger: HTMLElement,
  options?: {
    x?: number;
    start?: string;
    end?: string;
  },
) {
  if (prefersReducedMotion()) return;

  return gsap.fromTo(
    element,
    {
      x: options?.x ?? 120,
      opacity: 0,
      skewX: 8,
    },
    {
      x: 0,
      opacity: 1,
      skewX: 0,
      ease: "none",

      scrollTrigger: {
        trigger,
        start: options?.start ?? "top 90%",
        end: options?.end ?? "top 55%",
        scrub: true,
      },
    },
  );
}

export function animateRowProgress(
  bar: HTMLElement,
  progress: number,
  options?: {
    duration?: number;
  },
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
    {
      scale: 1,
    },
    {
      scale,
      duration: 0.22,
      yoyo: true,
      repeat: 1,
      ease: MOTION.ease.outSoft,
    },
  );
}

export function flashStats(el: HTMLElement) {
  if (prefersReducedMotion()) return;

  return gsap.fromTo(
    el,
    {
      y: 10,
      opacity: 0.5,
      filter: "blur(4px)",
    },
    {
      y: 0,
      opacity: 1,
      filter: "blur(0px)",
      duration: MOTION.duration.fast,
      ease: MOTION.ease.outSoft,
    },
  );
}

export function drawerStagger(
  items: NodeListOf<Element> | Element[],
  open: boolean,
) {
  if (prefersReducedMotion()) return;

  const tl = gsap.timeline({
    defaults: {
      ease: MOTION.ease.outSoft,
    },
  });

  if (open) {
    tl.fromTo(
      items,
      {
        x: 32,
        opacity: 0,
      },
      {
        x: 0,
        opacity: 1,
        duration: 0.4,
        stagger: 0.06,
      },
    );
  } else {
    tl.to(items, {
      x: 24,
      opacity: 0,
      duration: 0.25,
      stagger: 0.04,
    });
  }

  return tl;
}

export function refreshScrollTriggers(delay = 100) {
  if (typeof window === "undefined") return;

  window.setTimeout(() => {
    ScrollTrigger.refresh();
  }, delay);
}
