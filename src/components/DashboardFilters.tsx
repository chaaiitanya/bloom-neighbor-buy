
import { useState } from "react";

const options = [
  { label: "All", value: "all" },
  { label: "Indoor", value: "indoor" },
  { label: "Outdoor", value: "outdoor" },
  { label: "Succulent", value: "succulent" },
  { label: "Flower", value: "flower" },
];

export default function DashboardFilters({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  return (
    <div className="flex flex-row gap-1 w-full overflow-x-auto no-scrollbar">
      {options.map(option => (
        <button
          key={option.value}
          type="button"
          className={`rounded-full px-3 py-1.5 border text-sm font-semibold transition 
            ${
              value === option.value
                ? "bg-green-600 text-white border-green-600 shadow"
                : "bg-green-50 text-green-700 border-green-100 hover:bg-green-100"
            }`}
          onClick={() => onChange(option.value)}
        >
          {option.label}
        </button>
      ))}
    </div>
  );
}
