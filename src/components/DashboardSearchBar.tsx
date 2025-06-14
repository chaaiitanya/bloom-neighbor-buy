
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";

export default function DashboardSearchBar({ value, onChange }: { value: string; onChange: (val: string) => void }) {
  return (
    <div className="relative w-full">
      <Input
        type="text"
        placeholder="Search for plants near you..."
        className="pl-11 pr-3 bg-green-50 border-green-100 text-green-900 font-semibold placeholder:text-green-400"
        value={value}
        onChange={e => onChange(e.target.value)}
      />
      <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-green-400" size={20} />
    </div>
  );
}
