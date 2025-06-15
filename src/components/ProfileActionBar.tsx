
import { useNavigate } from "react-router-dom";
import { Settings, Star, Heart, FileText, QrCode, Share2, LogOut } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

const MENU = [
  {
    icon: <Settings className="w-5 h-5 text-green-600" />,
    label: "Profile Info",
    route: "/profile",
  },
  {
    icon: <Star className="w-5 h-5 text-yellow-500" />,
    label: "Stats",
    route: "/profile/stats",
  },
  {
    icon: <Heart className="w-5 h-5 text-red-500" />,
    label: "Favorites",
    route: "/profile/favorites",
  },
  {
    icon: <FileText className="w-5 h-5 text-green-700" />,
    label: "History",
    route: "/profile/transactions",
  },
  {
    icon: <QrCode className="w-5 h-5 text-green-600" />,
    label: "QR / Share",
    route: "/profile/share",
  },
  {
    icon: <Share2 className="w-5 h-5 text-green-600" />,
    label: "Account",
    route: "/profile/account",
  },
];

export default function ProfileActionBar() {
  const navigate = useNavigate();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/auth");
  };

  return (
    <ul className="w-full flex flex-col gap-2 max-w-md mx-auto mt-2">
      {MENU.map((item) => (
        <li key={item.label}>
          <button
            onClick={() => navigate(item.route)}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl border border-green-100 bg-white hover:bg-green-50 shadow-sm transition text-green-800"
          >
            <span className="mr-2">{item.icon}</span>
            <span className="font-medium">{item.label}</span>
          </button>
        </li>
      ))}
      <li>
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-xl border border-green-100 bg-white hover:bg-red-50 shadow-sm transition text-red-700 font-semibold"
        >
          <LogOut className="w-5 h-5" />
          <span className="font-medium">Log out</span>
        </button>
      </li>
    </ul>
  );
}
