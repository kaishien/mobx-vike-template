import type { PageContextServer } from "vike/types";
import type { DependencyContainer } from "../di";
import { resolveToken } from "../di";
import { createRequestContainer } from "./create-request-container";
import { InjectionKeys } from "./injection-keys";
import type { RootStoreSnapshot } from "./snapshot";
import { serializeUserModel } from "../models/user-model";

export type SSRPageData = {
  requestId: string;
  snapshot: RootStoreSnapshot;
};

/**
 * Global stores that are fetched on every page request.
 * Their snapshots are merged into the root snapshot automatically.
 */
async function setupGlobalStores(container: DependencyContainer): Promise<Partial<RootStoreSnapshot>> {
  const userModel = resolveToken(container, InjectionKeys.UserModel);
  await userModel.fetchCurrentUser();

  return { user: serializeUserModel(userModel) };
}

export async function createSSRPageData(
  pageContext: PageContextServer,
  setup: (container: DependencyContainer) => Promise<RootStoreSnapshot>,
): Promise<SSRPageData> {
  const container = createRequestContainer({ url: pageContext.urlOriginal });

  try {
    const globalSnapshot = await setupGlobalStores(container);
    const pageSnapshot = await setup(container);
    const snapshot = { ...globalSnapshot, ...pageSnapshot };

    const { requestId } = resolveToken(container, InjectionKeys.RequestContext);

    return { requestId, snapshot };
  } finally {
    container.dispose();
  }
}
