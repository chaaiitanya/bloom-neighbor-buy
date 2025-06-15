
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/components/ui/use-toast";

type ProfileData = {
  full_name?: string;
  avatar_url?: string;
  location?: string;
  bio?: string;
  socials?: { [k: string]: string };
};

function parseSocialsField(raw: any): { [k: string]: string } {
  // Accepts null, object, stringified JSON, array, etc, and always returns an object
  if (!raw) return {};
  if (typeof raw === "object" && !Array.isArray(raw)) return raw as { [k: string]: string };
  if (typeof raw === "string") {
    try {
      const parsed = JSON.parse(raw);
      return typeof parsed === "object" && !Array.isArray(parsed) ? parsed : {};
    } catch {
      return {};
    }
  }
  return {};
}

export default function ProfileEditForm({ onUpdated }: { onUpdated?: () => void }) {
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    (async () => {
      const { data: u } = await supabase.auth.getUser();
      if (u.user) {
        const { data: p } = await supabase.from("profiles").select("*").eq("id", u.user.id).maybeSingle();
        if (p) {
          setProfile({
            full_name: p.full_name || "",
            avatar_url: p.avatar_url || "",
            location: p.location || "",
            bio: p.bio || "",
            socials: parseSocialsField(p.socials),
          });
        } else {
          setProfile({
            full_name: "",
            avatar_url: "",
            location: "",
            bio: "",
            socials: {},
          });
        }
      }
      setLoading(false);
    })();
  }, []);

  // Handle changes
  const handleChange = (key: keyof ProfileData, value: any) => {
    setProfile(prev => prev ? { ...prev, [key]: value } : prev);
  };

  const handleSocialChange = (key: string, value: string) => {
    setProfile(prev =>
      prev
        ? {
            ...prev,
            socials: { ...(prev.socials ?? {}), [key]: value },
          }
        : prev
    );
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!profile) return;
    setSaving(true);
    const { error } = await supabase
      .from("profiles")
      .update({
        ...profile,
        socials: profile.socials || {},
      })
      .select()
      .single();
    setSaving(false);
    if (error) {
      toast({
        title: "Failed to update profile",
        description: error.message,
        variant: "destructive",
      });
    } else {
      toast({ title: "Profile updated!" });
      if (onUpdated) onUpdated();
    }
  };

  if (loading) return <div className="text-center my-6">Loading profile…</div>;

  return (
    <form className="space-y-4" onSubmit={handleSave}>
      <div>
        <label className="font-semibold text-green-800">Full Name</label>
        <Input value={profile?.full_name || ""} onChange={e => handleChange("full_name", e.target.value)} />
      </div>
      <div>
        <label className="font-semibold text-green-800">Location</label>
        <Input value={profile?.location || ""} onChange={e => handleChange("location", e.target.value)} />
      </div>
      <div>
        <label className="font-semibold text-green-800">Bio</label>
        <Textarea rows={2} value={profile?.bio || ""} onChange={e => handleChange("bio", e.target.value)} />
      </div>
      <div>
        <label className="font-semibold text-green-800">Social Links</label>
        <div className="flex flex-col gap-2 mt-1">
          {["instagram", "twitter", "facebook", "tiktok"].map(key => (
            <Input
              key={key}
              placeholder={key.charAt(0).toUpperCase() + key.slice(1)}
              value={profile?.socials?.[key] || ""}
              onChange={e => handleSocialChange(key, e.target.value)}
              className="rounded"
            />
          ))}
        </div>
      </div>
      <button
        type="submit"
        className="w-full mt-2 bg-green-600 hover:bg-green-700 text-white rounded-xl py-2 font-bold shadow disabled:opacity-50 disabled:cursor-wait"
        disabled={saving}
      >
        {saving ? "Saving…" : "Save Changes"}
      </button>
    </form>
  );
}
