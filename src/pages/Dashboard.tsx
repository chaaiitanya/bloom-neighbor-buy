
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import DashboardSearchBar from "@/components/DashboardSearchBar";
import DashboardLocationRange from "@/components/DashboardLocationRange";
import DashboardFilters from "@/components/DashboardFilters";
import DashboardPlantList from "@/components/DashboardPlantList";
import DashboardProfileAvatar from "@/components/DashboardProfileAvatar";

export default function Dashboard() {
  const navigate = useNavigate();

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session) {
        navigate("/auth");
      }
    });
  }, [navigate]);

  const [search, setSearch] = useState("");
  const [range, setRange] = useState(10);
  const [filter, setFilter] = useState("all");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");

  return (
    <main className="min-h-screen flex flex-col items-center bg-gradient-to-br from-green-50 to-white px-2 sm:px-4 lg:px-12 pb-10">
      <div className="w-full flex flex-col gap-4 mt-6">
        {/* Profile Avatar at top-left */}
        <div className="flex justify-start">
          <DashboardProfileAvatar />
        </div>
        <div className="flex flex-col gap-4 px-0 sm:px-2 w-full">
          <DashboardSearchBar value={search} onChange={setSearch} />
          <div className="flex flex-col sm:flex-row gap-2 flex-wrap items-center justify-between">
            <DashboardLocationRange value={range} onChange={setRange} />
            <DashboardFilters value={filter} onChange={setFilter} />
            {/* Price Filter Inputs */}
            <div className="flex flex-row items-center gap-2 rounded-xl px-3 bg-[#f4fdf7] border border-[#d3f4dc] h-[46px]">
              <span className="text-green-700 font-semibold text-base mr-2">Price:</span>
              <input
                type="number"
                min={0}
                placeholder="Min"
                value={minPrice}
                className="w-16 h-8 px-2 rounded bg-white border border-green-100 text-green-900 focus:outline-none focus:ring-1 focus:ring-green-200 font-semibold placeholder:text-green-400 mr-1"
                style={{ boxShadow: "0 1px 0 0 #e8f8ef" }}
                onChange={e => setMinPrice(e.target.value)}
              />
              <span className="text-gray-400 text-base mx-1">-</span>
              <input
                type="number"
                min={0}
                placeholder="Max"
                value={maxPrice}
                className="w-16 h-8 px-2 rounded bg-white border border-green-100 text-green-900 focus:outline-none focus:ring-1 focus:ring-green-200 font-semibold placeholder:text-green-400 ml-1"
                style={{ boxShadow: "0 1px 0 0 #e8f8ef" }}
                onChange={e => setMaxPrice(e.target.value)}
              />
            </div>
          </div>
        </div>
        <div className="mt-7 px-0 sm:px-2 w-full">
          <h2 className="text-lg font-bold text-green-800 mb-3">🌿 Best in your area</h2>
          <DashboardPlantList
            search={search}
            range={range}
            filter={filter}
            minPrice={minPrice}
            maxPrice={maxPrice}
          />
        </div>
        <div className="w-full flex justify-center mt-12">
          {/* Placeholder for Post Plant call-to-action */}
          <div className="bg-green-100 border border-green-300 rounded-2xl px-6 py-6 flex flex-col items-center shadow-sm max-w-sm w-full">
            <span className="text-green-900 font-semibold text-center text-base mb-2">
              Want to sell or give away a plant?
            </span>
            <button
              className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-7 rounded-xl shadow transition mt-2"
              disabled
              aria-disabled="true"
            >
              Post your plant (coming soon)
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}
