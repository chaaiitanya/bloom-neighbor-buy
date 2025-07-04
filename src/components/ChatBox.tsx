import { useEffect, useRef, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

type Message = {
  id: string;
  sender_id: string;
  content: string;
  sent_at: string;
};

interface ChatBoxProps {
  otherUserId: string; // The userId of the seller
  myUserId: string;    // The current logged-in user's id
  onClose?: () => void;
}

export default function ChatBox({ otherUserId, myUserId, onClose }: ChatBoxProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [chatId, setChatId] = useState<string | null>(null);
  const [input, setInput] = useState("");
  const [sending, setSending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const endRef = useRef<HTMLDivElement>(null);

  // 1. Get or create chat room between `myUserId` and `otherUserId`
  useEffect(() => {
    const fetchOrCreateChat = async () => {
      setError(null);
      // Log user IDs for debugging
      if (!myUserId || !otherUserId) {
        setError("Missing user information. Try refreshing the page or logging in again.");
        return;
      }
      // Get existing chat where user ids match
      let { data: chats, error: findError } = await supabase
        .from("private_chats")
        .select("*")
        .or(`and(participant_a.eq.${myUserId},participant_b.eq.${otherUserId}),and(participant_a.eq.${otherUserId},participant_b.eq.${myUserId})`)
        .limit(1);

      if (findError) {
        setError("Error loading chat room: " + findError.message);
        return;
      }

      if (chats && chats.length > 0) {
        setChatId(chats[0].id);
      } else {
        // Create a new chat
        let { data: newChat, error: insertError } = await supabase
          .from("private_chats")
          .insert([
            { participant_a: myUserId, participant_b: otherUserId },
          ])
          .select()
          .single();
        if (insertError || !newChat) {
          setError("Unable to start chat: " + (insertError?.message || "Unknown error"));
        } else {
          setChatId(newChat.id);
        }
      }
    };
    if (myUserId && otherUserId) {
      fetchOrCreateChat();
    }
  }, [myUserId, otherUserId]);

  // 2. Fetch messages for this chat
  useEffect(() => {
    if (!chatId) return;
    let sub: any;
    let cancelled = false;

    const fetchMessages = async () => {
      const { data, error } = await supabase
        .from("private_messages")
        .select("*")
        .eq("chat_id", chatId)
        .order("sent_at", { ascending: true });

      if (!cancelled) {
        if (error) setError("Error loading messages.");
        else setMessages(data ?? []);
      }
    };
    fetchMessages();

    // Realtime
    sub = supabase
      .channel(`private_messages_chat_${chatId}`)
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "private_messages", filter: `chat_id=eq.${chatId}` },
        (payload) => {
          setMessages((msgs) => [...msgs, payload.new as Message]);
        }
      )
      .subscribe();

    return () => {
      cancelled = true;
      if (sub) supabase.removeChannel(sub);
    };
  }, [chatId]);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, chatId]);

  // 3. Send a message (add optimistic update)
  const sendMessage = async () => {
    if (!input.trim() || !chatId) return;
    setSending(true);
    setError(null);

    // Add optimistic message
    const tempId = "temp-" + Date.now();
    const optimisticMessage: Message = {
      id: tempId,
      sender_id: myUserId,
      content: input.trim(),
      sent_at: new Date().toISOString(),
    };
    setMessages(msgs => [...msgs, optimisticMessage]);
    setInput("");

    let { error } = await supabase.from("private_messages").insert({
      chat_id: chatId,
      sender_id: myUserId,
      content: optimisticMessage.content,
    });
    setSending(false);
    if (error) {
      setError("Failed to send message.");
      // Remove the optimistic message if error
      setMessages(msgs => msgs.filter(msg => msg.id !== tempId));
    }
  };

  // We'll filter out duplicate optimistic messages when the real message arrives
  // (they will have the same content and sender within the last 30s)
  useEffect(() => {
    setMessages(existing => {
      const seen = new Set();
      return existing.filter((msg, idx, arr) => {
        if (msg.id.startsWith("temp-")) {
          // Check for a real message with same content and sender sent very recently
          const hasReal = arr.some(m =>
            m.id !== msg.id &&
            !m.id.startsWith("temp-") &&
            m.content === msg.content &&
            m.sender_id === msg.sender_id &&
            Math.abs(new Date(m.sent_at).getTime() - new Date(msg.sent_at).getTime()) < 30000
          );
          if (hasReal) return false;
        }
        const sig = `${msg.id}`;
        if (seen.has(sig)) return false;
        seen.add(sig);
        return true;
      });
    });
  }, [messages.length]);

  if (error) return <div className="text-red-500 text-sm py-2">{error}</div>;

  return (
    <div className="flex flex-col h-80 max-h-[60vh] bg-white dark:bg-[#222824] rounded-lg border border-green-100 dark:border-green-800 shadow-lg">
      <div className="flex items-center border-b border-green-100 dark:border-green-800 px-4 py-2 bg-green-50 dark:bg-[#263028] rounded-t-lg">
        <span className="font-semibold text-green-800 dark:text-green-200 flex-1">Chat with Seller</span>
        {onClose && (
          <button className="text-green-600 dark:text-green-300 font-bold text-lg" onClick={onClose} aria-label="Close">&times;</button>
        )}
      </div>
      <div className="flex-1 overflow-y-auto px-3 py-2">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`mb-2 flex ${msg.sender_id === myUserId ? "justify-end" : "justify-start"}`}
          >
            <span
              className={`inline-block px-3 py-2 rounded-xl text-sm break-words max-w-[70%] ${
                msg.sender_id === myUserId
                  ? "bg-green-600 text-white ml-6"
                  : "bg-green-100 dark:bg-green-900 text-green-900 dark:text-green-100 mr-6"
              }`}
              style={msg.id.startsWith("temp-") ? { opacity: 0.6 } : {}}
            >
              {msg.content}
            </span>
          </div>
        ))}
        <div ref={endRef} />
      </div>
      <form
        className="flex border-t border-green-100 dark:border-green-800 px-2 py-2 bg-white dark:bg-[#222824] rounded-b-lg"
        onSubmit={e => {
          e.preventDefault();
          sendMessage();
        }}
      >
        <Input
          value={input}
          onChange={e => setInput(e.target.value)}
          className="mr-2 bg-white dark:bg-[#202824] text-green-900 dark:text-green-100 border dark:border-green-800"
          placeholder="Type a message..."
          disabled={sending}
        />
        <Button
          type="submit"
          disabled={sending || !input.trim()}
          className="bg-green-600 hover:bg-green-700 text-white dark:bg-green-700 dark:hover:bg-green-900 rounded-lg"
        >
          Send
        </Button>
      </form>
    </div>
  );
}
