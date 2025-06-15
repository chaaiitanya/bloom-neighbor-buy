
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { Loader2, Edit, Trash2 } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription, DialogClose } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/hooks/use-toast";

type Plant = {
  id: string;
  name: string;
  photo_url?: string;
  price: number;
  location?: string;
  description?: string;
  created_at?: string;
};

export default function ProfileListings() {
  const [plants, setPlants] = useState<Plant[]>([]);
  const [loading, setLoading] = useState(true);
  // State for Edit dialog
  const [editOpen, setEditOpen] = useState(false);
  const [editingPlant, setEditingPlant] = useState<Plant | null>(null);
  const [editForm, setEditForm] = useState({
    name: "",
    price: "",
    location: "",
    description: "",
    photo_url: "",
  });
  // State for Delete confirmation
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deletingPlant, setDeletingPlant] = useState<Plant | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const fetchListings = async () => {
    setLoading(true);
    const { data: userRes } = await supabase.auth.getUser();
    if (userRes?.user) {
      const { data, error } = await supabase
        .from("plants")
        .select("*")
        .eq("user_id", userRes.user.id)
        .order("created_at", { ascending: false });
      if (!error && data) setPlants(data as Plant[]);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchListings();
    // eslint-disable-next-line
  }, []);

  // Open the edit dialog, pre-fill form
  const handleEditClick = (plant: Plant) => {
    setEditingPlant(plant);
    setEditForm({
      name: plant.name ?? "",
      price: plant.price?.toString() ?? "",
      location: plant.location ?? "",
      description: plant.description ?? "",
      photo_url: plant.photo_url ?? "",
    });
    setEditOpen(true);
  };

  // Update plant in DB
  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingPlant) return;
    setSubmitting(true);
    const { error } = await supabase
      .from("plants")
      .update({
        name: editForm.name,
        price: Number(editForm.price) || 0,
        location: editForm.location,
        description: editForm.description,
      })
      .eq("id", editingPlant.id);
    setSubmitting(false);
    if (error) {
      toast({
        title: "Update failed",
        description: error.message,
        variant: "destructive",
      });
    } else {
      toast({ title: "Listing updated." });
      setEditOpen(false);
      fetchListings();
    }
  };

  // Delete logic
  const handleDeleteClick = (plant: Plant) => {
    setDeletingPlant(plant);
    setDeleteOpen(true);
  };
  const handleDelete = async () => {
    if (!deletingPlant) return;
    setSubmitting(true);
    const { error } = await supabase.from("plants").delete().eq("id", deletingPlant.id);
    setSubmitting(false);
    if (error) {
      toast({
        title: "Delete failed",
        description: error.message,
        variant: "destructive",
      });
    } else {
      toast({ title: "Listing deleted." });
      setDeleteOpen(false);
      setDeletingPlant(null);
      fetchListings();
    }
  };

  return (
    <div className="my-4">
      <h3 className="text-green-900 dark:text-green-100 font-bold text-lg mb-2">My Listings</h3>
      {loading ? (
        <div className="flex items-center justify-center py-8 text-green-700 dark:text-green-300">
          <Loader2 className="animate-spin mr-2" />
          Loading...
        </div>
      ) : plants.length === 0 ? (
        <div className="text-center text-green-700 dark:text-green-200 py-8">No listings posted yet.</div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {plants.map(plant => (
            <Card key={plant.id} className="flex flex-col bg-white/75 dark:bg-[#181f1a]/85 border border-green-100 dark:border-[#223128] transition-colors shadow relative group">
              <div className="absolute top-3 right-3 flex gap-2 opacity-80 group-hover:opacity-100 z-10">
                <button
                  aria-label="Edit listing"
                  className="bg-green-50 hover:bg-green-200 dark:bg-green-900/60 text-green-700 dark:text-green-100 p-1.5 rounded-lg transition flex items-center"
                  onClick={() => handleEditClick(plant)}
                >
                  <Edit size={18} />
                </button>
                <button
                  aria-label="Delete listing"
                  className="bg-red-50 hover:bg-red-200 dark:bg-red-900/60 text-red-600 dark:text-red-200 p-1.5 rounded-lg transition flex items-center"
                  onClick={() => handleDeleteClick(plant)}
                >
                  <Trash2 size={18} />
                </button>
              </div>
              <div className="h-40 w-full bg-green-50 dark:bg-[#232a26] rounded-lg mb-2 overflow-hidden flex items-center justify-center">
                {plant.photo_url ? (
                  <img
                    src={plant.photo_url}
                    alt={plant.name}
                    className="object-cover w-full h-full"
                  />
                ) : (
                  <div className="text-green-400 text-lg">No image</div>
                )}
              </div>
              <div className="flex-1 px-2 pb-3">
                <div className="font-semibold text-green-800 dark:text-green-100">{plant.name}</div>
                <div className="text-green-700 dark:text-green-300 mb-1">${plant.price}</div>
                {plant.location && (
                  <div className="text-xs text-gray-400 dark:text-gray-200">{plant.location}</div>
                )}
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Edit Dialog */}
      <Dialog open={editOpen} onOpenChange={setEditOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Plant Listing</DialogTitle>
            <DialogDescription>
              Update your plant details and save changes.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleEditSubmit} className="space-y-4 mt-2">
            <div>
              <label className="block text-green-900 font-semibold mb-1">Name</label>
              <Input
                value={editForm.name}
                onChange={e => setEditForm(v => ({ ...v, name: e.target.value }))}
                required
                disabled={submitting}
              />
            </div>
            <div>
              <label className="block text-green-900 font-semibold mb-1">Price</label>
              <Input
                type="number"
                min="0"
                value={editForm.price}
                onChange={e => setEditForm(v => ({ ...v, price: e.target.value }))}
                required
                disabled={submitting}
              />
            </div>
            <div>
              <label className="block text-green-900 font-semibold mb-1">Location</label>
              <Input
                value={editForm.location}
                onChange={e => setEditForm(v => ({ ...v, location: e.target.value }))}
                required
                disabled={submitting}
              />
            </div>
            <div>
              <label className="block text-green-900 font-semibold mb-1">Description</label>
              <Textarea
                value={editForm.description}
                onChange={e => setEditForm(v => ({ ...v, description: e.target.value }))}
                disabled={submitting}
              />
            </div>
            <DialogFooter>
              <Button type="button" variant="secondary" onClick={() => setEditOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" disabled={submitting}>
                {submitting ? "Saving..." : "Save Changes"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Delete Dialog */}
      <Dialog open={deleteOpen} onOpenChange={setDeleteOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Listing</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete <b>{deletingPlant?.name}</b>? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button type="button" variant="secondary" onClick={() => setDeleteOpen(false)}>
              Cancel
            </Button>
            <Button type="button" variant="destructive" onClick={handleDelete} disabled={submitting}>
              {submitting ? "Deleting..." : "Delete"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

