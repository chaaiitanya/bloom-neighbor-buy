
import { MessageSquare } from "lucide-react";

export default function CommunityChatCard({ onClick }: { onClick: () => void }) {
  return (
    <button
      className="w-full bg-green-100 hover:bg-green-200 transition-colors border border-green-200 rounded-2xl shadow flex items-center px-6 py-3 mb-2"
      style={{
        boxShadow: "0 2px 24px 0 rgba(98, 186, 85, 0.07)",
      }}
      onClick={onClick}
      aria-label="Open Community Chat"
    >
      <div className="flex items-center gap-3 flex-1">
        <span className="rounded-full bg-green-200 p-2">
          <MessageSquare className="w-6 h-6 text-green-700" />
        </span>
        <span className="font-semibold text-green-800 text-lg tracking-tight">
          Community Chat
        </span>
      </div>
      {/* Add any extra icon/arrow if needed */}
    </button>
  );
}
