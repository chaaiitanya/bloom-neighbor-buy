
import { useState } from "react";
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

type NameSetupDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  userId: string;
  defaultFirstName?: string | null;
  defaultLastName?: string | null;
  onNameSaved: (firstName: string, lastName: string) => void;
};

export default function NameSetupDialog({
  open,
  onOpenChange,
  userId,
  defaultFirstName,
  defaultLastName,
  onNameSaved,
}: NameSetupDialogProps) {
  const [firstName, setFirstName] = useState(defaultFirstName ?? "");
  const [lastName, setLastName] = useState(defaultLastName ?? "");
  const [loading, setLoading] = useState(false);

  const handleSave = async () => {
    if (!firstName.trim() || !lastName.trim()) {
      toast({
        title: "Both names required",
        description: "Please enter your first and last name.",
        variant: "destructive",
      });
      return;
    }
    setLoading(true);
    const { error } = await supabase
      .from("profiles")
      .update({ first_name: firstName.trim(), last_name: lastName.trim() })
      .eq("id", userId);
    setLoading(false);
    if (error) {
      toast({
        title: "Error saving name",
        description: error.message,
        variant: "destructive",
      });
      return;
    }
    toast({ title: "Name saved!", description: "Your profile has been updated." });
    onNameSaved(firstName.trim(), lastName.trim());
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-xs w-full bg-white border border-green-200">
        <DialogHeader>
          <DialogTitle className="text-green-900 text-base font-bold">Set up your profile</DialogTitle>
        </DialogHeader>
        <div className="flex flex-col gap-3 py-2">
          <Input
            type="text"
            placeholder="First name"
            autoFocus
            className="bg-green-100 border-green-300 text-green-900"
            value={firstName}
            maxLength={30}
            onChange={e => setFirstName(e.target.value)}
            disabled={loading}
          />
          <Input
            type="text"
            placeholder="Last name"
            className="bg-green-100 border-green-300 text-green-900"
            value={lastName}
            maxLength={30}
            onChange={e => setLastName(e.target.value)}
            disabled={loading}
          />
        </div>
        <DialogFooter>
          <Button type="button" disabled={loading} className="bg-green-600 hover:bg-green-700 text-white w-full" onClick={handleSave}>
            {loading ? "Saving..." : "Save Name"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
