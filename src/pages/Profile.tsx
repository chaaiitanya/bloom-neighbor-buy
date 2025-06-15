
import { useState } from "react";
import { ProfilePreview } from "@/components/ProfilePreview";
import BottomTabNav from "@/components/BottomTabNav";
import ProfileEditForm from "@/components/ProfileEditForm";
import ProfileStats from "@/components/ProfileStats";
import ProfileTransactions from "@/components/ProfileTransactions";
import ProfileFavorites from "@/components/ProfileFavorites";
import ProfileQrShare from "@/components/ProfileQrShare";
import ProfileSocialLinks from "@/components/ProfileSocialLinks";

export default function Profile() {
  const [editMode, setEditMode] = useState(false);

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-green-50 to-white pb-20">
      <div className="p-6 flex flex-col items-center">
        <ProfilePreview name="Jamie Lin" rating={4.8} sales={18} avatar={undefined} />
        <div className="mt-2 text-green-700 text-xl font-semibold">Jamie Lin</div>
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
            <ProfileEditForm onUpdated={() => setEditMode(false)} />
          </div>
        ) : (
          <>
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
