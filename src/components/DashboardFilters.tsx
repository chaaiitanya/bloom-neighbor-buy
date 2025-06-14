
const options = [
  { label: "All", value: "all" },
  { label: "Indoor", value: "indoor" },
  { label: "Outdoor", value: "outdoor" },
  { label: "Succulent", value: "succulent" },
  { label: "Flower", value: "flower" },
];

export default function DashboardFilters({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  return (
    <div className="flex flex-row gap-2 w-full overflow-x-auto no-scrollbar">
      {options.map(option => (
        <button
          key={option.value}
          type="button"
          className={`
            rounded-full px-5 py-1.5 border text-base font-medium transition
            ${
              value === option.value
                ? "bg-green-500 text-white border-green-500 shadow-md"
                : "bg-transparent text-green-700 border-green-300 hover:bg-[#e3fae7] hover:border-green-400"
            }
          `}
          style={{ minWidth: 90 }}
          onClick={() => onChange(option.value)}
        >
          {option.label}
        </button>
      ))}
    </div>
  );
}
