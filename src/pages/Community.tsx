
import BottomTabNav from "@/components/BottomTabNav";
import { MessagesSquare } from "lucide-react";

export default function Community() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-green-50 to-white pb-20">
      <div className="flex flex-col gap-4 items-center w-full max-w-xl px-4 py-10">
        <MessagesSquare className="w-14 h-14 text-green-500 drop-shadow" />
        <h1 className="text-2xl font-bold text-green-700">Community Communication</h1>
        <p className="text-center text-green-900/80 max-w-sm">
          Welcome to the Bloom Neighbor Community! Here, you can communicate with other users, exchange tips, and build your plant network. (UI coming soon!)
        </p>
      </div>
      <BottomTabNav />
    </div>
  );
}
