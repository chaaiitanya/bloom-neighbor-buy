import ChatList from "@/components/ChatList";
import BottomTabNav from "@/components/BottomTabNav";
import CommunityChatBox from "@/components/CommunityChatBox";
import { MessagesSquare } from "lucide-react";
import { useState } from "react";

export default function Chat() {
  const [openCommunity, setOpenCommunity] = useState(false);

  return (
    <div className="min-h-screen flex flex-col pb-20 bg-gradient-to-br from-green-50 to-white dark:bg-gradient-to-br dark:from-[#181f1a] dark:to-[#232a26]/80 transition-colors">
      <h2 className="pt-8 text-center text-green-800 dark:text-green-100 font-bold text-2xl">Conversations</h2>
      <div className="flex-1 flex items-center justify-center">
        <div className="w-full max-w-xl bg-white/80 dark:bg-[#21271f]/85 rounded-2xl p-3 shadow-lg border border-green-100 dark:border-[#223128] transition-colors">
          {/* Community Chat section at the top */}
          <div className="mb-4">
            <button
              onClick={() => setOpenCommunity(true)}
              className="flex gap-3 items-center py-2 px-4 bg-green-100 dark:bg-green-900/40 rounded-xl border border-green-200 dark:border-green-800 hover:bg-green-200 hover:dark:bg-green-900/70 text-green-700 dark:text-green-100 text-base font-semibold shadow-sm transition-colors w-full"
            >
              <span>
                <svg width={28} height={28} className="inline-block text-green-500" fill="none" stroke="currentColor" strokeWidth={2.3} viewBox="0 0 24 24"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
              </span>
              <span>🌱 Community Chat</span>
            </button>
          </div>
          <ChatList />
        </div>
      </div>
      {/* Community Communication Section */}
      <div className="w-full flex flex-col gap-3 items-center py-8 px-5 border-t border-green-100 bg-green-50/50 dark:bg-[#232a26]/60 transition-colors">
        <MessagesSquare className="w-10 h-10 text-green-600 dark:text-green-300 drop-shadow" />
        <h3 className="text-lg font-bold text-green-700 dark:text-green-100">Community Communication</h3>
        <p className="text-center text-green-900/80 dark:text-green-200/80 max-w-sm text-sm">
          Welcome to the Bloom Neighbor Community! Here, you can communicate with other users, exchange tips, and build your plant network.
        </p>
      </div>
      {openCommunity && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black/30 px-2 transition-all">
          <div className="bg-white dark:bg-[#21271f] p-0 rounded-xl shadow-lg max-w-lg w-full">
            <CommunityChatBox onClose={() => setOpenCommunity(false)} />
          </div>
        </div>
      )}
      <BottomTabNav />
    </div>
  );
}
