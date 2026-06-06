import {
  getOrderMapEmbedUrl,
  getOrderTrackingMapUrl,
  showLiveMapForStatus,
} from "@/lib/maps-url";
import type { Order } from "@/type/orderType";
import { ExternalLink } from "lucide-react";

type Props = {
  order: Order;
};

export default function OrderLiveMap({ order }: Props) {
  if (!showLiveMapForStatus(order.orderStatus)) {
    return null;
  }

  const mapLink = getOrderTrackingMapUrl(order);
  const embedUrl = getOrderMapEmbedUrl(order);

  if (!mapLink) return null;

  return (
    <div className="mt-8 rounded-sm border border-black/10 overflow-hidden bg-white">
      <div className="px-6 py-4 border-b border-black/10 flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="text-[10px] uppercase tracking-[0.25em] text-black/45">
            Live delivery map
          </p>
          <p className="mt-1 text-sm text-black/60">
            Track your delivery location on Google Maps in real time.
          </p>
        </div>
        <a
          href={mapLink}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 bg-[#4285F4] text-white text-[10px] uppercase tracking-[0.2em] font-semibold px-5 py-3 hover:bg-[#3367d6] transition-colors"
        >
          <ExternalLink size={14} />
          Open in Google Maps
        </a>
      </div>

      {embedUrl && (
        <iframe
          title="Delivery map"
          src={embedUrl}
          className="w-full h-[360px] border-0"
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
        />
      )}
    </div>
  );
}
