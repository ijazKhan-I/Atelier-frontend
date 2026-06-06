import { fetchStrapiWithAuth, postData, BASIC_URL } from "@/app/api/strapi";
import type { CreateOrderInput, Order, StrapiOrderResponse } from "@/type/orderType";

type OrdersListResponse = { data: Order[] };

export type CreateOrderResult =
  | { ok: true; order: Order }
  | { ok: false; error: string };

/** Send a cash-on-delivery order to Strapi (visible in admin panel). */
export async function createCashOnDeliveryOrder(
  order: CreateOrderInput,
  token: string
): Promise<CreateOrderResult> {
  if (!BASIC_URL) {
    return { ok: false, error: "Store API is not configured." };
  }

  try {
    const url = new URL("/api/orders", BASIC_URL);
    const response = await fetch(url.toString(), {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ data: order }),
    });

    const payload = (await response.json()) as
      | StrapiOrderResponse
      | { error?: { message?: string } };

    if (!response.ok) {
      const message =
        payload &&
        "error" in payload &&
        typeof payload.error?.message === "string"
          ? payload.error.message
          : "Could not place your order. Please try again.";

      return { ok: false, error: message };
    }

    if (!payload || !("data" in payload) || !payload.data?.orderNumber) {
      return { ok: false, error: "Could not place your order. Please try again." };
    }

    return { ok: true, order: payload.data };
  } catch (error) {
    console.error("Order failed:", error);
    return { ok: false, error: "Could not place your order. Please try again." };
  }
}

/** Logged-in user: fetch all their orders. */
export async function getMyOrders(token: string) {
  return fetchStrapiWithAuth<OrdersListResponse>("/api/orders/my-orders", token);
}

/** Track one order by number (logged in, or guest with email). */
export async function trackOrder(
  orderNumber: string,
  options?: { token?: string | null; email?: string }
) {
  const params = new URLSearchParams();
  if (options?.email) {
    params.set("email", options.email);
  }

  const query = params.toString();
  const path = `/api/orders/track/${encodeURIComponent(orderNumber)}${query ? `?${query}` : ""}`;

  return fetchStrapiWithAuth<StrapiOrderResponse>(path, options?.token);
}

type DeliverySessionResponse = {
  data: {
    orderNumber: string;
    orderStatus: string;
    city?: string;
    country?: string;
  };
};

/** Delivery partner: validate share-link token (public). */
export async function getDeliverySession(token: string) {
  const params = new URLSearchParams({ token });
  return fetchStrapiWithAuth<DeliverySessionResponse>(
    `/api/orders/delivery-session?${params}`
  );
}

/** Delivery partner: send GPS from phone/browser (public). */
export async function shareDriverLocation(payload: {
  token: string;
  latitude: number;
  longitude: number;
}) {
  const response = await postData<{ data: { ok: boolean } }>(
    "/api/orders/share-driver-location",
    payload
  );
  return Boolean(response?.data?.ok);
}
