import type { DependencyContainer, InjectionToken, RequestContext, TypedToken } from "../di";
import { DummyJsonApi } from "../services/DummyJsonApi";
import { ProductDetailsStore } from "../stores/ProductDetailsStore";
import { ProductsStore } from "../stores/ProductsStore";
import type { SerializableStore } from "../stores/SerializableStore";
import { InjectionKeys } from "./injection-keys";
import type { RootStoreSnapshot } from "./snapshot";

type RegisterRequestDependenciesParams = {
  requestContext: RequestContext;
};

const registerInfrastructure = (container: DependencyContainer, requestContext: RequestContext) => {
  container.registerInstance(InjectionKeys.RequestContext, requestContext);
  container.registerSingleton(InjectionKeys.DummyJsonApi, DummyJsonApi);
};
  
const registerStores = (container: DependencyContainer) => {
  container.registerSingleton(InjectionKeys.ProductsStore, ProductsStore);
  container.registerSingleton(InjectionKeys.ProductDetailsStore, ProductDetailsStore);
};

const restoreStoreSnapshot = <TSnapshot>(
  container: DependencyContainer,
  token: TypedToken<SerializableStore<TSnapshot>>,
  snapshot?: TSnapshot,
) => {
  if (!snapshot) return;

  const store = container.resolve<SerializableStore<TSnapshot>>(token as InjectionToken<SerializableStore<TSnapshot>>);
  store.restore(snapshot);
};

export const hydrateRequestStores = (container: DependencyContainer, snapshot?: RootStoreSnapshot) => {
  restoreStoreSnapshot(container, InjectionKeys.ProductsStore, snapshot?.products);
  restoreStoreSnapshot(container, InjectionKeys.ProductDetailsStore, snapshot?.productDetails);
};

export const registerRequestDependencies = (
  container: DependencyContainer,
  params: RegisterRequestDependenciesParams,
) => {
  registerInfrastructure(container, params.requestContext);
  registerStores(container);
};
