import {
  type DependencyContainer,
  Lifecycle,
  type RequestContext,
  rootContainer,
} from "../di";
import { DummyJsonApi } from "../services/DummyJsonApi";
import { ProductDetailsStore } from "../stores/ProductDetailsStore";
import { ProductsStore } from "../stores/ProductsStore";
import { UserStore } from "../stores/UserStore";
import { InjectionKeys } from "./injection-keys";

rootContainer.register(
  InjectionKeys.DummyJsonApi,
  { useClass: DummyJsonApi },
  { lifecycle: Lifecycle.ContainerScoped },
);

rootContainer.register(
  InjectionKeys.UserStore,
  { useClass: UserStore },
  { lifecycle: Lifecycle.Singleton },
);

rootContainer.register(
  InjectionKeys.ProductsStore,
  { useClass: ProductsStore },
  { lifecycle: Lifecycle.ContainerScoped },
);

rootContainer.register(
  InjectionKeys.ProductDetailsStore,
  { useClass: ProductDetailsStore },
  { lifecycle: Lifecycle.ContainerScoped },
);

export function registerRequestContext(container: DependencyContainer, requestContext: RequestContext) {
  container.registerInstance(InjectionKeys.RequestContext, requestContext);
}
