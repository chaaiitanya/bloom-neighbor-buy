
import ChatList from "@/components/ChatList";
import BottomTabNav from "@/components/BottomTabNav";
import { MessagesSquare } from "lucide-react";

export default function Chat() {
  return (
    <div className="min-h-screen flex flex-col pb-20 bg-gradient-to-br from-green-50 to-white">
      <h2 className="pt-8 text-center text-green-800 font-bold text-2xl">Conversations</h2>
      <div className="flex-1 flex items-center justify-center">
        <ChatList />
      </div>
      {/* Community Communication Section */}
      <div className="w-full flex flex-col gap-3 items-center py-8 px-5 border-t border-green-100 bg-green-50/50">
        <MessagesSquare className="w-10 h-10 text-green-600 drop-shadow" />
        <h3 className="text-lg font-bold text-green-700">Community Communication</h3>
        <p className="text-center text-green-900/80 max-w-sm text-sm">
          Welcome to the Bloom Neighbor Community! Here, you can communicate with other users, exchange tips, and build your plant network. (UI coming soon!)
        </p>
      </div>
      <BottomTabNav />
    </div>
  );
}
