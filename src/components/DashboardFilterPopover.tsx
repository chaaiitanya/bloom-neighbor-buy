import { useState } from "react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Slider } from "@/components/ui/slider";
import { Filter } from "lucide-react";

export default function DashboardFilterPopover({
  range,
  setRange,
  minPrice,
  setMinPrice,
  maxPrice,
  setMaxPrice,
}: {
  range: number;
  setRange: (v: number) => void;
  minPrice: string;
  setMinPrice: (v: string) => void;
  maxPrice: string;
  setMaxPrice: (v: string) => void;
}) {
  // (Optional: local open/close state if you want to control the popover)
  return (
    <Popover>
      <PopoverTrigger asChild>
        <button
          className="flex items-center justify-center rounded-full bg-white border border-green-200 text-green-700 hover:bg-green-50 hover:border-green-400 transition h-[46px] w-[46px] shadow-sm"
          aria-label="Filters"
          type="button"
        >
          <Filter size={22} />
        </button>
      </PopoverTrigger>
      <PopoverContent align="end" className="w-[300px] px-0 py-2 rounded-2xl border-green-200 shadow-lg animate-fade-in">
        <div className="px-4">
          <div className="mb-4">
            <span className="block text-green-700 font-semibold mb-2">Range (km)</span>
            <div className="flex items-center gap-3">
              <Slider
                min={1}
                max={50}
                value={[range]}
                onValueChange={vals => setRange(vals[0])}
                className="w-full h-4"
                style={{ touchAction: "none" }}
                // Keeping custom style to match Figma
              />
              <span className="bg-green-50 text-green-700 font-medium px-2 py-1.5 rounded-md border border-green-100 min-w-[48px] text-center">{range} km</span>
            </div>
          </div>
          <div className="mb-1">
            <span className="block text-green-700 font-semibold mb-2">Price</span>
            <div className="flex flex-row items-center gap-2">
              <input
                type="number"
                min={0}
                placeholder="Min"
                value={minPrice}
                className="w-20 h-9 px-2 rounded bg-white border border-green-100 text-green-900 focus:outline-none focus:ring-1 focus:ring-green-200 font-semibold placeholder:text-green-400"
                style={{ boxShadow: "0 1px 0 0 #e8f8ef" }}
                onChange={e => setMinPrice(e.target.value)}
              />
              <span className="text-gray-400">-</span>
              <input
                type="number"
                min={0}
                placeholder="Max"
                value={maxPrice}
                className="w-20 h-9 px-2 rounded bg-white border border-green-100 text-green-900 focus:outline-none focus:ring-1 focus:ring-green-200 font-semibold placeholder:text-green-400"
                style={{ boxShadow: "0 1px 0 0 #e8f8ef" }}
                onChange={e => setMaxPrice(e.target.value)}
              />
            </div>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}
