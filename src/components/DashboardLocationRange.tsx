
import { useState } from "react";

export default function DashboardLocationRange({
  value,
  onChange
}: {
  value: number;
  onChange: (val: number) => void;
}) {
  return (
    <div className="flex items-center gap-3 w-full">
      <span className="text-green-700 text-sm font-semibold">Range:</span>
      <input
        type="range"
        min={1}
        max={50}
        value={value}
        onChange={e => onChange(Number(e.target.value))}
        className="w-[120px] accent-green-500"
      />
      <span className="text-sm text-green-600">{value} km</span>
    </div>
  );
}
