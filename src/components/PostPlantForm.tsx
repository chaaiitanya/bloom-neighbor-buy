import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/components/ui/use-toast";
import { useNavigate } from "react-router-dom";

type PostPlantFormProps = {
  afterPost?: () => void;
};

export default function PostPlantForm({ afterPost }: PostPlantFormProps) {
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [description, setDescription] = useState("");
  const [location, setLocation] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const navigate = useNavigate();

  // For demo: use placeholder image, but keep the upload field for user experience
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.length) {
      const file = e.target.files[0];
      setImagePreview(URL.createObjectURL(file));
      // Actual upload will be enabled once storage bucket is available.
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

    // Get user id
    const { data: userData } = await supabase.auth.getUser();
    const user_id = userData?.user?.id;
    if (!user_id) {
      toast({ title: "Not logged in!", variant: "destructive" });
      setSubmitting(false);
      return;
    }

    // Note: Once storage bucket is available, upload the image file and use the URL. For now, use a placeholder image.
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
      <div>
        <label className="block text-green-800 font-semibold mb-1">Location</label>
        <Input
          type="text"
          className="bg-white"
          placeholder="123 Green Ave, Your City"
          value={location}
          onChange={e => setLocation(e.target.value)}
          required
          disabled={submitting}
        />
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
