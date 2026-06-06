/** Turn delivery address into map coordinates (OpenStreetMap Nominatim). */
export async function geocodeDeliveryAddress(order: {
  streetAddress: string;
  postalCode: string;
  city: string;
  country: string;
}) {
  const query = [
    order.streetAddress,
    order.postalCode,
    order.city,
    order.country,
  ]
    .filter(Boolean)
    .join(", ");

  if (!query) return null;

  try {
    const url = new URL("https://nominatim.openstreetmap.org/search");
    url.searchParams.set("q", query);
    url.searchParams.set("format", "json");
    url.searchParams.set("limit", "1");

    const response = await fetch(url.toString(), {
      headers: { "Accept-Language": "en" },
    });

    if (!response.ok) return null;

    const results = (await response.json()) as { lat: string; lon: string }[];

    if (!results[0]) return null;

    return {
      lat: Number(results[0].lat),
      lng: Number(results[0].lon),
    };
  } catch {
    return null;
  }
}

export function isDriverLocationLive(updatedAt?: string | null, maxAgeMs = 120000) {
  if (!updatedAt) return false;
  const time = new Date(updatedAt).getTime();
  if (Number.isNaN(time)) return false;
  return Date.now() - time < maxAgeMs;
}
