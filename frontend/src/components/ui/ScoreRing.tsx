"use client";

import { useEffect, useRef } from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import { animateCounter, animateRingProgress, prefersReducedMotion, registerGsapPlugins } from "@/lib/gsap/gsapUtils";
import { specFont } from "@/theme/revoraTheme";

type Props = {
  label: string;
  value: number;
  size?: number;
  animate?: boolean;
};

export default function ScoreRing({ label, value, size = 96, animate = true }: Props) {
  const stroke = 7;
  const radius = (size - stroke) / 2;
  const circ = 2 * Math.PI * radius;
  const circleRef = useRef<SVGCircleElement>(null);
  const valueRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    registerGsapPlugins();
    const circle = circleRef.current;
    const valueEl = valueRef.current;
    if (!circle || !valueEl) return;

    const clamped = Math.min(100, Math.max(0, value));
    if (!animate || prefersReducedMotion()) {
      circle.setAttribute("stroke-dashoffset", String(circ - (clamped / 100) * circ));
      valueEl.textContent = String(Math.round(clamped));
      return;
    }

    const ringTween = animateRingProgress(circle, value, circ);
    const counterTween = animateCounter(valueEl, value, { duration: 1.1, decimals: 0 });

    return () => {
      ringTween.kill();
      counterTween.kill();
    };
  }, [value, circ, animate]);

  return (
    <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 1 }} className="score-ring">
      <Box sx={{ position: "relative", width: size, height: size }}>
        <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
          <circle cx={size / 2} cy={size / 2} r={radius} fill="none" stroke="rgba(244,241,234,0.08)" strokeWidth={stroke} />
          <circle
            ref={circleRef}
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke="#E11D2E"
            strokeWidth={stroke}
            strokeDasharray={circ}
            strokeDashoffset={circ}
            strokeLinecap="round"
            transform={`rotate(-90 ${size / 2} ${size / 2})`}
          />
        </svg>
        <Box
          ref={valueRef}
          sx={{
            position: "absolute",
            inset: 0,
            display: "grid",
            placeItems: "center",
            fontFamily: specFont,
            fontSize: size > 80 ? 22 : 16,
            fontWeight: 700,
          }}
        >
          0
        </Box>
      </Box>
      <Typography variant="overline" color="text.secondary">
        {label}
      </Typography>
    </Box>
  );
}
