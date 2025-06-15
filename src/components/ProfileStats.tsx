
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

export default function ProfileStats() {
  const [sales, setSales] = useState(0);

  useEffect(() => {
    (async () => {
      const { data: u } = await supabase.auth.getUser();
      if (u.user) {
        const { count } = await supabase
          .from("transactions")
          .select("id", { count: "exact", head: true })
          .eq("seller_id", u.user.id);
        setSales(count ?? 0);
      }
    })();
  }, []);

  return (
    <div className="w-full flex items-center justify-center gap-3 px-2">
      <div>
        <div className="text-green-900 font-bold text-xl">{sales}</div>
        <div className="text-xs text-gray-500">Total Sales</div>
      </div>
    </div>
  );
}
