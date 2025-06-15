import { MapPin } from "lucide-react";
import { Heart } from "lucide-react";
import { usePlantFavorite } from "@/hooks/usePlantFavorite";
import { cn } from "@/lib/utils";
import { useState } from "react";

type PlantProps = {
  image: string;
  name: string;
  price: string;
  distance: string;
  location: string;
  seller: string;
  onClick?: () => void;
  id?: string; // Add plant id to props!
};

export function PlantCard({
  image,
  name,
  price,
  distance,
  location,
  seller,
  onClick,
  id,
}: PlantProps) {
  // Show favorite button if id is provided
  const { isFavorite, toggleFavorite, loading } = usePlantFavorite(id);

  // Track if image failed to load
  const [imgError, setImgError] = useState(false);

  // Use "/placeholder.svg" if image is missing or failed to load
  const showImage = !imgError && image ? image : "/placeholder.svg";

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
      <div className="relative">
        <img
          src={showImage}
          alt={name}
          className="w-full h-44 object-cover bg-[#f6faf7]"
          loading="lazy"
          onError={() => setImgError(true)}
          style={{ background: "#f6faf7" }}
        />
        {/* Optionally overlay a fallback icon if broken (purely visual) */}
        {imgError && (
          <div className="absolute inset-0 flex items-center justify-center bg-[#f6faf7]">
            <span className="text-4xl text-green-300" role="img" aria-label="Plant placeholder">
              🍃
            </span>
          </div>
        )}
        {id && (
          <button
            onClick={e => {
              e.stopPropagation();
              toggleFavorite();
            }}
            aria-label={isFavorite ? "Remove from favorites" : "Add to favorites"}
            disabled={loading}
            className={cn(
              "absolute top-2 right-2 rounded-full bg-white/90 backdrop-blur shadow p-1",
              isFavorite ? "text-red-500" : "text-green-500",
              "hover:bg-green-50 transition z-10"
            )}
          >
            {isFavorite ? (
              <Heart className="w-5 h-5 fill-red-500 text-red-500" />
            ) : (
              <Heart className="w-5 h-5" />
            )}
          </button>
        )}
      </div>
      <div className="p-3 flex-1 flex flex-col justify-between">
        <div>
          <div className="flex justify-between items-center">
            <h2 className="text-base font-semibold text-green-700 dark:text-green-100 truncate">
              {name}
            </h2>
            <div className="text-green-800 dark:text-green-200 font-bold text-lg">{price}</div>
          </div>
          {/* Always show exact city and location info, make it clear and prominent */}
          <div className="flex items-center text-xs text-gray-500 dark:text-gray-300 mt-1 font-semibold gap-1">
            <span className="px-1 py-0.5 rounded bg-green-50 text-green-700 border border-green-200">{location}</span>
            <span className="mx-2">•</span>
            <span>{distance}</span>
          </div>
        </div>
      </div>
      {/* Seller label always underneath the card body */}
      <div className="pb-2 flex flex-col items-center">
        <span className="text-xs text-gray-400 dark:text-gray-200 pt-0 font-medium">
          Seller: {seller}
        </span>
      </div>
    </div>
  );
}
