import type { Order } from "@/type/orderType";

/** Google Maps link for delivery address or admin-provided live tracking URL. */
export function getOrderTrackingMapUrl(order: Pick<
  Order,
  | "streetAddress"
  | "postalCode"
  | "city"
  | "country"
  | "trackingMapUrl"
>) {
  if (order.trackingMapUrl?.trim()) {
    return order.trackingMapUrl.trim();
  }

  const address = [
    order.streetAddress,
    order.postalCode,
    order.city,
    order.country,
  ]
    .filter(Boolean)
    .join(", ");

  if (!address) return "";

  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}`;
}

export function getOrderMapEmbedUrl(order: Parameters<typeof getOrderTrackingMapUrl>[0]) {
  const address = [
    order.streetAddress,
    order.postalCode,
    order.city,
    order.country,
  ]
    .filter(Boolean)
    .join(", ");

  if (!address) return "";

  return `https://maps.google.com/maps?q=${encodeURIComponent(address)}&z=15&output=embed`;
}

/** Live driver map only when delivery has started (like food delivery apps). */
export function showLiveMapForStatus(status: Order["orderStatus"]) {
  return status === "delivering";
}
