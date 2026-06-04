import type { CartItem } from "@/components/shop/cartStorage";

export type OrderItemInput = {
  productName: string;
  productDocumentId: string;
  quantity: number;
  unitPrice: number;
  color: string;
  size: string;
  imageUrl: string;
};

export type CreateOrderInput = {
  firstName: string;
  lastName: string;
  email: string;
  streetAddress: string;
  postalCode: string;
  city: string;
  country: string;
  total: number;
  items: OrderItemInput[];
};

export type Order = {
  id: number;
  documentId: string;
  orderNumber: string;
  firstName: string;
  lastName: string;
  email: string;
  streetAddress: string;
  postalCode: string;
  city: string;
  country: string;
  paymentMethod: "cash_on_delivery";
  orderStatus: "pending" | "confirmed" | "shipped" | "delivered" | "cancelled";
  total: number;
  customerId?: number;
  customerUsername?: string;
  items?: OrderItemInput[];
};

export type StrapiOrderResponse = {
  data: Order;
};

export function mapCartItemsToOrderItems(cart: CartItem[]): OrderItemInput[] {
  return cart.map((item) => ({
    productName: item.name,
    productDocumentId: item.documentId,
    quantity: item.quantity,
    unitPrice: item.price,
    color: item.color,
    size: item.size,
    imageUrl: item.image,
  }));
}
