"use client";

import { Suspense } from "react";
import type { BuildConfig } from "@/types";
import GlbCarModel from "./GlbCarModel";
import ProceduralCarMesh from "./ProceduralCarMesh";

type CarModelProps = {
  config: BuildConfig;
  driveSpin?: boolean;
  modelPath?: string;
  modelScale?: number;
};

function CarModelInner({ config, driveSpin, modelPath, modelScale = 1 }: CarModelProps) {
  if (modelPath) {
    return (
      <GlbCarModel
        modelPath={modelPath}
        config={config}
        driveSpin={driveSpin}
        scale={modelScale}
      />
    );
  }

  return <ProceduralCarMesh config={config} driveSpin={driveSpin} />;
}

export default function CarModel(props: CarModelProps) {
  return (
    <Suspense fallback={null}>
      <CarModelInner {...props} />
    </Suspense>
  );
}
