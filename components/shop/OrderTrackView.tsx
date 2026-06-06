"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { ChevronLeft } from "lucide-react";
import { trackOrder } from "@/app/api/order/order";
import { getAuthToken, getAuthUser, isLoggedIn } from "@/lib/auth";
import { formatPrice } from "@/lib/format";
import { STATUS_BADGE_CLASS, formatOrderStatus } from "@/lib/order-status";
import type { Order } from "@/type/orderType";
import OrderStatusTimeline from "./OrderStatusTimeline";
import DeliveryTrackingMap from "./DeliveryTrackingMap";
import { orderToast } from "@/lib/order-toast";

export default function OrderTrackView() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [orderNumber, setOrderNumber] = useState(searchParams.get("order") ?? "");
  const [email, setEmail] = useState("");
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(false);
  const loggedIn = isLoggedIn();

  const loadOrder = async (
    number: string,
    guestEmail?: string,
    options?: { silent?: boolean }
  ) => {
    const trimmed = number.trim();
    if (!trimmed) return;

    if (!options?.silent) {
      setLoading(true);
      setOrder(null);
    }

    const token = getAuthToken();
    const response = await trackOrder(trimmed, {
      token,
      email: loggedIn ? undefined : guestEmail ?? email,
    });

    if (!options?.silent) {
      setLoading(false);
    }

    if (!response?.data) {
      if (!options?.silent) {
        orderToast.trackNotFound();
      }
      return;
    }

    setOrder(response.data);
    setOrderNumber(trimmed);
  };

  useEffect(() => {
    const user = getAuthUser();
    if (user?.email) {
      setEmail(user.email);
    }

    const preset = searchParams.get("order");
    if (preset && loggedIn) {
      loadOrder(preset, user?.email);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams, loggedIn]);

  useEffect(() => {
    if (!order) return;

    const shouldPoll = order.orderStatus === "delivering";

    if (!shouldPoll) return;

    const interval = setInterval(() => {
      loadOrder(order.orderNumber, loggedIn ? undefined : email, { silent: true });
    }, 10000);

    return () => clearInterval(interval);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [order?.orderNumber, order?.orderStatus, loggedIn, email]);

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    loadOrder(orderNumber, email);
  };

  return (
    <div className="min-h-screen bg-brand-offwhite text-brand-black pt-28 pb-20">
      <div className="max-w-screen-2xl mx-auto px-6 lg:px-12">
        <Link
          href={loggedIn ? "/orders" : "/shop"}
          className="inline-flex items-center gap-2 text-[10px] font-bold tracking-[0.3em] uppercase text-black/40 hover:text-black transition-colors"
        >
          <ChevronLeft size={14} />
          {loggedIn ? "My orders" : "Back to shop"}
        </Link>

        <h1 className="mt-8 font-serif text-4xl md:text-5xl">Track Order</h1>
        <p className="mt-3 text-sm text-black/55 mb-10">
          Enter your order number to see the latest status.
        </p>

        <form
          onSubmit={handleSubmit}
          className="max-w-xl space-y-6 rounded-sm border border-black/10 bg-white p-8"
        >
          <label className="block space-y-3">
            <span className="text-[10px] uppercase tracking-[0.25em] text-black/45">
              Order number
            </span>
            <input
              type="text"
              value={orderNumber}
              onChange={(e) => setOrderNumber(e.target.value)}
              placeholder="ATL-1234567890"
              required
              className="w-full border-0 border-b border-black/15 bg-transparent py-3.5 text-[15px] outline-none focus:border-black"
            />
          </label>

          {!loggedIn && (
            <label className="block space-y-3">
              <span className="text-[10px] uppercase tracking-[0.25em] text-black/45">
                Email used at checkout
              </span>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full border-0 border-b border-black/15 bg-transparent py-3.5 text-[15px] outline-none focus:border-black"
              />
            </label>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-black text-white text-[11px] uppercase tracking-[0.35em] font-medium py-5 hover:bg-zinc-900 transition-colors disabled:opacity-70"
          >
            {loading ? "Searching..." : "Track order"}
          </button>
        </form>

        {order && (
          <div className="mt-12 grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_360px] gap-12 items-start">
            <section className="rounded-sm border border-black/10 bg-white p-8">
              <div className="flex flex-wrap items-start justify-between gap-4 mb-8">
                <div>
                  <p className="text-[10px] uppercase tracking-[0.25em] text-black/40">
                    {order.orderNumber}
                  </p>
                  <h2 className="mt-2 font-serif text-2xl">
                    {order.firstName} {order.lastName}
                  </h2>
                </div>
                <span
                  className={`inline-block px-3 py-1 text-[10px] uppercase tracking-[0.2em] font-semibold rounded-full ${
                    STATUS_BADGE_CLASS[order.orderStatus]
                  }`}
                >
                  {formatOrderStatus(order.orderStatus)}
                </span>
              </div>

              <OrderStatusTimeline status={order.orderStatus} />
              <DeliveryTrackingMap order={order} />
            </section>

            <aside className="rounded-sm border border-black/10 bg-white p-8 space-y-6 text-sm">
              <div>
                <p className="text-[10px] uppercase tracking-[0.2em] text-black/40 mb-2">
                  Delivery
                </p>
                <p>
                  {order.streetAddress}
                  <br />
                  {order.postalCode} {order.city}
                  <br />
                  {order.country}
                </p>
              </div>

              <div>
                <p className="text-[10px] uppercase tracking-[0.2em] text-black/40 mb-2">
                  Payment
                </p>
                <p>Cash on delivery</p>
              </div>

              <div>
                <p className="text-[10px] uppercase tracking-[0.2em] text-black/40 mb-2">
                  Total
                </p>
                <p className="font-serif text-2xl">{formatPrice(order.total)}</p>
              </div>

              {order.items && order.items.length > 0 && (
                <div>
                  <p className="text-[10px] uppercase tracking-[0.2em] text-black/40 mb-3">
                    Items
                  </p>
                  <ul className="space-y-3">
                    {order.items.map((item, index) => (
                      <li key={index} className="flex justify-between gap-4">
                        <span>
                          {item.productName} × {item.quantity}
                          <span className="block text-xs text-black/45">
                            {item.size} | {item.color}
                          </span>
                        </span>
                        <span>{formatPrice(item.unitPrice * item.quantity)}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </aside>
          </div>
        )}
      </div>
    </div>
  );
}
