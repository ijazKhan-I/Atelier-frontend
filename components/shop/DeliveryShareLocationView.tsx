"use client";

import { useEffect, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import {
  getDeliverySession,
  shareDriverLocation,
} from "@/app/api/order/order";

/** Token-based driver link (fallback). Prefer /driver for registered drivers. */
export default function DeliveryShareLocationView() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token") ?? "";

  const [session, setSession] = useState<{
    orderNumber: string;
    orderStatus: string;
    city?: string;
    country?: string;
  } | null>(null);
  const [sharing, setSharing] = useState(false);
  const [lastSent, setLastSent] = useState<string | null>(null);
  const [error, setError] = useState("");
  const lastSend = useRef(0);

  useEffect(() => {
    if (!token) {
      setError("Missing delivery link token.");
      return;
    }

    getDeliverySession(token).then((response) => {
      if (!response?.data) {
        setError("Invalid or expired delivery link.");
        return;
      }
      if (response.data.orderStatus !== "delivering") {
        setError("This order is not out for delivery yet.");
        return;
      }
      setSession(response.data);
    });
  }, [token]);

  useEffect(() => {
    if (!token || !session || !navigator.geolocation) return;

    setSharing(true);
    setError("");

    const watchId = navigator.geolocation.watchPosition(
      async (position) => {
        const now = Date.now();
        if (now - lastSend.current < 5000) return;
        lastSend.current = now;

        const ok = await shareDriverLocation({
          token,
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        });

        if (ok) setLastSent(new Date().toLocaleTimeString());
      },
      () => {
        setError("Location permission denied. Allow GPS and refresh.");
        setSharing(false);
      },
      { enableHighAccuracy: true, maximumAge: 5000, timeout: 15000 }
    );

    return () => navigator.geolocation.clearWatch(watchId);
  }, [token, session]);

  return (
    <div className="min-h-screen bg-brand-offwhite text-brand-black pt-28 pb-20">
      <div className="max-w-lg mx-auto px-6">
        <p className="text-[10px] uppercase tracking-[0.3em] text-black/40">
          Atelier delivery
        </p>
        <h1 className="mt-4 font-serif text-3xl">Share live location</h1>

        {session && (
          <p className="mt-3 text-sm text-black/60">
            Order {session.orderNumber} — {session.city}, {session.country}
          </p>
        )}

        <p className="mt-4 text-xs text-black/45">
          Registered driver?{" "}
          <Link href="/driver" className="underline">
            Use the driver dashboard
          </Link>{" "}
          instead.
        </p>

        {error && (
          <p className="mt-6 rounded-sm border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">
            {error}
          </p>
        )}

        {sharing && !error && (
          <div className="mt-8 rounded-sm border border-emerald-200 bg-emerald-50 px-6 py-5">
            <p className="text-sm font-medium text-emerald-900">
              Location saved to Strapi — customer map updates automatically
            </p>
            {lastSent && (
              <p className="mt-2 text-xs text-emerald-800">Last sent {lastSent}</p>
            )}
          </div>
        )}

        <Link
          href="/"
          className="inline-block mt-10 text-[10px] uppercase tracking-[0.25em] text-black/45 hover:text-black"
        >
          Back to site
        </Link>
      </div>
    </div>
  );
}
