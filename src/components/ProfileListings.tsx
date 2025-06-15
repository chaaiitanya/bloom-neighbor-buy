
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { Loader2 } from "lucide-react";

type Plant = {
  id: string;
  name: string;
  photo_url?: string;
  price: number;
  location?: string;
  created_at?: string;
};

export default function ProfileListings() {
  const [plants, setPlants] = useState<Plant[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchListings = async () => {
      setLoading(true);
      const { data: userRes } = await supabase.auth.getUser();
      if (userRes?.user) {
        const { data, error } = await supabase
          .from("plants")
          .select("*")
          .eq("user_id", userRes.user.id)
          .order("created_at", { ascending: false });
        if (!error && data) setPlants(data as Plant[]);
      }
      setLoading(false);
    };
    fetchListings();
  }, []);

  return (
    <div className="my-4">
      <h3 className="text-green-900 font-bold text-lg mb-2">My Listings</h3>
      {loading ? (
        <div className="flex items-center justify-center py-8 text-green-700">
          <Loader2 className="animate-spin mr-2" />
          Loading...
        </div>
      ) : plants.length === 0 ? (
        <div className="text-center text-green-700 py-8">No listings posted yet.</div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {plants.map(plant => (
            <Card key={plant.id} className="flex flex-col">
              <div className="h-40 w-full bg-green-50 rounded-lg mb-2 overflow-hidden flex items-center justify-center">
                {plant.photo_url ? (
                  <img
                    src={plant.photo_url}
                    alt={plant.name}
                    className="object-cover w-full h-full"
                  />
                ) : (
                  <div className="text-green-400 text-lg">No image</div>
                )}
              </div>
              <div className="flex-1 px-2 pb-3">
                <div className="font-semibold text-green-800">{plant.name}</div>
                <div className="text-green-700 mb-1">${plant.price}</div>
                {plant.location && (
                  <div className="text-xs text-gray-400">{plant.location}</div>
                )}
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
