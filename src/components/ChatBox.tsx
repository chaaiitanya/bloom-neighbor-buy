
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

  // 3. Send a message
  const sendMessage = async () => {
    if (!input.trim() || !chatId) return;
    setSending(true);
    setError(null);
    let { error } = await supabase.from("private_messages").insert({
      chat_id: chatId,
      sender_id: myUserId,
      content: input.trim(),
    });
    setSending(false);
    setInput("");
    if (error) setError("Failed to send message.");
  };

  if (error) return <div className="text-red-500 text-sm py-2">{error}</div>;

  return (
    <div className="flex flex-col h-80 max-h-[60vh] bg-white rounded-lg border shadow-lg">
      <div className="flex items-center border-b px-4 py-2 bg-green-50 rounded-t-lg">
        <span className="font-semibold text-green-800 flex-1">Chat with Seller</span>
        {onClose && (
          <button className="text-green-600 font-bold text-lg" onClick={onClose} aria-label="Close">&times;</button>
        )}
      </div>
      <div className="flex-1 overflow-y-auto px-3 py-2">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`mb-2 flex ${msg.sender_id === myUserId ? "justify-end" : "justify-start"}`}
          >
            <span
              className={`inline-block px-3 py-2 rounded-xl text-sm ${
                msg.sender_id === myUserId
                  ? "bg-green-600 text-white ml-6"
                  : "bg-green-100 text-green-900 mr-6"
              }`}
            >
              {msg.content}
            </span>
          </div>
        ))}
        <div ref={endRef} />
      </div>
      <form
        className="flex border-t px-2 py-2"
        onSubmit={e => {
          e.preventDefault();
          sendMessage();
        }}
      >
        <Input
          value={input}
          onChange={e => setInput(e.target.value)}
          className="mr-2"
          placeholder="Type a message..."
          disabled={sending}
        />
        <Button type="submit" disabled={sending || !input.trim()} className="bg-green-600 hover:bg-green-700 text-white rounded-lg">
          Send
        </Button>
      </form>
    </div>
  );
}
