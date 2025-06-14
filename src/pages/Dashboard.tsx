
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
    // Check if user is not logged in, redirect to /auth
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session) {
        navigate("/auth");
      }
    });
  }, [navigate]);

  const [search, setSearch] = useState("");
  const [range, setRange] = useState(10);
  const [filter, setFilter] = useState("all");

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
          </div>
        </div>
        <div className="mt-7 px-0 sm:px-2 w-full">
          <h2 className="text-lg font-bold text-green-800 mb-3">🌿 Best in your area</h2>
          <DashboardPlantList search={search} range={range} filter={filter} />
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
