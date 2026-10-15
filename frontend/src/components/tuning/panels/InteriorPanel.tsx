"use client";

import OptionSelectPanel from "./OptionSelectPanel";
import type { BuildConfig } from "@/types";
import { interiorCategories } from "@/config/tuningOptions";

type InteriorPanelProps = {
  config: BuildConfig;
  onChange: (group: "interior", key: string, value: string) => void;
  onInteriorCamera?: () => void;
};

export default function InteriorPanel({ config, onChange }: InteriorPanelProps) {
  return (
    <OptionSelectPanel
      title="Interior"
      group="interior"
      fields={interiorCategories}
      values={config.interior}
      onChange={(_g, k, v) => onChange("interior", k, v)}
    />
  );
}
