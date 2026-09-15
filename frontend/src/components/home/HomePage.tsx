"use client";

import { useEffect, useRef } from "react";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import Link from "next/link";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useQuery } from "@tanstack/react-query";
import RevoraButton from "@/components/ui/RevoraButton";
import CarCard from "@/components/ui/CarCard";
import SectionHeader from "@/components/ui/SectionHeader";
import { fetchCars } from "@/lib/api/cars";
import { fetchBrands } from "@/lib/api/brands";
import { specFont } from "@/theme/revoraTheme";

gsap.registerPlugin(ScrollTrigger);

const highlights = [
  { value: "503", label: "HP M3 Competition" },
  { value: "2.1s", label: "Plaid 0–100" },
  { value: "9,000", label: "rpm GT3 redline" },
];

export default function HomePage() {
  const heroRef = useRef<HTMLDivElement>(null);
  const { data: featured } = useQuery({
    queryKey: ["cars", "featured"],
    queryFn: () => fetchCars({ sort: "horsepower", limit: 6 }),
  });
  const { data: latest } = useQuery({
    queryKey: ["cars", "latest"],
    queryFn: () => fetchCars({ sort: "newest", limit: 3 }),
  });
  const { data: brands = [] } = useQuery({ queryKey: ["brands"], queryFn: fetchBrands });

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const ctx = gsap.context(() => {
      gsap.from(".hero-copy > *", { y: 40, opacity: 0, duration: 0.9, stagger: 0.12, ease: "power3.out" });
      gsap.from(".hero-image", { x: 80, opacity: 0, duration: 1.2, delay: 0.2, ease: "power3.out" });
      gsap.utils.toArray<HTMLElement>(".reveal-section").forEach((section) => {
        gsap.from(section, {
          y: 48,
          opacity: 0,
          duration: 0.8,
          ease: "power2.out",
          scrollTrigger: { trigger: section, start: "top 82%" },
        });
      });
    }, heroRef);
    return () => ctx.revert();
  }, []);

  return (
    <Box ref={heroRef}>
      <Box
        sx={{
          minHeight: { xs: "88vh", md: "92vh" },
          display: "grid",
          gridTemplateColumns: { xs: "1fr", md: "1.05fr 0.95fr" },
          alignItems: "center",
          px: { xs: 2, md: 8 },
          gap: 4,
          overflow: "hidden",
          position: "relative",
        }}
      >
        <Box className="hero-copy">
          <Typography variant="overline" sx={{ color: "primary.main" }}>
            Automotive platform
          </Typography>
          <Typography variant="h1" sx={{ fontSize: { xs: 56, md: 92 }, my: 2 }}>
            Build.
            <br />
            Tune.
            <br />
            Drive.
          </Typography>
          <Typography color="text.secondary" sx={{ maxWidth: 460, mb: 4, fontSize: 18 }}>
            Discover cars from around the world. Configure them. Tune them. Save the result in your garage.
          </Typography>
          <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap" }}>
            <RevoraButton component={Link} href="/cars" variant="contained" size="large">
              Explore cars
            </RevoraButton>
            <RevoraButton component={Link} href="/brands" variant="outlined" size="large">
              Browse brands
            </RevoraButton>
          </Box>
        </Box>
        <Box className="hero-image" sx={{ position: "relative", minHeight: { xs: 280, md: 560 } }}>
          <Image
            src="https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=1800&q=80"
            alt="Porsche 911 on REVORA"
            fill
            priority
            sizes="(max-width: 900px) 100vw, 50vw"
            style={{ objectFit: "cover", objectPosition: "center" }}
          />
        </Box>
      </Box>

      <Container maxWidth="lg" sx={{ py: 10 }} className="reveal-section">
        <Grid container spacing={4}>
          {highlights.map((item) => (
            <Grid key={item.label} size={{ xs: 12, md: 4 }}>
              <Typography sx={{ fontFamily: specFont, fontSize: { xs: 40, md: 56 }, color: "primary.main" }}>
                {item.value}
              </Typography>
              <Typography color="text.secondary">{item.label}</Typography>
            </Grid>
          ))}
        </Grid>
      </Container>

      <Container maxWidth="lg" sx={{ py: 8 }} className="reveal-section">
        <SectionHeader title="Featured machines" subtitle="High-output cars ready to configure and tune." />
        <Grid container spacing={3}>
          {(featured?.items || []).map((car) => (
            <Grid key={car.id} size={{ xs: 12, sm: 6, md: 4 }}>
              <CarCard car={car} />
            </Grid>
          ))}
        </Grid>
      </Container>

      <Box sx={{ py: 8, overflow: "hidden" }} className="reveal-section">
        <Container maxWidth="lg">
          <SectionHeader title="Popular brands" subtitle="A growing catalog. Brand, model, generation, trim." />
        </Container>
        <Box sx={{ display: "flex", gap: 2, px: { xs: 2, md: 8 }, overflowX: "auto", pb: 2 }}>
          {brands.map((brand) => (
            <Box
              key={brand.id}
              component={Link}
              href={`/brands/${brand.slug}`}
              sx={{
                minWidth: 220,
                p: 3,
                border: "1px solid rgba(244,241,234,0.08)",
                bgcolor: "#0E0E11",
                "&:hover": { borderColor: "primary.main" },
              }}
            >
              <Typography variant="overline" color="text.secondary">
                {brand.country}
              </Typography>
              <Typography variant="h5">{brand.name}</Typography>
              <Typography variant="body2" color="text.secondary">
                {brand.carCount || 0} cars
              </Typography>
            </Box>
          ))}
        </Box>
      </Box>

      <Container maxWidth="lg" sx={{ py: 8 }} className="reveal-section">
        <SectionHeader title="Latest additions" />
        <Grid container spacing={3}>
          {(latest?.items || []).map((car) => (
            <Grid key={car.id} size={{ xs: 12, md: 4 }}>
              <CarCard car={car} />
            </Grid>
          ))}
        </Grid>
        <Box sx={{ mt: 6, p: { xs: 3, md: 6 }, border: "1px solid rgba(244,241,234,0.08)", display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: 3 }}>
          <Box>
            <Typography variant="h4">Start a build tonight.</Typography>
            <Typography color="text.secondary">Configure, tune, and park it in your garage.</Typography>
          </Box>
          <RevoraButton component={Link} href="/cars" variant="contained" size="large">
            Open catalog
          </RevoraButton>
        </Box>
      </Container>
    </Box>
  );
}
