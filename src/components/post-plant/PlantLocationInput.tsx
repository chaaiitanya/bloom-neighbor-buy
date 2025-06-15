
import { Input } from "@/components/ui/input";
import { useRef } from "react";

type LocationInputProps = {
  value: string;
  onInputChange: (val: string) => void;
  disabled?: boolean;
  suggestions: string[];
  isLoading: boolean;
  showDropdown: boolean;
  setShowDropdown: (v: boolean) => void;
  handleSuggestionClick: (suggestion: string) => void;
  handleBlur: () => void;
};

export default function PlantLocationInput({
  value,
  onInputChange,
  disabled,
  suggestions,
  isLoading,
  showDropdown,
  setShowDropdown,
  handleSuggestionClick,
  handleBlur,
}: LocationInputProps) {
  const locationInputRef = useRef<HTMLInputElement>(null);
  return (
    <div className="relative">
      <label className="block text-green-800 dark:text-green-100 font-semibold mb-1">Location (City)</label>
      <Input
        type="text"
        className="bg-white dark:bg-[#232a26] text-green-800 dark:text-green-50 placeholder:text-green-400 dark:placeholder:text-green-500"
        placeholder="Enter your city (e.g. Dallas, Mumbai, London,...)"
        value={value}
        onChange={e => onInputChange(e.target.value)}
        required
        disabled={disabled}
        autoComplete="off"
        ref={locationInputRef}
        onFocus={() => setShowDropdown(true)}
        onBlur={handleBlur}
        aria-autocomplete="list"
        aria-controls="location-autocomplete-list"
      />
      {showDropdown && value && (
        <ul
          id="location-autocomplete-list"
          className="absolute z-50 left-0 w-full bg-white dark:bg-[#232a26] border border-green-100 dark:border-green-800 rounded-xl mt-1 shadow-lg max-h-48 overflow-y-auto animate-fade-in"
          style={{ maxWidth: '100%' }}
          role="listbox"
        >
          {isLoading ? (
            <li className="px-4 py-2 text-green-600 dark:text-green-300 font-medium">Loading…</li>
          ) : suggestions.length > 0 ? (
            suggestions.map((loc, i) => (
              <li
                key={loc + i}
                className="px-4 py-2 cursor-pointer hover:bg-green-50 dark:hover:bg-green-900 text-green-800 dark:text-green-50 font-medium"
                onMouseDown={() => handleSuggestionClick(loc)}
                role="option"
                tabIndex={-1}
              >
                {loc}
              </li>
            ))
          ) : (
            value.length >= 2 && (
              <li className="px-4 py-2 text-green-700 dark:text-green-400">No cities found</li>
            )
          )}
        </ul>
      )}
    </div>
  );
}
