
import { useEffect, useState } from "react";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { UserCircle } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

// Uses Supabase user session to fetch the user data
export default function DashboardProfileAvatar() {
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      setUser(data.user);
    });
  }, []);

  if (!user) {
    return (
      <Avatar className="w-12 h-12 bg-green-100 border-[3px] border-green-300 shadow-md">
        <AvatarFallback>
          <UserCircle className="w-8 h-8 text-green-600" strokeWidth={2.5} />
        </AvatarFallback>
      </Avatar>
    );
  }

  // If user, prefer their avatar_url (if present), else fallback to Lucide icon
  const displayName = user.email || "User";
  const avatarUrl =
    user.user_metadata?.avatar_url ||
    `https://ui-avatars.com/api/?name=${encodeURIComponent(
      user.user_metadata?.full_name || displayName
    )}&size=128&background=BBF7D0&color=047857&font-size=0.45`;

  return (
    <Avatar className="w-12 h-12 bg-green-100 border-[3px] border-green-300 shadow-md">
      <AvatarImage src={avatarUrl} alt={displayName} />
      <AvatarFallback>
        <UserCircle className="w-8 h-8 text-green-600" strokeWidth={2.5} />
      </AvatarFallback>
    </Avatar>
  );
}
