"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import {
  getDriverAssignedOrders,
  getMyDriverProfile,
  shareDriverLocationAuth,
  type DriverProfile,
} from "@/app/api/driver/driver";
import { getAuthToken, isLoggedIn } from "@/lib/auth";
import type { Order } from "@/type/orderType";

export default function DriverDashboardView() {
  const [profile, setProfile] = useState<DriverProfile | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const [activeOrder, setActiveOrder] = useState<Order | null>(null);
  const [sharing, setSharing] = useState(false);
  const [lastSent, setLastSent] = useState<string | null>(null);
  const watchId = useRef<number | null>(null);

  useEffect(() => {
    if (!isLoggedIn()) return;
    const token = getAuthToken();
    if (!token) return;

    getMyDriverProfile(token).then((r) => {
      if (r?.data) setProfile(r.data);
    });
    getDriverAssignedOrders(token).then((r) => {
      if (r?.data) setOrders(r.data);
    });
  }, []);

  useEffect(() => {
    if (!sharing || !activeOrder || !navigator.geolocation) return;

    const token = getAuthToken();
    if (!token) return;

    watchId.current = navigator.geolocation.watchPosition(
      async (pos) => {
        const ok = await shareDriverLocationAuth(
          {
            orderDocumentId: activeOrder.documentId,
            latitude: pos.coords.latitude,
            longitude: pos.coords.longitude,
          },
          token
        );
        if (ok) setLastSent(new Date().toLocaleTimeString());
      },
      console.error,
      { enableHighAccuracy: true, maximumAge: 5000, timeout: 15000 }
    );

    return () => {
      if (watchId.current !== null) {
        navigator.geolocation.clearWatch(watchId.current);
      }
    };
  }, [sharing, activeOrder]);

  if (!isLoggedIn()) {
    return (
      <main className="min-h-screen pt-28 px-6 text-center">
        <Link href="/login" className="underline">
          Login
        </Link>{" "}
        to access driver dashboard
      </main>
    );
  }

  if (!profile) {
    return (
      <main className="min-h-screen pt-28 px-6 max-w-md mx-auto text-center">
        <p className="text-black/60">No driver profile in Strapi yet.</p>
        <Link
          href="/driver/register"
          className="mt-6 inline-block bg-black text-white px-6 py-3 text-[10px] uppercase tracking-[0.25em]"
        >
          Register as driver
        </Link>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-brand-offwhite pt-28 pb-20 px-6">
      <div className="max-w-2xl mx-auto">
        <h1 className="font-serif text-3xl">Driver dashboard</h1>
        <p className="mt-2 text-sm text-black/55">
          {profile.fullName} · {profile.phone} · {profile.vehicleType}
        </p>

        <h2 className="mt-10 text-[10px] uppercase tracking-[0.25em] text-black/40">
          Assigned deliveries
        </h2>
        <ul className="mt-4 space-y-4">
          {orders.map((o) => (
            <li key={o.documentId} className="border border-black/10 bg-white p-5 rounded-sm">
              <p className="font-mono text-sm">{o.orderNumber}</p>
              <p className="text-sm text-black/60 mt-1">
                {o.streetAddress}, {o.city}
              </p>
              <button
                type="button"
                onClick={() => {
                  setActiveOrder(o);
                  setSharing(true);
                }}
                className="mt-4 px-4 py-2 bg-black text-white text-[10px] uppercase tracking-[0.2em]"
              >
                Start GPS sharing
              </button>
            </li>
          ))}
          {orders.length === 0 && (
            <p className="text-sm text-black/50">
              No deliveries. Admin must set order status to &quot;delivering&quot; and assign
              you as driver in Strapi.
            </p>
          )}
        </ul>

        {sharing && activeOrder && (
          <div className="mt-10 border border-emerald-200 bg-emerald-50 p-5 rounded-sm">
            <p className="text-sm font-medium text-emerald-900">
              Sharing location for {activeOrder.orderNumber} via Strapi
            </p>
            {lastSent && (
              <p className="text-xs text-emerald-800 mt-1">Last update {lastSent}</p>
            )}
            <button
              type="button"
              onClick={() => {
                setSharing(false);
                setActiveOrder(null);
              }}
              className="mt-3 text-xs underline"
            >
              Stop sharing
            </button>
          </div>
        )}
      </div>
    </main>
  );
}
