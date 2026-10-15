"use client";

import { Suspense, use } from "react";
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import PageLoader from "@/components/ui/PageLoader";
import TuningStudio from "@/components/tuning/TuningStudio";

function TunePageContent({ carId }: { carId: string }) {
  return (
    <Suspense fallback={<PageLoader />}>
      <TuningStudio carId={carId} />
    </Suspense>
  );
}

export default function TunePage({ params }: { params: Promise<{ carId: string }> }) {
  const { carId } = use(params);
  return (
    <ProtectedRoute>
      <TunePageContent carId={carId} />
    </ProtectedRoute>
  );
}
