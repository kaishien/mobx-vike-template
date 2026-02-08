import type { PageContextServer } from "vike/types";
import type { DependencyContainer } from "../di";
import { resolveToken } from "../di";
import { createRequestContainer } from "./create-request-container";
import { InjectionKeys } from "./injection-keys";
import type { RootStoreSnapshot } from "./snapshot";

export type SSRPageData = {
  requestId: string;
  snapshot: RootStoreSnapshot;
};

export async function createSSRPageData(
  pageContext: PageContextServer,
  setup: (container: DependencyContainer) => Promise<RootStoreSnapshot>,
): Promise<SSRPageData> {
  const container = createRequestContainer({ url: pageContext.urlOriginal });

  try {
    const snapshot = await setup(container);
    const { requestId } = resolveToken(container, InjectionKeys.RequestContext);

    return { requestId, snapshot };
  } finally {
    container.dispose();
  }
}
