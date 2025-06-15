
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
    <main className="min-h-screen flex flex-col items-center bg-gradient-to-br from-green-50 to-white px-1 sm:px-4 lg:px-0 pb-16">
      <div className="w-full max-w-5xl flex flex-col gap-7 mt-6">
        {/* Header Card: Avatar + Post Plant */}
        <div className="flex justify-between items-start w-full px-0">
          <div className="flex-1">
            <div className="bg-white/80 shadow-lg rounded-2xl flex items-center gap-4 py-3 pl-4 pr-2 sm:pl-6 sm:pr-3 border border-green-100">
              <DashboardProfileAvatar />
              <div className="flex-1 min-w-[1px]" />
              {/* Post plant button appears to the right */}
              <Sheet open={isPostSheetOpen} onOpenChange={setIsPostSheetOpen}>
                <SheetTrigger asChild>
                  <Button
                    variant="default"
                    className="bg-green-700 hover:bg-green-800 text-white shadow-xl rounded-xl px-5 py-2 flex gap-2 items-center font-bold"
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
        <div className="w-full bg-white/80 rounded-2xl shadow-lg border border-green-100 py-5 px-4 sm:px-8 flex flex-col gap-4">
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
        {/* Section heading */}
        <div className="mt-1 px-1 sm:px-2 w-full flex items-center justify-between">
          <h2 className="text-xl md:text-2xl font-extrabold text-green-800 tracking-tight mb-1">
            🌿 Best in your area
          </h2>
          {/* Future: can add sort or more options here */}
        </div>
        {/* Plants List */}
        <div className="px-0 sm:px-2 w-full">
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
      </div>
      <BottomTabNav />
    </main>
  );
}
