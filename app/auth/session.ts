const AUTH_COOKIE_NAME = "mvp_access_token";

function parseCookieValue(cookieHeader: string | null | undefined, name: string): string | null {
  if (!cookieHeader) return null;

  const cookies = cookieHeader.split(";");
  for (const cookie of cookies) {
    const [rawName, ...rawValue] = cookie.trim().split("=");
    if (rawName === name) {
      return decodeURIComponent(rawValue.join("="));
    }
  }

  return null;
}

export function getAccessTokenFromCookie(cookieHeader: string | null | undefined): string | null {
  return parseCookieValue(cookieHeader, AUTH_COOKIE_NAME);
}

export function createAccessTokenCookieHeader(accessToken: string | null): string {
  if (!accessToken) {
    return `${AUTH_COOKIE_NAME}=; Path=/; HttpOnly; SameSite=Lax; Max-Age=0`;
  }

  const maxAge = 60 * 60 * 24 * 7;
  return `${AUTH_COOKIE_NAME}=${encodeURIComponent(accessToken)}; Path=/; HttpOnly; SameSite=Lax; Max-Age=${maxAge}`;
}

export function resolveRedirectToFromUrl(url: string): string {
  const parsed = new URL(url);
  const redirectTo = parsed.searchParams.get("redirectTo") ?? "/";

  if (!redirectTo.startsWith("/")) {
    return "/";
  }

  return redirectTo;
}
