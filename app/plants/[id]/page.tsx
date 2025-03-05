import PlantDetail from "@/app/components/plant-detail";

interface PlantPageProps {
  params: {
    id: string;
  };
}

export default function PlantPage({ params }: PlantPageProps) {
  const { id } = params;

  return (
    <main className="min-h-screen bg-background">
      <PlantDetail id={id} />
    </main>
  );
}
