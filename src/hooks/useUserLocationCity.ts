
import { useState, useEffect } from "react";

/**
 * Attempts to detect user's current city using browser geolocation and OpenStreetMap Nominatim.
 * Returns: { city, loading, error }
 */
export function useUserLocationCity(enabled: boolean) {
  const [city, setCity] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!enabled) return;
    if (!navigator.geolocation) {
      setError("Geolocation not supported");
      return;
    }
    setLoading(true);
    navigator.geolocation.getCurrentPosition(
      async pos => {
        const { latitude, longitude } = pos.coords;
        try {
          // Use free OSM Nominatim reverse geocode
          const res = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${latitude}&lon=${longitude}`
          );
          const data = await res.json();
          // Attempt to find city, town or village from address
          const _city =
            data.address?.city ||
            data.address?.town ||
            data.address?.village ||
            data.address?.county || // fallback
            null;
          setCity(_city);
        } catch (err) {
          setError("Could not detect your city");
        }
        setLoading(false);
      },
      geoErr => {
        setError("Location permission denied or unavailable.");
        setLoading(false);
      },
      { enableHighAccuracy: false, timeout: 9000 }
    );
  }, [enabled]);

  return { city, loading, error };
}
