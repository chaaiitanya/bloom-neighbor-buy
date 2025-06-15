import { useState, useEffect, useCallback } from "react";
import { ProfilePreview } from "@/components/ProfilePreview";
import BottomTabNav from "@/components/BottomTabNav";
import ProfileEditForm from "@/components/ProfileEditForm";
import ProfileStats from "@/components/ProfileStats";
import ProfileTransactions from "@/components/ProfileTransactions";
import ProfileFavorites from "@/components/ProfileFavorites";
import ProfileQrShare from "@/components/ProfileQrShare";
import ProfileSocialLinks from "@/components/ProfileSocialLinks";
import ProfileListings from "@/components/ProfileListings";
import { supabase } from "@/integrations/supabase/client";

type ProfileData = {
  full_name?: string;
  avatar_url?: string;
  rating?: number;
  sales?: number;
  email?: string;
};

export default function Profile() {
  const [editMode, setEditMode] = useState(false);
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [loading, setLoading] = useState(true);

  // This function fetches the profile from Supabase and updates state
  const fetchProfile = useCallback(async () => {
    setLoading(true);
    const { data: userObj } = await supabase.auth.getUser();
    if (userObj?.user) {
      const { data: prof } = await supabase
        .from("profiles")
        .select("full_name, avatar_url, rating")
        .eq("id", userObj.user.id)
        .maybeSingle();
      setProfile({
        full_name: prof?.full_name || userObj.user.user_metadata?.full_name || userObj.user.email || "User",
        avatar_url: prof?.avatar_url || userObj.user.user_metadata?.avatar_url || "",
        rating: typeof prof?.rating === "number" ? Number(prof.rating) : undefined,
        sales: undefined, // Could fetch sales count here!
        email: userObj.user.email,
      });
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  // After saving the profile, re-fetch info
  const handleProfileUpdated = () => {
    setEditMode(false);
    fetchProfile();
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-green-50 to-white pb-20">
      <div className="p-6 flex flex-col items-center">
        {loading ? (
          <div className="mb-2 h-12 w-32 rounded-full bg-green-100 animate-pulse" />
        ) : (
          <ProfilePreview
            name={profile?.full_name || "User"}
            avatar={profile?.avatar_url}
            rating={profile?.rating ?? 4.6}
            sales={profile?.sales ?? 22}
          />
        )}
        <div className="mt-2 text-green-700 text-xl font-semibold">
          {loading ? "..." : profile?.full_name || "User"}
        </div>
        <button
          onClick={() => setEditMode(!editMode)}
          className="text-green-600 underline mt-1 text-sm"
        >
          {editMode ? "Cancel Edit" : "Edit Profile"}
        </button>
        <ProfileStats />
        <ProfileSocialLinks />
        {editMode ? (
          <div className="w-full bg-white rounded-2xl p-4 border shadow mt-4">
            <ProfileEditForm onUpdated={handleProfileUpdated} />
          </div>
        ) : (
          <>
            <ProfileListings />
            <div className="w-full bg-white rounded-2xl p-4 border shadow mt-4">
              <ProfileFavorites />
            </div>
            <div className="w-full bg-white rounded-2xl p-4 border shadow mt-4">
              <ProfileTransactions />
            </div>
            <ProfileQrShare />
          </>
        )}
      </div>
      <BottomTabNav />
    </div>
  );
}
