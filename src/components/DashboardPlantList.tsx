import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import DashboardPlantGrid from "@/components/DashboardPlantGrid";
import PlantDetailDrawer from "@/components/PlantDetailDrawer";
import { Loader2 } from "lucide-react";
import { usePlantsWithSellers, PlantRaw } from "./usePlantsWithSellers";
import DashboardPlantSuggestionList from "./DashboardPlantSuggestionList";

// Simple Levenshtein distance calculation for suggestion rendering
function levenshtein(a: string, b: string): number {
  // Simple Levenshtein distance calculation
  if (!a) return b.length;
  if (!b) return a.length;
  let matrix = [];
  for (let i = 0; i <= b.length; i++) matrix[i] = [i];
  for (let j = 0; j <= a.length; j++) matrix[0][j] = j;
  for (let i = 1; i <= b.length; i++) {
    for (let j = 1; j <= a.length; j++) {
      matrix[i][j] =
        b.charAt(i - 1) === a.charAt(j - 1)
          ? matrix[i - 1][j - 1]
          : Math.min(
              matrix[i - 1][j - 1] + 1,
              matrix[i][j - 1] + 1,
              matrix[i - 1][j] + 1
            );
    }
  }
  return matrix[b.length][a.length];
}

export default function DashboardPlantList({
  search,
  range,
  filter,
  minPrice,
  maxPrice,
}: {
  search?: string;
  range?: number;
  filter?: string;
  minPrice?: string;
  maxPrice?: string;
}) {
  // Get all plant data from our custom hook
  const { plants, loading, error } = usePlantsWithSellers();
  // Get logged-in user id, so we can filter out self-listings
  const [myUserId, setMyUserId] = useState<string | null>(null);
  const [selectedPlant, setSelectedPlant] = useState<any | null>(null);

  // Fetch current user id on mount
  useEffect(() => {
    async function fetchUserId() {
      const { data: auth } = await supabase.auth.getUser();
      setMyUserId(auth?.user?.id ?? null);
    }
    fetchUserId();
  }, []);

  // Filtering logic: Remove my own plants, and apply all user filters
  let filteredPlants = plants;
  if (myUserId) {
    filteredPlants = filteredPlants.filter((plant) => plant.sellerId !== myUserId);
  }
  if (filter && filter !== "all") {
    filteredPlants = filteredPlants.filter((plant) => plant.type === filter);
  }
  if (search && search.trim()) {
    const q = search.trim().toLowerCase();
    filteredPlants = filteredPlants.filter(
      (plant) =>
        plant.name.toLowerCase().includes(q) ||
        (plant.location?.toLowerCase() || "").includes(q) ||
        plant.seller.toLowerCase().includes(q)
    );
  }
  if (minPrice && !isNaN(Number(minPrice))) {
    const min = Number(minPrice);
    filteredPlants = filteredPlants.filter((plant) => plant.price >= min);
  }
  if (maxPrice && !isNaN(Number(maxPrice))) {
    const max = Number(maxPrice);
    filteredPlants = filteredPlants.filter((plant) => plant.price <= max);
  }

  const didFilter =
    (search && search.trim()) ||
    (filter && filter !== "all") ||
    (typeof range === "number" && range !== 10) ||
    minPrice ||
    maxPrice;

  // Adjust gridPlants to fit DashboardPlantGrid + PlantDetailDrawer shape
  const gridPlants = (arr: PlantRaw[]) =>
    arr.map((plant) => ({
      id: plant.id,
      name: plant.name,
      price: `$${plant.price}`,
      image: plant.photo_url ?? "/placeholder.svg",
      distance: plant.distance ?? "—",
      location: plant.location ?? "Unlisted",
      seller: plant.seller ?? (plant.sellerId ? plant.sellerId.slice(0, 6) : "Unknown"),
      sellerId: plant.sellerId,
      additionalDetails: plant.description ?? "",
      type: plant.type ?? "all"
    }));

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12 text-green-700">
        <Loader2 className="animate-spin mr-3" /> Loading plant listings...
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center py-12 text-red-700">
        {error}
      </div>
    );
  }

  // Suggestions when user filter yields nothing
  let otherAreaPlants: PlantRaw[] = [];
  if (didFilter && filteredPlants.length === 0) {
    let suggestionSource = plants.slice();
    if (myUserId) {
      suggestionSource = suggestionSource.filter((plant) => plant.sellerId !== myUserId);
    }
    if (search && search.trim()) {
      const q = search.trim().toLowerCase();
      suggestionSource = suggestionSource
        .map((plant) => ({
          ...plant,
          _distance: plant.location
            ? levenshtein(plant.location.toLowerCase(), q)
            : 99
        }))
        .filter(plant => (plant.location?.toLowerCase() || "") !== q)
        .sort((a, b) => (a._distance as number) - (b._distance as number));
    }
    otherAreaPlants = suggestionSource.slice(0, 20);
  }

  const handlePlantClick = (plant: any) => {
    setSelectedPlant(plant);
  };

  if (didFilter && filteredPlants.length === 0) {
    return (
      <DashboardPlantSuggestionList otherAreaPlants={otherAreaPlants} gridPlants={gridPlants} />
    );
  }

  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-5 w-full mt-4 transition-all">
        <DashboardPlantGrid plants={gridPlants(filteredPlants)} onPlantClick={handlePlantClick} />
      </div>
      <PlantDetailDrawer
        open={!!selectedPlant}
        plant={selectedPlant}
        onClose={() => setSelectedPlant(null)}
      />
    </>
  );
}
