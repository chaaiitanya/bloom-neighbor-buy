
import { useEffect, useState } from "react";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { UserCircle } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";

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

  // Fallback UI if user not loaded
  if (!user) {
    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button aria-label="Open profile options">
            <Avatar className="w-12 h-12 bg-green-100 border-[3px] border-green-300 shadow-md hover:scale-105 transition">
              <AvatarFallback>
                <UserCircle className="w-8 h-8 text-green-600" strokeWidth={2.5} />
              </AvatarFallback>
            </Avatar>
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent
          side="bottom"
          align="start"
          className="animate-fade-in bg-white shadow-lg border border-green-100 rounded-xl min-w-[160px]"
        >
          <DropdownMenuItem onClick={() => navigate("/auth")}>
            Login
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    );
  }

  // If user, prefer their avatar_url, else fallback to Lucide icon
  const displayName = user.email || "User";
  const avatarUrl =
    user.user_metadata?.avatar_url ||
    `https://ui-avatars.com/api/?name=${encodeURIComponent(
      user.user_metadata?.full_name || displayName
    )}&size=128&background=BBF7D0&color=047857&font-size=0.45`;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button aria-label="Open profile options">
          <Avatar className="w-12 h-12 bg-green-100 border-[3px] border-green-300 shadow-md hover:scale-105 transition">
            <AvatarImage src={avatarUrl} alt={displayName} />
            <AvatarFallback>
              <UserCircle className="w-8 h-8 text-green-600" strokeWidth={2.5} />
            </AvatarFallback>
          </Avatar>
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        side="bottom"
        align="start"
        className="animate-fade-in bg-white shadow-lg border border-green-100 rounded-xl min-w-[180px] px-0 py-1"
      >
        <div className="px-4 py-2 flex flex-col">
          <span className="text-green-900 font-semibold">{user.user_metadata?.full_name || displayName}</span>
          <span className="text-xs text-muted-foreground">{user.email}</span>
        </div>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          onClick={() => navigate("/profile")}
          className="cursor-pointer hover:bg-green-50"
        >
          View Profile
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={handleLogout}
          className="text-red-600 cursor-pointer hover:bg-green-50"
        >
          Logout
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

