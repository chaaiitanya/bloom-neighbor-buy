
import { useState } from "react";
import { Input } from "@/components/ui/input";

export default function PostPlantForm() {
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.length) {
      const file = e.target.files[0];
      setImagePreview(URL.createObjectURL(file));
    }
  };

  return (
    <form className="p-6 space-y-5">
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
          />
        </div>
      </div>
      <div>
        <label className="block text-green-800 font-semibold mb-1">Name</label>
        <Input className="bg-white" type="text" placeholder="e.g. Fiddle Leaf Fig" required />
      </div>
      <div>
        <label className="block text-green-800 font-semibold mb-1">Price</label>
        <Input className="bg-white" type="number" step="0.01" min="0" placeholder="e.g. 15.00" required />
      </div>
      <div>
        <label className="block text-green-800 font-semibold mb-1">Description</label>
        <textarea className="w-full bg-white rounded-lg p-2 border border-green-100 min-h-[4rem]" placeholder="Any notes about your plant..." required />
      </div>
      <div>
        <label className="block text-green-800 font-semibold mb-1">Location</label>
        <Input type="text" className="bg-white" placeholder="123 Green Ave, Your City" required />
      </div>
      <button
        type="submit"
        className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-2 rounded-xl shadow mt-4 transition"
      >
        Post Plant
      </button>
    </form>
  );
}
