import { Suspense } from "react";
import OrderTrackView from "@/components/shop/OrderTrackView";

export default function TrackOrderPage() {
  return (
    <Suspense fallback={null}>
      <OrderTrackView />
    </Suspense>
  );
}
