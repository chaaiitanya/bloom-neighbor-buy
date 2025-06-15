
import { useRef } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/components/ui/use-toast";

interface PlantImageUploadProps {
  preview: string | null;
  setPreview: (url: string | null) => void;
  setImageFile?: (file: File | null) => void;
  disabled?: boolean;
}

export default function PlantImageUpload({
  preview,
  setPreview,
  setImageFile,
  disabled,
}: PlantImageUploadProps) {
  const imageInputRef = useRef<HTMLInputElement>(null);

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.length) {
      const file = e.target.files[0];

      // Provide preview
      setPreview(URL.createObjectURL(file));

      // Upload to Supabase Storage
      const fileExt = file.name.split(".").pop();
      const randomName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;
      const filePath = `uploads/${randomName}`;
      const { data, error } = await supabase.storage.from("plant-images").upload(filePath, file, {
        cacheControl: "3600",
        upsert: false,
      });
      if (error) {
        toast({
          title: "Image upload failed",
          description: error.message,
          variant: "destructive",
        });
        setImageFile && setImageFile(null);
        // Don’t update preview or photo_url
        return;
      }

      // Get public URL
      const { data: urlData } = supabase.storage.from("plant-images").getPublicUrl(filePath);
      if (urlData?.publicUrl) {
        setPreview(urlData.publicUrl);
        setImageFile && setImageFile(null); // No need to keep file after upload
      }
    }
  };

  return (
    <div>
      <label className="block text-green-800 font-semibold mb-2">Plant photo</label>
      <div className="w-full h-40 bg-green-50 rounded-xl border border-green-100 flex items-center justify-center relative overflow-hidden mb-2">
        {preview ? (
          <img src={preview} alt="Preview" className="w-full h-full object-cover rounded-xl transition" />
        ) : (
          <span className="text-gray-400">Add a photo</span>
        )}
        <input
          type="file"
          accept="image/*"
          className="opacity-0 absolute inset-0 cursor-pointer"
          onChange={handleImageChange}
          ref={imageInputRef}
          aria-label="Upload plant photo"
          disabled={disabled}
        />
      </div>
    </div>
  );
}
