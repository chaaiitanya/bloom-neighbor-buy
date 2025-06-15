
import { useNavigate } from "react-router-dom";
import { useState, useRef, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import BottomTabNav from "@/components/BottomTabNav";
import GlassHeader from "@/components/GlassHeader";
import WelcomeSection from "@/components/WelcomeSection";
import SearchBar from "@/components/SearchBar";
import LoginBar from "@/components/LoginBar";
import SproutslyDetails from "@/components/SproutslyDetails";
import FavoritePlants from "@/components/FavoritePlants";
import DashboardPlantList from "@/components/DashboardPlantList";

const bgImage = "/lovable-uploads/57e20818-f97d-4a73-ba99-7f6eedf5d5f9.png";

const Index = () => {
  const navigate = useNavigate();
  const [plantType, setPlantType] = useState("All");
  const [search, setSearch] = useState("");
  const [headerVisible, setHeaderVisible] = useState(false);
  const welcomeRef = useRef<HTMLDivElement>(null);

  // Track session state
  const [session, setSession] = useState<any>(null);

  useEffect(() => {
    // Listen for session changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    // Check for existing session on mount
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);

      // Redirect to dashboard if logged in
      if (session?.user) {
        navigate("/dashboard", { replace: true });
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [navigate]);

  // Show glass header when welcome section is out of viewport
  useEffect(() => {
    const ref = welcomeRef.current;
    if (!ref) return;

    const observer = new window.IntersectionObserver(
      ([entry]) => {
        setHeaderVisible(!entry.isIntersecting);
      },
      {
        root: null,
        threshold: 0.1,
      }
    );

    observer.observe(ref);
    return () => observer.disconnect();
  }, []);

  // Filter state mapping for demo: map plantType to dashboard filter
  function getDashboardFilter(pt: string) {
    // Dashboard expects: "all" | "indoor" | "outdoor" | "succulent" | "flower"
    if (!pt || pt === "All") return "all";
    if (pt === "Flower") return "flower";
    if (pt === "Cactus" || pt === "Herb" || pt === "Shrub" || pt === "Vine" || pt === "Rare" || pt === "Tree") return "indoor"; // Fallback mapping for demo types
    if (pt === "Succulent") return "succulent";
    if (pt === "Outdoor") return "outdoor";
    return "all";
  }

  const dashboardFilter = getDashboardFilter(plantType);

  return (
    <div className="relative min-h-screen flex flex-col items-center justify-start overflow-x-hidden">
      {/* BACKGROUND IMAGE (behind everything) */}
      <div
        className="absolute inset-0 -z-10"
        style={{
          backgroundImage: `url(${bgImage})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      />
      {/* BLACK OVERLAY */}
      <div className="absolute inset-0 -z-10 bg-black/70" />

      {/* GLASS HEADER that appears after scrolling past welcome */}
      <GlassHeader visible={headerVisible} />

      {/* Main content */}
      <main className="relative z-10 flex flex-col w-full max-w-2xl mx-auto px-2">
        <WelcomeSection ref={welcomeRef} />
        {/* Pass up search and plantType state, and add a setter for search */}
        <SearchBar
          plantType={plantType}
          setPlantType={setPlantType}
          setSearch={setSearch}
        />
        {/* Live plant results list from Dashboard */}
        <div className="w-full mt-1">
          <DashboardPlantList search={search} filter={dashboardFilter} />
        </div>
        <LoginBar />
        <div className="h-14 md:h-20" />
        <SproutslyDetails />
        <FavoritePlants />
      </main>
      {/* Show BottomTabNav only if logged in */}
      {!!session && <BottomTabNav />}
    </div>
  );
};

export default Index;
