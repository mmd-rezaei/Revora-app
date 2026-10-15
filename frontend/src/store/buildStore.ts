import { create } from "zustand";
import type { BuildConfig, Performance, Scores } from "@/types";
import type { CameraPreset, StudioMode, TuningTab, VehicleConfiguration } from "@/lib/tuning/types";
import { defaultVehicleConfig } from "@/config/tuningOptions";

export const defaultConfig: BuildConfig = {
  exterior: {
    paintColor: "Alpine White",
    paintFinish: "gloss",
    customPaintHex: "",
    bodyKit: "Stock",
    frontBumper: "Stock",
    rearDiffuser: "Stock",
    spoiler: "None",
    hood: "Stock",
    sideSkirts: "Stock",
    mirrors: "Body Color",
    grille: "Stock",
    exhaustTips: "Stock",
    headlights: "OEM",
    taillights: "OEM",
  },
  wheels: {
    design: "Stock",
    size: '19"',
    width: "8.5J",
    offset: "ET40",
    finish: "Silver",
    tireType: "All-Season",
    caliperColor: "Red",
    brakePackage: "Standard",
  },
  interior: {
    color: "Black",
    seats: "OEM",
    seatMaterial: "Leather",
    trim: "Aluminum",
    steeringWheel: "OEM",
    dashboard: "OEM",
    headliner: "Standard",
    seatBelts: "Standard",
    floorMats: "Standard",
    ambientLighting: "Off",
  },
};

type BuildState = {
  buildId: string | null;
  buildName: string;
  installedParts: string[];
  config: BuildConfig;
  vehicleConfig: VehicleConfiguration;
  performance: Performance | null;
  scores: Scores | null;
  studioMode: StudioMode;
  activeTab: TuningTab;
  cameraPreset: CameraPreset;
  setBuildId: (id: string | null) => void;
  setBuildName: (name: string) => void;
  setConfig: (group: keyof BuildConfig, key: string, value: string) => void;
  setVehicleConfig: (key: keyof VehicleConfiguration, value: string) => void;
  togglePart: (id: string, exclusiveGroup?: string | null, allParts?: { id: string; exclusiveGroup: string | null }[]) => void;
  setPerformance: (performance: Performance, scores: Scores) => void;
  setStudioMode: (mode: StudioMode) => void;
  setActiveTab: (tab: TuningTab) => void;
  setCameraPreset: (preset: CameraPreset) => void;
  reset: () => void;
  load: (payload: Partial<Pick<BuildState, "buildId" | "buildName" | "installedParts" | "config" | "vehicleConfig">>) => void;
  duplicate: () => void;
};

export const useBuildStore = create<BuildState>((set, get) => ({
  buildId: null,
  buildName: "Street Build",
  installedParts: [],
  config: defaultConfig,
  vehicleConfig: defaultVehicleConfig,
  performance: null,
  scores: null,
  studioMode: "build",
  activeTab: "exterior",
  cameraPreset: "orbit",
  setBuildId: (buildId) => set({ buildId }),
  setBuildName: (buildName) => set({ buildName }),
  setConfig: (group, key, value) =>
    set({
      config: {
        ...get().config,
        [group]: { ...get().config[group], [key]: value },
      },
    }),
  setVehicleConfig: (key, value) =>
    set({
      vehicleConfig: { ...get().vehicleConfig, [key]: value },
    }),
  togglePart: (id, exclusiveGroup, allParts = []) => {
    const current = get().installedParts;
    if (current.includes(id)) {
      set({ installedParts: current.filter((item) => item !== id) });
      return;
    }
    let next = [...current, id];
    if (exclusiveGroup) {
      const rivals = allParts
        .filter((part) => part.exclusiveGroup === exclusiveGroup && part.id !== id)
        .map((part) => part.id);
      next = next.filter((item) => !rivals.includes(item));
    }
    set({ installedParts: next });
  },
  setPerformance: (performance, scores) => set({ performance, scores }),
  setStudioMode: (studioMode) => set({ studioMode }),
  setActiveTab: (activeTab) => set({ activeTab }),
  setCameraPreset: (cameraPreset) => set({ cameraPreset }),
  reset: () =>
    set({
      buildId: null,
      buildName: "Street Build",
      installedParts: [],
      config: defaultConfig,
      vehicleConfig: defaultVehicleConfig,
      performance: null,
      scores: null,
      studioMode: "build",
      activeTab: "exterior",
      cameraPreset: "orbit",
    }),
  load: (payload) =>
    set({
      ...payload,
      config: payload.config ? { ...defaultConfig, ...payload.config, exterior: { ...defaultConfig.exterior, ...payload.config.exterior }, wheels: { ...defaultConfig.wheels, ...payload.config.wheels }, interior: { ...defaultConfig.interior, ...payload.config.interior } } : get().config,
      vehicleConfig: payload.vehicleConfig || defaultVehicleConfig,
    }),
  duplicate: () => set({ buildId: null, buildName: `${get().buildName} Copy` }),
}));
