"use client";
import PlantDetail from "@/app/components/plant-detail";
import { useParams } from "next/navigation";

export default function PlantPage() {
  const params = useParams();

  return (
    <main className="min-h-screen bg-background">
      <PlantDetail id={params.id as string} />
    </main>
  );
}
