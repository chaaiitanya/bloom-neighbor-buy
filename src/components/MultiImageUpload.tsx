
import React, { useRef } from "react";
import { toast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface MultiImageUploadProps {
  images: string[];
  setImages: (urls: string[]) => void;
  disabled?: boolean;
  maxImages?: number;
}

/**
 * Allows up to `maxImages` to be uploaded. Previews, removes, and uploads each image to Supabase Storage.
 * The image URLs array contains the public URLs after upload.
 */
export default function MultiImageUpload({
  images,
  setImages,
  disabled,
  maxImages = 10,
}: MultiImageUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFilesChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    if (images.length + files.length > maxImages) {
      toast({
        title: `You can upload up to ${maxImages} images.`,
        variant: "destructive",
      });
      return;
    }

    for (const file of Array.from(files)) {
      // Show local preview instantly (optional, can be removed)
      const localUrl = URL.createObjectURL(file);
      setImages((prev) => [...prev, localUrl]);

      // Upload
      const fileExt = file.name.split(".").pop();
      const randomName =
        Date.now() + "-" + Math.random().toString(36).substring(2) + "." + fileExt;
      const filePath = `uploads/${randomName}`;

      const { error } = await supabase.storage
        .from("plant-images")
        .upload(filePath, file, {
          cacheControl: "3600",
          upsert: false,
        });
      if (error) {
        toast({
          title: "Image upload failed",
          description: error.message,
          variant: "destructive",
        });
        setImages((prev) => prev.filter((img) => img !== localUrl));
        continue;
      }
      const { data: urlData } = supabase.storage.from("plant-images").getPublicUrl(filePath);
      if (urlData?.publicUrl) {
        setImages((prev) =>
          prev.map((img, i) => (img === localUrl ? urlData.publicUrl : img))
        );
      }
    }
    // Reset file input value so the same image can be uploaded again if needed
    if (inputRef.current) inputRef.current.value = "";
  };

  const handleRemove = (idx: number) => {
    setImages(images.filter((_, i) => i !== idx));
  };

  // Optionally: move image left/right for reorder
  const handleMove = (from: number, to: number) => {
    if (to < 0 || to >= images.length) return;
    const newArr = [...images];
    [newArr[from], newArr[to]] = [newArr[to], newArr[from]];
    setImages(newArr);
  };

  return (
    <div>
      <label className="block text-green-800 font-semibold mb-2">
        Plant photos (up to {maxImages})
      </label>
      <div className="flex gap-2 flex-wrap mb-2">
        {images.map((img, idx) => (
          <div key={img + idx} className="relative group">
            <img
              src={img}
              alt={`Plant ${idx + 1}`}
              className="w-20 h-20 rounded-xl object-cover border border-green-200 bg-green-50"
            />
            <button
              type="button"
              className="absolute top-1 right-1 bg-white/90 hover:bg-red-100 rounded-full p-1 opacity-70 group-hover:opacity-100"
              onClick={() => handleRemove(idx)}
              aria-label="Remove image"
              tabIndex={-1}
            >
              ×
            </button>
            <div className="absolute bottom-1 right-1 flex gap-1 text-xs">
              {idx > 0 && (
                <button
                  type="button"
                  className="bg-white/70 rounded p-0.5 font-bold"
                  onClick={() => handleMove(idx, idx - 1)}
                  tabIndex={-1}
                  title="Move left"
                  aria-label="Move left"
                  disabled={disabled}
                >
                  ←
                </button>
              )}
              {idx < images.length - 1 && (
                <button
                  type="button"
                  className="bg-white/70 rounded p-0.5 font-bold"
                  onClick={() => handleMove(idx, idx + 1)}
                  tabIndex={-1}
                  title="Move right"
                  aria-label="Move right"
                  disabled={disabled}
                >
                  →
                </button>
              )}
            </div>
          </div>
        ))}
        {images.length < maxImages && (
          <div className="w-20 h-20 rounded-xl border-2 border-dashed border-green-200 flex items-center justify-center relative cursor-pointer bg-green-50 hover:bg-green-100">
            <input
              type="file"
              accept="image/*"
              multiple
              className="absolute inset-0 opacity-0 cursor-pointer"
              onChange={handleFilesChange}
              ref={inputRef}
              disabled={disabled}
              aria-label="Upload plant photos"
            />
            <span className="text-2xl text-green-300">+</span>
          </div>
        )}
      </div>
      <p className="text-sm text-green-600">The first image will be used as the main cover.</p>
    </div>
  );
}
