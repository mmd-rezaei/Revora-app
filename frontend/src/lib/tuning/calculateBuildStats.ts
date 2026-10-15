import type { CalculateBuildInput } from "./types";
import type { BuildStatsResult } from "./types";
import { analyzeBuildCompatibility } from "./buildWarnings";

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}

function downforceFromConfig(config: CalculateBuildInput["config"]): number {
  let df = 0;
  const ext = config.exterior || {};
  if (ext.spoiler && ext.spoiler !== "None") df += ext.spoiler.includes("Wing") ? 12 : 6;
  if (ext.rearDiffuser && ext.rearDiffuser !== "Stock") df += 8;
  if (ext.frontBumper?.includes("Splitter")) df += 5;
  if (ext.bodyKit && ext.bodyKit !== "Stock") df += 4;
  return df;
}

function applyVehicleConfigEffects(
  perf: CalculateBuildInput["serverPerformance"],
  vehicleConfig: CalculateBuildInput["vehicleConfig"],
) {
  if (!perf) return perf;
  const next = { ...perf };
  let handling = next.handling;
  let braking = next.braking;
  let weight = next.weight;
  let zero = next.zeroToHundred;
  const top = next.topSpeed;

  switch (vehicleConfig.suspension) {
    case "Sport":
      handling += 6;
      zero -= 0.05;
      break;
    case "Track":
      handling += 12;
      zero -= 0.12;
      break;
    default:
      break;
  }

  switch (vehicleConfig.brakes) {
    case "Sport":
      braking += 8;
      zero -= 0.03;
      break;
    case "Carbon Ceramic":
      braking += 18;
      weight -= 8;
      zero -= 0.06;
      break;
    default:
      break;
  }

  switch (vehicleConfig.drivetrain) {
    case "AWD":
      handling += 5;
      weight += 45;
      zero -= 0.15;
      break;
    case "RWD":
      handling += 2;
      break;
    default:
      break;
  }

  if (vehicleConfig.transmission === "Manual") handling += 2;
  if (vehicleConfig.transmission === "DCT") zero -= 0.08;

  next.handling = clamp(Math.round(handling), 1, 100);
  next.braking = clamp(Math.round(braking), 1, 100);
  next.weight = clamp(Math.round(weight), 600, 4000);
  next.zeroToHundred = clamp(Math.round(zero * 100) / 100, 1.6, 20);
  next.topSpeed = clamp(Math.round(top), 80, 520);
  return next;
}

export function calculateBuildStats(input: CalculateBuildInput): BuildStatsResult {
  const installed = input.parts.filter((p) => input.installedPartIds.includes(p.id));
  const basePerf = input.serverPerformance || {
    horsepower: input.car.horsepower,
    torque: input.car.torque,
    zeroToHundred: input.car.zeroToHundred,
    topSpeed: input.car.topSpeed,
    weight: input.car.weight,
    handling: 68,
    braking: 68,
    reliability: 86,
  };
  const baseScores = input.serverScores || {
    performance: 50,
    handling: 68,
    braking: 68,
    style: 62,
    overall: 60,
  };

  const perfWithVehicle = applyVehicleConfigEffects(basePerf, input.vehicleConfig)!;
  const downforce = downforceFromConfig(input.config);
  const aeroScore = clamp(Math.round(50 + downforce * 2.5), 1, 100);
  const balance = clamp(
    Math.round(
      (perfWithVehicle.handling + perfWithVehicle.braking + perfWithVehicle.reliability) / 3 -
        Math.abs(perfWithVehicle.horsepower - input.car.horsepower) * 0.02,
    ),
    1,
    100,
  );

  const buildScore = clamp(
    Math.round(
      baseScores.performance * 0.28 +
        perfWithVehicle.handling * 0.22 +
        perfWithVehicle.braking * 0.18 +
        aeroScore * 0.12 +
        baseScores.style * 0.1 +
        balance * 0.1,
    ),
    1,
    100,
  );

  const warnings = analyzeBuildCompatibility(
    input.car,
    installed,
    input.config,
    input.vehicleConfig,
    perfWithVehicle,
  );

  return {
    calculatedPerformance: { ...perfWithVehicle, downforce },
    scores: {
      ...baseScores,
      aero: aeroScore,
      balance,
      overall: buildScore,
    },
    warnings: warnings.filter((w) => w.type === "warning"),
    recommendations: warnings.filter((w) => w.type === "recommendation"),
    buildScore,
  };
}
