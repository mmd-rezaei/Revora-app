"use client";

import Card from "@mui/material/Card";
import CardActionArea from "@mui/material/CardActionArea";
import CardContent from "@mui/material/CardContent";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Chip from "@mui/material/Chip";
import Image from "next/image";
import Link from "next/link";
import type { Car } from "@/types";
import { specFont } from "@/theme/revoraTheme";

export default function CarCard({ car }: { car: Car }) {
  const image = car.images[0] || "/next.svg";

  return (
    <Card sx={{ height: "100%", overflow: "hidden", "&:hover img": { transform: "scale(1.05)" } }}>
      <CardActionArea component={Link} href={`/cars/${car.slug}`} sx={{ height: "100%", alignItems: "stretch", display: "flex", flexDirection: "column" }}>
        <Box sx={{ position: "relative", aspectRatio: "16/10", overflow: "hidden", bgcolor: "#111" }}>
          <Image
            src={image}
            alt={`${car.brandName} ${car.modelName} ${car.trim}`}
            fill
            sizes="(max-width: 900px) 100vw, 33vw"
            style={{ objectFit: "cover", transition: "transform 0.6s ease" }}
          />
          <Chip
            label={car.year}
            size="small"
            sx={{ position: "absolute", top: 12, left: 12, bgcolor: "rgba(5,5,6,0.72)", color: "#F4F1EA" }}
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
