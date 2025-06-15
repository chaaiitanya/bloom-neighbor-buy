
import { useState, useRef } from "react";
import { supabase } from "@/integrations/supabase/client";

type Suggestion = string;

export function useCityAutocomplete() {
  const [cityInput, setCityInput] = useState("");
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const debounceRef = useRef<NodeJS.Timeout | null>(null);

  // Helper to get Mapbox public token from Supabase Edge Environment
  const getMapboxToken = async (): Promise<string | null> => {
    const { data, error } = await supabase.functions.invoke("get-secret", {
      body: { key: "MAPBOX_PUBLIC_TOKEN" },
    });
    if (error) return null;
    return data?.secret ?? null;
  };

  const fetchSuggestions = async (query: string) => {
    setIsLoading(true);
    setSuggestions([]);
    const mapboxToken = await getMapboxToken();
    if (!mapboxToken) {
      setSuggestions([]);
      setIsLoading(false);
      return;
    }
    try {
      const endpoint = `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(
        query
      )}.json?access_token=${mapboxToken}&autocomplete=true&types=place&limit=6&language=en`;
      const resp = await fetch(endpoint);
      const json = await resp.json();
      const citySuggestions =
        json?.features?.map((f: any) => f.place_name)?.filter(Boolean) || [];
      setSuggestions(citySuggestions);
    } catch {
      setSuggestions([]);
    }
    setIsLoading(false);
  };

  function handleInputChange(value: string) {
    setCityInput(value);
    setShowDropdown(true);
    if (debounceRef.current) clearTimeout(debounceRef.current);
    if (value.trim().length < 2) {
      setSuggestions([]);
      return;
    }
    debounceRef.current = setTimeout(() => {
      fetchSuggestions(value.trim());
    }, 250);
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
