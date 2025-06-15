
import { useNavigate } from "react-router-dom";

export default function SproutslyDetails() {
  const navigate = useNavigate();
  return (
    <div className="w-full max-w-md flex flex-col items-center">
      <h3 className="text-xl font-bold text-green-200 mb-3 tracking-wide drop-shadow">
        Why Sproutsly?
      </h3>
      <ul className="text-green-100 mb-4 text-base space-y-2">
        <li>🌿 Swap, give, or sell plants with neighbors easily</li>
        <li>📷 Share photos and tips about your plant babies</li>
        <li>🧑‍🌾 Join a green community, learn and grow together</li>
        <li>🔍 Discover rare finds near you</li>
        <li>🚶‍♂️ Meet plant lovers—right in your neighborhood</li>
      </ul>
      <div className="mt-6 mb-3 flex flex-col items-center">
        <span className="font-semibold text-green-300 text-lg mb-2">
          Ready to start sharing?
        </span>
        <button
          className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-8 rounded-xl shadow transition"
          onClick={() => navigate("/post")}
        >
          Post Your Plant Now
        </button>
      </div>
      <div className="text-green-200/70 mt-8 text-sm text-center">
        Sproutsly is about building a thriving, sharing, sustainable community,
        one plant at a time.🌱
      </div>
    </div>
  );
}
