import ConfigurePage from "@/components/configure/ConfigurePage";

export default function Page({ params }: { params: Promise<{ carId: string }> }) {
  return <ConfigurePage params={params} />;
}
