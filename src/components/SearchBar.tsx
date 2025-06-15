import { useState, useRef, useEffect } from "react";
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
  search,
  setSearch,
}: {
  plantType: string;
  setPlantType: (pt: string) => void;
  search?: string;
  setSearch?: (v: string) => void;
}) {
  const [internalSearch, setInternalSearch] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  // Use search prop if given (controlled), otherwise internal state (uncontrolled)
  const value = typeof search === "string" ? search : internalSearch;
  const onChange = setSearch || setInternalSearch;

  const suggestions = getSuggestions(value);

  // Handle suggestion click
  function handleSuggestionClick(s: string) {
    onChange(s);
    setShowDropdown(false);
    // Optionally blur input
    inputRef.current?.blur();
  }

  // Close dropdown if clicking elsewhere
  function handleBlur(e: React.FocusEvent<HTMLInputElement>) {
    // Timeout is needed to allow click event on dropdown
    setTimeout(() => setShowDropdown(false), 120);
  }

  useEffect(() => {
    // Keep internal state in sync if parent changes value outside
    if (typeof search === "string" && search !== internalSearch) {
      setInternalSearch(search);
    }
    // eslint-disable-next-line
  }, [search]);

  return (
    <form className="w-full mb-10" onSubmit={e => e.preventDefault()} autoComplete="off">
      <div className="flex flex-col sm:flex-row items-stretch gap-3 relative">
        <div className="relative flex-1">
          <input
            id="search-plants"
            type="text"
            ref={inputRef}
            value={value}
            placeholder="Search for neighbourhood plants..."
            className="w-full rounded-2xl border border-white/20 bg-black/75 backdrop-blur-xl pl-12 pr-4 py-4 text-xl text-green-100 placeholder:text-green-300/80 shadow focus:ring-2 focus:ring-green-200 focus:outline-none transition"
            autoComplete="off"
            onFocus={() => setShowDropdown(true)}
            onChange={e => {
              onChange(e.target.value);
              setShowDropdown(true);
            }}
            onBlur={handleBlur}
          />
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-green-300 w-7 h-7" />
          {/* Autocomplete dropdown */}
          {showDropdown && suggestions.length > 0 && (
            <ul className="absolute left-0 mt-1 bg-black/95 border border-white/20 backdrop-blur-2xl rounded-2xl shadow-lg w-full z-40 max-h-64 overflow-y-auto text-base">
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
