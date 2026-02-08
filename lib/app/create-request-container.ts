import { type DependencyContainer, rootContainer } from "../di";
import { hydrateRequestStores, registerRequestDependencies } from "./register";
import type { RootStoreSnapshot } from "./snapshot";

export type CreateRequestContainerParams = {
  requestId?: string;
  url?: string;
  snapshot?: RootStoreSnapshot;
};

export function createRequestContainer(params: CreateRequestContainerParams = {}): DependencyContainer {
  const requestContainer = rootContainer.createChildContainer();

  registerRequestDependencies(requestContainer, {
    requestContext: {
      requestId: params.requestId ?? createRequestId(),
      url: params.url ?? "",
    },
  });
  hydrateRequestStores(requestContainer, params.snapshot);

  return requestContainer;
}

function createRequestId() {
  if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
    return crypto.randomUUID();
  }

  return `req_${Math.random().toString(36).slice(2)}`;
}
