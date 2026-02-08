import { type DependencyContainer, rootContainer } from "../../lib/di";
import { registerRequestContext } from "./register";

export type CreateRequestContainerParams = {
  requestId?: string;
  url?: string;
};

export function createRequestContainer(params: CreateRequestContainerParams = {}): DependencyContainer {
  const requestContainer = rootContainer.createChildContainer();

  registerRequestContext(requestContainer, {
    requestId: params.requestId ?? createRequestId(),
    url: params.url ?? "",
  });

  return requestContainer;
}

function createRequestId() {
  if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
    return crypto.randomUUID();
  }

  return `req_${Math.random().toString(36).slice(2)}`;
}
