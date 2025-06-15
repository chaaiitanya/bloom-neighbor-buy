import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import DashboardPlantGrid from "@/components/DashboardPlantGrid";
import PlantDetailDrawer from "@/components/PlantDetailDrawer";
import { Loader2 } from "lucide-react";

// Type definitions
type PlantRaw = {
  id: string;
  name: string;
  price: number;
  photo_url: string | null;
  distance: string | null;
  location: string | null;
  sellerId: string;
  seller: string;
  type?: string;
};

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
  const [selectedPlant, setSelectedPlant] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [plants, setPlants] = useState<PlantRaw[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    setError(null);

    async function fetchPlantsWithProfileNames() {
      // Step 1: Get ALL plants as before. No join, keep fast.
      let { data, error } = await supabase
        .from("plants")
        .select(`
          id,
          name,
          price,
          photo_url,
          location,
          user_id,
          created_at
        `)
        .order("created_at", { ascending: false });

      if (error) {
        setError("Could not fetch plants.");
        setLoading(false);
        return;
      }

      if (!data) {
        setError("No data received.");
        setLoading(false);
        return;
      }

      // Step 2: Collect unique seller IDs
      const userIds = Array.from(
        new Set(data.map((plant: any) => plant.user_id).filter(Boolean))
      );
      // Step 3: Fetch seller profiles in one batch (id, full_name)
      let profileMap: Record<string, string> = {};
      if (userIds.length > 0) {
        const { data: profiles, error: profileErr } = await supabase
          .from("profiles")
          .select("id, full_name")
          .in("id", userIds);

        if (profiles && !profileErr) {
          // Map id to full_name
          for (const profile of profiles) {
            profileMap[profile.id] = profile.full_name || null;
          }
        }
      }

      // Step 4: Map plants adding correct seller name
      const transformed: PlantRaw[] = data.map((plant: any) => ({
        id: plant.id,
        name: plant.name,
        price: Number(plant.price),
        photo_url: plant.photo_url,
        distance: "—",
        location: plant.location ?? "Unlisted",
        sellerId: plant.user_id,
        // Use profile name if exists, fallback to user id
        seller:
          (plant.user_id && profileMap[plant.user_id]) ||
          (plant.user_id ? plant.user_id.slice(0, 6) : "Unknown"),
        type: "all",
      }));

      setPlants(transformed);
      setLoading(false);
    }

    fetchPlantsWithProfileNames();
  }, []);

  // Filtering logic
  let filteredPlants = plants;
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

  // Check if any filter applied
  const didFilter =
    (search && search.trim()) ||
    (filter && filter !== "all") ||
    (typeof range === "number" && range !== 10) ||
    minPrice ||
    maxPrice;

  // --- CRITICAL: Forward sellerId and seller to PlantDetailDrawer ---
  // Now shape the plant object for the grid/list and for PlantDetailDrawer:
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
      type: plant.type ?? "all"
    }));

  // Loading/error UI
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

  // Prepare 'other area' suggestions
  let otherAreaPlants: PlantRaw[] = [];
  if (didFilter && filteredPlants.length === 0) {
    let suggestionSource = plants.slice(); // all plants
    // If a search was provided, sort all by 'nearest' location match to the term.
    if (search && search.trim()) {
      const q = search.trim().toLowerCase();
      suggestionSource = suggestionSource
        .map((plant) => ({
          ...plant,
          _distance: plant.location
            ? levenshtein(plant.location.toLowerCase(), q)
            : 99
        }))
        // Only show plants from other locations, not where string matches search exactly
        .filter(plant => (plant.location?.toLowerCase() || "") !== q)
        .sort((a, b) => (a._distance as number) - (b._distance as number));
    }
    // Limit suggestion count for UX
    otherAreaPlants = suggestionSource.slice(0, 20);
  }

  // Add debug log for click:
  const handlePlantClick = (plant: any) => {
    console.log("Plant selected for drawer:", plant);
    setSelectedPlant(plant);
  };

  if (didFilter && filteredPlants.length === 0) {
    return (
      <>
        <div className="text-center text-green-700 col-span-full py-8 font-semibold">
          No plants found in your area.
          <div className="mt-2 text-green-800">See other available plants:</div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-5 w-full mt-4 transition-all">
          <DashboardPlantGrid plants={gridPlants(otherAreaPlants)} onPlantClick={handlePlantClick} />
        </div>
        <PlantDetailDrawer
          open={!!selectedPlant}
          plant={selectedPlant}
          onClose={() => setSelectedPlant(null)}
        />
      </>
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
