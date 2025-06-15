
import { PlantCard } from "@/components/PlantCard";

type Plant = {
  image: string;
  name: string;
  price: string;
  distance: string;
  location: string;
  seller: string;
  sellerId: string;
  type: string;
  id: string; // Make sure id is present
};

interface DashboardPlantGridProps {
  plants: Plant[];
  onPlantClick: (plant: Plant) => void;
}

export default function DashboardPlantGrid({ plants, onPlantClick }: DashboardPlantGridProps) {
  if (!plants.length) {
    return (
      <div className="text-center text-green-700 col-span-full py-8">No plants match your search.</div>
    );
  }
  return (
    <>
      {plants.map((plant, i) => (
        <PlantCard key={plant.id || i} {...plant} onClick={() => onPlantClick(plant)} id={plant.id} />
      ))}
    </>
  );
}
