
import { useState } from "react";
import { Search } from "lucide-react";

const plantTypes = [
  "All",
  "Flower",
  "Tree",
  "Cactus",
  "Herb",
  "Shrub",
  "Vine",
  "Rare",
];

export default function SearchBar({
  plantType,
  setPlantType,
}: {
  plantType: string;
  setPlantType: (pt: string) => void;
}) {
  return (
    <form className="w-full mb-10" onSubmit={e => e.preventDefault()}>
      <div className="flex flex-col sm:flex-row items-stretch gap-3 relative">
        <div className="relative flex-1">
          <input
            id="search-plants"
            type="text"
            placeholder="Search for neighbourhood plants..."
            className="w-full rounded-2xl border border-white/20 bg-black/75 backdrop-blur-xl pl-12 pr-4 py-4 text-xl text-green-100 placeholder:text-green-300/80 shadow focus:ring-2 focus:ring-green-200 focus:outline-none transition"
            autoComplete="off"
          />
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-green-300 w-7 h-7" />
        </div>
        <select
          className="rounded-2xl bg-black/70 border border-white/10 text-green-100 py-3 px-4 min-w-[120px] focus:outline-none focus:ring-2 focus:ring-green-400 transition"
          value={plantType}
          onChange={e => setPlantType(e.target.value)}
          aria-label="Filter by plant type"
        >
          {plantTypes.map(type => (
            <option key={type} value={type}>
              {type}
            </option>
          ))}
        </select>
        <input
          type="text"
          placeholder="Location (optional)"
          className="rounded-2xl bg-black/60 border border-white/10 text-green-100 py-3 px-4 min-w-[140px] focus:outline-none focus:ring-2 focus:ring-green-400 transition"
          aria-label="Location"
        />
      </div>
    </form>
  );
}
