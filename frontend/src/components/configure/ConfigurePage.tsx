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
import { fetchCar } from "@/lib/api/cars";
import { useBuildStore } from "@/store/buildStore";
import { exteriorOptions, wheelOptions, interiorOptions, paintColors } from "@/config/configuratorOptions";

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
  const { data: car, isLoading } = useQuery({ queryKey: ["car", carId], queryFn: () => fetchCar(carId) });

  useEffect(() => {
    if (!previewRef.current || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    gsap.fromTo(previewRef.current, { opacity: 0.7, scale: 0.98 }, { opacity: 1, scale: 1, duration: 0.35, ease: "power2.out" });
  }, [config]);

  if (isLoading || !car) return <PageLoader />;

  const current = categories[tab];
  const paint = config.exterior.paintColor || "Alpine White";

  const optionsPanel = (
    <Box>
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
            onChange={(_, value) => value && setConfig(current.key, key, value)}
            sx={{ display: "flex", flexWrap: "wrap", gap: 1, mt: 1 }}
          >
            {values.map((value) => (
              <ToggleButton key={value} value={value} sx={{ border: "1px solid rgba(244,241,234,0.12) !important", textTransform: "none" }}>
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
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h3">Configurator</Typography>
      <Typography color="text.secondary" sx={{ mb: 4 }}>
        {car.brandName} {car.modelName} {car.trim}
      </Typography>
      <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", md: "1.1fr 0.9fr" }, gap: 4 }}>
        <Box ref={previewRef} sx={{ position: "relative", minHeight: { xs: 260, md: 480 }, overflow: "hidden", bgcolor: "#111" }}>
          <Image src={car.images[0] || "/next.svg"} alt={car.modelName} fill sizes="(max-width: 900px) 100vw, 55vw" style={{ objectFit: "cover" }} />
          <Box sx={{ position: "absolute", inset: 0, backgroundColor: paintColors[paint], mixBlendMode: "soft-light", opacity: 0.45 }} />
          <Box sx={{ position: "absolute", bottom: 16, left: 16, bgcolor: "rgba(5,5,6,0.72)", px: 2, py: 1 }}>
            <Typography variant="caption">{config.exterior.bodyKit} · {config.wheels.design} · {config.interior.seats}</Typography>
          </Box>
        </Box>
        <Box sx={{ display: { xs: "none", md: "block" } }}>{optionsPanel}</Box>
      </Box>
      <Box sx={{ display: "flex", justifyContent: "space-between", mt: 4, gap: 2 }}>
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
  );
}
