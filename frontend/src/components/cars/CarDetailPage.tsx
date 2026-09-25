"use client";

import { use, useEffect, useMemo, useRef, useState } from "react";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import Chip from "@mui/material/Chip";
import Image from "next/image";
import Link from "next/link";
import gsap from "gsap";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import PageLoader from "@/components/ui/PageLoader";
import StatBlock from "@/components/ui/StatBlock";
import RevoraButton from "@/components/ui/RevoraButton";
import PageReveal from "@/components/ui/PageReveal";
import { fetchCar } from "@/lib/api/cars";
import { addFavorite, fetchFavorites, removeFavorite } from "@/lib/api/builds";
import { useCompareStore } from "@/store/compareStore";
import { useAuthStore } from "@/store/authStore";
import { prefersReducedMotion, registerGsapPlugins } from "@/lib/gsap/gsapUtils";
import { clipReveal, revealUp, scrubParallax } from "@/lib/gsap/presets";
import { revoraColors } from "@/theme/colors";
import { specFont } from "@/theme/revoraTheme";
import { getCarCoverImage, getCarGallery } from "@/lib/carImages";
import ImageLightbox from "@/components/ui/ImageLightbox";

export default function CarDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params);
  const heroRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const { user } = useAuthStore();
  const queryClient = useQueryClient();
  const { addCar, hasCar } = useCompareStore();
  const { data: car, isLoading } = useQuery({ queryKey: ["car", slug], queryFn: () => fetchCar(slug) });
  const { data: favorites = [] } = useQuery({
    queryKey: ["favorites"],
    queryFn: fetchFavorites,
    enabled: Boolean(user),
  });

  const favorite = car ? favorites.find((item) => item.car.id === car.id) : undefined;

  const favMutation = useMutation({
    mutationFn: async () => {
      if (!car) return;
      if (favorite) await removeFavorite(favorite.id);
      else await addFavorite(car.id);
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["favorites"] }),
  });

  useEffect(() => {
    if (!car || prefersReducedMotion()) return;
    registerGsapPlugins();
    const hero = heroRef.current;
    const image = imageRef.current;
    const content = contentRef.current;
    if (!hero || !image) return;

    const ctx = gsap.context(() => {
      gsap.from(".detail-title > *", {
        y: 40,
        opacity: 0,
        duration: 0.85,
        stagger: 0.12,
        ease: "power3.out",
        delay: 0.1,
      });

      gsap.fromTo(
        image,
        { clipPath: "inset(0 100% 0 0)", scale: 1.12 },
        { clipPath: "inset(0 0% 0 0)", scale: 1, duration: 1.2, ease: "power3.inOut", delay: 0.05 },
      );

      scrubParallax(image, hero, { y: 100 });

      if (content) {
        revealUp(content, ".detail-spec-row", { y: 24, start: "top 90%" });
        clipReveal(content, ".detail-desc");
      }
    }, hero);

    return () => ctx.revert();
  }, [car]);

  const gallery = useMemo(() => getCarGallery(car?.images), [car?.images]);
  const [activeImage, setActiveImage] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);

  useEffect(() => {
    setActiveImage(0);
    setLightboxOpen(false);
  }, [car?.id]);

  const openLightbox = (index: number) => {
    setActiveImage(index);
    setLightboxIndex(index);
    setLightboxOpen(true);
  };

  if (isLoading || !car) return <PageLoader />;

  const heroImage = gallery[activeImage] || getCarCoverImage(car.images);

  return (
    <>
      <Box
        ref={heroRef}
        sx={{
          position: "relative",
          height: { xs: 260, md: 420 },
          mt: "calc(var(--navbar-height) * -1)",
          pt: "var(--navbar-height)",
          overflow: "hidden",
        }}
      >
        <Box
          ref={imageRef}
          component="button"
          type="button"
          onClick={() => gallery.length && openLightbox(activeImage)}
          aria-label="Open photo gallery"
          sx={{
            position: "absolute",
            inset: "-10% 0 0 0",
            height: "120%",
            p: 0,
            border: 0,
            cursor: gallery.length ? "zoom-in" : "default",
            bgcolor: "transparent",
          }}
        >
          <Image
            src={heroImage}
            alt={`${car.brandName} ${car.modelName}`}
            fill
            priority
            sizes="100vw"
            style={{ objectFit: "cover", pointerEvents: "none" }}
          />
        </Box>
        <Box
          sx={{
            position: "absolute",
            inset: 0,
            background: `linear-gradient(to top, ${revoraColors.bg} 18%, transparent 58%)`,
          }}
        />
        <Container
          maxWidth="lg"
          className="detail-title"
          sx={{ position: "absolute", bottom: 32, left: 0, right: 0, zIndex: 1 }}
        >
          <Typography variant="overline">
            {car.brandName} · {car.generationName} · {car.year}
          </Typography>
          <Typography variant="h2">
            {car.modelName} {car.trim}
          </Typography>
        </Container>
      </Box>

      <PageReveal>
        <Container maxWidth="lg" sx={{ py: 6 }} ref={contentRef}>
          <Grid container spacing={3} sx={{ mb: 5 }} className="page-child gsap-stagger-container">
            <Grid size={{ xs: 6, md: 3 }} className="gsap-stagger-item">
              <StatBlock label="Horsepower" value={car.horsepower} unit="HP" animate scrollReveal />
            </Grid>
            <Grid size={{ xs: 6, md: 3 }} className="gsap-stagger-item">
              <StatBlock label="Torque" value={car.torque} unit="Nm" animate scrollReveal />
            </Grid>
            <Grid size={{ xs: 6, md: 3 }} className="gsap-stagger-item">
              <StatBlock label="0–100" value={car.zeroToHundred} unit="s" animate scrollReveal />
            </Grid>
            <Grid size={{ xs: 6, md: 3 }} className="gsap-stagger-item">
              <StatBlock label="Top speed" value={car.topSpeed} unit="km/h" animate scrollReveal />
            </Grid>
          </Grid>
          <Box className="page-child" sx={{ display: "flex", gap: 1.5, flexWrap: "wrap", mb: 6 }}>
            <RevoraButton component={Link} href={`/configure/${car.id}`} variant="contained">
              Configure
            </RevoraButton>
            <RevoraButton component={Link} href={`/tune/${car.id}`} variant="outlined">
              Tune
            </RevoraButton>
            <RevoraButton variant="outlined" onClick={() => addCar(car)} disabled={hasCar(car.id)}>
              {hasCar(car.id) ? "In compare" : "Compare"}
            </RevoraButton>
            <RevoraButton variant="outlined" onClick={() => favMutation.mutate()} disabled={!user}>
              {favorite ? "In garage" : "Add to garage"}
            </RevoraButton>
          </Box>
          {gallery.length > 1 ? (
            <Box className="page-child" sx={{ display: "flex", gap: 1, flexWrap: "wrap", mb: 4 }}>
              {gallery.map((src, index) => (
                <Box
                  key={src}
                  component="button"
                  type="button"
                  onClick={() => openLightbox(index)}
                  aria-label={`Open image ${index + 1}`}
                  sx={{
                    p: 0,
                    border: index === activeImage ? `2px solid ${revoraColors.signal}` : `1px solid ${revoraColors.border}`,
                    borderRadius: 1,
                    overflow: "hidden",
                    cursor: "pointer",
                    bgcolor: "transparent",
                    width: 96,
                    height: 64,
                    position: "relative",
                  }}
                >
                  <Image src={src} alt="" fill sizes="96px" style={{ objectFit: "cover" }} />
                </Box>
              ))}
            </Box>
          ) : null}
          <Typography className="page-child detail-desc" color="text.secondary" sx={{ maxWidth: 760, mb: 4, fontSize: 18, lineHeight: 1.7 }}>
            {car.description}
          </Typography>
          <Grid container spacing={2} sx={{ mb: 4 }} className="page-child">
            {[
              ["Engine", car.engine],
              ["Transmission", car.transmission],
              ["Drive", car.driveType],
              ["Fuel", car.fuelType],
              ["Weight", `${car.weight} kg`],
              ["Body", car.bodyType],
            ].map(([label, value]) => (
              <Grid key={label} size={{ xs: 6, md: 4 }} className="detail-spec-row">
                <Typography variant="caption" color="text.secondary">
                  {label}
                </Typography>
                <Typography sx={{ fontFamily: specFont }}>{value}</Typography>
              </Grid>
            ))}
          </Grid>
          <Box className="page-child" sx={{ display: "flex", gap: 1, flexWrap: "wrap" }}>
            {car.features.map((feature) => (
              <Chip key={feature} label={feature} className="detail-spec-row" />
            ))}
          </Box>
        </Container>
      </PageReveal>

      <ImageLightbox
        images={gallery.length ? gallery : [heroImage]}
        initialIndex={lightboxIndex}
        open={lightboxOpen}
        onClose={() => setLightboxOpen(false)}
        onIndexChange={setActiveImage}
        alt={`${car.brandName} ${car.modelName} ${car.trim}`}
      />
    </>
  );
}
