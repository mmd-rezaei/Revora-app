import type { Metadata } from "next";
import StudioHubPage from "@/components/studio/StudioHubPage";

export const metadata: Metadata = { title: "Configure" };

export default function Page() {
  return (
    <StudioHubPage
      title="Configurator"
      subtitle="Choose a car, then dial in exterior, wheels, and interior."
      actionPath="configure"
      emptyHint="No cars in the catalog yet. Browse the garage when vehicles are available."
    />
  );
}
