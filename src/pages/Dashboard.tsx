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
  // Persist location-detected in sessionStorage for the active session
  const [locationDetected, setLocationDetected] = useState(() => {
    return !!sessionStorage.getItem("dashboard_location_detected");
  });

  // Only try to detect if user hasn't already typed a search this session
  const { city: detectedCity, loading: locationLoading, error: locationError } =
    useUserLocationCity(!locationDetected && !search);

  // When user city is detected, set as search only if it hasn't been set
  useEffect(() => {
    if (detectedCity && !locationDetected && !search) {
      setSearch(detectedCity);
      setLocationDetected(true);
      sessionStorage.setItem("dashboard_location_detected", "1");
      toast({
        title: "Localized for you",
        description: `Showing plants near ${detectedCity}`,
      });
    }
    if (locationError && !locationDetected && !search) {
      setLocationDetected(true); // Prevent repeated requests
      sessionStorage.setItem("dashboard_location_detected", "1");
      toast({
        title: "Location not detected",
        description: "Please enter your city above to find local plants.",
        variant: "destructive",
      });
    }
  }, [detectedCity, locationError, locationDetected, search]);

  // On logout/login/session change, clear flag if needed
  useEffect(() => {
    // When user signs out, clear the flag
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!session) {
        sessionStorage.removeItem("dashboard_location_detected");
        setLocationDetected(false);
      }
    });
    return () => subscription.unsubscribe();
  }, []);

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
    <main className="min-h-screen flex flex-col items-center bg-gradient-to-br from-green-100/70 via-white/90 to-green-50/70 dark:bg-gradient-to-br dark:from-[#181f1a] dark:via-[#222b22]/90 dark:to-[#181f1a]/80 px-1 sm:px-4 lg:px-0 pb-16 relative transition-colors">
      {/* Main glass-card wrapper */}
      <div className="w-full max-w-5xl flex flex-col gap-8 mt-8 pb-24">
        {/* Improved Header Card: 3 columns - left (spacer), center (logo), right (avatar + post) */}
        <div className="flex items-center justify-between w-full px-0">
          {/* Left spacer */}
          <div className="flex-1 min-w-0" />
          {/* Center Sproutsly symbol */}
          <div className="flex flex-1 justify-center items-center pointer-events-none select-none">
            <span className="rounded-full bg-green-600/90 dark:bg-green-800/70 shadow-lg ring-2 ring-white/60 border-2 border-green-300/40 dark:border-green-800 p-2 sm:p-2.5 backdrop-blur-md flex items-center justify-center text-2xl sm:text-3xl animate-fade-in">
              🍃
            </span>
          </div>
          {/* Right side: Profile avatar and Post Plant */}
          <div className="flex justify-end items-center flex-1 gap-2 sm:gap-4 pl-0 sm:pl-4">
            <DashboardProfileAvatar />
            <Sheet open={isPostSheetOpen} onOpenChange={setIsPostSheetOpen}>
              <SheetTrigger asChild>
                <Button
                  variant="default"
                  className="bg-green-700 hover:bg-green-800 text-white shadow-xl rounded-xl px-4 sm:px-5 py-2 flex gap-2 items-center font-bold
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

        {/* Search + Filters Section Card */}
        <div className="w-full backdrop-blur-sm bg-white/85 dark:bg-[#202824]/80 border border-green-100/60 dark:border-[#222f25]/80 rounded-3xl shadow-2xl ring-1 ring-white/20 py-7 px-4 sm:px-10 flex flex-col gap-5
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
          <h2 className="text-2xl md:text-3xl font-extrabold text-green-800/90 dark:text-green-100 tracking-tight mb-1 drop-shadow-sm select-none">
            🌿 Best in your area
          </h2>
          {/* Future sort/settings could go here */}
        </div>
        {/* Plant List */}
        <div className="px-0 sm:px-2 w-full">
          <div className="backdrop-blur-sm bg-white/75 dark:bg-[#232a26]/80 border border-green-100/50 dark:border-[#223128]/60 rounded-2xl shadow-lg animate-fade-in p-2 sm:p-4 transition-all duration-300
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
      <div className="fixed inset-0 pointer-events-none z-0 bg-gradient-to-br from-white/30 via-green-100/20 to-white/5 dark:from-[#202824]/40 dark:via-[#232a26]/20 dark:to-[#181f1a]/20" />
    </main>
  );
}
