
import { MapPin } from "lucide-react";

type PlantProps = {
  image: string;
  name: string;
  price: string;
  distance: string;
  location: string;
  seller: string;
  onClick?: () => void;
};

export function PlantCard({ image, name, price, distance, location, seller, onClick }: PlantProps) {
  return (
    <div
      className="bg-white/75 dark:bg-[#21271f]/80 rounded-2xl shadow transition-all duration-200 border border-green-100 dark:border-[#223128] cursor-pointer overflow-hidden flex flex-col
        hover:scale-105 hover:shadow-green-200/60 hover:ring-2 hover:ring-green-200/70 hover:z-10"
      onClick={onClick}
      role="button"
      tabIndex={0}
      aria-label={`View ${name}`}
      style={{ backdropFilter: "blur(7px)", WebkitBackdropFilter: "blur(7px)" }}
    >
      <img
        src={image}
        alt={name}
        className="w-full h-44 object-cover"
        loading="lazy"
        style={{ background: "#f6faf7" }}
      />
      <div className="p-3 flex-1 flex flex-col justify-between">
        <div>
          <div className="flex justify-between items-center">
            <h2 className="text-base font-semibold text-green-700 dark:text-green-100 truncate">{name}</h2>
            <div className="text-green-800 dark:text-green-200 font-bold text-lg">{price}</div>
          </div>
          <div className="flex items-center text-xs text-gray-500 dark:text-gray-300 mt-1">
            <MapPin className="w-4 h-4 mr-1 text-green-400 dark:text-green-300" />
            <span>{location}</span>
            <span className="mx-2">•</span>
            <span>{distance}</span>
          </div>
        </div>
        <div className="mt-2 text-xs text-gray-400 dark:text-gray-200">Seller: {seller}</div>
      </div>
    </div>
  );
}

