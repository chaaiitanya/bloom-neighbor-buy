
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

type Trx = {
  id: string;
  plant_id: string;
  price: number;
  sold_at: string;
  buyer_id: string;
  seller_id: string;
  plant_name?: string;
};

export default function ProfileTransactions() {
  const [history, setHistory] = useState<Trx[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const { data: userObj } = await supabase.auth.getUser();
      const user_id = userObj.user?.id;
      if (!user_id) return;
      // As seller or buyer
      const { data: txs } = await supabase
        .from("transactions")
        .select("*")
        .or(`buyer_id.eq.${user_id},seller_id.eq.${user_id}`)
        .order("sold_at", { ascending: false });

      // Fetch plant names for display
      if (txs && txs.length) {
        const plantIds = txs.map(t => t.plant_id);
        const { data: plants } = await supabase.from("plants").select("id,name");
        setHistory(
          txs.map(tr => ({
            ...tr,
            plant_name: plants?.find(p => p.id === tr.plant_id)?.name || "",
          }))
        );
      } else {
        setHistory([]);
      }
      setLoading(false);
    })();
  }, []);

  if (loading) return <div className="text-center my-5">Loading transaction history…</div>;

  return (
    <div className="w-full mt-2">
      <div className="font-semibold text-green-800 mb-2">Transaction History</div>
      {history.length === 0 && (
        <div className="text-gray-500">No transactions yet</div>
      )}
      <ul className="space-y-2">
        {history.map(tr => (
          <li key={tr.id} className="rounded-xl border border-green-100 px-3 py-2 bg-white shadow-sm flex justify-between items-center">
            <span>
              {tr.seller_id === tr.buyer_id ? "Self" : tr.buyer_id ? "Bought" : "Sold"}{" "}
              <span className="font-medium">{tr.plant_name || "Plant"}</span>
            </span>
            <span className="font-semibold">${tr.price}</span>
            <span className="text-xs text-gray-500">{new Date(tr.sold_at).toLocaleDateString()}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
