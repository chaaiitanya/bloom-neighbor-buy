
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

export default function ProfileFavorites() {
  const [plants, setPlants] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const { data: userObj } = await supabase.auth.getUser();
      const user_id = userObj.user?.id;
      if (!user_id) return;
      const { data: favs } = await supabase.from("favorites").select("*").eq("user_id", user_id);
      if (favs && favs.length) {
        const plantIds = favs.map(f => f.plant_id);
        const { data: allPlants } = await supabase.from("plants").select("*").in("id", plantIds);
        setPlants(allPlants || []);
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
        <ul className="grid grid-cols-2 gap-3">
          {plants.map(plant => (
            <li
              key={plant.id}
              className="p-3 rounded-xl border border-green-100 dark:border-[#223128] bg-white dark:bg-[#181f1a]/85 shadow-sm transition-colors"
            >
              <div className="font-bold text-green-800 dark:text-green-100">{plant.name}</div>
              <div className="text-green-700 dark:text-green-300">${plant.price}</div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
