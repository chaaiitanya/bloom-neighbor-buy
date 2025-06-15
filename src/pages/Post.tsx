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
    <div className="min-h-screen flex flex-col pb-20 bg-gradient-to-br from-green-50 to-white dark:bg-gradient-to-br dark:from-[#181f1a] dark:to-[#232a26]/80 transition-colors">
      <h2 className="pt-8 text-center text-green-900 dark:text-green-100 font-bold text-2xl">Post a Plant</h2>
      <div className="flex-1 mt-4 px-3">
        {/* Card wrapper for form in dark mode */}
        <div className="max-w-lg mx-auto bg-white/80 dark:bg-[#21271f]/85 rounded-2xl p-3 sm:p-6 shadow-lg border border-green-100 dark:border-[#223128]">
          <PostPlantForm />
        </div>
      </div>
      <BottomTabNav />
    </div>
  );
}
