
import { useEffect, useState } from "react";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Dialog, DialogTrigger, DialogContent } from "@/components/ui/dialog";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import ProfileEditForm from "@/components/ProfileEditForm";
import ProfileStats from "@/components/ProfileStats";
import ProfileTransactions from "@/components/ProfileTransactions";
import ProfileFavorites from "@/components/ProfileFavorites";
import ProfileQrShare from "@/components/ProfileQrShare";
import ProfileSocialLinks from "@/components/ProfileSocialLinks";
import { UserCircle, Lock, Heart, BarChart2, QrCode, Edit } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function DashboardProfileAvatar() {
  const [user, setUser] = useState<any>(null);
  const [dialogOpen, setDialogOpen] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      setUser(data.user);
    });
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setDialogOpen(false);
    navigate("/auth");
  };

  const displayName = user?.user_metadata?.full_name || user?.email || "User";
  const avatarUrl =
    user?.user_metadata?.avatar_url ||
    `https://ui-avatars.com/api/?name=${encodeURIComponent(
      user?.user_metadata?.full_name || displayName
    )}&size=128&background=BBF7D0&color=047857&font-size=0.45`;

  // If user is not loaded show fallback avatar only
  return (
    <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
      <DialogTrigger asChild>
        <button aria-label="Open profile options">
          <Avatar className="w-12 h-12 bg-green-100 border-[3px] border-green-300 shadow-md hover:scale-105 transition">
            {user?.user_metadata?.avatar_url ? (
              <AvatarImage src={avatarUrl} alt={displayName} />
            ) : (
              <AvatarFallback>
                <UserCircle className="w-8 h-8 text-green-600" strokeWidth={2.5} />
              </AvatarFallback>
            )}
          </Avatar>
        </button>
      </DialogTrigger>
      <DialogContent className="max-w-lg w-full p-0 overflow-hidden rounded-2xl shadow-lg">
        {/* Modal header */}
        <div className="flex items-center gap-3 px-6 py-4 border-b bg-white">
          <Avatar className="w-12 h-12 bg-green-100 border-[3px] border-green-300">
            {user?.user_metadata?.avatar_url ? (
              <AvatarImage src={avatarUrl} alt={displayName} />
            ) : (
              <AvatarFallback>
                <UserCircle className="w-8 h-8 text-green-600" strokeWidth={2.5} />
              </AvatarFallback>
            )}
          </Avatar>
          <div className="flex-1">
            <div className="text-base font-semibold text-green-900">{displayName}</div>
            <div className="text-xs text-muted-foreground">{user?.email}</div>
          </div>
          <Button variant="ghost" className="text-red-600" size="sm" onClick={handleLogout}>
            Log out
          </Button>
        </div>
        {/* Modal options: Tabs */}
        <Tabs defaultValue="profile" className="w-full">
          <TabsList className="w-full flex flex-wrap gap-1 p-3 justify-between bg-green-50 rounded-none border-b">
            <TabsTrigger value="profile" className="flex items-center gap-2 px-3 py-1.5">
              <Edit className="w-4 h-4" /> Profile
            </TabsTrigger>
            <TabsTrigger value="stats" className="flex items-center gap-2 px-3 py-1.5">
              <BarChart2 className="w-4 h-4" /> Stats
            </TabsTrigger>
            <TabsTrigger value="favorites" className="flex items-center gap-2 px-3 py-1.5">
              <Heart className="w-4 h-4" /> Favorites
            </TabsTrigger>
            <TabsTrigger value="transactions" className="flex items-center gap-2 px-3 py-1.5">
              <UserCircle className="w-4 h-4" /> History
            </TabsTrigger>
            <TabsTrigger value="qr" className="flex items-center gap-2 px-3 py-1.5">
              <QrCode className="w-4 h-4" /> Share
            </TabsTrigger>
            <TabsTrigger value="account" className="flex items-center gap-2 px-3 py-1.5">
              <Lock className="w-4 h-4" /> Account
            </TabsTrigger>
          </TabsList>
          {/* Profile info edit */}
          <TabsContent value="profile" className="p-5">
            <ProfileEditForm />
            <div className="mt-6">
              <div className="font-semibold text-green-800 mb-1">Social Links</div>
              <ProfileSocialLinks />
            </div>
          </TabsContent>
          {/* Stats */}
          <TabsContent value="stats" className="p-5">
            <ProfileStats />
          </TabsContent>
          {/* Favorites */}
          <TabsContent value="favorites" className="p-5">
            <ProfileFavorites />
          </TabsContent>
          {/* Transaction history */}
          <TabsContent value="transactions" className="p-5">
            <ProfileTransactions />
          </TabsContent>
          {/* QR/share */}
          <TabsContent value="qr" className="p-5 flex flex-col items-center">
            <ProfileQrShare />
          </TabsContent>
          {/* Account management */}
          <TabsContent value="account" className="p-5">
            <div className="font-semibold text-green-800 mb-3">Account Management</div>
            <Button className="w-full mb-2" variant="destructive" onClick={handleLogout}>
              Log Out
            </Button>
            <div className="mt-2 text-sm text-gray-500">
              For password or account changes, use your sign-in email reset.<br />
              <Button
                variant="outline"
                className="mt-3"
                onClick={async () => {
                  if (!user?.email) return;
                  await supabase.auth.resetPasswordForEmail(user.email, {
                    redirectTo: window.location.origin + "/auth",
                  });
                  alert("Password reset link sent to your email.");
                }}
              >
                Reset Password
              </Button>
            </div>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
