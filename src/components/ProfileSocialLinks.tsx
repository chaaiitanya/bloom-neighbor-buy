
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

const platforms = [
  { name: "Instagram", key: "instagram" },
  { name: "Twitter", key: "twitter" },
  { name: "Facebook", key: "facebook" },
  { name: "TikTok", key: "tiktok" },
];

function parseSocialsField(raw: any): { [k: string]: string } {
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

export default function ProfileSocialLinks() {
  const [links, setLinks] = useState<{ [k: string]: string }>({});

  useEffect(() => {
    (async () => {
      const { data: userObj } = await supabase.auth.getUser();
      const user_id = userObj.user?.id;
      if (!user_id) return;
      const { data: prof } = await supabase
        .from("profiles")
        .select("socials")
        .eq("id", user_id)
        .maybeSingle();
      setLinks(parseSocialsField(prof?.socials));
    })();
  }, []);

  return (
    <div className="w-full flex flex-wrap gap-3 mt-2">
      {platforms.map(
        pl =>
          links[pl.key] && (
            <a
              key={pl.key}
              href={links[pl.key]}
              className="rounded-full px-4 py-1 bg-green-100 text-green-900 text-sm font-semibold hover:bg-green-200 transition"
              target="_blank"
              rel="noopener noreferrer"
            >
              {pl.name}
            </a>
          )
      )}
    </div>
  );
}
