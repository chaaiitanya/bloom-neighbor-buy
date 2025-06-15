
import { PlantCard } from "./PlantCard";

const trendingPlants = [
  {
    id: "demo-3",
    image: "https://images.unsplash.com/photo-1465146344425-f00d5f5c8f07?auto=format&fit=crop&w=600&q=80",
    name: "Marigold Flowers",
    price: "$5",
    distance: "0.8 mi",
    location: "Orange Ave",
    seller: "Alex"
  },
  {
    id: "demo-4",
    image: "https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9?auto=format&fit=crop&w=600&q=80",
    name: "Pine Sapling (3x)",
    price: "$6",
    distance: "1.2 mi",
    location: "Sunny Hills",
    seller: "Casey"
  }
];

export default function TrendingPlants() {
  return (
    <section className="mb-6">
      <h3 className="text-lg font-bold text-green-800 mb-2">Trending Plants Nearby</h3>
      <div className="flex gap-3 overflow-x-auto">
        {trendingPlants.map((plant, idx) => (
          <div key={plant.id || idx} className="min-w-[220px]">
            <PlantCard {...plant} id={plant.id} />
          </div>
        ))}
      </div>
    </section>
  );
}
