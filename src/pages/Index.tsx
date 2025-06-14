
import { useNavigate } from "react-router-dom";
import clsx from "clsx";

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

const bgImage = "/lovable-uploads/57e20818-f97d-4a73-ba99-7f6eedf5d5f9.png";

const Index = () => {
  const navigate = useNavigate();

  return (
    <div className="relative min-h-screen flex items-center justify-center">
      {/* BACKGROUND */}
      <div
        className="absolute inset-0 -z-10"
        style={{
          backgroundImage: `url(${bgImage})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      />
      {/* DARK GLASSY OVERLAY */}
      <div className="absolute inset-0 -z-10 bg-black/80 backdrop-blur-xl" />

      {/* MAIN CENTERED BLOCK */}
      <div className="w-full max-w-xl mx-auto flex flex-col items-center justify-center min-h-screen px-4">
        {/* Title */}
        <div className="mb-6 mt-4 w-full flex flex-col items-center">
          <h1 className="text-3xl md:text-4xl font-bold text-green-100 text-center tracking-wide drop-shadow-lg mb-8">Sproutsly</h1>
        </div>

        {/* WHY SPROUTSLY */}
        <div className="w-full bg-black/80 rounded-2xl shadow-lg px-6 py-8 flex flex-col items-center mb-8 border border-white/10 backdrop-blur">
          <h3 className="text-xl md:text-2xl font-semibold text-green-200 mb-5 text-center drop-shadow">
            Why Sproutsly?
          </h3>
          <ul className="text-green-100 text-base space-y-3 mb-8">
            <li>🌿 Swap, give, or sell plants with neighbors easily</li>
            <li>📷 Share photos and tips about your plant babies</li>
            <li>🧑‍🌾 Join a green community, learn and grow together</li>
            <li>🔍 Discover rare finds near you</li>
            <li>🚶‍♂️ Meet plant lovers—right in your neighborhood</li>
          </ul>
          <span className="font-semibold text-green-300 text-lg mb-3 text-center block">
            Ready to start sharing?
          </span>
          <button
            className="bg-green-500 hover:bg-green-600 text-white rounded-xl font-bold px-8 py-2 text-base shadow mb-2 transition"
            onClick={() => navigate("/post")}
          >
            Post Your Plant Now
          </button>
        </div>

        <span className="text-green-200/80 my-2 text-sm text-center mb-12">
          Sproutsly is about building a thriving, sharing, sustainable community, one plant at a time.<span className="ml-1">🌱</span>
        </span>

        {/* Avatars Section */}
        <div className="w-full flex flex-col items-center mt-6 mb-2">
          <h2 className="text-lg font-bold text-green-100 mb-3 text-center drop-shadow">
            Popular in your neighbourhood
          </h2>
          <div className="flex gap-4 px-6 py-4 bg-emerald-200/20 border border-white/20 backdrop-blur-lg rounded-2xl shadow-lg max-w-full">
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
      </div>
    </div>
  );
};

export default Index;
