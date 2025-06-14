
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";

export default function DashboardSearchBar({ value, onChange }: { value: string; onChange: (val: string) => void }) {
  return (
    <div className="relative w-full">
      <Input
        type="text"
        placeholder="Search for plants near you..."
        className="pl-14 pr-3 rounded-xl bg-[#f4fdf7] border border-[#d3f4dc] text-green-900 font-semibold placeholder:text-green-400 h-[46px] shadow-none focus:ring-1 focus:ring-green-200 transition"
        style={{ boxShadow: "0 2px 0 0 #e8f8ef" }}
        value={value}
        onChange={e => onChange(e.target.value)}
      />
      <span className="absolute left-4 top-1/2 -translate-y-1/2 bg-[#e3fae7] rounded-full w-7 h-7 flex items-center justify-center">
        <Search className="text-green-400" size={20} />
      </span>
    </div>
  );
}
