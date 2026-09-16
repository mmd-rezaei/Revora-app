export const MOTION = {
  ease: {
    out: "power3.out",
    outSoft: "power2.out",
    inOut: "power2.inOut",
    smooth: "power1.inOut",
    snap: "back.out(1.4)",
  },
  duration: {
    fast: 0.35,
    base: 0.65,
    slow: 1.05,
    hero: 1.2,
  },
  distance: {
    sm: 16,
    md: 40,
    lg: 80,
    hero: 120,
  },
  stagger: {
    tight: 0.06,
    base: 0.1,
    wide: 0.14,
  },
} as const;

export const SCROLL = {
  start: "top 85%",
  startEarly: "top 92%",
  heroEnd: "+=130%",
  scrub: 1.1,
} as const;
