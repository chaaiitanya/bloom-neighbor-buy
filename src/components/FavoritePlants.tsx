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
      
    </div>
  );
}
