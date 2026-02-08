import { type PropsWithChildren, useEffect, useRef } from "react";
import { usePageContext } from "vike-react/usePageContext";
import { type DependencyContainer, DIProvider, useInjection } from "../di";
import { createRequestContainer, type CreateRequestContainerParams } from "./create-request-container";
import { InjectionKeys } from "./injection-keys";
import type { SSRPageData } from "./ssr-data-helper";

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
  const containerRef = useRef<DependencyContainer | null>(null);
  const identityRef = useRef<string>("");
  const nextIdentity = `${params.requestId ?? ""}|${params.url ?? ""}`;

  if (!containerRef.current || identityRef.current !== nextIdentity) {
    containerRef.current?.dispose();
    containerRef.current = createRequestContainer(params);
    identityRef.current = nextIdentity;
  }

  useEffect(() => {
    return () => {
      containerRef.current?.dispose();
      containerRef.current = null;
      identityRef.current = "";
    };
  }, []);

  return containerRef.current;
}

function SSRContainerInner({ data, children }: PropsWithChildren<{ data: SSRPageData }>) {
  const container = useRequestContainer({
    requestId: data.requestId,
    snapshot: data.snapshot,
  });

  return <DIProvider container={container}>{children}</DIProvider>;
}

export function SSRContainerWrapper({ children }: PropsWithChildren) {
  const pageContext = usePageContext();
  const data = pageContext.data as unknown;

  if (!isSSRPageData(data)) {
    return <>{children}</>;
  }

  return <SSRContainerInner data={data}>{children}</SSRContainerInner>;
}

export function useRequestId() {
  const ctx = useInjection(InjectionKeys.RequestContext);
  return ctx.requestId;
}
