"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Banknote, ChevronLeft } from "lucide-react";
import OrderSummary from "./OrderSummary";
import { clearCart, readCart } from "./cartStorage";
import type { CartItem } from "./cartStorage";
import { createCashOnDeliveryOrder } from "@/app/api/order/order";
import { getAuthToken, getAuthUser, isLoggedIn, syncAuthCookie } from "@/lib/auth";
import { orderToast } from "@/lib/order-toast";
import { mapCartItemsToOrderItems } from "@/type/orderType";

const STEPS = ["Shipping", "Payment", "Review"] as const;

type ShippingForm = {
  firstName: string;
  lastName: string;
  email: string;
  streetAddress: string;
  postalCode: string;
  city: string;
  country: string;
};

const EMPTY_FORM: ShippingForm = {
  firstName: "",
  lastName: "",
  email: "",
  streetAddress: "",
  postalCode: "",
  city: "",
  country: "Pakistan",
};

export default function CheckoutView() {
  const router = useRouter();
  const [cart, setCart] = useState<CartItem[]>([]);
  const [form, setForm] = useState<ShippingForm>(EMPTY_FORM);
  const [activeStep, setActiveStep] = useState(0);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!isLoggedIn()) {
      router.replace("/login?redirect=/checkout");
      return;
    }

    syncAuthCookie();

    const user = getAuthUser();
    if (user?.email) {
      setForm((prev) => ({ ...prev, email: user.email }));
    }

    const items = readCart();
    if (items.length === 0) {
      router.replace("/cart");
      return;
    }

    setCart(items);
  }, [router]);

  const subtotal = useMemo(
    () => cart.reduce((sum, item) => sum + item.price * item.quantity, 0),
    [cart]
  );

  const updateField =
    (field: keyof ShippingForm) =>
    (event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
      setForm((prev) => ({ ...prev, [field]: event.target.value }));
    };

  // Step 1: save shipping details and move to payment.
  const handleShippingSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setActiveStep(1);
  };

  // Step 2: place COD order and send it to Strapi admin.
  const handlePlaceOrder = async () => {
    const token = getAuthToken();
    if (!token) {
      router.replace("/login?redirect=/checkout");
      return;
    }

    try {
      setSubmitting(true);

      const result = await createCashOnDeliveryOrder(
        {
          ...form,
          total: subtotal,
          items: mapCartItemsToOrderItems(cart),
        },
        token
      );

      if (!result.ok) {
        orderToast.failed(result.error);
        return;
      }

      clearCart();
      orderToast.placed(result.order.orderNumber);
      router.push(`/checkout/success?order=${result.order.orderNumber}`);
    } catch (error) {
      console.error("Order failed:", error);
      orderToast.failed();
    } finally {
      setSubmitting(false);
    }
  };

  if (cart.length === 0) {
    return null;
  }

  return (
    <div className="min-h-screen bg-white text-brand-black pt-24 pb-16 sm:pt-28 sm:pb-20">
      <div className="section-container">
        <Link
          href="/cart"
          className="inline-flex items-center gap-2 text-[10px] font-bold tracking-[0.3em] uppercase text-black/40 hover:text-black transition-colors"
        >
          <ChevronLeft size={14} />
          Back to cart
        </Link>

        <div className="mt-8 mb-10 flex flex-col gap-3 text-[9px] uppercase tracking-[0.2em] sm:mt-10 sm:mb-14 sm:flex-row sm:flex-wrap sm:items-center sm:gap-6 sm:text-[10px] sm:tracking-[0.35em]">
          {STEPS.map((step, index) => {
            const isActive = index === activeStep;
            const isDone = index < activeStep;
            const stepNumber = String(index + 1).padStart(2, "0");

            return (
              <div key={step} className="flex items-center gap-6">
                <span
                  className={
                    isActive || isDone
                      ? "font-bold text-black"
                      : "text-black/30"
                  }
                >
                  {stepNumber} {step}
                </span>
                {index < STEPS.length - 1 && (
                  <span className="hidden sm:inline text-black/15">—</span>
                )}
              </div>
            );
          })}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_420px] gap-8 sm:gap-12 items-start">
          <section>
            {activeStep === 0 ? (
              <>
                <h1 className="font-serif text-4xl md:text-5xl">
                  Shipping Information
                </h1>
                <p className="mt-3 text-sm text-black/55">
                  Enter your delivery details to complete the order.
                </p>

                <form onSubmit={handleShippingSubmit} className="mt-10 space-y-8">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <Field label="First Name">
                      <input
                        type="text"
                        value={form.firstName}
                        onChange={updateField("firstName")}
                        required
                        className="w-full border-0 border-b border-black/15 bg-transparent py-3.5 text-[15px] outline-none focus:border-black transition-colors"
                      />
                    </Field>
                    <Field label="Last Name">
                      <input
                        type="text"
                        value={form.lastName}
                        onChange={updateField("lastName")}
                        required
                        className="w-full border-0 border-b border-black/15 bg-transparent py-3.5 text-[15px] outline-none focus:border-black transition-colors"
                      />
                    </Field>
                  </div>

                  <Field label="Email Address">
                    <input
                      type="email"
                      value={form.email}
                      onChange={updateField("email")}
                      required
                      className="w-full border-0 border-b border-black/15 bg-transparent py-3.5 text-[15px] outline-none focus:border-black transition-colors"
                    />
                  </Field>

                  <Field label="Street Address">
                    <input
                      type="text"
                      value={form.streetAddress}
                      onChange={updateField("streetAddress")}
                      required
                      className="w-full border-0 border-b border-black/15 bg-transparent py-3.5 text-[15px] outline-none focus:border-black transition-colors"
                    />
                  </Field>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <Field label="Postal Code">
                      <input
                        type="text"
                        value={form.postalCode}
                        onChange={updateField("postalCode")}
                        required
                        className="w-full border-0 border-b border-black/15 bg-transparent py-3.5 text-[15px] outline-none focus:border-black transition-colors"
                      />
                    </Field>
                    <Field label="City">
                      <input
                        type="text"
                        value={form.city}
                        onChange={updateField("city")}
                        required
                        className="w-full border-0 border-b border-black/15 bg-transparent py-3.5 text-[15px] outline-none focus:border-black transition-colors"
                      />
                    </Field>
                  </div>

                  <Field label="Country">
                    <select
                      value={form.country}
                      onChange={updateField("country")}
                      required
                      className="w-full border-0 border-b border-black/15 bg-transparent py-3.5 text-[15px] outline-none focus:border-black transition-colors"
                    >
                      <option value="Pakistan">Pakistan</option>
                      <option value="United States">United States</option>
                      <option value="United Kingdom">United Kingdom</option>
                      <option value="United Arab Emirates">
                        United Arab Emirates
                      </option>
                    </select>
                  </Field>

                  <button
                    type="submit"
                    className="w-full bg-black text-white text-[11px] uppercase tracking-[0.35em] font-medium py-5 hover:bg-zinc-900 transition-colors"
                  >
                    Continue to Payment
                  </button>
                </form>
              </>
            ) : (
              <>
                <h1 className="font-serif text-4xl md:text-5xl">Payment</h1>
                <p className="mt-3 text-sm text-black/55">
                  Pay with cash when your order is delivered.
                </p>

                <div className="mt-10 border border-black p-6 bg-[#fafafa]">
                  <div className="flex items-start gap-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-full border border-black/15 bg-white">
                      <Banknote size={20} />
                    </div>
                    <div>
                      <p className="text-sm font-semibold uppercase tracking-[0.15em]">
                        Cash on Delivery
                      </p>
                      <p className="mt-2 text-sm text-black/55 leading-relaxed">
                        No online payment required. Our team will confirm your
                        order and collect payment at your doorstep.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="mt-8 flex flex-col sm:flex-row gap-4">
                  <button
                    type="button"
                    onClick={() => setActiveStep(0)}
                    className="w-full sm:w-auto px-8 py-5 border border-black/15 text-[11px] uppercase tracking-[0.35em] font-medium hover:bg-black/5 transition-colors"
                  >
                    Back
                  </button>
                  <button
                    type="button"
                    onClick={handlePlaceOrder}
                    disabled={submitting}
                    className="w-full bg-black text-white text-[11px] uppercase tracking-[0.35em] font-medium py-5 hover:bg-zinc-900 transition-colors disabled:opacity-70 disabled:cursor-not-allowed"
                  >
                    {submitting ? "Placing Order..." : "Place Order"}
                  </button>
                </div>
              </>
            )}
          </section>

          <OrderSummary
            items={cart}
            subtotal={subtotal}
            shippingLabel={
              activeStep === 1 ? "Cash on delivery" : "Calculated at next step"
            }
          />
        </div>
      </div>
    </div>
  );
}

function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <label className="block space-y-3">
      <span className="text-[10px] uppercase tracking-[0.25em] text-black/45">
        {label}
      </span>
      {children}
    </label>
  );
}
