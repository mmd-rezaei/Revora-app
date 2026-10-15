import BuildSharePage from "@/components/build/BuildSharePage";

export default function Page({ params }: { params: Promise<{ buildId: string }> }) {
  return <BuildSharePage params={params} />;
}
