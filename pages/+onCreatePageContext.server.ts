import type { PageContextServer } from "vike/types";
import { ANONYMOUS_USER_SNAPSHOT, serializeUserModel } from "../app/models/user-model";
import { createRequestContainer } from "../config/di/create-request-container";
import { resolveToken } from "../lib/di";
import { InjectionKeys } from "../app";
import { getAccessTokenFromCookie } from "../app/auth/session";

export async function onCreatePageContext(pageContext: PageContextServer): Promise<void> {
  const accessToken = getAccessTokenFromCookie(pageContext.headers?.cookie);

  if (!accessToken) {
    pageContext.user = ANONYMOUS_USER_SNAPSHOT;
    return;
  }

  const container = createRequestContainer({ url: pageContext.urlOriginal });

  try {
    const userModel = resolveToken(container, InjectionKeys.UserModel);
    await userModel.fetchCurrentUser(accessToken);
    pageContext.user = userModel.isAuthenticated ? serializeUserModel(userModel) : ANONYMOUS_USER_SNAPSHOT;
  } finally {
    container.dispose();
  }
}
