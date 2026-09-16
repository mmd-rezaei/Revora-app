import type { Metadata } from "next";
import StudioHubPage from "@/components/studio/StudioHubPage";

export const metadata: Metadata = { title: "Tune" };

export default function Page() {
  return (
    <StudioHubPage
      title="Tuning Studio"
      subtitle="Pick a machine, bolt on parts, and watch the numbers move."
      actionPath="tune"
      emptyHint="No cars available to tune yet. Start from the catalog."
    />
  );
}
