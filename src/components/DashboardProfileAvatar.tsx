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
import NameSetupDialog from "./NameSetupDialog";

export default function DashboardProfileAvatar() {
  const [user, setUser] = useState<any>(null);
  const [profileName, setProfileName] = useState<string | null>(null);
  const [profileAvatar, setProfileAvatar] = useState<string | null>(null);
  const [firstName, setFirstName] = useState<string | null>(null);
  const [lastName, setLastName] = useState<string | null>(null);
  const [showNameDialog, setShowNameDialog] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    supabase.auth.getUser().then(async ({ data }) => {
      setUser(data.user);

      // Fetch profile name from public.profiles if user exists
      if (data.user?.id) {
        const { data: profile } = await supabase
          .from("profiles")
          .select("full_name, avatar_url, first_name, last_name")
          .eq("id", data.user.id)
          .maybeSingle();

        if (profile) {
          setProfileName(profile.full_name || null);
          setProfileAvatar(profile.avatar_url || null);
          setFirstName(profile.first_name || null);
          setLastName(profile.last_name || null);
          // --- Show dialog if names are missing ---
          if (!profile.first_name || !profile.last_name) {
            setShowNameDialog(true);
          }
        } else {
          setProfileName(null);
          setProfileAvatar(null);
          setFirstName(null);
          setLastName(null);
        }
      }
    });
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/"); // Redirect to home page after logout
  };

  // Use fetched profile name first, fallback to metadata/email/User
  const displayName =
    (firstName && lastName && `${firstName} ${lastName}`) ||
    profileName ||
    user?.user_metadata?.full_name ||
    user?.email ||
    "User";

  // Prefer avatar from profile table, fallback to metadata or a default generator
  const avatarUrl =
    profileAvatar ||
    user?.user_metadata?.avatar_url ||
    `https://ui-avatars.com/api/?name=${encodeURIComponent(
      displayName
    )}&size=128&background=BBF7D0&color=047857&font-size=0.45`;

  return (
    <>
      <NameSetupDialog
        open={showNameDialog}
        onOpenChange={setShowNameDialog}
        userId={user?.id}
        defaultFirstName={firstName}
        defaultLastName={lastName}
        onNameSaved={(fname, lname) => {
          setFirstName(fname);
          setLastName(lname);
          setShowNameDialog(false);
        }}
      />
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button aria-label="Open profile menu">
            <Avatar className="w-12 h-12 bg-green-100 border-[3px] border-green-300 shadow-md hover:scale-105 transition">
              {profileAvatar || user?.user_metadata?.avatar_url ? (
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
              {profileAvatar || user?.user_metadata?.avatar_url ? (
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
            onClick={() => navigate("/profile")}
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
    </>
  );
}
