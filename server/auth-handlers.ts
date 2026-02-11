import { enhance, type UniversalHandler } from "@universal-middleware/core";
import { createRequestContainer } from "~/config/di/create-request-container";
import { resolveToken } from "~/lib/di";
import { InjectionKeys } from "~/config/di/injection-keys";
import { createAccessTokenCookieHeader, resolveRedirectToFromUrl } from "~/lib/auth/session";

function buildRedirectResponse(location: string, setCookie: string) {
  return new Response(null, {
    status: 302,
    headers: {
      location,
      "set-cookie": setCookie,
    },
  });
}

export const loginHandler: UniversalHandler<Universal.Context & object> = enhance(
  async (request) => {
    const requestUrl = new URL(request.url);
    const username = requestUrl.searchParams.get("username")?.trim();
    const password = requestUrl.searchParams.get("password")?.trim();
    const redirectTo = resolveRedirectToFromUrl(requestUrl.toString());

    if (!username || !password) {
      return buildRedirectResponse("/login?error=missing_credentials", createAccessTokenCookieHeader(null));
    }

    const container = createRequestContainer({ url: requestUrl.pathname });
    try {
      const api = resolveToken(container, InjectionKeys.DummyJsonApi);
      const auth = await api.login(username, password);
      return buildRedirectResponse(redirectTo, createAccessTokenCookieHeader(auth.accessToken));
    } catch {
      return buildRedirectResponse("/login?error=invalid_credentials", createAccessTokenCookieHeader(null));
    } finally {
      container.dispose();
    }
  },
  {
    name: "login-handler",
    path: "/api/auth/login",
    method: ["GET", "POST"],
    immutable: false,
  },
);

export const logoutHandler: UniversalHandler<Universal.Context & object> = enhance(
  async () => {
    return buildRedirectResponse("/login", createAccessTokenCookieHeader(null));
  },
  {
    name: "logout-handler",
    path: "/api/auth/logout",
    method: ["GET", "POST"],
    immutable: false,
  },
);
