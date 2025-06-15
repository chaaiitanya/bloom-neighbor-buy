
import { useEffect, useState } from "react";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { User, LogOut, Star, Heart, FileText, QrCode, Share2, Settings } from "lucide-react";

export default function DashboardProfileAvatar() {
  const [user, setUser] = useState<any>(null);
  const navigate = useNavigate();

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      setUser(data.user);
    });
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/auth");
  };

  const displayName = user?.user_metadata?.full_name || user?.email || "User";
  const avatarUrl =
    user?.user_metadata?.avatar_url ||
    `https://ui-avatars.com/api/?name=${encodeURIComponent(
      user?.user_metadata?.full_name || displayName
    )}&size=128&background=BBF7D0&color=047857&font-size=0.45`;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button aria-label="Open profile menu">
          <Avatar className="w-12 h-12 bg-green-100 border-[3px] border-green-300 shadow-md hover:scale-105 transition">
            {user?.user_metadata?.avatar_url ? (
              <AvatarImage src={avatarUrl} alt={displayName} />
            ) : (
              <AvatarFallback>
                <User className="w-8 h-8 text-green-600" strokeWidth={2.5} />
              </AvatarFallback>
            )}
          </Avatar>
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56 mt-2">
        <div className="flex items-center gap-3 px-3 py-2">
          <Avatar className="w-10 h-10 bg-green-100 border-[2px] border-green-300">
            {user?.user_metadata?.avatar_url ? (
              <AvatarImage src={avatarUrl} alt={displayName} />
            ) : (
              <AvatarFallback>
                <User className="w-6 h-6 text-green-600" strokeWidth={2.5} />
              </AvatarFallback>
            )}
          </Avatar>
          <div className="flex-1">
            <div className="text-sm font-semibold text-green-900">{displayName}</div>
            <div className="text-xs text-gray-500">{user?.email}</div>
          </div>
        </div>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          onClick={() => navigate("/profile/info")}
          className="gap-2"
        >
          <Settings className="w-4 h-4 text-green-600" />
          Profile Info
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => navigate("/profile/stats")}
          className="gap-2"
        >
          <Star className="w-4 h-4 text-yellow-500" />
          Stats
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => navigate("/profile/favorites")}
          className="gap-2"
        >
          <Heart className="w-4 h-4 text-red-500" />
          Favorites
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => navigate("/profile/transactions")}
          className="gap-2"
        >
          <FileText className="w-4 h-4 text-green-700" />
          History
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => navigate("/profile/share")}
          className="gap-2"
        >
          <QrCode className="w-4 h-4 text-green-600" />
          QR / Share
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => navigate("/profile/account")}
          className="gap-2"
        >
          <Share2 className="w-4 h-4 text-green-600" />
          Account
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          onClick={handleLogout}
          className="gap-2 text-red-600 font-semibold"
        >
          <LogOut className="w-4 h-4" />
          Log out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
