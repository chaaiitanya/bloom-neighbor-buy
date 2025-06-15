import { useState, useRef } from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/components/ui/use-toast";
import { useNavigate } from "react-router-dom";

type PostPlantFormProps = {
  afterPost?: () => void;
};

// Helper to get Mapbox public token from Supabase Edge Environment
const getMapboxToken = async (): Promise<string | null> => {
  const { data, error } = await supabase.functions.invoke("get-secret", {
    body: { key: "MAPBOX_PUBLIC_TOKEN" },
  });
  if (error) {
    return null;
  }
  return data?.secret ?? null;
};

export default function PostPlantForm({ afterPost }: PostPlantFormProps) {
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [description, setDescription] = useState("");
  const [location, setLocation] = useState("");
  const [submitting, setSubmitting] = useState(false);

  // Location autocomplete state
  const [showLocationDropdown, setShowLocationDropdown] = useState(false);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [isLoadingSuggestions, setIsLoadingSuggestions] = useState(false);
  const locationInputRef = useRef<HTMLInputElement>(null);

  const navigate = useNavigate();

  // Debounce timer for fetch
  const debounceRef = useRef<NodeJS.Timeout | null>(null);

  // Fetch city suggestions from Mapbox
  const fetchSuggestions = async (query: string) => {
    setIsLoadingSuggestions(true);
    setSuggestions([]);
    const mapboxToken = await getMapboxToken();
    if (!mapboxToken) {
      setSuggestions([]);
      setIsLoadingSuggestions(false);
      return;
    }
    try {
      // Cities only & limit results for performance
      const endpoint = `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(
        query
      )}.json?access_token=${mapboxToken}&autocomplete=true&types=place&limit=6&language=en`;
      const resp = await fetch(endpoint);
      const json = await resp.json();
      // Filter unique place names
      const citySuggestions =
        json?.features?.map((f: any) => f.place_name)?.filter(Boolean) || [];
      setSuggestions(citySuggestions);
    } catch {
      setSuggestions([]);
    }
    setIsLoadingSuggestions(false);
  };

  // Handle location changes and trigger suggestions
  function handleLocationInputChange(e: React.ChangeEvent<HTMLInputElement>) {
    const value = e.target.value;
    setLocation(value);
    setShowLocationDropdown(true);
    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }
    if (value.trim().length < 2) {
      setSuggestions([]);
      return;
    }
    debounceRef.current = setTimeout(() => {
      fetchSuggestions(value.trim());
    }, 250); // Debounce API calls
  }

  function handleSuggestionClick(loc: string) {
    setLocation(loc);
    setShowLocationDropdown(false);
    setSuggestions([]);
    locationInputRef.current?.blur();
  }

  function handleLocationBlur() {
    setTimeout(() => setShowLocationDropdown(false), 110);
  }

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.length) {
      const file = e.target.files[0];
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !price || !description.trim() || !location.trim()) {
      toast({
        title: "Please fill all fields.",
        variant: "destructive",
      });
      return;
    }
    setSubmitting(true);

    const { data: userData } = await supabase.auth.getUser();
    const user_id = userData?.user?.id;
    if (!user_id) {
      toast({ title: "Not logged in!", variant: "destructive" });
      setSubmitting(false);
      return;
    }
    const photo_url = imagePreview || "/placeholder.svg";

    const { error } = await supabase.from("plants").insert({
      user_id,
      photo_url,
      name,
      price: Number(price) || 0,
      description,
      location,
    });

    if (error) {
      toast({
        title: "Could not post plant.",
        description: error.message,
        variant: "destructive",
      });
    } else {
      toast({
        title: "Plant posted!",
        description: "Your plant is now listed.",
      });
      if (afterPost) {
        afterPost();
      } else {
        setTimeout(() => {
          navigate("/dashboard");
        }, 800);
      }
    }
    setSubmitting(false);
  };

  return (
    <form className="p-6 space-y-5" onSubmit={handleSubmit}>
      <div>
        <label className="block text-green-800 font-semibold mb-2">Plant photo</label>
        <div className="w-full h-40 bg-green-50 rounded-xl border border-green-100 flex items-center justify-center relative overflow-hidden mb-2">
          {imagePreview ? (
            <img src={imagePreview} alt="Preview" className="w-full h-full object-cover rounded-xl transition" />
          ) : (
            <span className="text-gray-400">Add a photo</span>
          )}
          <input
            type="file"
            accept="image/*"
            className="opacity-0 absolute inset-0 cursor-pointer"
            onChange={handleImageChange}
            aria-label="Upload plant photo"
            disabled={submitting}
          />
        </div>
      </div>
      <div>
        <label className="block text-green-800 font-semibold mb-1">Name</label>
        <Input
          className="bg-white"
          type="text"
          placeholder="e.g. Fiddle Leaf Fig"
          value={name}
          onChange={e => setName(e.target.value)}
          required
          disabled={submitting}
        />
      </div>
      <div>
        <label className="block text-green-800 font-semibold mb-1">Price</label>
        <Input
          className="bg-white"
          type="number"
          step="0.01"
          min="0"
          placeholder="e.g. 15.00"
          value={price}
          onChange={e => setPrice(e.target.value)}
          required
          disabled={submitting}
        />
      </div>
      <div>
        <label className="block text-green-800 font-semibold mb-1">Description</label>
        <Textarea
          className="bg-white rounded-lg p-2 border border-green-100 min-h-[4rem]"
          placeholder="Any notes about your plant..."
          value={description}
          onChange={e => setDescription(e.target.value)}
          required
          disabled={submitting}
        />
      </div>
      <div className="relative">
        <label className="block text-green-800 font-semibold mb-1">Location</label>
        <Input
          type="text"
          className="bg-white"
          placeholder="Enter your city (e.g. Mumbai, London,...)"
          value={location}
          onChange={handleLocationInputChange}
          required
          disabled={submitting}
          autoComplete="off"
          ref={locationInputRef}
          onFocus={() => setShowLocationDropdown(true)}
          onBlur={handleLocationBlur}
          aria-autocomplete="list"
          aria-controls="location-autocomplete-list"
        />
        {/* Autocomplete dropdown for locations */}
        {showLocationDropdown && location && (
          <ul
            id="location-autocomplete-list"
            className="absolute z-50 left-0 w-full bg-white border border-green-100 rounded-xl mt-1 shadow-lg max-h-48 overflow-y-auto animate-fade-in"
            style={{ maxWidth: "100%" }}
            role="listbox"
          >
            {isLoadingSuggestions ? (
              <li className="px-4 py-2 text-green-600 font-medium">Loading…</li>
            ) : suggestions.length > 0 ? (
              suggestions.map((loc, i) => (
                <li
                  key={loc + i}
                  className="px-4 py-2 cursor-pointer hover:bg-green-50 text-green-800 font-medium"
                  onMouseDown={() => handleSuggestionClick(loc)}
                  role="option"
                  tabIndex={-1}
                >
                  {loc}
                </li>
              ))
            ) : (
              location.length >= 2 && (
                <li className="px-4 py-2 text-green-700">No cities found</li>
              )
            )}
          </ul>
        )}
      </div>
      <button
        type="submit"
        className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-2 rounded-xl shadow mt-4 transition disabled:opacity-70 disabled:cursor-wait"
        disabled={submitting}
      >
        {submitting ? "Posting..." : "Post Plant"}
      </button>
    </form>
  );
}
