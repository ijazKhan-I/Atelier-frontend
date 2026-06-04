import { Suspense } from "react";
import CheckoutSuccessView from "@/components/shop/CheckoutSuccessView";

export default function CheckoutSuccessPage() {
  return (
    <Suspense fallback={null}>
      <CheckoutSuccessView />
    </Suspense>
  );
}
