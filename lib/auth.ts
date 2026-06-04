/** Cookie name read by middleware to protect checkout routes. */
export const AUTH_COOKIE = "atelier-auth";

const TOKEN_KEY = "jwt";
const USER_KEY = "user";

export type AuthUser = {
  id: number;
  username: string;
  email: string;
};

/** Save login session in localStorage (for client) and a cookie (for middleware). */
export function setAuthSession(jwt: string, user: AuthUser) {
  localStorage.setItem(TOKEN_KEY, jwt);
  localStorage.setItem(USER_KEY, JSON.stringify(user));

  // Middleware cannot read localStorage, so we mirror auth in a cookie.
  document.cookie = `${AUTH_COOKIE}=${jwt}; path=/; max-age=604800; SameSite=Lax`;
  window.dispatchEvent(new Event("auth-change"));
}

/** Clear session on logout. */
export function clearAuthSession() {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
  document.cookie = `${AUTH_COOKIE}=; path=/; max-age=0`;
  window.dispatchEvent(new Event("auth-change"));
}

/** Client-side login check (cart button, checkout page). */
export function isLoggedIn() {
  if (typeof window === "undefined") return false;
  return Boolean(localStorage.getItem(TOKEN_KEY));
}

export function getAuthToken() {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(TOKEN_KEY);
}

export function getAuthUser(): AuthUser | null {
  if (typeof window === "undefined") return null;

  try {
    const raw = localStorage.getItem(USER_KEY);
    return raw ? (JSON.parse(raw) as AuthUser) : null;
  } catch {
    return null;
  }
}

/** Keep middleware cookie in sync when user already has a saved JWT. */
export function syncAuthCookie() {
  const token = getAuthToken();
  if (!token) return;

  document.cookie = `${AUTH_COOKIE}=${token}; path=/; max-age=604800; SameSite=Lax`;
}
