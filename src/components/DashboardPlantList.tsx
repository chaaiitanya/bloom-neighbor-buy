
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { parseDistance, parsePrice } from "@/components/dashboard-plant-helpers";
import DashboardPlantGrid from "@/components/DashboardPlantGrid";
import PlantDetailDrawer from "@/components/PlantDetailDrawer";
import { Loader2 } from "lucide-react";

type PlantRaw = {
  id: string;
  name: string;
  price: number;
  photo_url: string | null;
  distance: string | null; // Not in db, for demo/mock
  location: string | null;
  sellerId: string;
  seller: string;
  type?: string; // If you later add categories
};

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
  // State for plant details drawer
  const [selectedPlant, setSelectedPlant] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [plants, setPlants] = useState<PlantRaw[]>([]);
  const [error, setError] = useState<string | null>(null);

  // Fetch plants (and seller profile info) from Supabase
  useEffect(() => {
    setLoading(true);
    setError(null);
    async function fetchPlants() {
      let { data, error } = await supabase
        .from("plants")
        .select(`
          id,
          name,
          price,
          photo_url,
          location,
          user_id,
          created_at,
          profiles:profiles!plants_user_id_fkey(
            username,
            full_name
          )
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

      // Store PlantRaw (price is number, no image field)
      const transformed: PlantRaw[] = data.map((plant: any) => ({
        id: plant.id,
        name: plant.name,
        price: Number(plant.price),
        photo_url: plant.photo_url,
        distance: "—", // Not tracked in db yet
        location: plant.location ?? "Unlisted",
        sellerId: plant.user_id,
        seller: plant.profiles?.username || plant.profiles?.full_name || "Unknown",
        type: "all", // For now, until categories are added
      }));
      setPlants(transformed);
      setLoading(false);
    }

    fetchPlants();
  }, []);

  // Filtering logic (performed on PlantRaw type)
  let filteredPlants = plants;

  // Filter by type (filter)
  if (filter && filter !== "all") {
    filteredPlants = filteredPlants.filter((plant) => plant.type === filter);
  }

  // Filter by search: name, location, or seller (case-insensitive)
  if (search && search.trim()) {
    const q = search.trim().toLowerCase();
    filteredPlants = filteredPlants.filter(
      (plant) =>
        plant.name.toLowerCase().includes(q) ||
        (plant.location?.toLowerCase() || "").includes(q) ||
        plant.seller.toLowerCase().includes(q)
    );
  }

  // Filter by minPrice
  if (minPrice && !isNaN(Number(minPrice))) {
    const min = Number(minPrice);
    filteredPlants = filteredPlants.filter(
      (plant) => plant.price >= min
    );
  }

  // Filter by maxPrice
  if (maxPrice && !isNaN(Number(maxPrice))) {
    const max = Number(maxPrice);
    filteredPlants = filteredPlants.filter(
      (plant) => plant.price <= max
    );
  }

  // Check if any filter/search has been applied
  const didFilter =
    (search && search.trim()) ||
    (filter && filter !== "all") ||
    (typeof range === "number" && range !== 10) ||
    minPrice ||
    maxPrice;

  // Prepare mapped plants for DashboardPlantGrid arguments
  const gridPlants = (arr: PlantRaw[]) =>
    arr.map((plant) => ({
      ...plant,
      image: plant.photo_url ?? "/placeholder.svg",
      price: `$${plant.price}`,
      distance: plant.distance ?? "—",
    }));

  // Loading & error handling
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

  // If no plants found after search/filter, show all available as suggestion
  if (didFilter && filteredPlants.length === 0) {
    return (
      <>
        <div className="text-center text-green-700 col-span-full py-8 font-semibold">
          No plants found in your area.
          <div className="mt-2 text-green-800">See other available plants:</div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-5 w-full mt-4 transition-all">
          <DashboardPlantGrid plants={gridPlants(plants)} onPlantClick={setSelectedPlant} />
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
        <DashboardPlantGrid plants={gridPlants(filteredPlants)} onPlantClick={setSelectedPlant} />
      </div>
      <PlantDetailDrawer
        open={!!selectedPlant}
        plant={selectedPlant}
        onClose={() => setSelectedPlant(null)}
      />
    </>
  );
}
