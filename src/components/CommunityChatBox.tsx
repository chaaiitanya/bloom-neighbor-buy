import { useEffect, useRef, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { toast } from "@/components/ui/use-toast";

// CommunityMessage type matches the new 'community_chat' table structure
type CommunityMessage = {
  id: string;
  sender_id: string | null;
  sender_name: string | null;
  avatar_url: string | null;
  content: string;
  sent_at: string;
};

export default function CommunityChatBox({
  onClose,
}: {
  onClose: () => void;
}) {
  const [messages, setMessages] = useState<CommunityMessage[]>([]);
  const [sending, setSending] = useState(false);
  const [message, setMessage] = useState("");
  const [user, setUser] = useState<any>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const formRef = useRef<HTMLFormElement>(null);

  // Fetch current user
  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      setUser(data?.user ?? null);
    });
  }, []);

  // Fetch recent messages from public.community_chat
  useEffect(() => {
    (async () => {
      const { data, error } = await supabase
        .from("community_chat")
        .select("id,sender_id,sender_name,avatar_url,content,sent_at")
        .order("sent_at", { ascending: true })
        .limit(100);

      if (error) {
        toast({
          title: "Failed to load messages",
          description: error.message,
          variant: "destructive",
        });
        return;
      }
      setMessages(data as CommunityMessage[] || []);
    })();

    // Listen for new messages in realtime
    const channel = supabase
      .channel("community-chat-room")
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "community_chat",
        },
        (payload: any) => {
          setMessages((prev) => {
            // Avoid adding duplicate messages if already present
            const already = prev.find((msg) => msg.id === payload.new.id);
            if (already) return prev;
            return [...prev, payload.new as CommunityMessage];
          });
        }
      )
      .subscribe();
    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  useEffect(() => {
    // Auto-scroll to bottom when new messages are loaded
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages.length]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      toast({ title: "Please log in to send messages." });
      return;
    }
    if (!message.trim()) return;
    setSending(true);

    // Send the message to Supabase
    const { data, error } = await supabase.from("community_chat").insert([
      {
        sender_id: user.id,
        content: message,
        sender_name:
          user.user_metadata?.full_name ||
          user.user_metadata?.username ||
          user.email?.split("@")[0] ||
          "User",
        avatar_url: user.user_metadata?.avatar_url || null,
      }
    ]).select("id,sender_id,sender_name,avatar_url,content,sent_at").single();

    setSending(false);
    setMessage("");
    if (error) {
      toast({ title: "Message failed", description: error.message, variant: "destructive" });
      return;
    }
    // Optimistically add the message to state (if not present)
    if (data && !messages.find((msg) => msg.id === data.id)) {
      setMessages((prev) => [...prev, data as CommunityMessage]);
    }
    // Message will still appear from realtime as well, but duplicates are prevented above
  };

  // Add the keydown handler for Textarea
  const handleTextareaKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      // Submit form if enabled
      if (
        !sending &&
        user &&
        message.trim() &&
        formRef.current
      ) {
        formRef.current.requestSubmit(); // Supported in modern browsers
      }
    }
  };

  return (
    <div className="flex flex-col h-[68vh] max-h-[500px] min-h-[320px] bg-white dark:bg-[#232a26] rounded-xl shadow-lg">
      <div className="flex items-center px-4 py-3 border-b border-green-100 dark:border-[#2a4033]">
        <span className="font-semibold text-green-800 dark:text-green-100 text-lg tracking-tight">
          Bloom Community Chat
        </span>
        <button
          className="ml-auto text-lg text-green-500 hover:text-red-400 transition"
          onClick={onClose}
          aria-label="Close community chat"
        >
          ×
        </button>
      </div>
      <ScrollArea className="flex-1 p-3 overflow-y-auto" ref={scrollRef}>
        <div className="flex flex-col gap-3">
          {messages.length === 0 && (
            <div className="text-center text-gray-400 py-12">No messages yet.</div>
          )}
          {messages.map((msg) => (
            <div
              key={msg.id}
              className="flex items-start gap-2"
              style={{
                alignSelf:
                  msg.sender_id === user?.id ? "flex-end" : "flex-start",
              }}
            >
              <img
                src={
                  msg.avatar_url ||
                  "https://ui-avatars.com/api/?name=" +
                    encodeURIComponent(msg.sender_name ?? "User")
                }
                alt={msg.sender_name ?? "User"}
                className="w-8 h-8 rounded-full object-cover border border-green-100 bg-green-50"
              />
              <div className="flex flex-col max-w-xs sm:max-w-sm bg-green-50 dark:bg-[#223128]/70 rounded-xl px-3 py-2 shadow text-green-900 dark:text-green-50">
                <span className="font-semibold text-sm text-green-700 dark:text-green-200">
                  {msg.sender_name}
                </span>
                <span className="text-xs text-green-600 dark:text-green-200/70 mt-0.5">
                  {msg.content}
                </span>
                <span className="block text-[10px] text-green-400 mt-1">
                  {new Date(msg.sent_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>
            </div>
          ))}
        </div>
      </ScrollArea>
      <form
        ref={formRef}
        onSubmit={handleSend}
        className="p-3 border-t border-green-100 dark:border-[#2a4033] flex gap-2"
      >
        <Textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={handleTextareaKeyDown} // NEW: enable sending with Enter
          placeholder={user ? "Type your message…" : "Sign in to send messages"}
          disabled={sending || !user}
          className="resize-none flex-1 min-h-[42px] max-h-[100px] bg-green-50/50 dark:bg-[#233024]/80"
          required
          maxLength={350}
          rows={1}
          style={{ fontSize: "1rem" }}
        />
        <Button
          type="submit"
          disabled={sending || !user || !message.trim()}
          className="h-10 px-4 bg-green-600 text-white rounded-xl font-bold"
        >
          Send
        </Button>
      </form>
    </div>
  );
}
