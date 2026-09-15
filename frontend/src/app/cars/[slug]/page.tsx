import CarDetailPage from "@/components/cars/CarDetailPage";

export default function Page({ params }: { params: Promise<{ slug: string }> }) {
  return <CarDetailPage params={params} />;
}
