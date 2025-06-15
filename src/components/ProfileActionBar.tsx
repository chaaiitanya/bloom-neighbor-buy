
import { useNavigate } from "react-router-dom";
import { Settings, Star, Heart, FileText, QrCode, Share2, LogOut } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

function ActionButton({ icon, label, onClick }: { icon: React.ReactNode; label: string; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="flex flex-col items-center justify-center bg-green-50 hover:bg-green-100 transition px-4 py-2 rounded-xl min-w-[60px] text-green-800 shadow border border-green-100"
    >
      <div className="mb-1">{icon}</div>
      <span className="text-xs font-semibold">{label}</span>
    </button>
  );
}

export default function ProfileActionBar() {
  const navigate = useNavigate();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/auth");
  };

  return (
    <div className="w-full flex flex-wrap gap-3 justify-center mb-5 mt-2">
      <ActionButton
        icon={<Settings className="w-5 h-5 text-green-600" />}
        label="Profile Info"
        onClick={() => navigate("/profile")}
      />
      <ActionButton
        icon={<Star className="w-5 h-5 text-yellow-500" />}
        label="Stats"
        onClick={() => navigate("/profile/stats")}
      />
      <ActionButton
        icon={<Heart className="w-5 h-5 text-red-500" />}
        label="Favorites"
        onClick={() => navigate("/profile/favorites")}
      />
      <ActionButton
        icon={<FileText className="w-5 h-5 text-green-700" />}
        label="History"
        onClick={() => navigate("/profile/transactions")}
      />
      <ActionButton
        icon={<QrCode className="w-5 h-5 text-green-600" />}
        label="QR / Share"
        onClick={() => navigate("/profile/share")}
      />
      <ActionButton
        icon={<Share2 className="w-5 h-5 text-green-600" />}
        label="Account"
        onClick={() => navigate("/profile/account")}
      />
      <ActionButton
        icon={<LogOut className="w-5 h-5 text-red-600" />}
        label="Log out"
        onClick={handleLogout}
      />
    </div>
  );
}
