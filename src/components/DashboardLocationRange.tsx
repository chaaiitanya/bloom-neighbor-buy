
import { Slider } from "@/components/ui/slider";

export default function DashboardLocationRange({
  value,
  onChange
}: {
  value: number;
  onChange: (val: number) => void;
}) {
  return (
    <div className="flex items-center gap-4 w-full">
      <span className="text-green-700 text-base font-semibold">Range:</span>
      <div className="flex-1 flex items-center">
        <Slider
          min={1}
          max={50}
          value={[value]}
          onValueChange={vals => onChange(vals[0])}
          className="w-[140px] md:w-[150px] h-4"
          style={{ touchAction: "none" }}
        >
          {/* Custom styling is handled via Tailwind below */}
        </Slider>
      </div>
      <span className="text-base text-green-600">{value} km</span>
      <style>
        {`
        .flex-1 .relative.flex.w-full.items-center {
          height: 20px !important;
        }
        .flex-1 .relative.flex.w-full.items-center .relative.h-2.w-full.grow.overflow-hidden.rounded-full {
          background: #222A29 !important;
          height: 5px !important;
        }
        .flex-1 .absolute.h-full.bg-primary {
          background: #19B861 !important;
        }
        .flex-1 .block.h-5.w-5.rounded-full {
          background: #19B861 !important;
          border-width: 0 !important;
          box-shadow: 0 2px 6px 0 #b7eccb59;
        }
        `}
      </style>
    </div>
  );
}
