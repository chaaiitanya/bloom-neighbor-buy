
import ChatListPlaceholder from "@/components/ChatListPlaceholder";
import BottomTabNav from "@/components/BottomTabNav";

export default function Chat() {
  return (
    <div className="min-h-screen flex flex-col pb-20 bg-gradient-to-br from-green-50 to-white">
      <h2 className="pt-8 text-center text-green-800 font-bold text-2xl">Conversations</h2>
      <div className="flex-1 flex items-center justify-center">
        <ChatListPlaceholder />
      </div>
      <BottomTabNav />
    </div>
  );
}
