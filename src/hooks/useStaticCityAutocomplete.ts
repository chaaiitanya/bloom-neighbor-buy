
import { useState, useRef } from "react";
import cityList from "@/components/cityList";

export function useStaticCityAutocomplete() {
  const [cityInput, setCityInput] = useState("");
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const debounceRef = useRef<NodeJS.Timeout | null>(null);

  function fetchSuggestions(query: string) {
    setIsLoading(false);
    // Filter cityList using case-insensitive matching
    const filtered = cityList.filter(city =>
      city.toLowerCase().includes(query.trim().toLowerCase())
    );
    setSuggestions(filtered.slice(0, 8)); // Limit results
  }

  function handleInputChange(value: string) {
    setCityInput(value);
    setShowDropdown(true);
    if (debounceRef.current) clearTimeout(debounceRef.current);
    if (value.trim().length < 2) {
      setSuggestions([]);
      return;
    }
    debounceRef.current = setTimeout(() => {
      fetchSuggestions(value);
    }, 150);
  }

  function handleSuggestionClick(loc: string) {
    setCityInput(loc);
    setShowDropdown(false);
    setSuggestions([]);
  }

  function handleBlur() {
    setTimeout(() => setShowDropdown(false), 110);
  }

  return {
    cityInput,
    setCityInput,
    suggestions,
    isLoading,
    showDropdown,
    setShowDropdown,
    handleInputChange,
    handleSuggestionClick,
    handleBlur,
  };
}
