"use client";

import { useEffect, useRef } from "react";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import Link from "next/link";
import Image from "next/image";
import gsap from "gsap";
import { useQuery } from "@tanstack/react-query";
import RevoraButton from "@/components/ui/RevoraButton";
import CarCard from "@/components/ui/CarCard";
import SectionHeader from "@/components/ui/SectionHeader";
import AnimatedCounter from "@/components/ui/AnimatedCounter";
import { fetchCars } from "@/lib/api/cars";
import { fetchBrands } from "@/lib/api/brands";
import { prefersReducedMotion, registerGsapPlugins, runMatchMedia } from "@/lib/gsap/gsapUtils";
import { clipReveal, horizontalScrollTrack, revealUp, scaleReveal, staggerChildren } from "@/lib/gsap/presets";
import { MOTION, SCROLL } from "@/lib/gsap/tokens";
import { revoraColors } from "@/theme/colors";

const highlights = [
  { value: 503, label: "HP M3 Competition", suffix: "" },
  { value: 2.1, label: "Plaid 0–100", suffix: "s", decimals: 1 },
  { value: 9000, label: "rpm GT3 redline", suffix: "" },
];

export default function HomePage() {
  const rootRef = useRef<HTMLDivElement>(null);
  const brandTrackRef = useRef<HTMLDivElement>(null);
  const galleryTrackRef = useRef<HTMLDivElement>(null);
  const { data: featured } = useQuery({
    queryKey: ["cars", "featured"],
    queryFn: () => fetchCars({ sort: "horsepower", limit: 8 }),
  });
  const { data: latest } = useQuery({
    queryKey: ["cars", "latest"],
    queryFn: () => fetchCars({ sort: "newest", limit: 3 }),
  });
  const { data: brands = [] } = useQuery({ queryKey: ["brands"], queryFn: fetchBrands });

  useEffect(() => {
    registerGsapPlugins();
    if (prefersReducedMotion()) return;

    let mmCleanup: (() => void) | undefined;

    const ctx = gsap.context(() => {
      const entrance = gsap.timeline({ defaults: { ease: MOTION.ease.out } });
      entrance
        .from(".hero-eyebrow", { y: 24, opacity: 0, duration: 0.7 })
        .from(
          ".hero-line",
          { y: 90, opacity: 0, rotateX: -22, duration: 0.9, stagger: 0.14, transformOrigin: "50% 100%" },
          "-=0.35",
        )
        .from(".hero-sub", { y: 20, opacity: 0, duration: 0.6 }, "-=0.45")
        .from(".hero-cta", { y: 16, opacity: 0, duration: 0.5, stagger: 0.1 }, "-=0.35")
        .from(".hero-image", { x: 70, opacity: 0, scale: 1.08, duration: 1.15 }, "-=0.85");

      gsap.to(".hero-image-inner", {
        scale: 1.1,
        duration: 9,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
      });

      mmCleanup = runMatchMedia((mm) => {
        mm.add("(min-width: 900px)", () => {
          const heroTl = gsap.timeline({
            scrollTrigger: {
              trigger: ".hero-scroll-zone",
              start: "top top",
              end: SCROLL.heroEnd,
              pin: ".hero-pin-stage",
              scrub: SCROLL.scrub,
              anticipatePin: 1,
            },
          });

          heroTl
            .to(".hero-line", { y: -70, scale: 0.82, opacity: 0.35, stagger: 0.06, ease: "none" }, 0)
            .to(".hero-copy", { y: -90, opacity: 0, ease: "none" }, 0)
            .to(".hero-cta", { y: -40, opacity: 0, ease: "none" }, 0)
            .to(".hero-image", { x: -50, y: 40, scale: 1.18, ease: "none" }, 0)
            .to(".hero-image-inner", { scale: 1.22, ease: "none" }, 0)
            .to(".hero-bg-depth", { y: 120, scale: 1.15, opacity: 0.4, ease: "none" }, 0)
            .fromTo(".hero-wipe", { scaleY: 0, transformOrigin: "top" }, { scaleY: 1, ease: "none" }, 0.55);
        });

        mm.add("(max-width: 899px)", () => {
          gsap.to(".hero-image", {
            y: 30,
            ease: "none",
            scrollTrigger: {
              trigger: ".hero-scroll-zone",
              start: "top top",
              end: "bottom top",
              scrub: true,
            },
          });
        });
      });

      revealUp(rootRef.current!, ".gsap-reveal-up", { y: 48 });
      clipReveal(rootRef.current!, ".gsap-clip-reveal");
      scaleReveal(rootRef.current!, ".gsap-scale-reveal");
      staggerChildren(rootRef.current!, ".gsap-stagger-container");

      const track = brandTrackRef.current;
      if (track) {
        horizontalScrollTrack(track, track.closest(".brand-scroll-section") as HTMLElement, { pin: false });
      }

      const gallery = galleryTrackRef.current;
      const gallerySection = gallery?.closest(".car-gallery-section") as HTMLElement | null;
      if (gallery && gallerySection) {
        horizontalScrollTrack(gallery, gallerySection, { pin: true, endExtra: "+=140%" });
      }

    }, rootRef);

    return () => {
      mmCleanup?.();
      ctx.revert();
    };
  }, [brands.length, featured?.items.length, latest?.items.length]);

  return (
    <Box ref={rootRef}>
      <Box className="hero-scroll-zone" sx={{ position: "relative" }}>
        <Box
          className="hero-pin-stage"
          sx={{
            minHeight: { xs: "88vh", md: "100vh" },
            display: "grid",
            gridTemplateColumns: { xs: "1fr", md: "1.05fr 0.95fr" },
            alignItems: "center",
            px: { xs: 2, md: 8 },
            gap: 4,
            overflow: "hidden",
            position: "relative",
          }}
        >
          <Box
            className="hero-bg-depth"
            sx={{
              position: "absolute",
              inset: "-15%",
              background: revoraColors.heroGlow,
              pointerEvents: "none",
            }}
          />
          <Box
            className="hero-wipe"
            sx={{
              position: "absolute",
              left: 0,
              right: 0,
              bottom: 0,
              height: "18%",
              background: `linear-gradient(to bottom, transparent, ${revoraColors.bg})`,
              transformOrigin: "top",
              pointerEvents: "none",
              zIndex: 2,
            }}
          />
          <Box className="hero-copy" sx={{ position: "relative", zIndex: 1 }}>
            <Typography variant="overline" className="hero-eyebrow" sx={{ color: "primary.main" }}>
              Automotive platform
            </Typography>
            <Typography variant="h1" sx={{ fontSize: { xs: 56, md: 92 }, my: 2, perspective: "900px" }}>
              {["Build.", "Tune.", "Drive."].map((line) => (
                <Box key={line} component="span" className="hero-line" sx={{ display: "block" }}>
                  {line}
                </Box>
              ))}
            </Typography>
            <Typography className="hero-sub" color="text.secondary" sx={{ maxWidth: 460, mb: 4, fontSize: 18 }}>
              Discover cars from around the world. Configure them. Tune them. Save the result in your garage.
            </Typography>
            <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap" }}>
              <RevoraButton className="hero-cta" component={Link} href="/cars" variant="contained" size="large">
                Explore cars
              </RevoraButton>
              <RevoraButton className="hero-cta" component={Link} href="/brands" variant="outlined" size="large">
                Browse brands
              </RevoraButton>
            </Box>
          </Box>
          <Box
            className="hero-image"
            sx={{
              position: "relative",
              minHeight: { xs: 280, md: 560 },
              zIndex: 1,
              overflow: "hidden",
              borderRadius: 1,
              border: `1px solid ${revoraColors.border}`,
            }}
          >
            <Box className="hero-image-inner" sx={{ position: "absolute", inset: 0 }}>
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
        </Box>
      </Box>

      <Container maxWidth="lg" sx={{ py: 10 }} className="gsap-clip-reveal">
        <Grid container spacing={4} className="gsap-stagger-container">
          {highlights.map((item) => (
            <Grid key={item.label} size={{ xs: 12, md: 4 }} className="gsap-stagger-item">
              <AnimatedCounter value={item.value} suffix={item.suffix} decimals={item.decimals} />
              <Typography color="text.secondary" sx={{ mt: 1 }}>
                {item.label}
              </Typography>
            </Grid>
          ))}
        </Grid>
      </Container>

      <Box sx={{ py: 4, overflow: "hidden" }} className="car-gallery-section gsap-reveal-up">
        <Container maxWidth="lg" sx={{ mb: 4 }}>
          <SectionHeader title="Featured machines" subtitle="Scroll through high-output cars ready to configure and tune." />
        </Container>
        <Box
          ref={galleryTrackRef}
          className="gsap-stagger-container"
          sx={{ display: "flex", gap: 3, px: { xs: 2, md: 8 }, width: "max-content", pb: 2 }}
        >
          {(featured?.items || []).map((car) => (
            <Box key={car.id} className="gsap-stagger-item" sx={{ width: { xs: 280, md: 360 }, flexShrink: 0 }}>
              <CarCard car={car} />
            </Box>
          ))}
        </Box>
      </Box>

      <Box sx={{ py: 8, overflow: "hidden" }} className="brand-scroll-section gsap-scale-reveal">
        <Container maxWidth="lg">
          <SectionHeader title="Popular brands" subtitle="A growing catalog. Brand, model, generation, trim." />
        </Container>
        <Box ref={brandTrackRef} sx={{ display: "flex", gap: 2, px: { xs: 2, md: 8 }, width: "max-content", pb: 2, mt: 4 }}>
          {brands.map((brand) => (
            <Box
              key={brand.id}
              component={Link}
              href={`/brands/${brand.slug}`}
              className="brand-card"
              sx={{
                minWidth: 220,
                p: 3,
                border: `1px solid ${revoraColors.border}`,
                bgcolor: revoraColors.paper,
                transition: "border-color 0.25s ease",
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

      <Container maxWidth="lg" sx={{ py: 8 }} className="gsap-reveal-up">
        <SectionHeader title="Latest additions" />
        <Grid container spacing={3} className="gsap-stagger-container" sx={{ mt: 1 }}>
          {(latest?.items || []).map((car) => (
            <Grid key={car.id} size={{ xs: 12, md: 4 }} className="gsap-stagger-item">
              <CarCard car={car} />
            </Grid>
          ))}
        </Grid>
        <Box
          className="gsap-clip-reveal"
          sx={{
            mt: 6,
            p: { xs: 3, md: 6 },
            border: `1px solid ${revoraColors.border}`,
            bgcolor: revoraColors.paper,
            display: "flex",
            justifyContent: "space-between",
            flexWrap: "wrap",
            gap: 3,
          }}
        >
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
