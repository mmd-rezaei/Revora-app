"use client";

import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Chip from "@mui/material/Chip";
import type { TuningPart } from "@/types";
import { performanceCategoryLabels } from "@/config/tuningOptions";
import { specFont } from "@/theme/revoraTheme";
import { pulseElement } from "@/lib/gsap/presets";
import { prefersReducedMotion } from "@/lib/gsap/gsapUtils";

type PerformancePanelProps = {
  parts: TuningPart[];
  installedParts: string[];
  onToggle: (partId: string, exclusiveGroup?: string) => void;
};

export default function PerformancePanel({ parts, installedParts, onToggle }: PerformancePanelProps) {
  const categories = [...new Set(parts.map((p) => p.category))];

  const handleToggle = (part: TuningPart) => {
    onToggle(part.id, part.exclusiveGroup ?? undefined);
    if (!prefersReducedMotion()) {
      const chip = document.querySelector(`[data-part-id="${part.id}"]`);
      if (chip instanceof HTMLElement) pulseElement(chip, 1.08);
    }
  };

  return (
    <Box className="tuning-panel">
      <Typography variant="overline" sx={{ display: "block", mb: 2 }}>
        Performance Upgrades
      </Typography>
      {categories.map((category) => (
        <Box key={category} className="tune-category" sx={{ mb: 2.5 }}>
          <Typography variant="caption" color="text.secondary">
            {performanceCategoryLabels[category] || category}
          </Typography>
          <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1, mt: 1 }}>
            {parts
              .filter((p) => p.category === category)
              .map((part) => {
                const active = installedParts.includes(part.id);
                const hp = part.effects.horsepower;
                const label = hp ? `${part.name} +${hp} HP` : part.name;
                return (
                  <Chip
                    key={part.id}
                    data-part-id={part.id}
                    label={label}
                    onClick={() => handleToggle(part)}
                    color={active ? "primary" : "default"}
                    variant={active ? "filled" : "outlined"}
                    sx={{ fontFamily: specFont }}
                    aria-pressed={active}
                  />
                );
              })}
          </Box>
        </Box>
      ))}
    </Box>
  );
}
