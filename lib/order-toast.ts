import { toast } from "sonner";

export const orderToast = {
  placed(orderNumber: string) {
    toast.success(`Order ${orderNumber} placed. Pay cash on delivery.`);
  },

  failed() {
    toast.error("Could not place your order. Please try again.");
  },
};
