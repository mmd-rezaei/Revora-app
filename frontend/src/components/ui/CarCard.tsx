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

type CarCardProps = {
  car: Car;
  href?: string;
};

export default function CarCard({ car, href }: CarCardProps) {
  const targetHref = href ?? `/cars/${car.slug}`;
  const cardRef = useRef<HTMLDivElement>(null);
  const image = car.images[0] || "/next.svg";

  function onEnter() {
    if (prefersReducedMotion() || !cardRef.current) return;
    gsap.to(cardRef.current, { y: -6, duration: 0.35, ease: "power2.out" });
    gsap.to(cardRef.current.querySelector(".car-card-image"), { scale: 1.06, duration: 0.5, ease: "power2.out" });
  }

  function onLeave() {
    if (prefersReducedMotion() || !cardRef.current) return;
    gsap.to(cardRef.current, { y: 0, duration: 0.35, ease: "power2.out" });
    gsap.to(cardRef.current.querySelector(".car-card-image"), { scale: 1, duration: 0.5, ease: "power2.out" });
  }

  return (
    <Card
      ref={cardRef}
      className="gsap-stagger-item"
      onMouseEnter={onEnter}
      onMouseLeave={onLeave}
      sx={{ height: "100%", overflow: "hidden" }}
    >
      <CardActionArea component={Link} href={targetHref} sx={{ height: "100%", alignItems: "stretch", display: "flex", flexDirection: "column" }}>
        <Box sx={{ position: "relative", aspectRatio: "16/10", overflow: "hidden", bgcolor: revoraColors.elevated }}>
          <Box className="car-card-image" sx={{ position: "absolute", inset: 0 }}>
            <Image
              src={image}
              alt={`${car.brandName} ${car.modelName} ${car.trim}`}
              fill
              sizes="(max-width: 900px) 100vw, 33vw"
              style={{ objectFit: "cover" }}
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
    </Card>
  );
}
