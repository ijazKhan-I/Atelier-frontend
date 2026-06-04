import { postData } from "@/app/api/strapi";
import type { CreateOrderInput, StrapiOrderResponse } from "@/type/orderType";

/** Send a cash-on-delivery order to Strapi (visible in admin panel). */
export async function createCashOnDeliveryOrder(
  order: CreateOrderInput,
  token: string
) {
  return postData<StrapiOrderResponse>(
    "/api/orders",
    { data: order },
    { token }
  );
}
