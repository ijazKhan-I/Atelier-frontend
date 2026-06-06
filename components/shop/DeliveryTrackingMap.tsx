"use client";

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import type { Order } from "@/type/orderType";
import { geocodeDeliveryAddress, isDriverLocationLive } from "@/lib/geocode";
import { getOrderTrackingMapUrl, showLiveMapForStatus } from "@/lib/maps-url";
import { ExternalLink } from "lucide-react";

function getPickupFromOrder(order: Order) {
  const source = order.fulfillmentSource;
  if (!source) return null;

  const lat = source.lat ?? source.location?.lat;
  const lng = source.lng ?? source.location?.lng;

  if (typeof lat !== "number" || typeof lng !== "number") return null;

  const typeLabel = source.sourceType === "warehouse" ? "Warehouse" : "Store";
  return {
    lat,
    lng,
    label: `${typeLabel}: ${source.name}`,
  };
}

const DeliveryMapInner = dynamic(() => import("./DeliveryMapInner"), {
  ssr: false,
  loading: () => (
    <div className="h-[400px] w-full bg-black/5 flex items-center justify-center text-sm text-black/45">
      Loading map...
    </div>
  ),
});

type Props = {
  order: Order;
};

export default function DeliveryTrackingMap({ order }: Props) {
  const [destination, setDestination] = useState<{ lat: number; lng: number } | null>(
    null
  );

  const driver =
    typeof order.driverLatitude === "number" &&
    typeof order.driverLongitude === "number"
      ? { lat: order.driverLatitude, lng: order.driverLongitude }
      : null;

  const driverLive = isDriverLocationLive(order.driverLocationUpdatedAt);
  const showMap = showLiveMapForStatus(order.orderStatus);
  const pickup = getPickupFromOrder(order);

  useEffect(() => {
    if (!showMap) return;

    geocodeDeliveryAddress(order).then(setDestination);
  }, [order, showMap]);

  if (!showMap) {
    if (order.orderStatus === "cancelled") return null;

    const statusMessages: Partial<Record<Order["orderStatus"], string>> = {
      pending: "Your order is waiting for confirmation. The live driver map will appear when delivery starts.",
      confirmed: "Your order is being prepared. The live driver map will appear when the driver starts delivery.",
      shipped: "Your order has shipped and is on the way to your area. The live driver map will appear when delivery starts.",
      delivered: "Your order has been delivered. Live tracking is no longer available.",
    };

    const message = statusMessages[order.orderStatus];
    if (!message) return null;

    return (
      <div className="mt-8 rounded-sm border border-black/10 bg-white px-6 py-5">
        <p className="text-[10px] uppercase tracking-[0.25em] text-black/45">
          Delivery map
        </p>
        <p className="mt-2 text-sm text-black/60">{message}</p>
      </div>
    );
  }

  const mapsLink = getOrderTrackingMapUrl(order);
  const waitingForDriver = order.orderStatus === "delivering" && !driver;

  return (
    <div className="mt-8 rounded-sm border border-black/10 overflow-hidden bg-white">
      <div className="px-6 py-4 border-b border-black/10 flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="text-[10px] uppercase tracking-[0.25em] text-black/45">
            Live delivery map
          </p>
          <p className="mt-1 text-sm text-black/60">
            Green dot = store/warehouse. Black dot = your address. Blue dot =
            delivery partner
            {driverLive ? " (updating from Strapi)" : ""}.
          </p>
        </div>
        {mapsLink && (
          <a
            href={mapsLink}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 border border-black/15 text-[10px] uppercase tracking-[0.2em] font-semibold px-5 py-3 hover:bg-black/5 transition-colors"
          >
            <ExternalLink size={14} />
            Open in Google Maps
          </a>
        )}
      </div>

      {waitingForDriver && (
        <p className="px-6 py-3 text-sm text-amber-800 bg-amber-50 border-b border-amber-100">
          Waiting for delivery partner to share their location. The map updates
          live when they open the driver link on their phone.
        </p>
      )}

      {driver && order.driverLocationUpdatedAt && (
        <p className="px-6 py-2 text-[10px] uppercase tracking-[0.15em] text-black/45 border-b border-black/5">
          Driver location {driverLive ? "live" : "last updated"}:{" "}
          {new Date(order.driverLocationUpdatedAt).toLocaleString()}
        </p>
      )}

      <DeliveryMapInner
        destination={destination}
        pickup={pickup ? { lat: pickup.lat, lng: pickup.lng } : null}
        pickupLabel={pickup?.label ?? "Pickup location"}
        driver={driver}
        driverLive={driverLive}
        orderNumber={order.orderNumber}
      />
    </div>
  );
}
