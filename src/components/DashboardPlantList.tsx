
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
  {
    image: "/placeholder.svg",
    name: "Aloe Vera",
    price: "$8",
    distance: "3 km",
    location: "Midtown",
    seller: "Olivia",
  },
  {
    image: "/placeholder.svg",
    name: "Spider Plant",
    price: "$10",
    distance: "4.5 km",
    location: "Maplewood",
    seller: "Leo",
  },
  {
    image: "/placeholder.svg",
    name: "Pothos",
    price: "$9",
    distance: "4 km",
    location: "Riverside",
    seller: "Sofia",
  },
  {
    image: "/placeholder.svg",
    name: "Cactus Mini",
    price: "$6",
    distance: "6 km",
    location: "Hillcrest",
    seller: "Amber",
  },
  {
    image: "/placeholder.svg",
    name: "Peace Lily",
    price: "$11",
    distance: "2.5 km",
    location: "Sunnydale",
    seller: "Maria",
  },
  {
    image: "/placeholder.svg",
    name: "ZZ Plant",
    price: "$18",
    distance: "7 km",
    location: "Evergreen",
    seller: "Noah",
  },
  {
    image: "/placeholder.svg",
    name: "Rubber Plant",
    price: "$20",
    distance: "1 km",
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

