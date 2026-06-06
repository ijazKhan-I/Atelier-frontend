import { fetchStrapiWithAuth, postData } from "@/app/api/strapi";
import type { Order } from "@/type/orderType";

export type DriverProfile = {
  documentId: string;
  fullName: string;
  phone: string;
  vehicleType: string;
  isActive: boolean;
  currentLatitude?: number | null;
  currentLongitude?: number | null;
  lastLocationAt?: string | null;
};

type DriverResponse = { data: DriverProfile };
type OrdersResponse = { data: Order[] };

/** Register logged-in user as a delivery driver (Strapi). */
export async function registerDriver(
  data: { fullName: string; phone: string; vehicleType?: string },
  token: string
) {
  return postData<DriverResponse>(
    "/api/drivers/register",
    { data },
    { token }
  );
}

export async function getMyDriverProfile(token: string) {
  return fetchStrapiWithAuth<DriverResponse>("/api/drivers/me", token);
}

export async function getDriverAssignedOrders(token: string) {
  return fetchStrapiWithAuth<OrdersResponse>("/api/drivers/my-orders", token);
}

/** Driver shares GPS — saved on order in Strapi (customer map polls this). */
export async function shareDriverLocationAuth(
  payload: {
    orderDocumentId: string;
    latitude: number;
    longitude: number;
  },
  token: string
) {
  const response = await postData<{ data: { ok: boolean } }>(
    "/api/drivers/share-location",
    payload,
    { token }
  );
  return Boolean(response?.data?.ok);
}
