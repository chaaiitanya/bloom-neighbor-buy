
import { PlantCard } from "@/components/PlantCard";

// Demo data for now
const demoPlants = [
  {
    image: "/placeholder.svg",
    name: "Fiddle Leaf Fig",
    price: "$15",
    distance: "2 km",
    location: "Sunnydale",
    seller: "Maria",
  },
  {
    image: "/placeholder.svg",
    name: "Snake Plant",
    price: "$12",
    distance: "5 km",
    location: "Greenfield",
    seller: "James",
  },
  {
    image: "/placeholder.svg",
    name: "Monstera Deliciosa",
    price: "$25",
    distance: "1.5 km",
    location: "Oakwood",
    seller: "Jessica",
  },
];

export default function DashboardPlantList() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-5 w-full mt-4 transition-all">
      {demoPlants.map((plant, i) => (
        <PlantCard key={i} {...plant} />
      ))}
    </div>
  );
}
