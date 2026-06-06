import { toast } from "sonner";

export const orderToast = {
  placed(orderNumber: string) {
    toast.success(`Order ${orderNumber} placed. Pay cash on delivery.`);
  },

  failed(message = "Could not place your order. Please try again.") {
    toast.error(message);
  },

  trackNotFound() {
    toast.error("Order not found. Check your order number and email.");
  },
};
