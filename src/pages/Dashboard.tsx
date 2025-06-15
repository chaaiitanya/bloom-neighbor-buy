
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
import { Sheet, SheetTrigger, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

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
  const [isPostSheetOpen, setIsPostSheetOpen] = useState(false);

  // When the URL search param changes, update local search bar!
  useEffect(() => {
    setSearch(getQueryParam(location.search, "search"));
  }, [location.search]);

  // Handler to refresh plant list after submit
  const handleAfterPost = () => {
    setIsPostSheetOpen(false);
    window.location.reload();
  };

  return (
    <main className="min-h-screen flex flex-col items-center bg-gradient-to-br from-green-50 to-white px-2 sm:px-4 lg:px-12 pb-10">
      <div className="w-full flex flex-col gap-4 mt-6">
        {/* Header: Avatar top-left, Post Plant top-right */}
        <div className="flex justify-between items-start w-full">
          <DashboardProfileAvatar />

          {/* Top-right: Post a Plant button */}
          <Sheet open={isPostSheetOpen} onOpenChange={setIsPostSheetOpen}>
            <SheetTrigger asChild>
              <Button
                variant="default"
                className="bg-green-700 hover:bg-green-800 text-white shadow-lg rounded-xl px-5 py-2 flex gap-2 items-center font-bold"
                aria-label="Post a Plant"
              >
                <Plus className="w-5 h-5" />
                <span className="hidden sm:inline">Post a Plant</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="max-w-md w-full border-l">
              <SheetHeader>
                <SheetTitle className="text-xl text-green-900 font-semibold">Post a Plant</SheetTitle>
              </SheetHeader>
              <PostPlantForm afterPost={handleAfterPost} />
            </SheetContent>
          </Sheet>
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
        {/* Removed the PostPlantForm call-to-action card here */}
      </div>
    </main>
  );
}
