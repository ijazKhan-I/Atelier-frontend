import { Lock } from "lucide-react";
import type { CartItem } from "./cartStorage";
import { formatPrice } from "@/lib/format";

type Props = {
  items: CartItem[];
  subtotal: number;
  shippingLabel?: string;
};

export default function OrderSummary({
  items,
  subtotal,
  shippingLabel = "Calculated at next step",
}: Props) {
  return (
    <aside className="rounded-sm border border-black/10 bg-[#fafafa] p-8 md:p-10">
      <h2 className="font-serif text-3xl mb-8">Order Summary</h2>

      <div className="space-y-6">
        {items.map((item) => (
          <div
            key={`${item.documentId}-${item.color}-${item.size}`}
            className="flex gap-4"
          >
            <div className="h-24 w-20 shrink-0 overflow-hidden bg-white border border-black/10">
              {item.image ? (
                <img
                  src={item.image}
                  alt={item.name}
                  className="h-full w-full object-cover"
                  loading="lazy"
                />
              ) : null}
            </div>

            <div className="flex flex-1 items-start justify-between gap-4">
              <div>
                <p className="text-sm font-medium">{item.name}</p>
                <p className="mt-1 text-[10px] uppercase tracking-[0.2em] text-black/45">
                  {item.size} | {item.color}
                </p>
                {item.quantity > 1 && (
                  <p className="mt-1 text-xs text-black/40">Qty: {item.quantity}</p>
                )}
              </div>
              <p className="text-sm font-medium shrink-0">
                {formatPrice(item.price * item.quantity)}
              </p>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-8 space-y-4 border-t border-black/10 pt-8 text-sm">
        <div className="flex items-center justify-between">
          <span className="text-black/55">Subtotal</span>
          <span>{formatPrice(subtotal)}</span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-black/55">Shipping</span>
          <span className="text-black/70">{shippingLabel}</span>
        </div>
        <div className="flex items-center justify-between border-t border-black/10 pt-4 text-base">
          <span className="font-medium">Total</span>
          <span className="font-serif text-2xl">{formatPrice(subtotal)}</span>
        </div>
      </div>

      <div className="mt-8 flex items-start gap-3 text-[10px] uppercase tracking-[0.15em] text-black/45 leading-relaxed">
        <Lock size={14} className="mt-0.5 shrink-0" />
        <p>
          Secure checkout. Your data is encrypted and protected by global security
          standards.
        </p>
      </div>
    </aside>
  );
}
