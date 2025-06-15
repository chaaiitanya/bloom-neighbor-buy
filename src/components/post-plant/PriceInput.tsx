
import { Input } from "@/components/ui/input";

type PriceInputProps = {
  value: string;
  onChange: (val: string) => void;
  disabled?: boolean;
};

export default function PriceInput({ value, onChange, disabled }: PriceInputProps) {
  return (
    <div>
      <label className="block text-green-800 dark:text-green-100 font-semibold mb-1">Price</label>
      <Input
        className="bg-white dark:bg-[#232a26] text-green-800 dark:text-green-50 placeholder:text-green-400 dark:placeholder:text-green-500"
        type="number"
        step="0.01"
        min="0"
        placeholder="e.g. 15.00"
        value={value}
        onChange={e => onChange(e.target.value)}
        required
        disabled={disabled}
      />
    </div>
  );
}
