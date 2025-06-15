
// Returns a distance (in km) between two city names, using lookup and Haversine formula
import cityCoordinates from "./cityCoordinates";

// Haversine function
function haversineDistanceKm(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const toRad = (deg: number) => (deg * Math.PI) / 180;
  const R = 6371; // Radius of earth in km
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) *
      Math.cos(toRad(lat2)) *
      Math.sin(dLon / 2) ** 2;
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

// Looks up both cities and returns a rounded string or "—" if not found
export function getCityDistanceKm(cityA?: string | null, cityB?: string | null): string {
  if (!cityA || !cityB) return "—";

  const a = cityA.trim().toLowerCase();
  const b = cityB.trim().toLowerCase();

  const coordA = cityCoordinates[a];
  const coordB = cityCoordinates[b];

  if (!coordA || !coordB) return "—";
  const dist = haversineDistanceKm(coordA.lat, coordA.lng, coordB.lat, coordB.lng);
  return `${Math.round(dist)} km`;
}
