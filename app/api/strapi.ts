
export const BASIC_URL = process.env.NEXT_PUBLIC_STRAPI_URL || process.env.STRAPI_URL;

// Fetch data from Strapi and surface the real error when it fails.
export async function fetchStrapi<T>(endpoint: string): Promise<T | null> {
  return fetchStrapiWithAuth<T>(endpoint);
}

/** GET request with optional JWT for protected Strapi routes. */
export async function fetchStrapiWithAuth<T>(
  endpoint: string,
  token?: string | null
): Promise<T | null> {
  if (!BASIC_URL) {
    throw new Error("Missing Strapi URL. Set NEXT_PUBLIC_STRAPI_URL or STRAPI_URL.");
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



// Post data to Strapi. Pass token for authenticated requests (e.g. placing orders).
export async function postData<T>(
  endpoint: string,
  bodyData: unknown,
  options?: { token?: string | null }
): Promise<T | null> {
  if (!BASIC_URL) {
    throw new Error("Missing Strapi URL. Set NEXT_PUBLIC_STRAPI_URL or STRAPI_URL.");
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
