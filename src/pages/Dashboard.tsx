
import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import DashboardSearchBar from "@/components/DashboardSearchBar";
import DashboardLocationRange from "@/components/DashboardLocationRange";
import DashboardFilters from "@/components/DashboardFilters";
import DashboardPlantList from "@/components/DashboardPlantList";
import DashboardProfileAvatar from "@/components/DashboardProfileAvatar";
import DashboardFilterPopover from "@/components/DashboardFilterPopover";
import PostPlantForm from "@/components/PostPlantForm";

function getQueryParam(searchString: string, key: string) {
  const params = new URLSearchParams(searchString);
  return params.get(key) || "";
}

export default function Dashboard() {
  const navigate = useNavigate();
  const location = useLocation();

  // --- initialize 'search' state from query params ---
  const initialSearch =
    typeof window !== "undefined"
      ? getQueryParam(location.search, "search")
      : "";
  const [search, setSearch] = useState(initialSearch);
  const [range, setRange] = useState(10);
  const [filter, setFilter] = useState("all");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");

  // When the URL search param changes, update local search bar!
  useEffect(() => {
    setSearch(getQueryParam(location.search, "search"));
  }, [location.search]);

  return (
    <main className="min-h-screen flex flex-col items-center bg-gradient-to-br from-green-50 to-white px-2 sm:px-4 lg:px-12 pb-10">
      <div className="w-full flex flex-col gap-4 mt-6">
        {/* Profile Avatar at top-left */}
        <div className="flex justify-start">
          <DashboardProfileAvatar />
        </div>
        <div className="flex flex-col gap-4 px-0 sm:px-2 w-full">
          <DashboardSearchBar value={search} onChange={setSearch} />
          {/* Category filters row */}
          <div className="flex flex-col sm:flex-row items-center gap-2 flex-wrap w-full">
            {/* Filter Popover (Range + Price) moved to the start */}
            <DashboardFilterPopover
              range={range}
              setRange={setRange}
              minPrice={minPrice}
              setMinPrice={setMinPrice}
              maxPrice={maxPrice}
              setMaxPrice={setMaxPrice}
            />
            <div className="flex-1 w-full">
              <DashboardFilters value={filter} onChange={setFilter} />
            </div>
          </div>
        </div>
        <div className="mt-7 px-0 sm:px-2 w-full">
          <h2 className="text-lg font-bold text-green-800 mb-3">🌿 Best in your area</h2>
          {/* ADD fade-in/slide animation for plant list */}
          <div className="animate-fade-in">
            <DashboardPlantList
              search={search}
              range={range}
              filter={filter}
              minPrice={minPrice}
              maxPrice={maxPrice}
            />
          </div>
        </div>
        <div className="w-full flex justify-center mt-12">
          {/* Post Plant call-to-action */}
          <div className="bg-green-100 border border-green-300 rounded-2xl px-6 py-6 flex flex-col items-center shadow-sm max-w-sm w-full">
            <span className="text-green-900 font-semibold text-center text-base mb-2">
              Want to sell or give away a plant?
            </span>
            {/* Insert the functional PostPlantForm */}
            <div className="w-full mt-2">
              <PostPlantForm
                afterPost={() => {
                  window.location.reload();
                }}
              />
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
