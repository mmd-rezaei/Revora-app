"use client";

import { useEffect, useRef } from "react";
import Box from "@mui/material/Box";
import { animateCounter, prefersReducedMotion, registerGsapPlugins } from "@/lib/gsap/gsapUtils";
import { specFont } from "@/theme/revoraTheme";

type Props = {
  value: number;
  suffix?: string;
  decimals?: number;
  className?: string;
  color?: string;
  fontSize?: number | { xs: number; md: number };
};

export default function AnimatedCounter({
  value,
  suffix = "",
  decimals = 0,
  className,
  color = "primary.main",
  fontSize = { xs: 40, md: 56 },
}: Props) {
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    registerGsapPlugins();
    const el = ref.current;
    if (!el) return;
    if (prefersReducedMotion()) {
      el.textContent = `${decimals ? value.toFixed(decimals) : value}${suffix}`;
      return;
    }
    const tween = animateCounter(el, value, { suffix, decimals });
    return () => {
      tween.kill();
    };
  }, [value, suffix, decimals]);

  return (
    <Box
      component="span"
      ref={ref}
      className={className}
      sx={{ fontFamily: specFont, fontSize, color, fontWeight: 600, display: "inline-block" }}
    />
  );
}
