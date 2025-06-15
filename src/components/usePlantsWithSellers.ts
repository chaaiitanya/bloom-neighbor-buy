import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import cityCoordinates from "./cityCoordinates";
import { getCityDistanceKm } from "./cityDistanceUtils";

// Type definitions matching the old DashboardPlantList
export type PlantRaw = {
  id: string;
  name: string;
  price: number;
  photo_url: string | null;
  distance: string | null;
  location: string | null;
  sellerId: string;
  seller: string;
  description?: string | null;
  type?: string;
};

export function usePlantsWithSellers(userCity?: string) {
  const [plants, setPlants] = useState<PlantRaw[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    setError(null);

    async function fetchPlantsWithProfileNames() {
      // Step 1: Get ALL plants, now including description.
      let { data, error } = await supabase
        .from("plants")
        .select(`
          id,
          name,
          price,
          photo_url,
          description,
          location,
          user_id,
          created_at
        `)
        .order("created_at", { ascending: false });

      if (error) {
        setError("Could not fetch plants.");
        setLoading(false);
        return;
      }

      if (!data) {
        setError("No data received.");
        setLoading(false);
        return;
      }

      // Step 2: Collect unique seller IDs
      const userIds = Array.from(
        new Set(data.map((plant: any) => plant.user_id).filter(Boolean))
      );
      
      let profileMap: Record<string, { full_name?: string; first_name?: string; last_name?: string }> = {};
      if (userIds.length > 0) {
        const { data: profiles, error: profileErr } = await supabase
          .from("profiles")
          .select("id, full_name, first_name, last_name")
          .in("id", userIds);

        if (profiles && !profileErr) {
          for (const profile of profiles) {
            profileMap[profile.id] = {
              full_name: profile.full_name?.trim() || "",
              first_name: profile.first_name?.trim() || "",
              last_name: profile.last_name?.trim() || "",
            };
          }
        }

        // Log the profiles for debugging!
        console.log("Profile Map:", profileMap);
      }

      // Step 4: Map plants adding correct seller name and description
      const transformed: PlantRaw[] = data.map((plant: any) => {
        // Get seller-naming priority: full_name > `${first_name} ${last_name}` > Unknown Seller
        const profile = plant.user_id && profileMap[plant.user_id] ? profileMap[plant.user_id] : null;
        let sellerName = "Unknown Seller";
        if (profile) {
          if (profile.full_name && profile.full_name.length > 0) {
            sellerName = profile.full_name;
          } else if ((profile.first_name && profile.first_name.length > 0) || (profile.last_name && profile.last_name.length > 0)) {
            const nameArr = [profile.first_name, profile.last_name].filter(Boolean);
            sellerName = nameArr.length ? nameArr.join(" ") : "Unknown Seller";
          }
        }

        console.log(
          `[Plant "${plant.name}"] SellerId: ${plant.user_id} | Seller Name: "${sellerName}"`
        );

        // Calculate city-to-city distance if both cities known, else use "—"
        const sellerCity = plant.location || "";
        const userCityValue = userCity || "";
        const cityDistance = getCityDistanceKm(userCityValue, sellerCity);

        return {
          id: plant.id,
          name: plant.name,
          price: Number(plant.price),
          photo_url: plant.photo_url,
          distance: cityDistance,
          location: plant.location ?? "Unlisted",
          sellerId: plant.user_id,
          seller: sellerName,
          description: plant.description ?? null,
          type: "all",
        };
      });

      // Debug print all mapped plants and sellers
      console.log("Mapped Plants:", transformed);

      setPlants(transformed);
      setLoading(false);
    }

    fetchPlantsWithProfileNames();
  }, [userCity]);

  return { plants, loading, error };
}
