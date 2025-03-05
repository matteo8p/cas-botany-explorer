"use client";

import Image from "next/image";
import {
  MapPin,
  Calendar,
  Users,
  Tag,
  Layers,
  Globe,
  Mountain,
  FlowerIcon as PlantIcon,
  FileText,
  Clock,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import { Id } from "../../convex/_generated/dataModel";
import { extractImageUrl } from "@/lib/utils";

// Format date strings
const formatDate = (dateString: string | number) => {
  if (!dateString) return "N/A";
  try {
    return new Date(dateString.toString()).toLocaleDateString();
  } catch (e) {
    console.error(e);
    return dateString.toString();
  }
};

// Display value or N/A if not available
const displayValue = (value: string | number | undefined | null) => {
  if (value === undefined || value === null || value === "") return "N/A";
  return value;
};

interface PlantDetailProps {
  id: string;
}

export default function PlantDetail({ id }: PlantDetailProps) {
  // Convert the string ID to a Convex ID
  const plant = useQuery(api.botany.getPlantById, { id: id as Id<"botany"> });

  if (plant === undefined) {
    return <div>Loading...</div>;
  }

  if (plant === null) {
    return <div>Plant not found</div>;
  }

  const maybeRenderImage = () => {
    const imageUrl = extractImageUrl(plant.img, "1000");
    return (
      imageUrl && (
        <Image
          src={imageUrl || "/placeholder.svg"}
          alt={plant.fullName}
          fill
          className="object-cover"
          priority
        />
      )
    );
  };
  return (
    <div className="container mx-auto py-8 px-4">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left column - Image and basic info */}
        <div className="lg:col-span-1">
          <Card className="overflow-hidden">
            <div className="relative aspect-square w-full">
              {maybeRenderImage()}
            </div>
            <CardContent className="p-6">
              <h1 className="text-2xl font-bold italic mb-2">
                {plant.fullName}
              </h1>
              <div className="flex items-center gap-2 text-muted-foreground mb-4">
                <Badge variant="outline">{plant.family}</Badge>
                {plant.typeStatusName && (
                  <Badge variant="secondary">{plant.typeStatusName}</Badge>
                )}
              </div>

              <div className="grid gap-3">
                <div className="flex items-center gap-2">
                  <Tag className="h-4 w-4 text-primary" />
                  <span className="text-sm">
                    Catalog: {displayValue(plant.catalogNumber)}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-primary" />
                  <span className="text-sm">
                    {displayValue(plant.localityName)},{" "}
                    {displayValue(plant.state)}, {displayValue(plant.country)}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-primary" />
                  <span className="text-sm">
                    Collected: {formatDate(plant.startDate)}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Users className="h-4 w-4 text-primary" />
                  <span className="text-sm">
                    Collectors: {displayValue(plant.collectors)}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right column - Detailed information */}
        <div className="lg:col-span-2">
          <Tabs defaultValue="taxonomy" className="w-full">
            <TabsList className="grid grid-cols-4 mb-6">
              <TabsTrigger value="taxonomy">Taxonomy</TabsTrigger>
              <TabsTrigger value="location">Location</TabsTrigger>
              <TabsTrigger value="collection">Collection</TabsTrigger>
              <TabsTrigger value="notes">Notes</TabsTrigger>
            </TabsList>

            {/* Taxonomy Tab */}
            <TabsContent value="taxonomy" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <PlantIcon className="h-5 w-5" />
                    Taxonomic Classification
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Class:</span>
                        <span className="font-medium">
                          {displayValue(plant.class)}
                        </span>
                      </div>
                      <Separator />
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Order:</span>
                        <span className="font-medium">
                          {displayValue(plant.order)}
                        </span>
                      </div>
                      <Separator />
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Family:</span>
                        <span className="font-medium">
                          {displayValue(plant.family)}
                        </span>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Genus:</span>
                        <span className="font-medium">
                          {displayValue(plant.genus)}
                        </span>
                      </div>
                      <Separator />
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Species:</span>
                        <span className="font-medium">
                          {displayValue(plant.species)}
                        </span>
                      </div>
                      <Separator />
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">
                          Full Name:
                        </span>
                        <span className="font-medium italic">
                          {displayValue(plant.fullName)}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="mt-6">
                    <h4 className="text-sm font-medium mb-2">Determination</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">
                          Determined by:
                        </span>
                        <span className="font-medium">
                          {displayValue(plant.determiner)}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">
                          Determined date:
                        </span>
                        <span className="font-medium">
                          {formatDate(plant.determinedDate)}
                        </span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Location Tab */}
            <TabsContent value="location" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Globe className="h-5 w-5" />
                    Geographic Information
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">
                          Continent:
                        </span>
                        <span className="font-medium">
                          {displayValue(plant.continent)}
                        </span>
                      </div>
                      <Separator />
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Country:</span>
                        <span className="font-medium">
                          {displayValue(plant.country)}
                        </span>
                      </div>
                      <Separator />
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">
                          State/Province:
                        </span>
                        <span className="font-medium">
                          {displayValue(plant.state)}
                        </span>
                      </div>
                      <Separator />
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Town:</span>
                        <span className="font-medium">
                          {displayValue(plant.town)}
                        </span>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Locality:</span>
                        <span className="font-medium">
                          {displayValue(plant.localityName)}
                        </span>
                      </div>
                      <Separator />
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Latitude:</span>
                        <span className="font-medium">
                          {displayValue(plant.latitude1)}
                        </span>
                      </div>
                      <Separator />
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">
                          Longitude:
                        </span>
                        <span className="font-medium">
                          {displayValue(plant.longitude1)}
                        </span>
                      </div>
                      <Separator />
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Habitat:</span>
                        <span className="font-medium">
                          {displayValue(plant.geoc)}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="mt-6">
                    <h4 className="flex items-center gap-2 text-sm font-medium mb-2">
                      <Mountain className="h-4 w-4" />
                      Elevation
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Min:</span>
                        <span className="font-medium">
                          {displayValue(plant.minElevation)}{" "}
                          {plant.originalElevationUnit}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Max:</span>
                        <span className="font-medium">
                          {displayValue(plant.maxElevation)}{" "}
                          {plant.originalElevationUnit}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Unit:</span>
                        <span className="font-medium">
                          {displayValue(plant.originalElevationUnit)}
                        </span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Collection Tab */}
            <TabsContent value="collection" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Layers className="h-5 w-5" />
                    Collection Details
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">
                          Catalog Number:
                        </span>
                        <span className="font-medium">
                          {displayValue(plant.catalogNumber)}
                        </span>
                      </div>
                      <Separator />
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">
                          Alt. Catalog Number:
                        </span>
                        <span className="font-medium">
                          {displayValue(plant.altCatalogNumber)}
                        </span>
                      </div>
                      <Separator />
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">
                          Type Status:
                        </span>
                        <span className="font-medium">
                          {displayValue(plant.typeStatusName)}
                        </span>
                      </div>
                      <Separator />
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Count:</span>
                        <span className="font-medium">
                          {displayValue(plant.count)}
                        </span>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">
                          Collectors:
                        </span>
                        <span className="font-medium">
                          {displayValue(plant.collectors)}
                        </span>
                      </div>
                      <Separator />
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">
                          Collection Date:
                        </span>
                        <span className="font-medium">
                          {formatDate(plant.startDate)}
                        </span>
                      </div>
                      <Separator />
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">
                          Verbatim Date:
                        </span>
                        <span className="font-medium">
                          {displayValue(plant.verbatimDate)}
                        </span>
                      </div>
                      <Separator />
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">
                          Preparations:
                        </span>
                        <span className="font-medium">
                          {displayValue(plant.preparations)}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="mt-6">
                    <h4 className="flex items-center gap-2 text-sm font-medium mb-2">
                      <Clock className="h-4 w-4" />
                      Dates
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">
                          Start Date:
                        </span>
                        <span className="font-medium">
                          {formatDate(plant.startDate)}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">End Date:</span>
                        <span className="font-medium">
                          {formatDate(plant.endDate)}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">
                          CE Start Date:
                        </span>
                        <span className="font-medium">
                          {formatDate(plant.ce_startDate)}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">
                          CE End Date:
                        </span>
                        <span className="font-medium">
                          {formatDate(plant.ce_endDate)}
                        </span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Notes Tab */}
            <TabsContent value="notes" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <FileText className="h-5 w-5" />
                    Notes & Remarks
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    <div>
                      <h4 className="text-sm font-medium mb-2">
                        General Remarks
                      </h4>
                      <p className="p-3 bg-muted rounded-md">
                        {displayValue(plant.remarks)}
                      </p>
                    </div>

                    <div>
                      <h4 className="text-sm font-medium mb-2">
                        Collection Remarks
                      </h4>
                      <p className="p-3 bg-muted rounded-md">
                        {displayValue(plant.co_remarks)}
                      </p>
                    </div>

                    <div>
                      <h4 className="text-sm font-medium mb-2">
                        Last Modified
                      </h4>
                      <p className="text-sm text-muted-foreground">
                        {displayValue(plant.timestampModified)}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}
