import { type PropsWithChildren, useRef } from "react";
import { usePageContext } from "vike-react/usePageContext";
import { type DependencyContainer, DIProvider, resolveToken, useInjection } from "../di";
import { createRequestContainer, type CreateRequestContainerParams } from "./create-request-container";
import { InjectionKeys } from "./injection-keys";
import { SnapshotContext } from "./snapshot-context";
import type { SSRPageData } from "./ssr-data-helper";

let clientContainer: DependencyContainer | null = null;

function isSSRPageData(data: unknown): data is SSRPageData {
  return (
    typeof data === "object" &&
    data !== null &&
    "requestId" in data &&
    "snapshot" in data &&
    typeof (data as SSRPageData).requestId === "string"
  );
}

function useRequestContainer(params: CreateRequestContainerParams) {
  const serverContainerRef = useRef<DependencyContainer | null>(null);

  // Keep one stable container for the browser session,
  // so app-level stores (e.g. UserStore) survive client-side navigation.
  if (typeof window !== "undefined") {
    if (!clientContainer) {
      clientContainer = createRequestContainer(params);
    } else if (params.requestId) {
      const requestContext = resolveToken(clientContainer, InjectionKeys.RequestContext);
      requestContext.requestId = params.requestId;
      requestContext.url = params.url ?? requestContext.url;
    }
    return clientContainer;
  }

  if (!serverContainerRef.current) {
    serverContainerRef.current = createRequestContainer(params);
  }

  return serverContainerRef.current;
}

export function SSRContainerWrapper({ children }: PropsWithChildren) {
  const pageContext = usePageContext();
  const pageData = pageContext.data as unknown;
  
  const data = isSSRPageData(pageData) ? pageData : undefined;

  const container = useRequestContainer({
    requestId: data?.requestId,
    url: pageContext.urlPathname,
  });

  return (
    <DIProvider container={container}>
      <SnapshotContext.Provider value={data?.snapshot}>{children}</SnapshotContext.Provider>
    </DIProvider>
  );
}

export function useRequestId() {
  const ctx = useInjection(InjectionKeys.RequestContext);
  return ctx.requestId;
}
