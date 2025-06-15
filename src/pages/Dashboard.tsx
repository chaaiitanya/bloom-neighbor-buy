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
import {
  Sheet,
  SheetTrigger,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { useUserLocationCity } from "@/hooks/useUserLocationCity";
import { toast } from "@/components/ui/use-toast";
import BottomTabNav from "@/components/BottomTabNav"; // ADDED

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

  // ---- auto-location detection ----
  // Only try to detect if user hasn't already typed a search this session
  const [locationDetected, setLocationDetected] = useState(false);
  const { city: detectedCity, loading: locationLoading, error: locationError } =
    useUserLocationCity(!locationDetected && !search);

  // When user city is detected, set as search only if it hasn't been set
  useEffect(() => {
    if (detectedCity && !locationDetected && !search) {
      setSearch(detectedCity);
      setLocationDetected(true);
      toast({
        title: "Localized for you",
        description: `Showing plants near ${detectedCity}`,
      });
    }
    if (locationError && !locationDetected && !search) {
      setLocationDetected(true); // Prevent repeated requests
      toast({
        title: "Location not detected",
        description: "Please enter your city above to find local plants.",
        variant: "destructive",
      });
    }
  }, [detectedCity, locationError, locationDetected, search, toast]);

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
    <main className="min-h-screen flex flex-col items-center bg-gradient-to-br from-green-100/70 via-white/90 to-green-50/70 px-1 sm:px-4 lg:px-0 pb-16 relative">
      {/* Main glass-card wrapper */}
      <div className="w-full max-w-5xl flex flex-col gap-8 mt-8 pb-24">
        {/* Header Card: Avatar + Sproutsly symbol + Post Plant */}
        <div className="flex justify-between items-start w-full px-0">
          <div className="flex-1">
            <div className="backdrop-blur-sm bg-white/80 shadow-2xl border border-green-100/60 rounded-3xl flex items-center gap-4 py-4 pl-5 pr-3 sm:pl-8 sm:pr-4 ring-1 ring-white/30
              transition-all duration-300 hover:scale-105 hover:shadow-green-200/50 hover:ring-2 hover:ring-green-200/70">
              {/* Avatar (left) */}
              <DashboardProfileAvatar />

              {/* Center Sproutsly symbol */}
              <div className="flex-1 flex justify-center items-center pointer-events-none select-none">
                <span className="rounded-full bg-green-600/90 shadow-lg ring-2 ring-white/60 border-2 border-green-300/40 p-2 sm:p-2.5 backdrop-blur-md flex items-center justify-center animate-fade-in">
                  {/* Leaf/Sprout Lucide icon */}
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-8 h-8 text-white drop-shadow-md" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M8.5 22c2.5-8.5-2-13-7.5-15.63M15.5 22c-2.5-8.5 2-13 7.5-15.63M12 7c.35 2.2 2.34 4 5 4 2.21 0 4-1.79 4-4C21 3.13 17.5 2 15.5 2c-1.51 0-3.34.74-4.5 2C10.34 2.74 8.51 2 7 2 5 2 1.5 3.13 1.5 7c0 2.21 1.79 4 4 4 2.66 0 4.65-1.8 5-4Z"/>
                  </svg>
                </span>
              </div>

              {/* Post Plant button (right) */}
              <Sheet open={isPostSheetOpen} onOpenChange={setIsPostSheetOpen}>
                <SheetTrigger asChild>
                  <Button
                    variant="default"
                    className="bg-green-700 hover:bg-green-800 text-white shadow-xl rounded-xl px-5 py-2 flex gap-2 items-center font-bold
                      transition-transform duration-200 hover:scale-105 hover:shadow-green-500/30"
                    aria-label="Post a Plant"
                  >
                    <Plus className="w-5 h-5" />
                    <span className="hidden sm:inline">Post a Plant</span>
                  </Button>
                </SheetTrigger>
                <SheetContent side="right" className="max-w-md w-full border-l">
                  <SheetHeader>
                    <SheetTitle className="text-xl text-green-900 font-semibold">
                      Post a Plant
                    </SheetTitle>
                  </SheetHeader>
                  <PostPlantForm afterPost={handleAfterPost} />
                </SheetContent>
              </Sheet>
            </div>
          </div>
        </div>

        {/* Search + Filters Section Card */}
        <div className="w-full backdrop-blur-sm bg-white/85 border border-green-100/60 rounded-3xl shadow-2xl ring-1 ring-white/20 py-7 px-4 sm:px-10 flex flex-col gap-5
          transition-all duration-300 hover:scale-105 hover:ring-2 hover:ring-green-200/70 hover:shadow-green-100/60">
          <DashboardSearchBar value={search} onChange={setSearch} />
          {/* Category filters row */}
          <div className="flex flex-col sm:flex-row items-center gap-3 flex-wrap w-full">
            {/* Filter Popover (Range + Price) */}
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
        {/* Section heading */}
        <div className="mt-1 px-2 w-full flex items-center justify-between">
          <h2 className="text-2xl md:text-3xl font-extrabold text-green-800/90 tracking-tight mb-1 drop-shadow-sm select-none">
            🌿 Best in your area
          </h2>
          {/* Future sort/settings could go here */}
        </div>
        {/* Plant List */}
        <div className="px-0 sm:px-2 w-full">
          <div className="backdrop-blur-sm bg-white/75 border border-green-100/50 rounded-2xl shadow-lg animate-fade-in p-2 sm:p-4 transition-all duration-300
              hover:scale-105 hover:shadow-green-100/60 hover:ring-2 hover:ring-green-200/60">
            <DashboardPlantList
              search={search}
              range={range}
              filter={filter}
              minPrice={minPrice}
              maxPrice={maxPrice}
            />
          </div>
        </div>
      </div>
      <BottomTabNav />
      {/* Extra layer for glass-like bright edge, less blur for clarity */}
      <div className="fixed inset-0 pointer-events-none z-0 bg-gradient-to-br from-white/30 via-green-100/20 to-white/5" />
    </main>
  );
}
