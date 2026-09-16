"use client";

import { useEffect, useRef } from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import Link from "next/link";
import gsap from "gsap";
import { useCompareStore } from "@/store/compareStore";
import RevoraButton from "@/components/ui/RevoraButton";
import { prefersReducedMotion, registerGsapPlugins } from "@/lib/gsap/gsapUtils";

export default function CompareTray() {
  const { cars, removeCar, clear } = useCompareStore();
  const trayRef = useRef<HTMLDivElement>(null);
  const prevCount = useRef(0);

  useEffect(() => {
    if (!trayRef.current || prefersReducedMotion()) return;
    registerGsapPlugins();

    if (cars.length > 0 && prevCount.current === 0) {
      gsap.fromTo(trayRef.current, { y: 80, opacity: 0 }, { y: 0, opacity: 1, duration: 0.5, ease: "power3.out" });
    } else if (cars.length === 0 && prevCount.current > 0) {
      gsap.to(trayRef.current, { y: 80, opacity: 0, duration: 0.35, ease: "power2.in" });
    }
    prevCount.current = cars.length;
  }, [cars.length]);

  if (cars.length === 0) return null;

  return (
    <Box
      ref={trayRef}
      sx={{
        position: "sticky",
        bottom: 0,
        zIndex: 20,
        borderTop: "1px solid rgba(174, 203, 235, 0.14)",
        bgcolor: "rgba(12, 24, 41, 0.94)",
        backdropFilter: "blur(12px)",
        px: { xs: 2, md: 4 },
        py: 1.5,
        display: "flex",
        alignItems: "center",
        gap: 2,
        overflowX: "auto",
      }}
    >
      <Typography variant="overline" sx={{ whiteSpace: "nowrap" }}>
        Compare {cars.length}/3
      </Typography>
      {cars.map((car) => (
        <Box key={car.id} sx={{ display: "flex", alignItems: "center", gap: 0.5, border: "1px solid rgba(174, 203, 235, 0.14)", px: 1, borderRadius: 1 }}>
          <Typography variant="body2" sx={{ whiteSpace: "nowrap" }}>
            {car.brandName} {car.modelName}
          </Typography>
          <IconButton size="small" onClick={() => removeCar(car.id)} aria-label={`Remove ${car.modelName}`}>
            <CloseIcon fontSize="small" />
          </IconButton>
        </Box>
      ))}
      <Box sx={{ ml: "auto", display: "flex", gap: 1 }}>
        <RevoraButton size="small" onClick={clear}>
          Clear
        </RevoraButton>
        <RevoraButton size="small" variant="contained" component={Link} href="/compare">
          Open
        </RevoraButton>
      </Box>
    </Box>
  );
}
