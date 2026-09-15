import { create } from "zustand";
import type { BuildConfig, Performance, Scores } from "@/types";

export const defaultConfig: BuildConfig = {
  exterior: {
    paintColor: "Alpine White",
    bodyKit: "Stock",
    frontBumper: "Stock",
    rearDiffuser: "Stock",
    spoiler: "None",
    hood: "Stock",
    mirrors: "Body Color",
    exhaustTips: "Stock",
  },
  wheels: {
    design: "Stock",
    size: '19"',
    tireType: "All-Season",
    caliperColor: "Red",
  },
  interior: {
    color: "Black",
    seats: "Standard",
    trim: "Aluminum",
    steeringWheel: "Standard",
    ambientLighting: "Off",
  },
};

type BuildState = {
  buildName: string;
  installedParts: string[];
  config: BuildConfig;
  performance: Performance | null;
  scores: Scores | null;
  setBuildName: (name: string) => void;
  setConfig: (group: keyof BuildConfig, key: string, value: string) => void;
  togglePart: (id: string, exclusiveGroup?: string | null, allParts?: { id: string; exclusiveGroup: string | null }[]) => void;
  setPerformance: (performance: Performance, scores: Scores) => void;
  reset: () => void;
  load: (payload: Partial<Pick<BuildState, "buildName" | "installedParts" | "config">>) => void;
};

export const useBuildStore = create<BuildState>((set, get) => ({
  buildName: "Street Build",
  installedParts: [],
  config: defaultConfig,
  performance: null,
  scores: null,
  setBuildName: (buildName) => set({ buildName }),
  setConfig: (group, key, value) =>
    set({
      config: {
        ...get().config,
        [group]: { ...get().config[group], [key]: value },
      },
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
  reset: () =>
    set({
      buildName: "Street Build",
      installedParts: [],
      config: defaultConfig,
      performance: null,
      scores: null,
    }),
  load: (payload) => set(payload),
}));
