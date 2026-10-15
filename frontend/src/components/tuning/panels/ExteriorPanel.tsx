"use client";

import OptionSelectPanel from "./OptionSelectPanel";
import type { BuildConfig } from "@/types";
import { exteriorCategories } from "@/config/tuningOptions";

type ExteriorPanelProps = {
  config: BuildConfig;
  onChange: (group: "exterior", key: string, value: string) => void;
};

export default function ExteriorPanel({ config, onChange }: ExteriorPanelProps) {
  return (
    <OptionSelectPanel
      title="Exterior"
      group="exterior"
      fields={exteriorCategories}
      values={config.exterior}
      onChange={(_g, k, v) => onChange("exterior", k, v)}
    />
  );
}
