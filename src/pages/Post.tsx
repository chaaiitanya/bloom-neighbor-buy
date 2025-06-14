
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import PostPlantForm from "@/components/PostPlantForm";
import BottomTabNav from "@/components/BottomTabNav";

export default function Post() {
  const navigate = useNavigate();

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session) {
        navigate("/auth");
      }
    });
  }, [navigate]);

  return (
    <div className="min-h-screen flex flex-col pb-20 bg-gradient-to-br from-green-50 to-white">
      <h2 className="pt-8 text-center text-green-900 font-bold text-2xl">Post a Plant</h2>
      <div className="flex-1 mt-4 px-3">
        <PostPlantForm />
      </div>
      <BottomTabNav />
    </div>
  );
}
