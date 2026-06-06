"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { registerDriver } from "@/app/api/driver/driver";
import { getAuthToken, isLoggedIn } from "@/lib/auth";
import { toast } from "sonner";

export default function DriverRegisterView() {
  const router = useRouter();
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [vehicleType, setVehicleType] = useState("motorcycle");
  const [loading, setLoading] = useState(false);

  if (!isLoggedIn()) {
    return (
      <main className="min-h-screen pt-28 px-6 max-w-md mx-auto">
        <p className="text-sm text-black/60">Sign in first to register as a driver.</p>
        <Link href="/login" className="mt-4 inline-block underline text-sm">
          Go to login
        </Link>
      </main>
    );
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const token = getAuthToken();
    if (!token) return;

    setLoading(true);
    const result = await registerDriver({ fullName, phone, vehicleType }, token);
    setLoading(false);

    if (!result?.data) {
      toast.error("Registration failed. You may already be registered.");
      return;
    }

    toast.success("Driver profile created in Strapi");
    router.push("/driver");
  }

  return (
    <main className="min-h-screen bg-brand-offwhite pt-28 pb-20 px-6">
      <div className="max-w-md mx-auto">
        <h1 className="font-serif text-3xl">Driver registration</h1>
        <p className="mt-2 text-sm text-black/55">
          Your profile is saved in Strapi. Admin assigns orders to you in the admin panel.
        </p>

        <form onSubmit={handleSubmit} className="mt-8 space-y-6">
          <label className="block space-y-2">
            <span className="text-[10px] uppercase tracking-[0.2em] text-black/45">
              Full name
            </span>
            <input
              required
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              className="w-full border-b border-black/15 bg-transparent py-3 outline-none"
            />
          </label>
          <label className="block space-y-2">
            <span className="text-[10px] uppercase tracking-[0.2em] text-black/45">
              Phone
            </span>
            <input
              required
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full border-b border-black/15 bg-transparent py-3 outline-none"
            />
          </label>
          <label className="block space-y-2">
            <span className="text-[10px] uppercase tracking-[0.2em] text-black/45">
              Vehicle
            </span>
            <select
              value={vehicleType}
              onChange={(e) => setVehicleType(e.target.value)}
              className="w-full border-b border-black/15 bg-transparent py-3 outline-none"
            >
              <option value="bike">Bike</option>
              <option value="motorcycle">Motorcycle</option>
              <option value="car">Car</option>
              <option value="van">Van</option>
            </select>
          </label>
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-black text-white py-4 text-[11px] uppercase tracking-[0.3em] disabled:opacity-70"
          >
            {loading ? "Saving..." : "Register on Strapi"}
          </button>
        </form>
      </div>
    </main>
  );
}
