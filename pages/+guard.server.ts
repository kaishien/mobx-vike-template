import { redirect } from "vike/abort";
import type { PageContextServer } from "vike/types";

function isLoginPath(urlPathname: string): boolean {
  return urlPathname === "/login";
}

export function guard(pageContext: PageContextServer) {
  const isAuthenticated = !!pageContext.user?.isAuthenticated;
  const loginPath = isLoginPath(pageContext.urlPathname);

  if (!isAuthenticated && !loginPath) {
    throw redirect(
      `/login?redirectTo=${encodeURIComponent(pageContext.urlPathname)}`,
    );
  }

  if (isAuthenticated && loginPath) {
    throw redirect("/");
  }
}
