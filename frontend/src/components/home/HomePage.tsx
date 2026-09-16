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

import { fetchCars } from "@/lib/api/cars";
import { fetchBrands } from "@/lib/api/brands";

import {
  prefersReducedMotion,
  registerGsapPlugins,
  runMatchMedia,
} from "@/lib/gsap/gsapUtils";

import {
  horizontalCardDepth,
  horizontalScrollTrack,
  revealUp,
  scaleReveal,
  scrollDepth,
  scrollText,
  scrubClipReveal,
  scrubReveal,
  speedReveal,
} from "@/lib/gsap/presets";

import { MOTION, SCROLL } from "@/lib/gsap/tokens";

import { revoraColors } from "@/theme/colors";
import { specFont } from "@/theme/revoraTheme";

import "./HomePage.scss";

export default function HomePage() {
  const rootRef = useRef<HTMLDivElement>(null);

  const galleryTrackRef = useRef<HTMLDivElement>(null);
  const brandTrackRef = useRef<HTMLDivElement>(null);

  const { data: featured } = useQuery({
    queryKey: ["cars", "featured"],
    queryFn: () =>
      fetchCars({
        sort: "horsepower",
        limit: 8,
      }),
  });

  const { data: latest } = useQuery({
    queryKey: ["cars", "latest"],
    queryFn: () =>
      fetchCars({
        sort: "newest",
        limit: 3,
      }),
  });

  const { data: brands = [] } = useQuery({
    queryKey: ["brands"],
    queryFn: fetchBrands,
  });

  const heroCar = featured?.items?.[0];

  const heroSpecs = heroCar
    ? [
        {
          label: "Horsepower",
          value: `${heroCar.horsepower} HP`,
        },
        {
          label: "Torque",
          value: `${heroCar.torque} Nm`,
        },
        {
          label: "0–100",
          value: `${heroCar.zeroToHundred}s`,
        },
        {
          label: "Top speed",
          value: `${heroCar.topSpeed} km/h`,
        },
      ]
    : [];

  useEffect(() => {
    registerGsapPlugins();

    if (prefersReducedMotion()) return;

    let mmCleanup: (() => void) | undefined;
    let horizontalCleanup: (() => void) | undefined;

    const ctx = gsap.context(() => {
      /*
       * =========================================================
       * GLOBAL SCROLL PROGRESS
       * =========================================================
       */

      gsap.to(".page-scroll-progress", {
        scaleX: 1,
        ease: "none",
        transformOrigin: "left center",

        scrollTrigger: {
          trigger: rootRef.current,
          start: "top top",
          end: "bottom bottom",
          scrub: true,
        },
      });

      /*
       * =========================================================
       * HERO ENTRANCE
       * =========================================================
       */

      const heroEntrance = gsap.timeline({
        defaults: {
          ease: MOTION.ease.out,
        },
      });

      heroEntrance
        .from(".hero-eyebrow", {
          y: 30,
          opacity: 0,
          duration: 0.7,
        })
        .from(
          ".hero-line",
          {
            y: 110,
            opacity: 0,
            rotateX: -25,
            duration: 1,
            stagger: 0.13,
            transformOrigin: "50% 100%",
          },
          "-=0.35",
        )
        .from(
          ".hero-sub",
          {
            y: 25,
            opacity: 0,
            duration: 0.65,
          },
          "-=0.5",
        )
        .from(
          ".hero-cta",
          {
            y: 20,
            opacity: 0,
            duration: 0.5,
            stagger: 0.1,
          },
          "-=0.4",
        )
        .from(
          ".hero-image",
          {
            clipPath: "inset(0 100% 0 0)",
            opacity: 0,
            duration: 1.1,
            ease: "power4.out",
          },
          "-=0.6",
        )
        .from(
          ".hero-image-inner",
          {
            scale: 1.18,
            x: 35,
            duration: 1.2,
            ease: "power3.out",
          },
          "-=1",
        )
        .from(
          ".hero-spec",
          {
            x: 45,
            opacity: 0,
            filter: "blur(8px)",
            duration: 0.55,
            stagger: 0.08,
          },
          "-=0.8",
        );

      /*
       * =========================================================
       * HERO IDLE MOTION
       * =========================================================
       */

      gsap.to(".hero-image-inner", {
        xPercent: -3,
        scale: 1.055,
        duration: 9,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
      });

      gsap.to(".hero-image-glow", {
        scale: 1.12,
        opacity: 0.75,
        duration: 3,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
      });

      /*
       * =========================================================
       * RESPONSIVE SCROLL ANIMATIONS
       * =========================================================
       */

      mmCleanup = runMatchMedia((mm) => {
        /*
         * =======================================================
         * DESKTOP HERO
         * =======================================================
         */

        mm.add("(min-width: 900px)", () => {
          const heroZone = document.querySelector(
            ".hero-scroll-zone",
          ) as HTMLElement | null;

          const heroStage = document.querySelector(
            ".hero-pin-stage",
          ) as HTMLElement | null;

          const heroImage = document.querySelector(
            ".hero-image",
          ) as HTMLElement | null;

          const heroBackground = document.querySelector(
            ".hero-bg-depth",
          ) as HTMLElement | null;

          if (!heroZone || !heroStage || !heroImage || !heroBackground) {
            return;
          }

          const heroTimeline = gsap.timeline({
            scrollTrigger: {
              trigger: heroZone,
              start: "top top",
              end: SCROLL.heroEnd,
              pin: heroStage,
              scrub: 1,
              anticipatePin: 1,
            },
          });

          heroTimeline
            .to(
              ".hero-bg-depth",
              {
                yPercent: 25,
                scale: 1.25,
                opacity: 0.3,
                ease: "none",
              },
              0,
            )
            .to(
              ".hero-line",
              {
                y: -75,
                scale: 0.8,
                opacity: 0.25,
                stagger: 0.05,
                ease: "none",
              },
              0,
            )
            .to(
              ".hero-copy",
              {
                y: -110,
                opacity: 0,
                ease: "none",
              },
              0.05,
            )
            .to(
              ".hero-cta",
              {
                y: -50,
                opacity: 0,
                stagger: 0.04,
                ease: "none",
              },
              0.05,
            )
            .to(
              ".hero-image",
              {
                y: 40,
                rotateY: -10,
                rotateX: 3,
                scale: 0.93,
                transformPerspective: 1000,
                ease: "none",
              },
              0.2,
            )
            .to(
              ".hero-image-inner",
              {
                xPercent: -8,
                scale: 1.02,
                ease: "none",
              },
              0.2,
            )
            .to(
              ".hero-image-glow",
              {
                scale: 1.4,
                opacity: 1,
                ease: "none",
              },
              0.2,
            )
            .to(
              ".hero-spec",
              {
                x: 50,
                opacity: 0,
                filter: "blur(6px)",
                stagger: 0.06,
                ease: "none",
              },
              0.35,
            )
            .fromTo(
              ".hero-wipe",
              {
                scaleY: 0,
              },
              {
                scaleY: 1,
                ease: "none",
              },
              0.6,
            );

          scrollDepth(heroImage, heroZone, {
            y: -35,
            scale: 1.08,
            rotateY: -3,
            start: "top bottom",
            end: "bottom top",
          });

          scrollDepth(heroBackground, heroZone, {
            y: 100,
            scale: 1.18,
            opacity: 0.25,
            start: "top bottom",
            end: "bottom top",
          });
        });

        /*
         * =======================================================
         * MOBILE HERO
         * =======================================================
         */

        mm.add("(max-width: 899px)", () => {
          const mobileHero = gsap.timeline({
            scrollTrigger: {
              trigger: ".hero-scroll-zone",
              start: "top top",
              end: "bottom top",
              scrub: true,
            },
          });

          mobileHero
            .to(
              ".hero-bg-depth",
              {
                y: 80,
                scale: 1.12,
                opacity: 0.4,
                ease: "none",
              },
              0,
            )
            .to(
              ".hero-image",
              {
                y: 20,
                scale: 0.96,
                ease: "none",
              },
              0,
            )
            .to(
              ".hero-copy",
              {
                y: -40,
                opacity: 0,
                ease: "none",
              },
              0.2,
            );

          const mobileImage = document.querySelector(
            ".hero-image",
          ) as HTMLElement | null;

          const heroZone = document.querySelector(
            ".hero-scroll-zone",
          ) as HTMLElement | null;

          if (mobileImage && heroZone) {
            scrollDepth(mobileImage, heroZone, {
              y: -20,
              scale: 1.04,
              start: "top bottom",
              end: "bottom top",
            });
          }
        });

        /*
         * =======================================================
         * FEATURED MACHINES
         * =======================================================
         */

        const gallery = galleryTrackRef.current;

        const gallerySection = gallery?.closest(
          ".car-gallery-section",
        ) as HTMLElement | null;

        if (gallery && gallerySection) {
          horizontalScrollTrack(gallery, gallerySection, {
            pin: true,
            endExtra: "+=180%",
            scrub: 1,
          });

          horizontalCleanup = horizontalCardDepth(gallery, {
            selector: ".featured-card",
            strength: 1.15,
          });

          const galleryTitle = gallerySection.querySelector(
            ".section-title",
          ) as HTMLElement | null;

          if (galleryTitle) {
            scrollText(galleryTitle, gallerySection, {
              x: 80,
              y: 20,
              scale: 0.92,
              start: "top 80%",
              end: "top 35%",
            });
          }
        }

        /*
         * =======================================================
         * POPULAR BRANDS
         * =======================================================
         */

        const brandTrack = brandTrackRef.current;

        const brandSection = brandTrack?.closest(
          ".brand-scroll-section",
        ) as HTMLElement | null;

        if (brandTrack && brandSection) {
          horizontalScrollTrack(brandTrack, brandSection, {
            pin: false,
            endExtra: "+=80%",
            scrub: 1,
          });

          gsap.utils
            .toArray<HTMLElement>(".brand-card")
            .forEach((card, index) => {
              speedReveal(card, brandSection, {
                x: 90 + index * 8,
                start: "top 90%",
                end: "top 50%",
              });

              gsap.to(card, {
                rotateY: index % 2 === 0 ? 3 : -3,
                ease: "none",

                scrollTrigger: {
                  trigger: card,
                  start: "top bottom",
                  end: "bottom top",
                  scrub: true,
                },
              });
            });
        }

        /*
         * =======================================================
         * LATEST CARS
         * =======================================================
         */

        gsap.utils
          .toArray<HTMLElement>(".latest-card")
          .forEach((card, index) => {
            scrubReveal(card, card, {
              y: 100,
              scale: 0.88,
              start: "top 92%",
              end: "top 52%",
            });

            gsap.to(card, {
              rotateY: index % 2 === 0 ? -2 : 2,
              ease: "none",

              scrollTrigger: {
                trigger: card,
                start: "top bottom",
                end: "bottom top",
                scrub: true,
              },
            });
          });

        /*
         * =======================================================
         * BUILD CTA
         * =======================================================
         */

        const buildSection = document.querySelector(
          ".build-cta",
        ) as HTMLElement | null;

        if (buildSection) {
          scrubClipReveal(buildSection, buildSection, {
            start: "top 90%",
            end: "top 45%",
            direction: "up",
          });

          const buildContent = buildSection.querySelector(
            ".build-cta-content",
          ) as HTMLElement | null;

          if (buildContent) {
            scrubReveal(buildContent, buildSection, {
              y: 60,
              scale: 0.94,
              start: "top 80%",
              end: "top 45%",
            });
          }

          const buildButton = buildSection.querySelector(
            ".build-cta-button",
          ) as HTMLElement | null;

          if (buildButton) {
            speedReveal(buildButton, buildSection, {
              x: 80,
              start: "top 75%",
              end: "top 40%",
            });
          }

          const buildGlow = buildSection.querySelector(
            ".build-cta-glow",
          ) as HTMLElement | null;

          if (buildGlow) {
            scrollDepth(buildGlow, buildSection, {
              y: -20,
              scale: 1.2,
              opacity: 1,
              start: "top bottom",
              end: "bottom top",
            });
          }
        }

        /*
         * =======================================================
         * GENERIC GSAP PRESETS
         * =======================================================
         */

        if (rootRef.current) {
          revealUp(rootRef.current, ".gsap-reveal-up", {
            y: 70,
          });

          scaleReveal(rootRef.current, ".gsap-scale-reveal");
        }
      });
    }, rootRef);

    return () => {
      horizontalCleanup?.();
      mmCleanup?.();
      ctx.revert();
    };
  }, [
    brands.length,
    featured?.items.length,
    latest?.items.length,
    heroCar?.id,
  ]);

  return (
    <Box ref={rootRef} className="home-page">
      {/* =======================================================
          GLOBAL SCROLL PROGRESS
      ======================================================= */}

      <Box className="page-scroll-progress" />

      {/* =======================================================
          HERO
      ======================================================= */}

      <Box className="hero-scroll-zone">
        <Box className="hero-pin-stage">
          <Box className="hero-bg-depth" />

          <Box className="hero-wipe" />

          {/* HERO COPY */}

          <Box className="hero-copy">
            <Typography
              variant="overline"
              className="hero-eyebrow"
              sx={{
                color: "primary.main",
                letterSpacing: "0.25em",
              }}
            >
              Automotive platform
            </Typography>

            <Typography variant="h1" className="hero-title">
              {["Build.", "Tune.", "Drive."].map((line) => (
                <Box key={line} component="span" className="hero-line">
                  {line}
                </Box>
              ))}
            </Typography>

            <Typography className="hero-sub" color="text.secondary">
              Discover cars from around the world. Configure them. Tune them.
              Save the result in your garage.
            </Typography>

            <Box className="hero-actions">
              <RevoraButton
                className="hero-cta"
                component={Link}
                href="/cars"
                variant="contained"
                size="large"
              >
                Explore cars
              </RevoraButton>

              <RevoraButton
                className="hero-cta"
                component={Link}
                href="/brands"
                variant="outlined"
                size="large"
              >
                Browse brands
              </RevoraButton>
            </Box>
          </Box>

          {/* HERO VISUAL */}

          <Box className="hero-visual">
            {/* HERO SPECS */}

            {heroCar ? (
              <Box className="hero-specs">
                <Typography className="hero-car-name" variant="overline">
                  {heroCar.brandName} {heroCar.modelName}
                </Typography>

                {heroSpecs.map((spec) => (
                  <Box key={spec.label} className="hero-spec">
                    <Typography className="hero-spec-label">
                      {spec.label}
                    </Typography>

                    <Typography className="hero-spec-value">
                      {spec.value}
                    </Typography>
                  </Box>
                ))}
              </Box>
            ) : null}

            {/* HERO IMAGE */}

            <Box
              component={heroCar ? Link : "div"}
              href={heroCar ? `/cars/${heroCar.slug}` : undefined}
              className="hero-image"
            >
              <Box className="hero-image-glow" />

              <Box className="hero-image-inner">
                <Image
                  src={
                    heroCar?.images[0] ||
                    "https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=1800&q=80"
                  }
                  alt={
                    heroCar
                      ? `${heroCar.brandName} ${heroCar.modelName}`
                      : "Featured car on REVORA"
                  }
                  fill
                  priority
                  sizes="(max-width: 900px) 90vw, 500px"
                  style={{
                    objectFit: "cover",
                    objectPosition: "center",
                  }}
                />
              </Box>
            </Box>
          </Box>
        </Box>
      </Box>

      {/* =======================================================
          FEATURED MACHINES
      ======================================================= */}

      <Box className="car-gallery-section">
        <Container maxWidth="lg" className="section-heading-container">
          <Box className="section-title">
            <SectionHeader
              title="Featured machines"
              subtitle="Scroll through high-output cars ready to configure and tune."
            />
          </Box>
        </Container>

        <Box className="horizontal-viewport">
          <Box ref={galleryTrackRef} className="featured-track">
            {(featured?.items || []).map((car) => (
              <Box key={car.id} className="featured-card">
                <CarCard car={car} />
              </Box>
            ))}
          </Box>
        </Box>
      </Box>

      {/* =======================================================
          POPULAR BRANDS
      ======================================================= */}

      <Box className="brand-scroll-section">
        <Container maxWidth="lg" className="section-heading-container">
          <Box className="section-title">
            <SectionHeader
              title="Popular brands"
              subtitle="A growing catalog. Brand, model, generation, trim."
            />
          </Box>
        </Container>

        <Box className="horizontal-viewport horizontal-viewport--brands">
          <Box ref={brandTrackRef} className="brand-track">
            {brands.map((brand) => (
              <Box
                key={brand.id}
                component={Link}
                href={`/brands/${brand.slug}`}
                className="brand-card"
              >
                <Typography variant="overline" className="brand-card__country">
                  {brand.country}
                </Typography>

                <Typography variant="h5" className="brand-card__name">
                  {brand.name}
                </Typography>

                <Typography variant="body2" className="brand-card__count">
                  {brand.carCount || 0} cars
                </Typography>
              </Box>
            ))}
          </Box>
        </Box>
      </Box>

      {/* =======================================================
          LATEST CARS
      ======================================================= */}

      <Container maxWidth="lg" className="latest-section">
        <Box className="section-title">
          <SectionHeader title="Latest additions" />
        </Box>

        <Grid container spacing={3} className="latest-grid">
          {(latest?.items || []).map((car) => (
            <Grid
              key={car.id}
              size={{
                xs: 12,
                md: 4,
              }}
              className="latest-card"
            >
              <CarCard car={car} />
            </Grid>
          ))}
        </Grid>

        {/* =====================================================
            BUILD CTA
        ===================================================== */}

        <Box className="build-cta">
          <Box className="build-cta-glow" />

          <Box className="build-cta-content">
            <Typography variant="h4" className="build-cta-title">
              Start a build tonight.
            </Typography>

            <Typography color="text.secondary">
              Configure, tune, and park it in your garage.
            </Typography>
          </Box>

          <Box className="build-cta-button">
            <RevoraButton
              component={Link}
              href="/cars"
              variant="contained"
              size="large"
            >
              Open catalog
            </RevoraButton>
          </Box>
        </Box>
      </Container>
    </Box>
  );
}
