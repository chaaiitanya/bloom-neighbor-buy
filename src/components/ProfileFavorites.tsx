
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import PlantDetailDrawer from "@/components/PlantDetailDrawer";
import { PlantCard } from "@/components/PlantCard";

export default function ProfileFavorites() {
  const [plants, setPlants] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedPlant, setSelectedPlant] = useState<any | null>(null);
  const [myUserId, setMyUserId] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      const { data: userObj } = await supabase.auth.getUser();
      const user_id = userObj.user?.id;
      setMyUserId(user_id || null);
      if (!user_id) return setLoading(false);

      // Step 1: Get favorites.
      const { data: favs } = await supabase.from("favorites").select("*").eq("user_id", user_id);
      if (favs && favs.length) {
        const plantIds = favs.map(f => f.plant_id);
        // Step 2: Fetch plants and join profiles to get seller info.
        const { data: allPlants } = await supabase
          .from("plants")
          .select(`
            *,
            profiles: user_id (full_name, avatar_url, rating)
          `)
          .in("id", plantIds);
        // Step 3: Adapt plant data for PlantCard and PlantDetailDrawer
        const mapped = (allPlants || []).map(plant => ({
          id: plant.id,
          name: plant.name,
          price: `$${plant.price}`,
          image: plant.photo_url ?? "/placeholder.svg",
          distance: plant.distance ?? "—",
          location: plant.location ?? "Unlisted",
          seller: plant.profiles?.full_name ??
            (plant.user_id ? plant.user_id.slice(0, 6) : "Unknown"),
          sellerId: plant.user_id,
          sellerAvatar: plant.profiles?.avatar_url ?? "",
          sellerRating: typeof plant.profiles?.rating === "number" ? Number(plant.profiles.rating) : 4.6,
          sellerSales: 22, // Placeholder - replace if you have sales data
          additionalDetails: plant.description ?? "",
          type: plant.type ?? "all"
        }));
        setPlants(mapped);
      } else {
        setPlants([]);
      }
      setLoading(false);
    })();
  }, []);

  if (loading) return <div className="text-center my-4">Loading favorites…</div>;
  return (
    <div className="w-full mt-2">
      <div className="font-semibold text-green-800 dark:text-green-100 mb-2">Favorite Plants</div>
      {plants.length === 0 ? (
        <div className="text-gray-500 dark:text-green-200/80">No favorites yet</div>
      ) : (
        <>
          <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {plants.map(plant => (
              <li
                key={plant.id}
                // Make entire card clickable
                onClick={() => setSelectedPlant(plant)}
                className="cursor-pointer"
              >
                <PlantCard
                  {...plant}
                  onClick={() => setSelectedPlant(plant)}
                  id={plant.id}
                />
              </li>
            ))}
          </ul>
          <PlantDetailDrawer
            open={!!selectedPlant}
            plant={selectedPlant}
            onClose={() => setSelectedPlant(null)}
          />
        </>
      )}
    </div>
  );
}
