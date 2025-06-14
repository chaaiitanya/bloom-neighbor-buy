
import { useNavigate } from "react-router-dom";
import { Search, LogIn } from "lucide-react";

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

// Use the user's uploaded greenic plant background image
const bgImage = "/lovable-uploads/57e20818-f97d-4a73-ba99-7f6eedf5d5f9.png";

const Index = () => {
  const navigate = useNavigate();

  return (
    <div className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden">
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
      <div className="absolute inset-0 -z-10 bg-black/40" />
      
      {/* Favorite Plants (Avatars) with glass effect */}
      <div className="absolute top-12 left-1/2 -translate-x-1/2 z-0 w-fit">
        <div className="flex gap-4 px-6 py-3 bg-white/20 border border-white/30 backdrop-blur-md rounded-2xl shadow-lg">
          {favoritePlants.map((plant, idx) => (
            <div key={idx} className="flex flex-col items-center">
              <img
                src={plant.image}
                alt={plant.name}
                className="w-20 h-20 rounded-full border-4 border-green-200 shadow-lg object-cover bg-green-50"
              />
              <span className="mt-2 text-white text-xs shadow text-center drop-shadow">{plant.name}</span>
            </div>
          ))}
        </div>
      </div>
      {/* MAIN CONTENT */}
      <div className="relative z-10 flex flex-col items-center w-full max-w-md mt-40 sm:mt-52 p-4">
        {/* Welcome */}
        <h1 className="text-3xl md:text-4xl font-extrabold text-green-100 mb-2 text-center drop-shadow">
          Welcome to Sproutsly
        </h1>
        <div className="text-green-50 mb-8 text-lg text-center max-w-prose drop-shadow">
          Discover & swap the favorite plants of your neighbourhood 🌱
        </div>
        {/* Search Bar (glassmorphism) */}
        <form className="w-full mb-6" onSubmit={e => e.preventDefault()}>
          <div className="relative">
            <input
              id="search-plants"
              type="text"
              placeholder="Search for neighborhood plants..."
              className="w-full rounded-2xl border border-white/30 bg-white/20 backdrop-blur-md pl-12 pr-4 py-4 text-xl text-green-900 placeholder:text-green-900/50 shadow focus:ring-2 focus:ring-green-200 focus:outline-none transition"
              autoComplete="off"
            />
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-green-400 w-7 h-7" />
          </div>
        </form>
        {/* Login Section with glassmorphism */}
        <div className="w-full flex justify-center">
          <div className="w-full flex justify-center bg-white/20 border border-white/30 backdrop-blur-md rounded-xl shadow-lg py-3">
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
      </div>
    </div>
  );
};

export default Index;

