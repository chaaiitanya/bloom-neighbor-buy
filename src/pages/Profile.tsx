import { useState, useEffect, useCallback } from "react";
import { ProfilePreview } from "@/components/ProfilePreview";
import BottomTabNav from "@/components/BottomTabNav";
import ProfileEditForm from "@/components/ProfileEditForm";
import ProfileStats from "@/components/ProfileStats";
import ProfileFavorites from "@/components/ProfileFavorites";
import ProfileQrShare from "@/components/ProfileQrShare";
import ProfileSocialLinks from "@/components/ProfileSocialLinks";
import ProfileListings from "@/components/ProfileListings";
import ProfileActionBar from "@/components/ProfileActionBar";
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
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-green-100 to-white dark:from-[#181f1a] dark:to-[#232a26]/80 pb-24 transition-colors">
      <div className="w-full max-w-xl mx-auto px-3 sm:px-0 mt-4">
        {/* Card container for profile */}
        <div className="relative rounded-3xl shadow-xl bg-white/75 dark:bg-[#161c17]/95 border border-green-100 dark:border-[#223128] ring-1 ring-green-100 dark:ring-[#223128] p-6 flex flex-col items-center mb-6 animate-fade-in transition-colors">
          {loading ? (
            <div className="mb-2 h-12 w-32 rounded-full bg-green-100 dark:bg-[#232a26]/60 animate-pulse" />
          ) : (
            <ProfilePreview
              fullName={profile?.full_name || "User"}
              avatar={profile?.avatar_url}
              rating={profile?.rating ?? 4.6}
              sales={profile?.sales ?? 22}
            />
          )}
          <div className="mt-2 text-green-700 dark:text-green-100 text-xl font-semibold tracking-tight">
            {loading ? "..." : profile?.full_name || "User"}
          </div>
          <button
            onClick={() => setEditMode(!editMode)}
            className="text-green-600 underline mt-1 text-sm hover:text-green-800 dark:text-green-300 dark:hover:text-green-100 transition story-link"
          >
            {editMode ? "Cancel Edit" : "Edit Profile"}
          </button>
          <div className="w-full mt-3">
            <ProfileStats />
          </div>
          <ProfileSocialLinks />
          {editMode && (
            <div className="w-full bg-white dark:bg-[#181f1a]/90 rounded-2xl p-4 border border-green-100 dark:border-[#223128] shadow mt-5 transition-colors">
              <ProfileEditForm onUpdated={handleProfileUpdated} />
            </div>
          )}
        </div>

        {!editMode && (
          <>
            {/* Listings */}
            <div className="mb-6 animate-fade-in">
              <ProfileListings />
            </div>
            {/* Favorites */}
            <div className="w-full rounded-2xl p-4 border border-green-100 dark:border-[#223128] bg-green-50/70 dark:bg-[#181f1a]/80 shadow mb-4 animate-fade-in transition-colors">
              <ProfileFavorites />
            </div>
            {/* Action bar list */}
            <div className="w-full max-w-md mx-auto">
              <ProfileActionBar />
            </div>
            {/* QR Share */}
            <div className="w-full flex flex-col items-center mt-8 animate-fade-in">
              <ProfileQrShare />
            </div>
          </>
        )}
      </div>
      <BottomTabNav />
    </div>
  );
}
