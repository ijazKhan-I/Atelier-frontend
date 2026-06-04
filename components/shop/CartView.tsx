"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { ChevronLeft, Minus, Plus, ShieldCheck, X } from "lucide-react";
import type { CartItem } from "./cartStorage";
import {
  clearCart,
  readCart,
  removeCartItem,
  updateCartQuantity,
} from "./cartStorage";
import { isLoggedIn, syncAuthCookie } from "@/lib/auth";
import { formatPrice } from "@/lib/format";

export default function CartView() {
  const router = useRouter();
  const [cart, setCart] = useState<CartItem[]>([]);

  useEffect(() => {
    // Read once on mount, then stay in sync with other cart updates.
    const syncCart = () => setCart(readCart());

    syncCart();
    window.addEventListener("storage", syncCart);
    window.addEventListener("cart-change", syncCart);

    return () => {
      window.removeEventListener("storage", syncCart);
      window.removeEventListener("cart-change", syncCart);
    };
  }, []);

  const subtotal = useMemo(
    () => cart.reduce((sum, item) => sum + item.price * item.quantity, 0),
    [cart]
  );

  const itemCount = useMemo(
    () => cart.reduce((sum, item) => sum + item.quantity, 0),
    [cart]
  );

  const handleClear = () => {
    clearCart();
    setCart([]);
  };

  /** Checkout is protected — send guests to login first. */
  const handleProceedToCheckout = () => {
    if (!isLoggedIn()) {
      router.push("/login?redirect=/checkout");
      return;
    }

    syncAuthCookie();
    router.push("/checkout");
  };

  return (
    <div className="min-h-screen bg-brand-offwhite text-brand-black pt-28 pb-20">
      <div className="max-w-screen-2xl mx-auto px-6 lg:px-12">
        <Link
          href="/shop"
          className="inline-flex items-center gap-2 text-[10px] font-bold tracking-[0.3em] uppercase text-black/40 hover:text-black transition-colors"
        >
          <ChevronLeft size={14} />
          Continue shopping
        </Link>

        <div className="mt-8 mb-12">
          <h1 className="font-serif text-5xl md:text-7xl leading-none">
            Your Selection
          </h1>
          <p className="mt-4 text-black/50 text-sm md:text-base">
            {itemCount} pieces currently reserved in your atelier cart.
          </p>
        </div>

        {cart.length === 0 ? (
          <div className="rounded-[32px] border border-black/10 bg-white p-10 text-center shadow-sm">
            <p className="text-black/65">Your cart is empty right now.</p>
            <Link
              href="/shop"
              className="inline-flex mt-6 rounded-full bg-black px-6 py-3 text-[10px] font-bold tracking-[0.25em] uppercase text-white"
            >
              Browse shop
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_380px] gap-10 items-start">
            <div className="space-y-8">
              {cart.map((item) => (
                <div
                  key={`${item.documentId}-${item.color}-${item.size}`}
                  className="grid grid-cols-1 md:grid-cols-[240px_minmax(0,1fr)] gap-6 pb-8 border-b border-black/10"
                >
                  <div className="aspect-[3/4] overflow-hidden bg-white border border-black/10">
                    {item.image ? (
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-full h-full object-cover"
                        loading="lazy"
                      />
                    ) : null}
                  </div>

                  <div className="flex flex-col justify-between gap-6">
                    <div className="flex items-start justify-between gap-6">
                      <div>
                        <h2 className="font-serif text-3xl leading-tight">{item.name}</h2>
                        <p className="mt-2 text-xs uppercase tracking-[0.25em] text-black/45">
                          {item.color} / {item.size}
                        </p>
                      </div>
                      <p className="text-sm text-black/60">
                        {formatPrice(item.price)}
                      </p>
                    </div>

                    <div className="flex flex-wrap items-center gap-4">
                      <div className="inline-flex items-center border border-black/15 bg-white">
                        <button
                          type="button"
                          onClick={() =>
                            updateCartQuantity(
                              item.documentId,
                              item.color,
                              item.size,
                              item.quantity - 1
                            )
                          }
                          className="px-4 py-3 text-black/60 hover:text-black transition-colors"
                        >
                          <Minus size={14} />
                        </button>
                        <span className="min-w-12 text-center text-sm">
                          {item.quantity}
                        </span>
                        <button
                          type="button"
                          onClick={() =>
                            updateCartQuantity(
                              item.documentId,
                              item.color,
                              item.size,
                              item.quantity + 1
                            )
                          }
                          className="px-4 py-3 text-black/60 hover:text-black transition-colors"
                        >
                          <Plus size={14} />
                        </button>
                      </div>

                      <button
                        type="button"
                        onClick={() =>
                          removeCartItem(item.documentId, item.color, item.size)
                        }
                        className="inline-flex items-center gap-2 text-[10px] font-bold tracking-[0.25em] uppercase text-black/40 hover:text-black transition-colors"
                      >
                        <X size={14} />
                        Remove
                      </button>
                    </div>
                  </div>
                </div>
              ))}

              <button
                type="button"
                onClick={handleClear}
                className="inline-flex items-center gap-2 text-[10px] font-bold tracking-[0.25em] uppercase text-black/40 hover:text-black transition-colors"
              >
                <X size={14} />
                Clear cart
              </button>
            </div>

            <aside className="rounded-[28px] bg-white text-black p-8 md:p-10 border border-black/10 shadow-sm">
              <h2 className="font-serif text-3xl">Order Summary</h2>

              <div className="mt-8 space-y-5 text-sm">
                <div className="flex items-center justify-between">
                  <span className="text-black/55">Subtotal</span>
                  <span className="font-medium">{formatPrice(subtotal)}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-black/55">Shipping (Express)</span>
                  <span className="font-medium">Complimentary</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-black/55">Taxes</span>
                  <span className="font-medium">Calculated at checkout</span>
                </div>
              </div>

              <div className="mt-8 border-t border-black/10 pt-8 flex items-center justify-between">
                <span className="text-[10px] uppercase tracking-[0.3em] text-black/55">
                  Estimated Total
                </span>
                <span className="font-serif text-4xl">{formatPrice(subtotal)}</span>
              </div>

              <button
                type="button"
                onClick={handleProceedToCheckout}
                className="mt-8 w-full bg-black text-white text-[11px] uppercase tracking-[0.35em] font-medium py-5 hover:bg-zinc-900 transition-colors"
              >
                Proceed to Checkout
              </button>

              <div className="mt-8 flex items-start gap-3 text-sm text-black/60">
                <ShieldCheck className="mt-1 h-4 w-4" />
                <p>
                  Every Atelier piece is handcrafted and inspected before dispatch.
                  Enjoy complimentary express shipping and 30-day returns on all
                  seasonal collections.
                </p>
              </div>
            </aside>
          </div>
        )}
      </div>
    </div>
  );
}
