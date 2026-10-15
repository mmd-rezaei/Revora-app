"use client";

import { useCallback, useEffect, useMemo, useRef, useState, type SyntheticEvent } from "react";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import Grid from "@mui/material/Grid";
import ToggleButton from "@mui/material/ToggleButton";
import ToggleButtonGroup from "@mui/material/ToggleButtonGroup";
import Drawer from "@mui/material/Drawer";
import Typography from "@mui/material/Typography";
import Alert from "@mui/material/Alert";
import useMediaQuery from "@mui/material/useMediaQuery";
import { useTheme } from "@mui/material/styles";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useRouter, useSearchParams } from "next/navigation";
import gsap from "gsap";
import PageLoader from "@/components/ui/PageLoader";
import PageReveal from "@/components/ui/PageReveal";
import RevoraButton from "@/components/ui/RevoraButton";
import { fetchCar } from "@/lib/api/cars";
import { createBuild, fetchBuild, fetchTuningParts, previewPerformance, updateBuild } from "@/lib/api/builds";
import { useBuildStore } from "@/store/buildStore";
import { calculateBuildStats } from "@/lib/tuning/calculateBuildStats";
import { getCar3DConfig } from "@/lib/tuning/car3DConfig";
import type { TuningTab } from "@/lib/tuning/types";
import { prefersReducedMotion, registerGsapPlugins } from "@/lib/gsap/gsapUtils";
import { revoraColors } from "@/theme/colors";
import CarViewer3D from "./CarViewer3D";
import TuningToolbar from "./TuningToolbar";
import BuildStats from "./BuildStats";
import BuildSummary from "./BuildSummary";
import SaveBuildDialog from "./SaveBuildDialog";
import ExteriorPanel from "./panels/ExteriorPanel";
import InteriorPanel from "./panels/InteriorPanel";
import PerformancePanel from "./panels/PerformancePanel";
import WheelSelector from "./panels/WheelSelector";
import PaintSelector from "./panels/PaintSelector";
import ConfigurationPanel from "./panels/ConfigurationPanel";
import "./TuningStudio.scss";

const TABS: { value: TuningTab; label: string }[] = [
  { value: "exterior", label: "Exterior" },
  { value: "interior", label: "Interior" },
  { value: "performance", label: "Performance" },
  { value: "wheels", label: "Wheels" },
  { value: "paint", label: "Paint" },
  { value: "configuration", label: "Config" },
];

type TuningStudioProps = {
  carId: string;
};

export default function TuningStudio({ carId }: TuningStudioProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const buildParam = searchParams.get("build");
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const panelRef = useRef<HTMLDivElement>(null);
  const driveOverlayRef = useRef<HTMLDivElement>(null);
  const prevCarRef = useRef<string | null>(null);
  const [saveOpen, setSaveOpen] = useState(false);
  const [mobileSheet, setMobileSheet] = useState(false);

  const {
    buildId,
    buildName,
    setBuildId,
    setBuildName,
    installedParts,
    togglePart,
    config,
    setConfig,
    vehicleConfig,
    setVehicleConfig,
    performance,
    scores,
    setPerformance,
    studioMode,
    setStudioMode,
    activeTab,
    setActiveTab,
    cameraPreset,
    setCameraPreset,
    load,
    reset,
  } = useBuildStore();

  const { data: car, isLoading, isError } = useQuery({
    queryKey: ["car", carId],
    queryFn: () => fetchCar(carId),
  });
  const { data: parts = [] } = useQuery({ queryKey: ["tuning-parts"], queryFn: fetchTuningParts });

  const { data: existingBuild, isLoading: loadingBuild } = useQuery({
    queryKey: ["build", buildParam],
    queryFn: () => fetchBuild(buildParam!),
    enabled: Boolean(buildParam),
  });

  useEffect(() => {
    if (!existingBuild) return;
    load({
      buildId: existingBuild.id,
      buildName: existingBuild.name,
      installedParts: (existingBuild.installedParts as { id: string }[]).map((p) =>
        typeof p === "string" ? p : p.id,
      ),
      config: existingBuild.config,
    });
    if (existingBuild.calculatedPerformance && existingBuild.scores) {
      setPerformance(existingBuild.calculatedPerformance, existingBuild.scores);
    }
  }, [existingBuild, load, setPerformance]);

  useEffect(() => {
    if (buildParam) return;
    if (prevCarRef.current && prevCarRef.current !== carId) reset();
    prevCarRef.current = carId;
  }, [carId, buildParam, reset]);

  useEffect(() => {
    if (car) {
      setVehicleConfig("drivetrain", car.driveType || "RWD");
      setVehicleConfig("transmission", car.transmission?.includes("Manual") ? "Manual" : "Automatic");
    }
  }, [car, setVehicleConfig]);

  const updatePreview = useCallback(async () => {
    const result = await previewPerformance({ carId, installedParts, config });
    setPerformance(result.calculatedPerformance, result.scores);
  }, [carId, installedParts, config, setPerformance]);

  useEffect(() => {
    updatePreview().catch(() => undefined);
  }, [updatePreview]);

  useEffect(() => {
    if (activeTab === "interior") setCameraPreset("interior");
  }, [activeTab, setCameraPreset]);

  useEffect(() => {
    if (!panelRef.current || prefersReducedMotion()) return;
    registerGsapPlugins();
    const ctx = gsap.context(() => {
      gsap.from(".tuning-panel", { y: 16, opacity: 0, duration: 0.5, ease: "power3.out" });
    }, panelRef);
    return () => ctx.revert();
  }, [activeTab]);

  useEffect(() => {
    if (studioMode !== "drive" || !driveOverlayRef.current || prefersReducedMotion()) return;
    gsap.fromTo(driveOverlayRef.current, { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.8, ease: "power3.out" });
  }, [studioMode]);

  const stats = useMemo(() => {
    if (!car) return null;
    return calculateBuildStats({
      car,
      parts,
      installedPartIds: installedParts,
      config,
      vehicleConfig,
      serverPerformance: performance,
      serverScores: scores,
    });
  }, [car, parts, installedParts, config, vehicleConfig, performance, scores]);

  const car3d = getCar3DConfig(carId, car?.slug, car?.bodyType);

  const saveMutation = useMutation({
    mutationFn: async () => {
      if (buildId) {
        return updateBuild(buildId, { name: buildName, installedParts, config });
      }
      return createBuild({ carId, name: buildName, installedParts, config });
    },
    onSuccess: (saved) => {
      setBuildId(saved.id);
      setSaveOpen(false);
      router.push("/garage");
    },
  });

  const handleTogglePart = (partId: string, exclusiveGroup?: string) => {
    togglePart(partId, exclusiveGroup, parts);
  };

  if (isLoading || loadingBuild) return <PageLoader />;
  if (isError || !car || !stats) {
    return (
      <Container sx={{ py: 6 }}>
        <Alert severity="error">Could not load this vehicle. Check the car ID and try again.</Alert>
      </Container>
    );
  }

  const carLabel = `${car.brandName} ${car.modelName}`;
  const panelContent = (
    <Box ref={panelRef}>
      {activeTab === "exterior" ? (
        <ExteriorPanel config={config} onChange={(g, k, v) => setConfig(g, k, v)} />
      ) : null}
      {activeTab === "interior" ? (
        <InteriorPanel config={config} onChange={(g, k, v) => setConfig(g, k, v)} />
      ) : null}
      {activeTab === "performance" ? (
        <PerformancePanel parts={parts} installedParts={installedParts} onToggle={handleTogglePart} />
      ) : null}
      {activeTab === "wheels" ? (
        <WheelSelector config={config} onChange={(g, k, v) => setConfig(g, k, v)} />
      ) : null}
      {activeTab === "paint" ? (
        <PaintSelector config={config} onChange={(k, v) => setConfig("exterior", k, v)} />
      ) : null}
      {activeTab === "configuration" ? (
        <ConfigurationPanel vehicleConfig={vehicleConfig} onChange={setVehicleConfig} />
      ) : null}
    </Box>
  );

  return (
    <PageReveal>
      <Container maxWidth="xl" className="tuning-studio" sx={{ py: { xs: 3, md: 4 } }}>
        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: 2, mb: 2 }}>
          <Box>
            <Typography variant="h4" className="page-child">
              {carLabel}
            </Typography>
            <Typography color="text.secondary" className="page-child">
              {car.trim} · {car.year}
            </Typography>
          </Box>
          {studioMode === "build" ? (
            <RevoraButton variant="contained" onClick={() => setSaveOpen(true)} aria-label="Save build">
              Save Build
            </RevoraButton>
          ) : null}
        </Box>

        <TuningToolbar
          studioMode={studioMode}
          cameraPreset={cameraPreset}
          onModeChange={setStudioMode}
          onCameraChange={setCameraPreset}
        />

        <Grid container spacing={3}>
          <Grid size={{ xs: 12, lg: 8 }}>
            <Box sx={{ position: "relative" }}>
              <CarViewer3D
                config={config}
                cameraPreset={cameraPreset}
                studioMode={studioMode}
                modelPath={car3d.modelPath}
                modelScale={car3d.modelScale}
                isGenericModel={car3d.isGenericModel}
                carLabel={carLabel}
              />
              {studioMode === "drive" ? (
                <Box
                  ref={driveOverlayRef}
                  className="drive-overlay"
                  sx={{
                    position: "absolute",
                    inset: 0,
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "flex-end",
                    p: 3,
                    pointerEvents: "none",
                    background: "linear-gradient(transparent 40%, rgba(9,18,32,0.85))",
                  }}
                >
                  <Typography variant="h4">{carLabel}</Typography>
                  <Typography variant="h6" color="primary">
                    {stats.calculatedPerformance.horsepower} HP · {stats.calculatedPerformance.torque} Nm
                  </Typography>
                  <Typography color="text.secondary">
                    {stats.calculatedPerformance.zeroToHundred}s · Score {stats.buildScore}
                  </Typography>
                </Box>
              ) : null}
            </Box>

            {studioMode === "build" ? (
              <>
                <ToggleButtonGroup
                  exclusive
                  size="small"
                  value={activeTab}
                  onChange={(_e: SyntheticEvent, v: TuningTab | null) => {
                    if (!v) return;
                    setActiveTab(v);
                    if (isMobile) setMobileSheet(true);
                  }}
                  sx={{ mt: 2, flexWrap: "wrap", gap: 0.5 }}
                  aria-label="Customization categories"
                >
                  {TABS.map((t) => (
                    <ToggleButton key={t.value} value={t.value}>
                      {t.label}
                    </ToggleButton>
                  ))}
                </ToggleButtonGroup>
                {!isMobile ? <Box sx={{ mt: 2 }}>{panelContent}</Box> : null}
              </>
            ) : null}
          </Grid>

          <Grid size={{ xs: 12, lg: 4 }}>
            <Box sx={{ display: "flex", flexDirection: "column", gap: 2, position: { lg: "sticky" }, top: "calc(var(--navbar-height) + 16px)" }}>
              <BuildStats stats={stats} />
              {studioMode === "build" ? <BuildSummary car={car} buildName={buildName} config={config} stats={stats} /> : null}
            </Box>
          </Grid>
        </Grid>

        <Drawer
          anchor="bottom"
          open={isMobile && mobileSheet && studioMode === "build"}
          onClose={() => setMobileSheet(false)}
          slotProps={{
            paper: {
              sx: {
                maxHeight: "70vh",
                bgcolor: revoraColors.paper,
                borderTop: `1px solid ${revoraColors.border}`,
              },
            },
          }}
        >
          <Box sx={{ p: 2, overflow: "auto" }}>{panelContent}</Box>
        </Drawer>

        <SaveBuildDialog
          open={saveOpen}
          buildName={buildName}
          saving={saveMutation.isPending}
          error={saveMutation.isError}
          onClose={() => setSaveOpen(false)}
          onNameChange={setBuildName}
          onSave={() => saveMutation.mutate()}
        />
      </Container>
    </PageReveal>
  );
}
