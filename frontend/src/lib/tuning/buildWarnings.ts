import type { BuildConfig, Car, Performance, TuningPart } from "@/types";
import type { BuildInsight, VehicleConfiguration } from "./types";

function hasCategory(parts: TuningPart[], categories: string[]): boolean {
  return parts.some((p) => categories.includes(p.category));
}

function totalHpGain(parts: TuningPart[]): number {
  return parts.reduce((sum, p) => sum + (p.effects.horsepower || 0), 0);
}

export function analyzeBuildCompatibility(
  car: Car,
  installedParts: TuningPart[],
  config: BuildConfig,
  vehicleConfig: VehicleConfiguration,
  performance: Performance,
): BuildInsight[] {
  const insights: BuildInsight[] = [];
  const hpGain = totalHpGain(installedParts);
  const hasTurbo = hasCategory(installedParts, ["turbo", "supercharger"]);
  const hasCooling = hasCategory(installedParts, ["cooling"]);
  const hasIntercooler = installedParts.some((p) => p.category === "intercooler");
  const hasTrackTires = config.wheels?.tireType === "Track Semi-Slick";
  const comfortSuspension = vehicleConfig.suspension === "Comfort";
  const stockBrakes = vehicleConfig.brakes === "Standard";

  if (hpGain >= 80 && !hasCooling) {
    insights.push({
      type: "warning",
      severity: "medium",
      title: "Cooling limitation",
      message: "Current cooling hardware may be insufficient for this power level.",
    });
  }

  if (hasTurbo && !hasIntercooler && hpGain >= 50) {
    insights.push({
      type: "warning",
      severity: "medium",
      title: "Intercooler recommended",
      message: "Forced induction without an upgraded intercooler may cause heat soak.",
    });
  }

  if (performance.horsepower >= 600 && stockBrakes) {
    insights.push({
      type: "warning",
      severity: "high",
      title: "Brake upgrade advised",
      message: `${performance.horsepower} HP exceeds safe capacity for standard brakes.`,
    });
  }

  if (hasTrackTires && comfortSuspension) {
    insights.push({
      type: "recommendation",
      severity: "medium",
      title: "Suspension mismatch",
      message: "Track tires pair best with Sport or Track suspension for balanced grip.",
    });
  }

  if (vehicleConfig.drivetrain === "FWD" && performance.horsepower >= 400) {
    insights.push({
      type: "warning",
      severity: "low",
      title: "Traction limited",
      message: "High power on FWD may cause wheel spin — consider AWD or traction upgrades.",
    });
  }

  if (config.wheels?.size === '22"' && Number(car.weight) > 1800) {
    insights.push({
      type: "recommendation",
      severity: "low",
      title: "Wheel weight",
      message: "Large wheels add unsprung mass — acceleration and ride may be affected.",
    });
  }

  return insights;
}
