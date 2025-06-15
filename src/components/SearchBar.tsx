
import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
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

const exampleLocations = [
  "Sunnydale",
  "Greenfield",
  "Oakwood",
  "Midtown",
  "Maplewood",
  "Riverside",
  "Hillcrest",
  "Evergreen",
  "Garden Oaks",
  "Meadow Lane",
  "Brookfield",
];

const examplePlantNames = [
  "Marigold Flowers",
  "Ficus Tree",
  "Water Lilies",
  "Monstera",
  "Aloe Vera",
  "Spider Plant",
  "Pothos",
  "Cactus Mini",
  "Peace Lily",
  "ZZ Plant",
  "Rubber Plant",
  "Outdoor Bonsai",
  "Daisy",
  "Succulent Mix",
];

function getSuggestions(query: string) {
  if (!query) return [];
  const q = query.toLowerCase();
  // make a unique set
  const suggestions = [
    ...plantTypes,
    ...exampleLocations,
    ...examplePlantNames,
  ].filter(
    (item) => item.toLowerCase().includes(q)
  );
  return Array.from(new Set(suggestions));
}

export default function SearchBar({
  plantType,
  setPlantType,
}: {
  plantType: string;
  setPlantType: (pt: string) => void;
}) {
  const [search, setSearch] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

  const suggestions = getSuggestions(search);

  // Handle suggestion click
  function handleSuggestionClick(s: string) {
    setSearch(s);
    setShowDropdown(false);
    inputRef.current?.blur();
  }

  function handleBlur(e: React.FocusEvent<HTMLInputElement>) {
    setTimeout(() => setShowDropdown(false), 120);
  }

  // SUBMIT HANDLER: Go to /dashboard with query param
  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (search?.trim().length) {
      // encodeURIComponent for safety
      navigate(`/dashboard?search=${encodeURIComponent(search.trim())}`);
    } else {
      navigate(`/dashboard`);
    }
  }

  return (
    <form
      className="w-full mb-10"
      onSubmit={handleSubmit}
      autoComplete="off"
    >
      <div className="flex flex-col sm:flex-row items-stretch gap-3 relative">
        <div className="relative flex-1">
          <input
            id="search-plants"
            type="text"
            ref={inputRef}
            value={search}
            placeholder="Search for neighbourhood plants..."
            className="w-full rounded-2xl border border-white/20 bg-black/75 backdrop-blur-xl pl-12 pr-4 py-4 text-xl text-green-100 placeholder:text-green-300/80 shadow focus:ring-2 focus:ring-green-200 focus:outline-none transition"
            autoComplete="off"
            onFocus={() => setShowDropdown(true)}
            onChange={e => {
              setSearch(e.target.value);
              setShowDropdown(true);
            }}
            onBlur={handleBlur}
          />
          <button
            type="submit"
            className="absolute right-4 top-1/2 -translate-y-1/2 bg-green-500 hover:bg-green-600 text-white rounded-full p-2 transition shadow animate-fade-in"
            aria-label="Search"
          >
            <Search className="w-6 h-6" />
          </button>
          {/* Autocomplete dropdown */}
          {showDropdown && suggestions.length > 0 && (
            <ul className="absolute left-0 mt-1 bg-black/95 border border-white/20 backdrop-blur-2xl rounded-2xl shadow-lg w-full z-40 max-h-64 overflow-y-auto text-base animate-fade-in">
              {suggestions.map((s, i) => (
                <li
                  key={s + i}
                  className="px-5 py-3 cursor-pointer hover:bg-green-900/20 text-green-100"
                  onMouseDown={() => handleSuggestionClick(s)}
                >
                  {s}
                </li>
              ))}
            </ul>
          )}
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
