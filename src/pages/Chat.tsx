import ChatList from "@/components/ChatList";
import BottomTabNav from "@/components/BottomTabNav";
import CommunityChatBox from "@/components/CommunityChatBox";
import CommunityChatCard from "@/components/CommunityChatCard";
import { MessagesSquare } from "lucide-react";
import { useState } from "react";
export default function Chat() {
  const [openCommunity, setOpenCommunity] = useState(false);
  return <div className="min-h-screen flex flex-col pb-20 bg-gradient-to-br from-green-50 to-white dark:bg-gradient-to-br dark:from-[#181f1a] dark:to-[#232a26]/80 transition-colors">
      <h2 className="pt-10 pb-6 text-center text-green-800 dark:text-green-100 font-extrabold text-2xl tracking-tighter">Conversations</h2>
      <div className="flex-1 flex items-start justify-center">
        <div className="w-full max-w-xl flex flex-col items-center">
          <div className="w-full flex flex-col gap-0">
            {/* Community Chat styled card */}
            <CommunityChatCard onClick={() => setOpenCommunity(true)} />
            {/* Chat list below the card, grouping logic */}
            <div className="bg-white/80 dark:bg-[#21271f]/85 rounded-2xl shadow-lg border border-green-100 dark:border-[#223128] px-4 py-3">
              <ChatList />
            </div>
          </div>
        </div>
      </div>
      {/* Community Communication Section */}
      
      {openCommunity && <div className="fixed inset-0 flex items-center justify-center z-50 bg-black/30 px-2 transition-all">
          <div className="bg-white dark:bg-[#21271f] p-0 rounded-xl shadow-lg max-w-lg w-full">
            <CommunityChatBox onClose={() => setOpenCommunity(false)} />
          </div>
        </div>}
      <BottomTabNav />
    </div>;
}