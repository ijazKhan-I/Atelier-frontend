"use client";

import { useEffect } from "react";
import L from "leaflet";
import { MapContainer, Marker, Popup, TileLayer, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";

type LatLng = { lat: number; lng: number };

type Props = {
  destination: LatLng | null;
  pickup: LatLng | null;
  pickupLabel: string;
  driver: LatLng | null;
  driverLive: boolean;
  orderNumber: string;
};

const destinationIcon = L.divIcon({
  className: "",
  html: `<div style="width:14px;height:14px;border-radius:50%;background:#111;border:2px solid #fff;box-shadow:0 2px 6px rgba(0,0,0,.35)"></div>`,
  iconSize: [14, 14],
  iconAnchor: [7, 7],
});

const pickupIcon = L.divIcon({
  className: "",
  html: `<div style="width:16px;height:16px;border-radius:50%;background:#16a34a;border:2px solid #fff;box-shadow:0 2px 8px rgba(22,163,74,.45)"></div>`,
  iconSize: [16, 16],
  iconAnchor: [8, 8],
});

const driverIcon = L.divIcon({
  className: "",
  html: `<div style="width:16px;height:16px;border-radius:50%;background:#2563eb;border:2px solid #fff;box-shadow:0 2px 8px rgba(37,99,235,.5)"></div>`,
  iconSize: [16, 16],
  iconAnchor: [8, 8],
});

function FitBounds({ points }: { points: LatLng[] }) {
  const map = useMap();

  useEffect(() => {
    if (points.length === 0) return;

    if (points.length === 1) {
      map.setView([points[0].lat, points[0].lng], 14);
      return;
    }

    const bounds = L.latLngBounds(points.map((p) => [p.lat, p.lng]));
    map.fitBounds(bounds, { padding: [48, 48], maxZoom: 15 });
  }, [map, points]);

  return null;
}

export default function DeliveryMapInner({
  destination,
  pickup,
  pickupLabel,
  driver,
  driverLive,
  orderNumber,
}: Props) {
  const points = [pickup, destination, driver].filter(Boolean) as LatLng[];
  const center = points[0] ?? { lat: 31.52, lng: 74.35 };

  return (
    <MapContainer
      center={[center.lat, center.lng]}
      zoom={13}
      className="h-[400px] w-full z-0"
      scrollWheelZoom
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      <FitBounds points={points} />

      {pickup && (
        <Marker position={[pickup.lat, pickup.lng]} icon={pickupIcon}>
          <Popup>{pickupLabel}</Popup>
        </Marker>
      )}

      {destination && (
        <Marker position={[destination.lat, destination.lng]} icon={destinationIcon}>
          <Popup>Delivery address — {orderNumber}</Popup>
        </Marker>
      )}

      {driver && (
        <Marker position={[driver.lat, driver.lng]} icon={driverIcon}>
          <Popup>
            Delivery partner {driverLive ? "(live)" : "(last known position)"}
          </Popup>
        </Marker>
      )}
    </MapContainer>
  );
}
