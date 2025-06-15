import { useState, useRef, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/components/ui/use-toast";
import { useNavigate } from "react-router-dom";
import PlantImageUpload from "@/components/PlantImageUpload";
import { useStaticCityAutocomplete } from "@/hooks/useStaticCityAutocomplete";
import { useUserLocationCity } from "@/hooks/useUserLocationCity";
import MultiImageUpload from "@/components/MultiImageUpload";

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
  // Photos array state!
  const [photos, setPhotos] = useState<string[]>([]);
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [description, setDescription] = useState("");
  const [submitting, setSubmitting] = useState(false);

  // Use static autocomplete hook for city/location
  const {
    cityInput: location,
    setCityInput: setLocation,
    suggestions,
    isLoading,
    showDropdown,
    setShowDropdown,
    handleInputChange,
    handleSuggestionClick,
    handleBlur,
  } = useStaticCityAutocomplete();

  // --- Auto-detect location (city) on mount ---
  const { city: detectedCity, loading: locationLoading, error: locationError } =
    useUserLocationCity(location.length === 0); // only when input is empty

  useEffect(() => {
    if (
      detectedCity &&
      location.length === 0 // only if input is empty
    ) {
      setLocation(detectedCity);
      toast({
        title: "Detected your city",
        description: `Location pre-filled as ${detectedCity}`,
      });
    }
    if (locationError && location.length === 0) {
      toast({
        title: "Could not detect city",
        description: "Please enter your city manually.",
        variant: "destructive",
      });
    }
  }, [detectedCity, locationError, setLocation, location]);

  const locationInputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (
      !name.trim() ||
      !price ||
      !description.trim() ||
      !location.trim() ||
      photos.length === 0
    ) {
      toast({
        title: "Please fill all fields and upload at least 1 image.",
        variant: "destructive",
      });
      return;
    }
    // --- enforce city recognition ---
    const locStandardized = location.trim().toLowerCase();
    if (locStandardized.length < 2) {
      toast({ title: "Please enter a valid city.", variant: "destructive" });
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

    // Insert main plant entry (use first photo as primary)
    const { data: insertPlant, error } = await supabase
      .from("plants")
      .insert({
        user_id,
        photo_url: photos[0], // main image for legacy use
        name,
        price: Number(price) || 0,
        description,
        location,
      })
      .select()
      .single();

    if (error || !insertPlant) {
      toast({
        title: "Could not post plant.",
        description: error?.message,
        variant: "destructive",
      });
      setSubmitting(false);
      return;
    }

    // Insert all images into plant_photos
    let failed = false;
    for (let i = 0; i < photos.length; i++) {
      const { error: photoErr } = await supabase.from("plant_photos").insert({
        plant_id: insertPlant.id,
        photo_url: photos[i],
        position: i,
      });
      if (photoErr) {
        failed = true;
        // We continue to insert the rest, but only show toast at end
      }
    }

    toast({
      title: failed
        ? "Plant posted but some images failed to link."
        : "Plant posted!",
      description: failed
        ? "Not all images may appear. Please try editing your listing to fix."
        : "Your plant is now listed.",
      variant: failed ? "destructive" : undefined,
    });

    if (afterPost) {
      afterPost();
    } else {
      setTimeout(() => {
        navigate("/dashboard");
      }, 800);
    }
    setSubmitting(false);
  };

  return (
    <form className="p-6 space-y-5" onSubmit={handleSubmit}>
      <MultiImageUpload
        images={photos}
        setImages={setPhotos}
        disabled={submitting}
        maxImages={10}
      />
      <div>
        <label className="block text-green-800 dark:text-green-100 font-semibold mb-1">Name</label>
        <Input
          className="bg-white dark:bg-[#232a26] text-green-800 dark:text-green-50 placeholder:text-green-400 dark:placeholder:text-green-500"
          type="text"
          placeholder="e.g. Fiddle Leaf Fig"
          value={name}
          onChange={e => setName(e.target.value)}
          required
          disabled={submitting}
        />
      </div>
      <div>
        <label className="block text-green-800 dark:text-green-100 font-semibold mb-1">Price</label>
        <Input
          className="bg-white dark:bg-[#232a26] text-green-800 dark:text-green-50 placeholder:text-green-400 dark:placeholder:text-green-500"
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
        <label className="block text-green-800 dark:text-green-100 font-semibold mb-1">Description</label>
        <Textarea
          className="bg-white dark:bg-[#232a26] rounded-lg p-2 border border-green-100 min-h-[4rem] text-green-800 dark:text-green-50 placeholder:text-green-400 dark:placeholder:text-green-500"
          placeholder="Any notes about your plant..."
          value={description}
          onChange={e => setDescription(e.target.value)}
          required
          disabled={submitting}
        />
      </div>
      <div className="relative">
        <label className="block text-green-800 dark:text-green-100 font-semibold mb-1">Location (City)</label>
        <Input
          type="text"
          className="bg-white dark:bg-[#232a26] text-green-800 dark:text-green-50 placeholder:text-green-400 dark:placeholder:text-green-500"
          placeholder="Enter your city (e.g. Dallas, Mumbai, London,...)"
          value={location}
          onChange={e => handleInputChange(e.target.value)}
          required
          disabled={submitting}
          autoComplete="off"
          ref={locationInputRef}
          onFocus={() => setShowDropdown(true)}
          onBlur={handleBlur}
          aria-autocomplete="list"
          aria-controls="location-autocomplete-list"
        />
        {showDropdown && location && (
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
              location.length >= 2 && (
                <li className="px-4 py-2 text-green-700 dark:text-green-400">No cities found</li>
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
