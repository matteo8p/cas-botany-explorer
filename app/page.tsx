"use client";

import { useQuery } from "convex/react";
import { api } from "../convex/_generated/api";
import { PlantCard } from "./components/plant-card";
import Image from "next/image";
import { Search } from "lucide-react";
import { useState, useMemo } from "react";

export default function Home() {
  const [searchQuery, setSearchQuery] = useState("");

  const searchResults = useQuery(api.botany.searchPlants, {
    query: searchQuery,
    category: "all",
    limit: 30,
  });

  const plants = searchResults ?? [];

  const renderSearchBar = () => {
    return (
      <div className="w-full max-w-2xl">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-muted-foreground h-5 w-5" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search specimens by name, location, or collector..."
            className="w-full h-14 pl-12 pr-4 rounded-full border border-input bg-background shadow-sm hover:border-muted-foreground/25 focus:border-primary focus:ring-2 focus:ring-primary/20 focus:outline-none transition-colors"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              className="absolute right-4 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground"
            >
              Clear
            </button>
          )}
        </div>
        {searchQuery && (
          <div className="mt-2 text-sm text-muted-foreground">
            {`Limited to ${searchResults?.length} results`}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="min-h-screen flex flex-col">
      {/* Hero Section */}
      <div className="flex-1 flex flex-col items-center justify-center gap-8 px-4 py-16">
        <div className="flex flex-col items-center gap-6 max-w-2xl text-center">
          <Image
            src="https://upload.wikimedia.org/wikipedia/en/2/26/California_Academy_of_Sciences_Logo.png"
            alt="California Academy of Sciences"
            width={300}
            height={100}
            className="mb-4"
            priority
          />
          <h1 className="text-4xl font-light tracking-tight">
            Botanical Collections Database
          </h1>
          <p className="text-lg text-muted-foreground">
            Explore our digital herbarium specimens from around the world
          </p>
        </div>

        {renderSearchBar()}
      </div>

      {/* Results Section */}
      <div className="container mx-auto px-4 pb-16">
        <div className="border-b mb-6 pb-4">
          <p className="text-sm text-muted-foreground">
            {searchQuery
              ? `Showing ${plants.length} matching specimens`
              : `Showing ${plants.length} specimens`}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {plants === undefined ? (
            <div className="col-span-full flex justify-center py-12">
              <div className="animate-pulse text-muted-foreground">
                Loading specimens...
              </div>
            </div>
          ) : plants.length === 0 ? (
            <div className="col-span-full text-center py-12 text-muted-foreground">
              No specimens found matching your search.
            </div>
          ) : (
            plants.map((plant) => <PlantCard key={plant._id} plant={plant} />)
          )}
        </div>
      </div>
    </div>
  );
}
