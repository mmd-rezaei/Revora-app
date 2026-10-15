"use client";

import OptionSelectPanel from "./OptionSelectPanel";
import type { BuildConfig } from "@/types";
import { wheelStudioOptions } from "@/config/tuningOptions";

const wheelFields = [
  { key: "design", label: "Wheel design", options: wheelStudioOptions.design },
  { key: "size", label: "Size", options: wheelStudioOptions.size },
  { key: "width", label: "Width", options: wheelStudioOptions.width },
  { key: "offset", label: "Offset", options: wheelStudioOptions.offset },
  { key: "finish", label: "Finish", options: wheelStudioOptions.finish },
  { key: "tireType", label: "Tire type", options: wheelStudioOptions.tireType },
  { key: "caliperColor", label: "Caliper color", options: wheelStudioOptions.caliperColor },
  { key: "brakePackage", label: "Brake package", options: wheelStudioOptions.brakePackage },
] as const;

type WheelSelectorProps = {
  config: BuildConfig;
  onChange: (group: "wheels", key: string, value: string) => void;
};

export default function WheelSelector({ config, onChange }: WheelSelectorProps) {
  return (
    <OptionSelectPanel
      title="Wheel Studio"
      group="wheels"
      fields={wheelFields}
      values={config.wheels}
      onChange={(_g, k, v) => onChange("wheels", k, v)}
    />
  );
}
