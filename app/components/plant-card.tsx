"use client";

import Link from "next/link";
import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { extractImageUrl } from "@/lib/utils";
import type { Doc } from "../../convex/_generated/dataModel";

type Plant = Doc<"botany">;

interface PlantCardProps {
  plant: Plant;
}

export function PlantCard({ plant }: PlantCardProps) {
  const imageUrl = extractImageUrl(plant.img, "1000");

  return (
    <Link href={`/plants/${plant._id}`} className="group block h-full">
      <Card className="overflow-hidden h-full transition-all hover:shadow-lg duration-300 border-none">
        <div className="relative aspect-square bg-muted/10">
          {imageUrl && (
            <Image
              src={imageUrl}
              alt={plant.fullName}
              fill
              className="object-cover transition-transform duration-300 group-hover:scale-105"
            />
          )}
        </div>
        <CardContent className="p-6">
          <h2 className="text-lg font-light italic tracking-tight mb-1">
            {plant.fullName}
          </h2>
          <p className="text-sm text-muted-foreground mb-3">{plant.family}</p>

          <div className="flex flex-wrap gap-2 mb-4">
            {plant.typeStatusName && (
              <Badge
                variant="secondary"
                className="text-xs bg-primary/10 text-primary hover:bg-primary/20"
              >
                {plant.typeStatusName}
              </Badge>
            )}
            <Badge
              variant="outline"
              className="text-xs bg-white/50 backdrop-blur-sm hover:bg-muted/50"
            >
              {plant.country}
            </Badge>
          </div>

          <div className="space-y-2">
            <p className="truncate text-sm">
              {plant.localityName} {plant.state}
            </p>
            <p className="text-muted-foreground text-xs">
              Collected: {plant.startDate.toString()}
            </p>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
