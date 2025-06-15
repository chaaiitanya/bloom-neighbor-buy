import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Dialog, DialogContent, DialogHeader } from "@/components/ui/dialog";
import { ProfilePreview } from "@/components/ProfilePreview";
import ChatBox from "./ChatBox";
import { Skeleton } from "@/components/ui/skeleton";

// Chat list item type
type ChatSummary = {
  id: string;
  participant: {
    id: string;
    username: string | null;
    full_name: string | null;
    avatar_url: string | null;
    email: string | null;
  };
  latestMessage: {
    content: string;
    sent_at: string;
  } | null;
};

export default function ChatList() {
  const [myUserId, setMyUserId] = useState<string | null>(null);
  const [chats, setChats] = useState<ChatSummary[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeChat, setActiveChat] = useState<ChatSummary | null>(null);

  // Get current user ID on mount
  useEffect(() => {
    supabase.auth.getUser().then(({ data, error }) => {
      if (data?.user) setMyUserId(data.user.id);
    });
  }, []);

  // Fetch chats once we know user ID
  useEffect(() => {
    if (!myUserId) return;
    setLoading(true);
    (async () => {
      // 1. Fetch chats
      let { data: chatsRaw, error: chatsError } = await supabase
        .from("private_chats")
        .select("*")
        .or(`participant_a.eq.${myUserId},participant_b.eq.${myUserId}`)
        .order("created_at", { ascending: false });

      if (chatsError || !chatsRaw) {
        setChats([]);
        setLoading(false);
        return;
      }

      // 2. For each chat, find other participant ID
      const chatSummaries: ChatSummary[] = await Promise.all(
        chatsRaw.map(async (chat: any) => {
          const otherId = chat.participant_a === myUserId ? chat.participant_b : chat.participant_a;
          
          // Fetch profile (ensure we get email as last fallback)
          let { data: profile, error: profileError } = await supabase
            .from("profiles")
            .select("id,username,full_name,avatar_url")
            .eq("id", otherId)
            .maybeSingle();

          // Fetch user email from auth (if missing from profile)
          let email = null;
          if (profile?.id) {
            // Try to get email from profiles table (customize this if you ever sync emails to profiles)
            // For now, as a fallback, call auth.getUser() if display name is missing
            // Unfortunately, the API does not let us call auth.getUser() for other users for security reasons
            // So, fallback: At least return null, or show partial user Id
            email = null;
          }

          // Fetch latest message
          let { data: latestMsg } = await supabase
            .from("private_messages")
            .select("content,sent_at")
            .eq("chat_id", chat.id)
            .order("sent_at", { ascending: false })
            .limit(1)
            .maybeSingle();
          return {
            id: chat.id,
            participant: {
              id: profile?.id ?? otherId,
              username: profile?.username ?? null,
              full_name: profile?.full_name ?? null,
              avatar_url: profile?.avatar_url ?? null,
              email: email,
            },
            latestMessage: latestMsg
              ? { content: latestMsg.content, sent_at: latestMsg.sent_at }
              : null,
          };
        })
      );
      setChats(chatSummaries);
      setLoading(false);
    })();
  }, [myUserId]);

  if (!myUserId) {
    return (
      <div className="text-green-700 font-semibold text-center p-8">
        Please log in to view your chats.
      </div>
    );
  }

  if (loading) {
    // Loading skeleton for chat list
    return (
      <div className="w-full max-w-lg px-3 mt-10 flex flex-col gap-3">
        {[1, 2, 3].map(i => (
          <div className="flex items-center gap-4" key={i}>
            <Skeleton className="w-12 h-12 rounded-full" />
            <div className="flex-1">
              <Skeleton className="w-28 h-4 mb-2" />
              <Skeleton className="w-40 h-3" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (chats && chats.length === 0) {
    return (
      <div className="w-full max-w-lg px-4 py-12 flex flex-col items-center justify-center gap-4">
        <div className="rounded-full bg-green-100 w-20 h-20 flex items-center justify-center">
          <svg width={36} height={36} className="text-green-500" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
        </div>
        <div className="text-lg font-semibold text-green-800">No conversations yet!</div>
        <div className="text-sm text-gray-400 text-center">Message a buyer or seller to start a new conversation.</div>
      </div>
    );
  }

  return (
    <>
      <div className="w-full max-w-lg px-2 sm:px-0 flex flex-col gap-2">
        {chats?.map(chat => {
          // Compose a displayName variable with strong fallback logic
          const displayName =
            chat.participant.full_name ||
            chat.participant.username ||
            chat.participant.email ||
            (chat.participant.id ? "User " + chat.participant.id.slice(0, 6) : "User");

          return (
            <button
              key={chat.id}
              onClick={() => setActiveChat(chat)}
              className="flex items-center gap-4 bg-white rounded-xl px-4 py-3 hover:shadow border border-green-50 transition active:bg-green-50"
              aria-label={`Open chat with ${displayName}`}
            >
              <img
                src={
                  chat.participant.avatar_url ||
                  "https://ui-avatars.com/api/?name=" +
                    encodeURIComponent(displayName)
                }
                alt={displayName}
                className="w-12 h-12 rounded-full object-cover border-2 border-green-100 bg-green-50"
              />
              <div className="flex flex-col flex-1 min-w-0 text-left">
                <span className="font-semibold text-green-800 truncate">
                  {displayName}
                </span>
                <span className="text-xs text-gray-500 truncate mt-0.5">
                  {chat.latestMessage ? chat.latestMessage.content : <span className="italic text-gray-300">No messages yet</span>}
                </span>
              </div>
              <span className="text-xs text-gray-400 ml-2">
                {chat.latestMessage ? new Date(chat.latestMessage.sent_at).toLocaleDateString() : ""}
              </span>
            </button>
          );
        })}
      </div>
      {/* Chat dialog */}
      <Dialog open={!!activeChat} onOpenChange={open => !open && setActiveChat(null)}>
        <DialogContent className="max-w-md w-full p-0 rounded-xl">
          <DialogHeader>
            <div className="flex gap-3 py-3 px-4 items-center border-b border-green-50 bg-green-50 rounded-t-xl">
              <ProfilePreview
                name={
                  activeChat?.participant.full_name ||
                  activeChat?.participant.username ||
                  activeChat?.participant.email ||
                  (activeChat?.participant.id
                    ? "User " + activeChat.participant.id.slice(0, 6)
                    : "User")
                }
                avatar={activeChat?.participant.avatar_url}
              />
              <span className="ml-auto text-xs text-gray-400">
                {activeChat?.latestMessage ? new Date(activeChat.latestMessage.sent_at).toLocaleDateString() : ""}
              </span>
            </div>
          </DialogHeader>
          {activeChat && (
            <div className="p-3">
              <ChatBox
                otherUserId={activeChat.participant.id}
                myUserId={myUserId}
                onClose={() => setActiveChat(null)}
              />
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
