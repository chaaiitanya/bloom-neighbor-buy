
import { PlantCard } from "./PlantCard";

const seasonalPlants = [
  {
    image: "https://images.unsplash.com/photo-1518495973542-4542c06a5843?auto=format&fit=crop&w=600&q=80",
    name: "Ficus Tree",
    price: "$24",
    distance: "2.5 mi",
    location: "Grove Ln",
    seller: "Morgan"
  },
  {
    image: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=600&q=80",
    name: "Water Lilies",
    price: "$14",
    distance: "3.1 mi",
    location: "Lakeview Dr",
    seller: "Taylor"
  }
];

export default function SeasonalPlants() {
  return (
    <section className="mb-6">
      <h3 className="text-lg font-bold text-green-800 mb-2">Plants Ideal for This Season</h3>
      <div className="flex gap-3 overflow-x-auto">
        {seasonalPlants.map((plant, idx) => (
          <div key={idx} className="min-w-[220px]">
            <PlantCard {...plant} />
          </div>
        ))}
      </div>
    </section>
  );
}
