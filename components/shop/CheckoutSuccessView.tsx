"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";

export default function CheckoutSuccessView() {
  const searchParams = useSearchParams();
  const orderNumber = searchParams.get("order");

  return (
    <div className="min-h-screen bg-white text-brand-black pt-32 pb-20">
      <div className="max-w-2xl mx-auto px-6 text-center">
        <p className="text-[10px] uppercase tracking-[0.35em] text-black/40 mb-4">
          Order confirmed
        </p>
        <h1 className="font-serif text-4xl md:text-5xl mb-6">Thank you</h1>
        <p className="text-sm text-black/60 leading-relaxed mb-4">
          Your order has been sent to our team. Payment will be collected in cash
          when your delivery arrives.
        </p>
        {orderNumber && (
          <p className="text-sm font-medium mb-10">
            Order number: <span className="font-serif">{orderNumber}</span>
          </p>
        )}
        <Link
          href="/shop"
          className="inline-flex bg-black text-white text-[11px] uppercase tracking-[0.35em] font-medium px-8 py-4 hover:bg-zinc-900 transition-colors"
        >
          Continue shopping
        </Link>
      </div>
    </div>
  );
}
