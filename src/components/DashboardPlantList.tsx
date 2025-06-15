
import { useState } from "react";
import demoPlants from "@/components/dashboard-plant-demo";
import { parseDistance, parsePrice } from "@/components/dashboard-plant-helpers";
import DashboardPlantGrid from "@/components/DashboardPlantGrid";
import PlantDetailDrawer from "@/components/PlantDetailDrawer";

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

  let filteredPlants = demoPlants;

  // Filter by range (distance in km)
  if (typeof range === "number" && !isNaN(range)) {
    filteredPlants = filteredPlants.filter(plant => parseDistance(plant.distance) <= range);
  }

  // Filter by type (filter)
  if (filter && filter !== "all") {
    filteredPlants = filteredPlants.filter(plant => plant.type === filter);
  }

  // Filter by search: name, location, or seller (case-insensitive)
  if (search && search.trim()) {
    const q = search.trim().toLowerCase();
    filteredPlants = filteredPlants.filter(plant =>
      plant.name.toLowerCase().includes(q) ||
      plant.location.toLowerCase().includes(q) ||
      plant.seller.toLowerCase().includes(q)
    );
  }

  // Filter by minPrice
  if (minPrice && !isNaN(Number(minPrice))) {
    const min = Number(minPrice);
    filteredPlants = filteredPlants.filter(
      plant => parsePrice(plant.price) >= min
    );
  }

  // Filter by maxPrice
  if (maxPrice && !isNaN(Number(maxPrice))) {
    const max = Number(maxPrice);
    filteredPlants = filteredPlants.filter(
      plant => parsePrice(plant.price) <= max
    );
  }

  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-5 w-full mt-4 transition-all">
        <DashboardPlantGrid plants={filteredPlants} onPlantClick={setSelectedPlant} />
      </div>
      <PlantDetailDrawer
        open={!!selectedPlant}
        plant={selectedPlant}
        onClose={() => setSelectedPlant(null)}
      />
    </>
  );
}
