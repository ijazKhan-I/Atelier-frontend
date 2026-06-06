import { Suspense } from "react";
import DeliveryShareLocationView from "@/components/shop/DeliveryShareLocationView";

export default function DeliverySharePage() {
  return (
    <Suspense fallback={null}>
      <DeliveryShareLocationView />
    </Suspense>
  );
}
