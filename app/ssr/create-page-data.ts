import type { PageContextServer } from "vike/types";
import { createRequestContainer } from "../../config/di/create-request-container";
import { InjectionKeys } from "../../config/di/injection-keys";
import type { DependencyContainer } from "../../lib/di";
import { resolveToken } from "../../lib/di";
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
    const pageSnapshot = await setup(container);

    const { requestId } = resolveToken(container, InjectionKeys.RequestContext);

    return { requestId, snapshot: pageSnapshot };
  } finally {
    container.dispose();
  }
}
