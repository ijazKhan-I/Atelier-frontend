import {
  ORDER_STATUS_STEPS,
  formatOrderStatus,
  getStatusStepIndex,
} from "@/lib/order-status";
import type { OrderStatus } from "@/lib/order-status";

type Props = {
  status: OrderStatus;
};

export default function OrderStatusTimeline({ status }: Props) {
  if (status === "cancelled") {
    return (
      <div className="rounded-sm border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">
        This order was cancelled.
      </div>
    );
  }

  const activeIndex = getStatusStepIndex(status);

  return (
    <ol className="space-y-0">
      {ORDER_STATUS_STEPS.map((step, index) => {
        const isComplete = index <= activeIndex;
        const isCurrent = index === activeIndex;

        return (
          <li key={step.key} className="flex gap-4">
            <div className="flex flex-col items-center">
              <span
                className={`flex h-8 w-8 items-center justify-center rounded-full border text-[10px] font-bold ${
                  isComplete
                    ? "border-black bg-black text-white"
                    : "border-black/20 bg-white text-black/30"
                }`}
              >
                {index + 1}
              </span>
              {index < ORDER_STATUS_STEPS.length - 1 && (
                <span
                  className={`my-1 w-px flex-1 min-h-8 ${
                    index < activeIndex ? "bg-black" : "bg-black/15"
                  }`}
                />
              )}
            </div>

            <div className="pb-8">
              <p
                className={`text-sm font-medium uppercase tracking-[0.15em] ${
                  isCurrent ? "text-black" : isComplete ? "text-black/70" : "text-black/35"
                }`}
              >
                {step.label}
              </p>
              <p className="mt-1 text-sm text-black/50">{step.description}</p>
              {isCurrent && (
                <p className="mt-2 text-[10px] uppercase tracking-[0.2em] text-black/45">
                  Current: {formatOrderStatus(status)}
                </p>
              )}
            </div>
          </li>
        );
      })}
    </ol>
  );
}
