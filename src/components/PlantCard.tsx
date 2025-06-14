
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
      className="bg-white rounded-2xl shadow hover:shadow-lg transition border cursor-pointer overflow-hidden flex flex-col"
      onClick={onClick}
      role="button"
      tabIndex={0}
      aria-label={`View ${name}`}
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
            <h2 className="text-base font-semibold text-green-700 truncate">{name}</h2>
            <div className="text-green-800 font-bold text-lg">{price}</div>
          </div>
          <div className="flex items-center text-xs text-gray-500 mt-1">
            <MapPin className="w-4 h-4 mr-1 text-green-400" />
            <span>{location}</span>
            <span className="mx-2">•</span>
            <span>{distance}</span>
          </div>
        </div>
        <div className="mt-2 text-xs text-gray-400">Seller: {seller}</div>
      </div>
    </div>
  );
}
