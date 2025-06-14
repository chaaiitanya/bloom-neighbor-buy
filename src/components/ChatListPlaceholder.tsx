
export default function ChatListPlaceholder() {
  return (
    <div className="flex flex-col items-center justify-center h-full gap-4">
      <div className="rounded-full bg-green-100 w-20 h-20 flex items-center justify-center">
        <svg width={36} height={36} className="text-green-500" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
      </div>
      <div className="text-lg font-semibold text-green-800">Chat is coming soon!</div>
      <div className="text-sm text-gray-400">You'll be able to message sellers & buyers here.</div>
    </div>
  );
}
