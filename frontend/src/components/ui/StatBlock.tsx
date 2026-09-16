"use client";

import { useEffect, useRef } from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import gsap from "gsap";
import AnimatedCounter from "@/components/ui/AnimatedCounter";
import { prefersReducedMotion, registerGsapPlugins } from "@/lib/gsap/gsapUtils";
import { specFont } from "@/theme/revoraTheme";

type Props = {
  label: string;
  value: string | number;
  unit?: string;
  align?: "left" | "center";
  animate?: boolean;
  scrollReveal?: boolean;
};

export default function StatBlock({ label, value, unit, align = "left", animate = false, scrollReveal = false }: Props) {
  const blockRef = useRef<HTMLDivElement>(null);
  const numeric = typeof value === "number" ? value : parseFloat(String(value));

  useEffect(() => {
    if (!scrollReveal || !blockRef.current || prefersReducedMotion()) return;
    registerGsapPlugins();
    const ctx = gsap.context(() => {
      gsap.from(blockRef.current, {
        y: 28,
        opacity: 0,
        duration: 0.7,
        ease: "power3.out",
        scrollTrigger: {
          trigger: blockRef.current,
          start: "top 88%",
          once: true,
        },
      });
    }, blockRef);
    return () => ctx.revert();
  }, [scrollReveal]);

  return (
    <Box ref={blockRef} sx={{ textAlign: align }} className="stat-block">
      <Typography variant="overline" color="text.secondary" sx={{ display: "block", mb: 0.5 }}>
        {label}
      </Typography>
      {animate && !Number.isNaN(numeric) ? (
        <AnimatedCounter value={numeric} suffix={unit ? ` ${unit}` : ""} fontSize={{ xs: 22, md: 28 }} color="text.primary" />
      ) : (
        <Typography sx={{ fontFamily: specFont, fontSize: { xs: 22, md: 28 }, fontWeight: 600, lineHeight: 1 }}>
          {value}
          {unit ? (
            <Box component="span" sx={{ ml: 0.75, fontSize: 12, color: "text.secondary", fontWeight: 400 }}>
              {unit}
            </Box>
          ) : null}
        </Typography>
      )}
    </Box>
  );
}
