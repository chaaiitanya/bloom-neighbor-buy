
import { Textarea } from "@/components/ui/textarea";

type PlantDescriptionProps = {
  value: string;
  onChange: (val: string) => void;
  disabled?: boolean;
};

export default function PlantDescription({ value, onChange, disabled }: PlantDescriptionProps) {
  return (
    <div>
      <label className="block text-green-800 dark:text-green-100 font-semibold mb-1">Description</label>
      <Textarea
        className="bg-white dark:bg-[#232a26] rounded-lg p-2 border border-green-100 min-h-[4rem] text-green-800 dark:text-green-50 placeholder:text-green-400 dark:placeholder:text-green-500"
        placeholder="Any notes about your plant..."
        value={value}
        onChange={e => onChange(e.target.value)}
        required
        disabled={disabled}
      />
    </div>
  );
}
