
import { PlantCard } from "@/components/PlantCard";
import BottomTabNav from "@/components/BottomTabNav";
import { useNavigate } from "react-router-dom";

// Placeholder listings
const listings = [
  {
    image: "https://images.unsplash.com/photo-1618160702438-9b02ab6515c9?auto=format&fit=crop&w=600&q=80",
    name: "Monstera Deliciosa",
    price: "$18",
    distance: "0.4 mi",
    location: "Maple St",
    seller: "Jamie"
  },
  {
    image: "https://images.unsplash.com/photo-1465146344425-f00d5f5c8f07?auto=format&fit=crop&w=600&q=80",
    name: "Marigold Flowers",
    price: "$5",
    distance: "0.8 mi",
    location: "Orange Ave",
    seller: "Alex"
  },
  {
    image: "https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9?auto=format&fit=crop&w=600&q=80",
    name: "Pine Sapling (3x)",
    price: "$6",
    distance: "1.2 mi",
    location: "Sunny Hills",
    seller: "Casey"
  },
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
  },
];

const Index = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col pb-20 bg-gradient-to-br from-green-50 to-white">
      <header className="flex items-end justify-between px-4 pt-6 pb-3">
        <div>
          <h1 className="text-2xl font-bold text-green-900">Sproutsly</h1>
          <div className="text-green-500 text-sm">Plants near you</div>
        </div>
        <button
          className="bg-green-100 text-green-800 font-bold px-4 py-2 rounded-xl shadow-sm hover:bg-green-200 transition text-sm"
          onClick={() => navigate("/post")}
        >
          + Sell a plant
        </button>
      </header>
      <main className="flex-1 px-3">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
          {listings.map((listing, idx) => (
            <PlantCard key={idx} {...listing} />
          ))}
        </div>
      </main>
      <BottomTabNav />
    </div>
  );
};

export default Index;
