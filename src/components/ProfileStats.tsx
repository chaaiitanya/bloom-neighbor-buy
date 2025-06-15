
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

export default function ProfileStats() {
  const [sales, setSales] = useState(0);
  const [rating, setRating] = useState<number | null>(null);

  useEffect(() => {
    (async () => {
      const { data: u } = await supabase.auth.getUser();
      if (u.user) {
        const { data: prof } = await supabase.from("profiles").select("*").eq("id", u.user.id).single();
        setRating(prof?.rating ?? null);
        const { count } = await supabase.from("transactions").select("id", { count: "exact", head: true }).eq("seller_id", u.user.id);
        setSales(count ?? 0);
      }
    })();
  }, []);

  return (
    <div className="w-full flex items-center justify-between gap-3 px-2">
      <div>
        <div className="text-green-900 font-bold text-xl">{rating ?? "-"}</div>
        <div className="text-xs text-gray-500">Rating</div>
      </div>
      <div>
        <div className="text-green-900 font-bold text-xl">{sales}</div>
        <div className="text-xs text-gray-500">Total Sales</div>
      </div>
    </div>
  );
}
