import { redirect } from "vike/abort";
import type { PageContextServer } from "vike/types";
import { SnapshotKeys } from "~/application/ssr/snapshot";
import type { UserSnapshot } from "~/entity/user-model";

function isLoginPath(urlPathname: string): boolean {
  return urlPathname === "/login";
}

function getUserSnapshot(pageContext: PageContextServer): UserSnapshot | undefined {
  return pageContext.snapshotOverrides?.[SnapshotKeys.UserModel] as UserSnapshot | undefined;
}

export function guard(pageContext: PageContextServer) {
  const isAuthenticated = Boolean(getUserSnapshot(pageContext)?.isAuthenticated);
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
