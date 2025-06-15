
import { useState, useEffect } from "react";
import { toast } from "@/components/ui/use-toast";
import { useNavigate } from "react-router-dom";
import PlantImageUpload from "@/components/PlantImageUpload";
import MultiImageUpload from "@/components/MultiImageUpload";
import { useStaticCityAutocomplete } from "@/hooks/useStaticCityAutocomplete";
import { useUserLocationCity } from "@/hooks/useUserLocationCity";
import PlantNameInput from "@/components/post-plant/PlantNameInput";
import PriceInput from "@/components/post-plant/PriceInput";
import PlantDescription from "@/components/post-plant/PlantDescription";
import PlantLocationInput from "@/components/post-plant/PlantLocationInput";
import PostPlantFormWrapper from "@/components/post-plant/PostPlantFormWrapper";
import { supabase } from "@/integrations/supabase/client";

type PostPlantFormProps = {
  afterPost?: () => void;
};

export default function PostPlantForm({ afterPost }: PostPlantFormProps) {
  const [photos, setPhotos] = useState<string[]>([]);
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [description, setDescription] = useState("");
  const [submitting, setSubmitting] = useState(false);

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

    let failed = false;
    for (let i = 0; i < photos.length; i++) {
      const { error: photoErr } = await supabase.from("plant_photos").insert({
        plant_id: insertPlant.id,
        photo_url: photos[i],
        position: i,
      });
      if (photoErr) {
        failed = true;
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
    <PostPlantFormWrapper>
      <form className="space-y-5" onSubmit={handleSubmit}>
        <MultiImageUpload
          images={photos}
          setImages={setPhotos}
          disabled={submitting}
          maxImages={10}
        />
        <PlantNameInput value={name} onChange={setName} disabled={submitting} />
        <PriceInput value={price} onChange={setPrice} disabled={submitting} />
        <PlantDescription value={description} onChange={setDescription} disabled={submitting} />
        <PlantLocationInput
          value={location}
          onInputChange={handleInputChange}
          disabled={submitting}
          suggestions={suggestions}
          isLoading={isLoading}
          showDropdown={showDropdown}
          setShowDropdown={setShowDropdown}
          handleSuggestionClick={handleSuggestionClick}
          handleBlur={handleBlur}
        />
        <button
          type="submit"
          className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-2 rounded-xl shadow mt-4 transition disabled:opacity-70 disabled:cursor-wait"
          disabled={submitting}
        >
          {submitting ? "Posting..." : "Post Plant"}
        </button>
      </form>
    </PostPlantFormWrapper>
  );
}
