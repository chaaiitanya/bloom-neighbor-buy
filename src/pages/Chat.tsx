import ChatList from "@/components/ChatList";
import BottomTabNav from "@/components/BottomTabNav";
import { MessagesSquare } from "lucide-react";

export default function Chat() {
  return (
    <div className="min-h-screen flex flex-col pb-20 bg-gradient-to-br from-green-50 to-white dark:bg-gradient-to-br dark:from-[#181f1a] dark:to-[#232a26]/80 transition-colors">
      <h2 className="pt-8 text-center text-green-800 dark:text-green-100 font-bold text-2xl">Conversations</h2>
      <div className="flex-1 flex items-center justify-center">
        {/* Added dark background for the chat list container */}
        <div className="w-full max-w-xl bg-white/80 dark:bg-[#21271f]/85 rounded-2xl p-3 shadow-lg border border-green-100 dark:border-[#223128] transition-colors">
          <ChatList />
        </div>
      </div>
      {/* Community Communication Section */}
      <div className="w-full flex flex-col gap-3 items-center py-8 px-5 border-t border-green-100 bg-green-50/50 dark:bg-[#232a26]/60 transition-colors">
        <MessagesSquare className="w-10 h-10 text-green-600 dark:text-green-300 drop-shadow" />
        <h3 className="text-lg font-bold text-green-700 dark:text-green-100">Community Communication</h3>
        <p className="text-center text-green-900/80 dark:text-green-200/80 max-w-sm text-sm">
          Welcome to the Bloom Neighbor Community! Here, you can communicate with other users, exchange tips, and build your plant network. (UI coming soon!)
        </p>
      </div>
      <BottomTabNav />
    </div>
  );
}
