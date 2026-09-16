"use client";

import { use, useEffect, useRef, useState } from "react";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import ToggleButton from "@mui/material/ToggleButton";
import ToggleButtonGroup from "@mui/material/ToggleButtonGroup";
import Drawer from "@mui/material/Drawer";
import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
import Image from "next/image";
import gsap from "gsap";
import RevoraButton from "@/components/ui/RevoraButton";
import PageLoader from "@/components/ui/PageLoader";
import PageReveal from "@/components/ui/PageReveal";
import { fetchCar } from "@/lib/api/cars";
import { useBuildStore } from "@/store/buildStore";
import { exteriorOptions, wheelOptions, interiorOptions, paintColors } from "@/config/configuratorOptions";
import { prefersReducedMotion, registerGsapPlugins } from "@/lib/gsap/gsapUtils";
import { pulseElement } from "@/lib/gsap/presets";
import { revoraColors } from "@/theme/colors";

const categories = [
  { label: "Exterior", options: exteriorOptions, key: "exterior" as const },
  { label: "Wheels", options: wheelOptions, key: "wheels" as const },
  { label: "Interior", options: interiorOptions, key: "interior" as const },
];

export default function ConfigurePage({ params }: { params: Promise<{ carId: string }> }) {
  const { carId } = use(params);
  const [tab, setTab] = useState(0);
  const [sheet, setSheet] = useState(false);
  const { config, setConfig } = useBuildStore();
  const previewRef = useRef<HTMLDivElement>(null);
  const paintRef = useRef<HTMLDivElement>(null);
  const optionsRef = useRef<HTMLDivElement>(null);
  const rootRef = useRef<HTMLDivElement>(null);
  const { data: car, isLoading } = useQuery({ queryKey: ["car", carId], queryFn: () => fetchCar(carId) });

  useEffect(() => {
    if (!rootRef.current || prefersReducedMotion()) return;
    registerGsapPlugins();
    const ctx = gsap.context(() => {
      gsap.from(".config-preview", { scale: 0.96, opacity: 0, duration: 0.9, ease: "power3.out" });
      gsap.from(".config-panel", { x: 40, opacity: 0, duration: 0.75, ease: "power3.out", delay: 0.15 });
    }, rootRef);
    return () => ctx.revert();
  }, [car]);

  useEffect(() => {
    if (prefersReducedMotion()) return;
    const preview = previewRef.current;
    const paint = paintRef.current;
    if (!preview) return;

    const tl = gsap.timeline({ defaults: { ease: "power2.out" } });
    tl.fromTo(preview, { scale: 0.97, x: 8 }, { scale: 1, x: 0, duration: 0.45 })
      .fromTo(preview, { filter: "brightness(0.85)" }, { filter: "brightness(1)", duration: 0.35 }, 0);
    if (paint) {
      tl.fromTo(paint, { opacity: 0.15 }, { opacity: 0.45, duration: 0.5 }, 0);
    }
    return () => {
      tl.kill();
    };
  }, [config]);

  useEffect(() => {
    if (!optionsRef.current || prefersReducedMotion()) return;
    gsap.from(optionsRef.current.querySelectorAll(".MuiToggleButton-root"), {
      y: 12,
      opacity: 0,
      duration: 0.4,
      stagger: 0.04,
      ease: "power2.out",
    });
  }, [tab]);

  if (isLoading || !car) return <PageLoader />;

  const current = categories[tab];
  const paint = config.exterior.paintColor || "Alpine White";

  const handleConfigChange = (category: typeof current.key, key: string, value: string) => {
    setConfig(category, key, value);
    if (!prefersReducedMotion() && optionsRef.current) {
      const active = optionsRef.current.querySelector(".Mui-selected");
      if (active instanceof HTMLElement) pulseElement(active);
    }
  };

  const optionsPanel = (
    <Box ref={optionsRef} className="config-panel">
      <Tabs value={tab} onChange={(_, value) => setTab(value)} sx={{ mb: 3 }} variant="scrollable">
        {categories.map((item) => (
          <Tab key={item.label} label={item.label} />
        ))}
      </Tabs>
      {Object.entries(current.options).map(([key, values]) => (
        <Box key={key} sx={{ mb: 3 }}>
          <Typography variant="overline" color="text.secondary">{key}</Typography>
          <ToggleButtonGroup
            exclusive
            value={config[current.key][key]}
            onChange={(_, value) => value && handleConfigChange(current.key, key, value)}
            sx={{ display: "flex", flexWrap: "wrap", gap: 1, mt: 1 }}
          >
            {values.map((value) => (
              <ToggleButton
                key={value}
                value={value}
                sx={{
                  border: `1px solid ${revoraColors.border} !important`,
                  textTransform: "none",
                  "&.Mui-selected": {
                    borderColor: `${revoraColors.borderHover} !important`,
                    bgcolor: "rgba(225, 29, 46, 0.08) !important",
                  },
                }}
              >
                {key === "paintColor" ? (
                  <Box sx={{ width: 14, height: 14, borderRadius: "50%", bgcolor: paintColors[value], mr: 1, border: "1px solid rgba(255,255,255,0.3)" }} />
                ) : null}
                {value}
              </ToggleButton>
            ))}
          </ToggleButtonGroup>
        </Box>
      ))}
    </Box>
  );

  return (
    <PageReveal>
      <Container maxWidth="lg" sx={{ py: { xs: 4, md: 5 }, pt: { xs: 3, md: 4 } }} ref={rootRef}>
        <Typography variant="h3" className="page-child">Configurator</Typography>
        <Typography color="text.secondary" sx={{ mb: 4 }} className="page-child">
          {car.brandName} {car.modelName} {car.trim}
        </Typography>
        <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", md: "1.1fr 0.9fr" }, gap: 4 }}>
          <Box
            ref={previewRef}
            className="config-preview page-child"
            sx={{ position: "relative", minHeight: { xs: 260, md: 480 }, overflow: "hidden", bgcolor: revoraColors.elevated }}
          >
            <Image src={car.images[0] || "/next.svg"} alt={car.modelName} fill sizes="(max-width: 900px) 100vw, 55vw" style={{ objectFit: "cover" }} />
            <Box
              ref={paintRef}
              sx={{ position: "absolute", inset: 0, backgroundColor: paintColors[paint], mixBlendMode: "soft-light", opacity: 0.45 }}
            />
            <Box sx={{ position: "absolute", bottom: 16, left: 16, bgcolor: "rgba(12, 24, 41, 0.78)", px: 2, py: 1 }}>
              <Typography variant="caption">{config.exterior.bodyKit} · {config.wheels.design} · {config.interior.seats}</Typography>
            </Box>
          </Box>
          <Box
            sx={{
              display: { xs: "none", md: "block" },
              p: 2.5,
              border: `1px solid ${revoraColors.border}`,
              bgcolor: revoraColors.paper,
              borderRadius: 1,
              alignSelf: "start",
              position: "sticky",
              top: "calc(var(--navbar-height) + 16px)",
            }}
          >
            {optionsPanel}
          </Box>
        </Box>
        <Box sx={{ display: "flex", justifyContent: "space-between", mt: 4, gap: 2 }} className="page-child">
          <RevoraButton variant="outlined" onClick={() => setSheet(true)} sx={{ display: { md: "none" } }}>
            Options
          </RevoraButton>
          <RevoraButton component={Link} href={`/tune/${car.id}`} variant="contained" sx={{ ml: "auto" }}>
            Continue to Tune
          </RevoraButton>
        </Box>
        <Drawer anchor="bottom" open={sheet} onClose={() => setSheet(false)}>
          <Box sx={{ p: 3, maxHeight: "80vh", overflow: "auto" }}>{optionsPanel}</Box>
        </Drawer>
      </Container>
    </PageReveal>
  );
}
