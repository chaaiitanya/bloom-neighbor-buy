
import { MapPin, Image, MessageCircle, User, MessagesSquare } from "lucide-react";

const tabs = [
  { label: "Home", icon: MapPin, route: "/" },
  { label: "Post", icon: Image, route: "/post" },
  { label: "Chat", icon: MessageCircle, route: "/chat" },
  { label: "Profile", icon: User, route: "/profile" },
];

import { useLocation, useNavigate } from "react-router-dom";

export default function BottomTabNav() {
  const location = useLocation();
  const navigate = useNavigate();

  return (
    <nav className="fixed bottom-0 inset-x-0 bg-white dark:bg-[#161b16] border-t border-green-100 dark:border-[#233024] flex justify-around items-center z-50 h-16 shadow-[0_-2px_16px_0_rgba(34,197,94,0.03)]">
      {tabs.map(tab => {
        const active = location.pathname === tab.route;
        return (
          <button
            aria-label={tab.label}
            key={tab.label}
            className={`flex flex-col items-center justify-center flex-1 py-2 ${
              active
                ? "text-green-600 dark:text-green-200 font-bold"
                : "text-gray-400 dark:text-gray-500"
            } transition`}
            onClick={() => navigate(tab.route)}
          >
            <tab.icon size={26} strokeWidth={active ? 2.5 : 2} />
            <span className="text-xs mt-1">{tab.label}</span>
          </button>
        );
      })}
    </nav>
  );
}

