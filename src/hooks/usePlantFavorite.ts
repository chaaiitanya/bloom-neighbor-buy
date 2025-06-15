
import { useEffect, useState, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";

export function usePlantFavorite(plantId?: string) {
  const [isFavorite, setIsFavorite] = useState(false);
  const [loading, setLoading] = useState(false);
  const [favId, setFavId] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;
    async function fetchFavorite() {
      if (!plantId) return;
      setLoading(true);
      const { data: userRes } = await supabase.auth.getUser();
      const userId = userRes.user?.id;
      if (!userId) return;
      const { data, error } = await supabase
        .from("favorites")
        .select("*")
        .eq("user_id", userId)
        .eq("plant_id", plantId)
        .maybeSingle();
      if (!mounted) return;
      setIsFavorite(!!data);
      setFavId(data?.id ?? null);
      setLoading(false);
    }
    fetchFavorite();
    return () => { mounted = false; };
  }, [plantId]);

  const toggleFavorite = useCallback(async () => {
    setLoading(true);
    const { data: userRes } = await supabase.auth.getUser();
    const userId = userRes.user?.id;
    if (!userId || !plantId) {
      setLoading(false);
      return { success: false, error: "Must be logged in" };
    }
    if (isFavorite && favId) {
      const { error } = await supabase.from("favorites").delete().eq("id", favId);
      if (!error) setIsFavorite(false);
      setFavId(null);
      setLoading(false);
      return { success: !error, error: error?.message || undefined };
    } else {
      const { data, error } = await supabase
        .from("favorites")
        .insert({ user_id: userId, plant_id: plantId })
        .select()
        .maybeSingle();
      if (!error && data) {
        setFavId(data.id);
        setIsFavorite(true);
      }
      setLoading(false);
      return { success: !error, error: error?.message || undefined };
    }
  }, [isFavorite, favId, plantId]);

  return { isFavorite, toggleFavorite, loading };
}
