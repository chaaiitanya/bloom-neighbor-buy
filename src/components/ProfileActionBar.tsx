
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
    <ul className="w-full flex flex-col gap-3 shadow-lg rounded-2xl bg-white dark:bg-[#161c17]/95 border border-green-100 dark:border-[#223128] py-3 px-2 animate-fade-in transition-colors">
      {MENU.map((item) => (
        <li key={item.label}>
          <button
            onClick={() => navigate(item.route)}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-green-50 dark:hover:bg-[#223128]/80 group transition text-green-800 dark:text-green-100 font-medium focus:outline-none focus:ring-2 focus:ring-green-200 dark:focus:ring-green-800"
            aria-label={item.label}
          >
            <span className="mr-2">
              {item.icon}
            </span>
            <span className="text-base group-hover:text-green-700 dark:group-hover:text-green-300 transition">
              {item.label}
            </span>
          </button>
        </li>
      ))}
      <li>
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-red-50 dark:hover:bg-[#232a26]/80 transition text-red-700 dark:text-red-400 font-semibold border-t border-green-100 dark:border-[#223128] mt-1 focus:outline-none focus:ring-2 focus:ring-red-200 dark:focus:ring-red-900"
        >
          <LogOut className="w-5 h-5" />
          <span className="text-base">Log out</span>
        </button>
      </li>
    </ul>
  );
}

