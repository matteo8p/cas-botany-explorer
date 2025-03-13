"use client";

import Image from "next/image";
import {
  MapPin,
  Calendar,
  Users,
  Tag,
  Layers,
  Globe,
  FlowerIcon as PlantIcon,
  FileText,
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
    <div className="container mx-auto py-12 px-4">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        {/* Left column - Image and basic info */}
        <div className="lg:col-span-1">
          <Card className="overflow-hidden border-none shadow-lg hover:shadow-xl transition-shadow duration-300">
            <div className="relative aspect-square w-full">
              {maybeRenderImage()}
            </div>
            <CardContent className="p-8">
              <h1 className="text-3xl font-light italic mb-4 tracking-tight">
                {plant.fullName}
              </h1>
              <div className="flex items-center gap-2 mb-6">
                <Badge
                  variant="outline"
                  className="bg-white/50 backdrop-blur-sm"
                >
                  {plant.family}
                </Badge>
                {plant.typeStatusName && (
                  <Badge
                    variant="secondary"
                    className="bg-primary/10 text-primary"
                  >
                    {plant.typeStatusName}
                  </Badge>
                )}
              </div>

              <div className="grid gap-4 text-sm">
                <div className="flex items-center gap-3 text-muted-foreground hover:text-primary transition-colors">
                  <Tag className="h-4 w-4" />
                  <span>{displayValue(plant.catalogNumber)}</span>
                </div>
                <div className="flex items-center gap-3 text-muted-foreground hover:text-primary transition-colors">
                  <MapPin className="h-4 w-4" />
                  <span className="truncate">
                    {displayValue(plant.localityName)},{" "}
                    {displayValue(plant.state)}, {displayValue(plant.country)}
                  </span>
                </div>
                <div className="flex items-center gap-3 text-muted-foreground hover:text-primary transition-colors">
                  <Calendar className="h-4 w-4" />
                  <span>{formatDate(plant.startDate)}</span>
                </div>
                <div className="flex items-center gap-3 text-muted-foreground hover:text-primary transition-colors">
                  <Users className="h-4 w-4" />
                  <span>{displayValue(plant.collectors)}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right column - Detailed information */}
        <div className="lg:col-span-2">
          <Tabs defaultValue="taxonomy" className="w-full">
            <TabsList className="grid w-full grid-cols-4 mb-8 bg-background border rounded-full p-1">
              <TabsTrigger
                value="taxonomy"
                className="rounded-full data-[state=active]:bg-primary data-[state=active]:text-primary-foreground transition-all"
              >
                Taxonomy
              </TabsTrigger>
              <TabsTrigger
                value="location"
                className="rounded-full data-[state=active]:bg-primary data-[state=active]:text-primary-foreground transition-all"
              >
                Location
              </TabsTrigger>
              <TabsTrigger
                value="collection"
                className="rounded-full data-[state=active]:bg-primary data-[state=active]:text-primary-foreground transition-all"
              >
                Collection
              </TabsTrigger>
              <TabsTrigger
                value="notes"
                className="rounded-full data-[state=active]:bg-primary data-[state=active]:text-primary-foreground transition-all"
              >
                Notes
              </TabsTrigger>
            </TabsList>

            {/* Taxonomy Tab */}
            <TabsContent value="taxonomy" className="space-y-6">
              <Card className="border-none shadow-md hover:shadow-lg transition-shadow duration-300">
                <CardHeader className="pb-4">
                  <CardTitle className="flex items-center gap-3 text-xl font-light">
                    <PlantIcon className="h-5 w-5 text-primary" />
                    Taxonomic Classification
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <div className="flex justify-between items-center group">
                        <span className="text-muted-foreground group-hover:text-primary transition-colors">
                          Class:
                        </span>
                        <span className="font-medium">
                          {displayValue(plant.class)}
                        </span>
                      </div>
                      <Separator className="opacity-50" />
                      <div className="flex justify-between items-center group">
                        <span className="text-muted-foreground group-hover:text-primary transition-colors">
                          Order:
                        </span>
                        <span className="font-medium">
                          {displayValue(plant.order)}
                        </span>
                      </div>
                      <Separator className="opacity-50" />
                      <div className="flex justify-between items-center group">
                        <span className="text-muted-foreground group-hover:text-primary transition-colors">
                          Family:
                        </span>
                        <span className="font-medium">
                          {displayValue(plant.family)}
                        </span>
                      </div>
                    </div>
                    <div className="space-y-4">
                      <div className="flex justify-between items-center group">
                        <span className="text-muted-foreground group-hover:text-primary transition-colors">
                          Genus:
                        </span>
                        <span className="font-medium">
                          {displayValue(plant.genus)}
                        </span>
                      </div>
                      <Separator className="opacity-50" />
                      <div className="flex justify-between items-center group">
                        <span className="text-muted-foreground group-hover:text-primary transition-colors">
                          Species:
                        </span>
                        <span className="font-medium">
                          {displayValue(plant.species)}
                        </span>
                      </div>
                      <Separator className="opacity-50" />
                      <div className="flex justify-between items-center group">
                        <span className="text-muted-foreground group-hover:text-primary transition-colors">
                          Full Name:
                        </span>
                        <span className="font-medium italic">
                          {displayValue(plant.fullName)}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="mt-8">
                    <h4 className="text-sm font-medium text-primary mb-4">
                      Determination
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-muted/50 p-4 rounded-lg">
                      <div className="flex justify-between items-center group">
                        <span className="text-muted-foreground group-hover:text-primary transition-colors">
                          Determined by:
                        </span>
                        <span className="font-medium">
                          {displayValue(plant.determiner)}
                        </span>
                      </div>
                      <div className="flex justify-between items-center group">
                        <span className="text-muted-foreground group-hover:text-primary transition-colors">
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
            <TabsContent value="location" className="space-y-6">
              <Card className="border-none shadow-md hover:shadow-lg transition-shadow duration-300">
                <CardHeader className="pb-4">
                  <CardTitle className="flex items-center gap-3 text-xl font-light">
                    <Globe className="h-5 w-5 text-primary" />
                    Geographic Information
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <div className="flex justify-between items-center group">
                        <span className="text-muted-foreground group-hover:text-primary transition-colors">
                          Continent:
                        </span>
                        <span className="font-medium">
                          {displayValue(plant.continent)}
                        </span>
                      </div>
                      <Separator className="opacity-50" />
                      <div className="flex justify-between items-center group">
                        <span className="text-muted-foreground group-hover:text-primary transition-colors">
                          Country:
                        </span>
                        <span className="font-medium">
                          {displayValue(plant.country)}
                        </span>
                      </div>
                      <Separator className="opacity-50" />
                      <div className="flex justify-between items-center group">
                        <span className="text-muted-foreground group-hover:text-primary transition-colors">
                          State/Province:
                        </span>
                        <span className="font-medium">
                          {displayValue(plant.state)}
                        </span>
                      </div>
                      <Separator className="opacity-50" />
                      <div className="flex justify-between items-center group">
                        <span className="text-muted-foreground group-hover:text-primary transition-colors">
                          Town:
                        </span>
                        <span className="font-medium">
                          {displayValue(plant.town)}
                        </span>
                      </div>
                    </div>
                    <div className="space-y-4">
                      <div className="flex justify-between items-center group">
                        <span className="text-muted-foreground group-hover:text-primary transition-colors">
                          Locality:
                        </span>
                        <span className="font-medium">
                          {displayValue(plant.localityName)}
                        </span>
                      </div>
                      <Separator className="opacity-50" />
                      <div className="flex justify-between items-center group">
                        <span className="text-muted-foreground group-hover:text-primary transition-colors">
                          Latitude:
                        </span>
                        <span className="font-medium">
                          {displayValue(plant.latitude1)}
                        </span>
                      </div>
                      <Separator className="opacity-50" />
                      <div className="flex justify-between items-center group">
                        <span className="text-muted-foreground group-hover:text-primary transition-colors">
                          Longitude:
                        </span>
                        <span className="font-medium">
                          {displayValue(plant.longitude1)}
                        </span>
                      </div>
                      <Separator className="opacity-50" />
                      <div className="flex justify-between items-center group">
                        <span className="text-muted-foreground group-hover:text-primary transition-colors">
                          Habitat:
                        </span>
                        <span className="font-medium">
                          {displayValue(plant.geoc)}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="mt-8">
                    <h4 className="text-sm font-medium text-primary mb-4">
                      Elevation
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 bg-muted/50 p-4 rounded-lg">
                      <div className="flex justify-between items-center group">
                        <span className="text-muted-foreground group-hover:text-primary transition-colors">
                          Min:
                        </span>
                        <span className="font-medium">
                          {displayValue(plant.minElevation)}{" "}
                          {plant.originalElevationUnit}
                        </span>
                      </div>
                      <div className="flex justify-between items-center group">
                        <span className="text-muted-foreground group-hover:text-primary transition-colors">
                          Max:
                        </span>
                        <span className="font-medium">
                          {displayValue(plant.maxElevation)}{" "}
                          {plant.originalElevationUnit}
                        </span>
                      </div>
                      <div className="flex justify-between items-center group">
                        <span className="text-muted-foreground group-hover:text-primary transition-colors">
                          Unit:
                        </span>
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
            <TabsContent value="collection" className="space-y-6">
              <Card className="border-none shadow-md hover:shadow-lg transition-shadow duration-300">
                <CardHeader className="pb-4">
                  <CardTitle className="flex items-center gap-3 text-xl font-light">
                    <Layers className="h-5 w-5 text-primary" />
                    Collection Details
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <div className="flex justify-between items-center group">
                        <span className="text-muted-foreground group-hover:text-primary transition-colors">
                          Catalog Number:
                        </span>
                        <span className="font-medium">
                          {displayValue(plant.catalogNumber)}
                        </span>
                      </div>
                      <Separator className="opacity-50" />
                      <div className="flex justify-between items-center group">
                        <span className="text-muted-foreground group-hover:text-primary transition-colors">
                          Alt. Catalog Number:
                        </span>
                        <span className="font-medium">
                          {displayValue(plant.altCatalogNumber)}
                        </span>
                      </div>
                      <Separator className="opacity-50" />
                      <div className="flex justify-between items-center group">
                        <span className="text-muted-foreground group-hover:text-primary transition-colors">
                          Type Status:
                        </span>
                        <span className="font-medium">
                          {displayValue(plant.typeStatusName)}
                        </span>
                      </div>
                      <Separator className="opacity-50" />
                      <div className="flex justify-between items-center group">
                        <span className="text-muted-foreground group-hover:text-primary transition-colors">
                          Count:
                        </span>
                        <span className="font-medium">
                          {displayValue(plant.count)}
                        </span>
                      </div>
                    </div>
                    <div className="space-y-4">
                      <div className="flex justify-between items-center group">
                        <span className="text-muted-foreground group-hover:text-primary transition-colors">
                          Collectors:
                        </span>
                        <span className="font-medium">
                          {displayValue(plant.collectors)}
                        </span>
                      </div>
                      <Separator className="opacity-50" />
                      <div className="flex justify-between items-center group">
                        <span className="text-muted-foreground group-hover:text-primary transition-colors">
                          Collection Date:
                        </span>
                        <span className="font-medium">
                          {formatDate(plant.startDate)}
                        </span>
                      </div>
                      <Separator className="opacity-50" />
                      <div className="flex justify-between items-center group">
                        <span className="text-muted-foreground group-hover:text-primary transition-colors">
                          Verbatim Date:
                        </span>
                        <span className="font-medium">
                          {displayValue(plant.verbatimDate)}
                        </span>
                      </div>
                      <Separator className="opacity-50" />
                      <div className="flex justify-between items-center group">
                        <span className="text-muted-foreground group-hover:text-primary transition-colors">
                          Preparations:
                        </span>
                        <span className="font-medium">
                          {displayValue(plant.preparations)}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="mt-8">
                    <h4 className="text-sm font-medium text-primary mb-4">
                      Dates
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-muted/50 p-4 rounded-lg">
                      <div className="flex justify-between items-center group">
                        <span className="text-muted-foreground group-hover:text-primary transition-colors">
                          Start Date:
                        </span>
                        <span className="font-medium">
                          {formatDate(plant.startDate)}
                        </span>
                      </div>
                      <div className="flex justify-between items-center group">
                        <span className="text-muted-foreground group-hover:text-primary transition-colors">
                          End Date:
                        </span>
                        <span className="font-medium">
                          {formatDate(plant.endDate)}
                        </span>
                      </div>
                      <div className="flex justify-between items-center group">
                        <span className="text-muted-foreground group-hover:text-primary transition-colors">
                          CE Start Date:
                        </span>
                        <span className="font-medium">
                          {formatDate(plant.ce_startDate)}
                        </span>
                      </div>
                      <div className="flex justify-between items-center group">
                        <span className="text-muted-foreground group-hover:text-primary transition-colors">
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
            <TabsContent value="notes" className="space-y-6">
              <Card className="border-none shadow-md hover:shadow-lg transition-shadow duration-300">
                <CardHeader className="pb-4">
                  <CardTitle className="flex items-center gap-3 text-xl font-light">
                    <FileText className="h-5 w-5 text-primary" />
                    Notes & Remarks
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    <div>
                      <h4 className="text-sm font-medium text-primary mb-2">
                        General Remarks
                      </h4>
                      <p className="p-3 bg-muted rounded-md">
                        {displayValue(plant.remarks)}
                      </p>
                    </div>

                    <div>
                      <h4 className="text-sm font-medium text-primary mb-2">
                        Collection Remarks
                      </h4>
                      <p className="p-3 bg-muted rounded-md">
                        {displayValue(plant.co_remarks)}
                      </p>
                    </div>

                    <div>
                      <h4 className="text-sm font-medium text-primary mb-2">
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
