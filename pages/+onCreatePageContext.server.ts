import type { PageContextServer } from "vike/types";
import { SnapshotKeys } from "~/application/ssr/snapshot";
import { createRequestContainer } from "~/config/di/create-request-container";
import { InjectionKeys } from "~/config/di";
import { resolveToken } from "~/lib/di";
import { ANONYMOUS_USER_SNAPSHOT, serializeUserModel } from "~/entity/user-model";
import { getAccessTokenFromCookie } from "~/lib/auth/session";

export async function onCreatePageContext(pageContext: PageContextServer): Promise<void> {
  const accessToken = getAccessTokenFromCookie(pageContext.headers?.cookie);

  if (!accessToken) {
    pageContext.snapshotOverrides = { [SnapshotKeys.UserModel]: ANONYMOUS_USER_SNAPSHOT };
    return;
  }

  const container = createRequestContainer({ url: pageContext.urlOriginal });

  try {
    const userModel = resolveToken(container, InjectionKeys.UserModel);
    await userModel.fetchCurrentUser(accessToken);
    const userSnapshot = userModel.isAuthenticated ? serializeUserModel(userModel) : ANONYMOUS_USER_SNAPSHOT;
    pageContext.snapshotOverrides = { [SnapshotKeys.UserModel]: userSnapshot };
  } finally {
    container.dispose();
  }
}
