"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ChevronLeft } from "lucide-react";
import { getMyOrders } from "@/app/api/order/order";
import { getAuthToken, isLoggedIn } from "@/lib/auth";
import { formatPrice } from "@/lib/format";
import { STATUS_BADGE_CLASS, formatOrderStatus } from "@/lib/order-status";
import type { Order } from "@/type/orderType";

export default function MyOrdersView() {
  const router = useRouter();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isLoggedIn()) {
      router.replace("/login?redirect=/orders");
      return;
    }

    const token = getAuthToken();
    if (!token) return;

    getMyOrders(token).then((response) => {
      setOrders(response?.data ?? []);
      setLoading(false);
    });
  }, [router]);

  return (
    <div className="min-h-screen bg-brand-offwhite text-brand-black pt-24 pb-16 sm:pt-28 sm:pb-20">
      <div className="section-container">
        <Link
          href="/shop"
          className="inline-flex items-center gap-2 text-[10px] font-bold tracking-[0.3em] uppercase text-black/40 hover:text-black transition-colors"
        >
          <ChevronLeft size={14} />
          Back to shop
        </Link>

        <div className="mt-8 mb-12 flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
          <div>
            <h1 className="font-serif text-4xl md:text-5xl">My Orders</h1>
            <p className="mt-3 text-sm text-black/55">
              View and track your Atelier orders.
            </p>
          </div>
          <Link
            href="/orders/track"
            className="text-[10px] uppercase tracking-[0.25em] font-semibold border-b border-black pb-1 w-fit"
          >
            Track by order number
          </Link>
        </div>

        {loading ? (
          <p className="text-sm text-black/50">Loading orders...</p>
        ) : orders.length === 0 ? (
          <div className="rounded-sm border border-black/10 bg-white p-10 text-center">
            <p className="text-black/60">You have not placed any orders yet.</p>
            <Link
              href="/shop"
              className="inline-flex mt-6 bg-black text-white text-[10px] uppercase tracking-[0.3em] font-medium px-6 py-3"
            >
              Start shopping
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {orders.map((order) => (
              <Link
                key={order.documentId ?? order.orderNumber}
                href={`/orders/track?order=${encodeURIComponent(order.orderNumber)}`}
                className="block rounded-sm border border-black/10 bg-white p-6 hover:border-black/25 transition-colors"
              >
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div>
                    <p className="text-[10px] uppercase tracking-[0.25em] text-black/40">
                      {order.orderNumber}
                    </p>
                    <p className="mt-2 font-serif text-xl">
                      {order.firstName} {order.lastName}
                    </p>
                    <p className="mt-1 text-sm text-black/50">
                      {order.city}, {order.country}
                    </p>
                  </div>

                  <div className="text-right">
                    <span
                      className={`inline-block px-3 py-1 text-[10px] uppercase tracking-[0.2em] font-semibold rounded-full ${
                        STATUS_BADGE_CLASS[order.orderStatus]
                      }`}
                    >
                      {formatOrderStatus(order.orderStatus)}
                    </span>
                    <p className="mt-3 font-medium">{formatPrice(order.total)}</p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
