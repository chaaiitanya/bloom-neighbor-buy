
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

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

export function usePlantsWithSellers() {
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
      // Step 3: Fetch seller profiles in one batch (id, full_name)
      let profileMap: Record<string, string> = {};
      if (userIds.length > 0) {
        const { data: profiles, error: profileErr } = await supabase
          .from("profiles")
          .select("id, full_name")
          .in("id", userIds);

        if (profiles && !profileErr) {
          // Map id to full_name (allow null or empty fallback)
          for (const profile of profiles) {
            profileMap[profile.id] = profile.full_name?.trim() || "";
          }
        }
      }

      // Step 4: Map plants adding correct seller name and description
      const transformed: PlantRaw[] = data.map((plant: any) => {
        const hasFullName = plant.user_id && profileMap[plant.user_id] && profileMap[plant.user_id].length > 0;
        return {
          id: plant.id,
          name: plant.name,
          price: Number(plant.price),
          photo_url: plant.photo_url,
          distance: "—",
          location: plant.location ?? "Unlisted",
          sellerId: plant.user_id,
          // Prefer full name, else show "Unknown Seller"
          seller: hasFullName
            ? profileMap[plant.user_id]
            : "Unknown Seller",
          description: plant.description ?? null,
          type: "all",
        };
      });

      setPlants(transformed);
      setLoading(false);
    }

    fetchPlantsWithProfileNames();
  }, []);

  return { plants, loading, error };
}

