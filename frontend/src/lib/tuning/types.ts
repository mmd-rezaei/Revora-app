import type { BuildConfig, Car, Performance, Scores, TuningPart } from "@/types";

export type StudioMode = "build" | "inspect" | "drive";

export type CameraPreset =
  | "orbit"
  | "front"
  | "rear"
  | "side"
  | "top"
  | "interior";

export type TuningTab =
  | "exterior"
  | "interior"
  | "performance"
  | "wheels"
  | "paint"
  | "configuration";

export type PaintFinish = "gloss" | "matte" | "metallic" | "pearl";

export type VehicleConfiguration = {
  aspiration: string;
  transmission: string;
  drivetrain: string;
  suspension: string;
  brakes: string;
};

export type BuildWarning = {
  type: "warning";
  severity: "low" | "medium" | "high";
  title: string;
  message: string;
};

export type BuildRecommendation = {
  type: "recommendation";
  severity: "low" | "medium";
  title: string;
  message: string;
};

export type BuildInsight = BuildWarning | BuildRecommendation;

export type ExtendedPerformance = Performance & {
  downforce?: number;
};

export type ExtendedScores = Scores & {
  aero?: number;
  balance?: number;
};

export type BuildStatsResult = {
  calculatedPerformance: ExtendedPerformance;
  scores: ExtendedScores;
  warnings: BuildWarning[];
  recommendations: BuildRecommendation[];
  buildScore: number;
};

export type ExteriorPartDef = {
  id: string;
  name: string;
  category: string;
  configKey: string;
  performanceEffects?: Partial<Record<keyof Performance | "downforce", number>>;
};

export type Car3DConfig = {
  carId: string;
  slug?: string;
  modelPath?: string;
  hasModel: boolean;
  fallbackScale?: number;
};

export type TuningStateSlice = {
  buildName: string;
  installedParts: string[];
  config: BuildConfig;
  vehicleConfig: VehicleConfiguration;
  studioMode: StudioMode;
  activeTab: TuningTab;
  cameraPreset: CameraPreset;
};

export type CalculateBuildInput = {
  car: Car;
  parts: TuningPart[];
  installedPartIds: string[];
  config: BuildConfig;
  vehicleConfig: VehicleConfiguration;
  serverPerformance?: Performance | null;
  serverScores?: Scores | null;
};
