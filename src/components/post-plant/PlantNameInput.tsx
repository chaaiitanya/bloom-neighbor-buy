
import { Input } from "@/components/ui/input";

type PlantNameInputProps = {
  value: string;
  onChange: (val: string) => void;
  disabled?: boolean;
};

export default function PlantNameInput({ value, onChange, disabled }: PlantNameInputProps) {
  return (
    <div>
      <label className="block text-green-800 dark:text-green-100 font-semibold mb-1">Name</label>
      <Input
        className="bg-white dark:bg-[#232a26] text-green-800 dark:text-green-50 placeholder:text-green-400 dark:placeholder:text-green-500"
        type="text"
        placeholder="e.g. Fiddle Leaf Fig"
        value={value}
        onChange={e => onChange(e.target.value)}
        required
        disabled={disabled}
      />
    </div>
  );
}
