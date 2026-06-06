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

export type FulfillmentSource = {
  documentId: string;
  name: string;
  sourceType: "store" | "warehouse";
  streetAddress?: string;
  city?: string;
  country?: string;
  phone?: string;
  isActive?: boolean;
  lat?: number | null;
  lng?: number | null;
  geohash?: string | null;
  location?: { lat?: number; lng?: number } | null;
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
  orderStatus:
    | "pending"
    | "confirmed"
    | "shipped"
    | "delivering"
    | "delivered"
    | "cancelled";
  total: number;
  customerId?: number;
  customerUsername?: string;
  trackingMapUrl?: string | null;
  driverLatitude?: number | null;
  driverLongitude?: number | null;
  driverLocationUpdatedAt?: string | null;
  fulfillmentSource?: FulfillmentSource | null;
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
