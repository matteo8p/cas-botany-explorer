"use client";

import Link from "next/link";
import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useQuery } from "convex/react";
import { api } from "../convex/_generated/api";
import { extractImageUrl } from "@/lib/utils";
import type { Doc } from "../convex/_generated/dataModel";

// Use the Doc type with the table name to get the correct type
type Plant = Doc<"botany">;

// Format date strings

export default function Home() {
  const plants = useQuery(api.botany.getPlants);

  const filteredPlants = plants ?? [];
  const renderCard = (plant: Plant) => {
    const imageUrl = extractImageUrl(plant.img, "1000");
    return (
      <Link href={`/plants/${plant._id}`} key={plant._id} className="group">
        <Card className="overflow-hidden h-full transition-all hover:shadow-md">
          <div className="relative aspect-square">
            {imageUrl && (
              <Image
                src={imageUrl}
                alt={plant.fullName}
                fill
                className="object-cover transition-transform group-hover:scale-105"
              />
            )}
          </div>
          <CardContent className="p-4">
            <h2 className="text-lg font-semibold italic">{plant.fullName}</h2>
            <p className="text-sm text-muted-foreground mb-2">{plant.family}</p>

            <div className="flex flex-wrap gap-1 mb-3">
              {plant.typeStatusName && (
                <Badge variant="secondary" className="text-xs">
                  {plant.typeStatusName}
                </Badge>
              )}
              <Badge variant="outline" className="text-xs">
                {plant.country}
              </Badge>
            </div>

            <div className="text-sm">
              <p className="truncate">
                {plant.localityName} {plant.state}
              </p>
              <p className="text-muted-foreground text-xs mt-1">
                Collected: {plant.startDate.toString()}
              </p>
            </div>
          </CardContent>
        </Card>
      </Link>
    );
  };

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold">Plant Collection</h1>
          <p className="text-muted-foreground">
            Browse through our botanical specimens
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {plants === undefined ? (
          // Loading state
          <p>Loading plants...</p>
        ) : (
          filteredPlants.map((plant) => renderCard(plant))
        )}
      </div>
    </div>
  );
}
