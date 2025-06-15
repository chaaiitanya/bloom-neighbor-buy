
import DashboardPlantGrid from "@/components/DashboardPlantGrid";
import PlantDetailDrawer from "@/components/PlantDetailDrawer";
import { useState } from "react";
import type { PlantRaw } from "./usePlantsWithSellers";

type PlantLike = {
  id: string;
  name: string;
  price: number;
  photo_url: string | null;
  distance: string | null;
  location: string | null;
  sellerId: string;
  seller: string;
  description?: string | null;
  type?: string;
};

type DashboardPlantSuggestionListProps = {
  otherAreaPlants: PlantLike[];
  gridPlants: (arr: PlantLike[]) => any[];
};

export default function DashboardPlantSuggestionList({ otherAreaPlants, gridPlants }: DashboardPlantSuggestionListProps) {
  const [selectedPlant, setSelectedPlant] = useState<any | null>(null);

  const handlePlantClick = (plant: any) => {
    setSelectedPlant(plant);
  };

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
