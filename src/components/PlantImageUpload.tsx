
import { useRef } from "react";

interface PlantImageUploadProps {
  preview: string | null;
  setPreview: (url: string | null) => void;
  disabled?: boolean;
}

export default function PlantImageUpload({
  preview,
  setPreview,
  disabled,
}: PlantImageUploadProps) {
  const imageInputRef = useRef<HTMLInputElement>(null);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.length) {
      const file = e.target.files[0];
      setPreview(URL.createObjectURL(file));
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
