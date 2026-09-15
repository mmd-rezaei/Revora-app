import TunePage from "@/components/tune/TunePage";

export default function Page({ params }: { params: Promise<{ carId: string }> }) {
  return <TunePage params={params} />;
}
