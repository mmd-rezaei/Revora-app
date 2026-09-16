import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

let registered = false;

export function registerGsapPlugins() {
  if (registered || typeof window === "undefined") return;
  gsap.registerPlugin(ScrollTrigger);
  registered = true;
}

export function prefersReducedMotion() {
  if (typeof window === "undefined") return true;
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

export function animateCounter(
  el: HTMLElement,
  endValue: number,
  options?: { duration?: number; suffix?: string; decimals?: number; ease?: string },
) {
  const proxy = { value: 0 };
  const decimals = options?.decimals ?? 0;
  return gsap.to(proxy, {
    value: endValue,
    duration: options?.duration ?? 1.4,
    ease: options?.ease ?? "power2.out",
    onUpdate: () => {
      el.textContent = `${decimals ? proxy.value.toFixed(decimals) : Math.round(proxy.value)}${options?.suffix ?? ""}`;
    },
  });
}

export function animateRingProgress(
  circle: SVGCircleElement,
  value: number,
  circumference: number,
  options?: { duration?: number },
) {
  const clamped = Math.min(100, Math.max(0, value));
  const offset = circumference - (clamped / 100) * circumference;
  if (prefersReducedMotion()) {
    circle.setAttribute("stroke-dashoffset", String(offset));
    return gsap.timeline();
  }
  return gsap.to(circle, {
    strokeDashoffset: offset,
    duration: options?.duration ?? 1.1,
    ease: "power2.out",
  });
}

export function runMatchMedia(builder: (mm: gsap.MatchMedia) => void) {
  registerGsapPlugins();
  if (prefersReducedMotion()) return () => undefined;
  const mm = gsap.matchMedia();
  builder(mm);
  return () => mm.revert();
}
