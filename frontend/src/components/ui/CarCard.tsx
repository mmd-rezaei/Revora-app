"use client";

import { useRef } from "react";
import Card from "@mui/material/Card";
import CardActionArea from "@mui/material/CardActionArea";
import CardContent from "@mui/material/CardContent";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Chip from "@mui/material/Chip";
import Image from "next/image";
import Link from "next/link";
import gsap from "gsap";
import type { Car } from "@/types";
import { specFont } from "@/theme/revoraTheme";
import { prefersReducedMotion } from "@/lib/gsap/gsapUtils";
import { revoraColors } from "@/theme/colors";
import { getCarCoverImage } from "@/lib/carImages";

type CarCardProps = {
  car: Car;
  href?: string;
};

export default function CarCard({ car, href }: CarCardProps) {
  const targetHref = href ?? `/cars/${car.slug}`;
  const liftRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLDivElement>(null);
  const hoverTweenRef = useRef<gsap.core.Tween | null>(null);
  const image = getCarCoverImage(car.images);

  function resetHover() {
    hoverTweenRef.current?.kill();
    const lift = liftRef.current;
    const imageEl = imageRef.current;
    if (!lift || prefersReducedMotion()) return;

    hoverTweenRef.current = gsap.to(lift, {
      y: 0,
      duration: 0.35,
      ease: "power2.out",
      overwrite: "auto",
    });

    if (imageEl) {
      gsap.to(imageEl, {
        scale: 1,
        duration: 0.45,
        ease: "power2.out",
        overwrite: "auto",
      });
    }
  }

  function onEnter() {
    const lift = liftRef.current;
    const imageEl = imageRef.current;
    if (prefersReducedMotion() || !lift || !imageEl) return;

    hoverTweenRef.current?.kill();
    hoverTweenRef.current = gsap.to(lift, {
      y: -6,
      duration: 0.35,
      ease: "power2.out",
      overwrite: "auto",
    });
    gsap.to(imageEl, {
      scale: 1.03,
      duration: 0.45,
      ease: "power2.out",
      overwrite: "auto",
    });
  }

  function onLeave() {
    resetHover();
  }

  return (
    <Card
      className="car-card"
      sx={{ height: "100%", width: "100%", maxWidth: "100%", overflow: "clip" }}
      onMouseLeave={onLeave}
    >
      <Box className="car-card-hover-zone" onMouseEnter={onEnter} onMouseLeave={onLeave} sx={{ height: "100%" }}>
        <Box ref={liftRef} className="car-card-lift" sx={{ height: "100%", willChange: "transform" }}>
          <CardActionArea
            component={Link}
            href={targetHref}
            sx={{ height: "100%", alignItems: "stretch", display: "flex", flexDirection: "column" }}
          >
            <Box sx={{ position: "relative", aspectRatio: "16/10", overflow: "clip", bgcolor: revoraColors.elevated }}>
              <Box
                ref={imageRef}
                className="car-card-image"
                sx={{ position: "absolute", inset: 0, overflow: "clip", transformOrigin: "center center" }}
              >
                <Image
                  src={image}
                  alt={`${car.brandName} ${car.modelName} ${car.trim}`}
                  fill
                  sizes="(max-width: 900px) 100vw, 33vw"
                  style={{ objectFit: "cover", objectPosition: "center" }}
                />
              </Box>
              <Chip
                label={car.year}
                size="small"
                sx={{ position: "absolute", top: 12, left: 12, bgcolor: "rgba(12, 24, 41, 0.78)", color: revoraColors.ice }}
              />
            </Box>
            <CardContent sx={{ width: "100%" }}>
              <Typography variant="overline" color="text.secondary">
                {car.brandName}
              </Typography>
              <Typography variant="h6" sx={{ fontFamily: "var(--font-syne)", mb: 2 }}>
                {car.modelName} {car.trim}
              </Typography>
              <Box sx={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 1 }}>
                {[
                  ["HP", car.horsepower],
                  ["NM", car.torque],
                  ["0–100", `${car.zeroToHundred}s`],
                ].map(([label, value]) => (
                  <Box key={label}>
                    <Typography variant="caption" color="text.secondary">
                      {label}
                    </Typography>
                    <Typography sx={{ fontFamily: specFont, fontSize: 14 }}>{value}</Typography>
                  </Box>
                ))}
              </Box>
            </CardContent>
          </CardActionArea>
        </Box>
      </Box>
    </Card>
  );
}
