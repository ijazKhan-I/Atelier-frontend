/** Backend base URL (Django REST). Legacy Strapi env names still work. */
export const BASIC_URL =
  process.env.NEXT_PUBLIC_API_URL ||
  process.env.NEXT_PUBLIC_STRAPI_URL ||
  process.env.STRAPI_URL ||
  process.env.API_URL;

const missingUrlMessage =
  "Missing API URL. Set NEXT_PUBLIC_API_URL (or NEXT_PUBLIC_STRAPI_URL).";

/** GET from the Atelier API. */
export async function fetchStrapi<T>(endpoint: string): Promise<T | null> {
  return fetchStrapiWithAuth<T>(endpoint);
}

/** GET with optional JWT for protected routes. */
export async function fetchStrapiWithAuth<T>(
  endpoint: string,
  token?: string | null
): Promise<T | null> {
  if (!BASIC_URL) {
    throw new Error(missingUrlMessage);
  }

  try {
    const url = new URL(endpoint, BASIC_URL);
    const headers: Record<string, string> = {};

    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }

    const response = await fetch(url.toString(), { cache: "no-store", headers });

    if (!response.ok) {
      const errorText = await response.text();
      console.log("Fetch Error:", response.status, response.statusText, errorText);
      return null;
    }

    const data: T = await response.json();
    return data;
  } catch (error) {
    console.log(error);
    return null;
  }
}

/** POST JSON. Pass token for authenticated requests (e.g. placing orders). */
export async function postData<T>(
  endpoint: string,
  bodyData: unknown,
  options?: { token?: string | null }
): Promise<T | null> {
  if (!BASIC_URL) {
    throw new Error(missingUrlMessage);
  }

  try {
    const url = new URL(endpoint, BASIC_URL);
    const headers: Record<string, string> = {
      "Content-Type": "application/json",
    };

    if (options?.token) {
      headers.Authorization = `Bearer ${options.token}`;
    }

    const response = await fetch(url.toString(), {
      method: "POST",
      headers,
      body: JSON.stringify(bodyData),
    });

    const data: T = await response.json();

    if (!response.ok) {
      console.log("POST Error:", data);
      return null;
    }

    return data;
  } catch (error) {
    console.log(error);
    return null;
  }
}
