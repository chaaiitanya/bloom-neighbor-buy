
const favoritePlants = [
  {
    image:
      "https://images.unsplash.com/photo-1465146344425-f00d5f5c8f07?auto=format&fit=crop&w=600&q=80",
    name: "Marigold Flowers",
  },
  {
    image:
      "https://images.unsplash.com/photo-1518495973542-4542c06a5843?auto=format&fit=crop&w=600&q=80",
    name: "Ficus Tree",
  },
  {
    image:
      "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=600&q=80",
    name: "Water Lilies",
  },
  {
    image:
      "https://images.unsplash.com/photo-1618160702438-9b02ab6515c9?auto=format&fit=crop&w=600&q=80",
    name: "Monstera",
  },
];

export default function FavoritePlants() {
  return (
    <div className="w-full flex flex-col items-center mb-10 mt-16">
      <h2 className="text-lg font-bold text-green-100 mb-4 text-center drop-shadow">
        Popular in your neighbourhood
      </h2>
      <div className="flex gap-4 px-6 py-3 bg-emerald-200/10 border border-white/20 backdrop-blur-md rounded-2xl shadow-md">
        {favoritePlants.map((plant, idx) => (
          <div key={idx} className="flex flex-col items-center">
            <img
              src={plant.image}
              alt={plant.name}
              className="w-16 h-16 rounded-full border-4 border-green-300 shadow object-cover bg-green-50"
            />
            <span className="mt-2 text-green-100 text-xs shadow text-center drop-shadow">
              {plant.name}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
