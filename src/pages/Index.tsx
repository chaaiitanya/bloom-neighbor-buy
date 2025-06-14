
import { useNavigate } from "react-router-dom";
import { Search, LogIn } from "lucide-react";
import { useState } from "react";

const favoritePlants = [
  {
    image: "https://images.unsplash.com/photo-1465146344425-f00d5f5c8f07?auto=format&fit=crop&w=600&q=80",
    name: "Marigold Flowers",
  },
  {
    image: "https://images.unsplash.com/photo-1518495973542-4542c06a5843?auto=format&fit=crop&w=600&q=80",
    name: "Ficus Tree",
  },
  {
    image: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=600&q=80",
    name: "Water Lilies",
  },
  {
    image: "https://images.unsplash.com/photo-1618160702438-9b02ab6515c9?auto=format&fit=crop&w=600&q=80",
    name: "Monstera",
  },
];

const bgImage = "/lovable-uploads/57e20818-f97d-4a73-ba99-7f6eedf5d5f9.png";

const plantTypes = [
  "All",
  "Flower",
  "Tree",
  "Cactus",
  "Herb",
  "Shrub",
  "Vine",
  "Rare",
];

const Index = () => {
  const navigate = useNavigate();
  const [plantType, setPlantType] = useState("All");

  return (
    <div className="relative min-h-screen flex flex-col items-center justify-start overflow-x-hidden">
      {/* BACKGROUND IMAGE */}
      <div
        className="absolute inset-0 -z-10"
        style={{
          backgroundImage: `url(${bgImage})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      />
      {/* DARK OVERLAY FOR TEXT READABILITY */}
      <div className="absolute inset-0 -z-10 bg-black/60" />

      {/* Centered "Sproutsly" Heading */}
      <div className="fixed inset-0 flex items-center justify-center pointer-events-none z-20">
        <h1 className="text-4xl md:text-5xl font-extrabold text-green-100 text-center drop-shadow pointer-events-none select-none">
          Sproutsly
        </h1>
      </div>

      {/* Main Page Content - padding-top set to create space for centered heading, which overlays */}
      <main className="relative z-10 flex flex-col items-center w-full max-w-2xl mx-auto px-2 pt-32 pb-10">
        {/* Search Bar Section */}
        <form className="w-full mb-8" onSubmit={e => e.preventDefault()}>
          <div className="flex items-center gap-2 relative">
            {/* Main Search Input */}
            <input
              id="search-plants"
              type="text"
              placeholder="Search for neighbourhood plants..."
              className="w-full rounded-2xl border border-white/20 bg-black/80 backdrop-blur-xl pl-12 pr-4 py-4 text-xl text-green-100 placeholder:text-green-300/80 shadow focus:ring-2 focus:ring-green-200 focus:outline-none transition"
              autoComplete="off"
            />
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-green-300 w-7 h-7" />
            {/* Plant Type Dropdown */}
            <select
              className="rounded-xl bg-black/70 border border-white/10 text-green-100 py-2 px-3 min-w-[120px] focus:outline-none focus:ring-2 focus:ring-green-400 transition"
              value={plantType}
              onChange={e => setPlantType(e.target.value)}
              aria-label="Filter by plant type"
            >
              {plantTypes.map(type => (
                <option key={type} value={type}>{type}</option>
              ))}
            </select>
          </div>
        </form>

        {/* Login Section: Glassmorphic, darker */}
        <div className="w-full flex justify-center mb-24">
          <div className="w-full flex justify-center bg-black/70 border border-white/30 backdrop-blur-lg rounded-xl shadow-lg py-4">
            <button
              className="flex items-center gap-2 text-white font-bold px-8 text-lg group transition"
              type="button"
              onClick={() => alert("Login coming soon!")}
            >
              <LogIn className="w-6 h-6 group-hover:animate-bounce" />
              Login or Create Account
            </button>
          </div>
        </div>

        {/* Ample Space */}
        <div className="h-16" />

        {/* More Page Details */}
        <div className="w-full max-w-md flex flex-col items-center">
          <h3 className="text-xl font-bold text-green-200 mb-3 tracking-wide drop-shadow">Why Sproutsly?</h3>
          <ul className="text-green-100 mb-4 text-base space-y-2">
            <li>🌿 Swap, give, or sell plants with neighbors easily</li>
            <li>📷 Share photos and tips about your plant babies</li>
            <li>🧑‍🌾 Join a green community, learn and grow together</li>
            <li>🔍 Discover rare finds near you</li>
            <li>🚶‍♂️ Meet plant lovers—right in your neighborhood</li>
          </ul>
          <div className="mt-6 mb-3 flex flex-col items-center">
            <span className="font-semibold text-green-300 text-lg mb-2">Ready to start sharing?</span>
            <button
              className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-8 rounded-xl shadow transition"
              onClick={() => navigate("/post")}
            >
              Post Your Plant Now
            </button>
          </div>
          <div className="text-green-200/70 mt-8 text-sm text-center">
            Sproutsly is about building a thriving, sharing, sustainable community, one plant at a time.🌱
          </div>
        </div>

        {/* Favorite Plants Avatars */}
        <div className="w-full flex flex-col items-center mt-14 mb-10">
          <h2 className="text-lg font-bold text-green-100 mb-4 text-center drop-shadow">Popular in your neighbourhood</h2>
          <div className="flex gap-4 px-6 py-3 bg-emerald-200/10 border border-white/20 backdrop-blur-md rounded-2xl shadow-md">
            {favoritePlants.map((plant, idx) => (
              <div key={idx} className="flex flex-col items-center">
                <img
                  src={plant.image}
                  alt={plant.name}
                  className="w-16 h-16 rounded-full border-4 border-green-300 shadow object-cover bg-green-50"
                />
                <span className="mt-2 text-green-100 text-xs shadow text-center drop-shadow">{plant.name}</span>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
};

export default Index;
