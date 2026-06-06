import type { Order } from "@/type/orderType";

export type OrderStatus = Order["orderStatus"];

export const ORDER_STATUS_STEPS: {
  key: OrderStatus;
  label: string;
  description: string;
}[] = [
  { key: "pending", label: "Pending", description: "Order received" },
  { key: "confirmed", label: "Confirmed", description: "Being prepared" },
  { key: "shipped", label: "Shipped", description: "Left warehouse" },
  { key: "delivering", label: "Delivering", description: "Driver on the way" },
  { key: "delivered", label: "Delivered", description: "Completed" },
];

export function formatOrderStatus(status: string) {
  return status.replace(/_/g, " ");
}

export function getStatusStepIndex(status: OrderStatus) {
  if (status === "cancelled") return -1;
  return ORDER_STATUS_STEPS.findIndex((step) => step.key === status);
}

export const STATUS_BADGE_CLASS: Record<OrderStatus, string> = {
  pending: "bg-amber-100 text-amber-900",
  confirmed: "bg-blue-100 text-blue-900",
  shipped: "bg-indigo-100 text-indigo-900",
  delivering: "bg-violet-100 text-violet-900",
  delivered: "bg-emerald-100 text-emerald-900",
  cancelled: "bg-red-100 text-red-900",
};
