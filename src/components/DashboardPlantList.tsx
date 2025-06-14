import { PlantCard } from "@/components/PlantCard";
import PlantDetailDrawer from "@/components/PlantDetailDrawer";
import { useState } from "react";

const demoPlants = [
  {
    image: "/placeholder.svg",
    name: "Fiddle Leaf Fig",
    price: "$15",
    distance: "2 km",
    location: "Sunnydale",
    seller: "Maria",
    type: "indoor",
  },
  {
    image: "/placeholder.svg",
    name: "Snake Plant",
    price: "$12",
    distance: "5 km",
    location: "Greenfield",
    seller: "James",
    type: "indoor",
  },
  {
    image: "/placeholder.svg",
    name: "Monstera Deliciosa",
    price: "$25",
    distance: "1.5 km",
    location: "Oakwood",
    seller: "Jessica",
    type: "indoor",
  },
  {
    image: "/placeholder.svg",
    name: "Aloe Vera",
    price: "$8",
    distance: "3 km",
    location: "Midtown",
    seller: "Olivia",
    type: "succulent",
  },
  {
    image: "/placeholder.svg",
    name: "Spider Plant",
    price: "$10",
    distance: "4.5 km",
    location: "Maplewood",
    seller: "Leo",
    type: "indoor",
  },
  {
    image: "/placeholder.svg",
    name: "Pothos",
    price: "$9",
    distance: "4 km",
    location: "Riverside",
    seller: "Sofia",
    type: "indoor",
  },
  {
    image: "/placeholder.svg",
    name: "Cactus Mini",
    price: "$6",
    distance: "6 km",
    location: "Hillcrest",
    seller: "Amber",
    type: "succulent",
  },
  {
    image: "/placeholder.svg",
    name: "Peace Lily",
    price: "$11",
    distance: "2.5 km",
    location: "Sunnydale",
    seller: "Maria",
    type: "flower",
  },
  {
    image: "/placeholder.svg",
    name: "ZZ Plant",
    price: "$18",
    distance: "7 km",
    location: "Evergreen",
    seller: "Noah",
    type: "indoor",
  },
  {
    image: "/placeholder.svg",
    name: "Rubber Plant",
    price: "$20",
    distance: "1 km",
    location: "Oakwood",
    seller: "Jessica",
    type: "indoor",
  },
  // Extra sample data for a longer list
  {
    image: "/placeholder.svg",
    name: "Outdoor Bonsai",
    price: "$22",
    distance: "8 km",
    location: "Garden Oaks",
    seller: "Daniel",
    type: "outdoor",
  },
  {
    image: "/placeholder.svg",
    name: "Daisy",
    price: "$5",
    distance: "12 km",
    location: "Meadow Lane",
    seller: "Emma",
    type: "flower",
  },
  {
    image: "/placeholder.svg",
    name: "Succulent Mix",
    price: "$14",
    distance: "10 km",
    location: "Brookfield",
    seller: "Leo",
    type: "succulent",
  },
];

function parseDistance(str: string) {
  // expects something like "2 km"
  const match = str.match(/^([\d.]+)\s*km$/i);
  if (!match) return Infinity;
  return parseFloat(match[1]);
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

  // Parse price from string, e.g. "$15" -> 15
  function parsePrice(str: string) {
    const match = str.match(/[\d.]+/);
    if (!match) return 0;
    return parseFloat(match[0]);
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
        {filteredPlants.length === 0 ? (
          <div className="text-center text-green-700 col-span-full py-8">No plants match your search.</div>
        ) : (
          filteredPlants.map((plant, i) => (
            <PlantCard key={i} {...plant} onClick={() => setSelectedPlant(plant)} />
          ))
        )}
      </div>
      <PlantDetailDrawer
        open={!!selectedPlant}
        plant={selectedPlant}
        onClose={() => setSelectedPlant(null)}
      />
    </>
  );
}

// NOTE: File is getting long (over 200 lines), consider refactoring into smaller files for readability and maintainability.
