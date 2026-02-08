import {
  type DependencyContainer,
  Lifecycle,
  type RequestContext,
  rootContainer,
} from "../di";
import { DummyJsonApi } from "../services/DummyJsonApi";
import { ProductDetailsModel } from "../models/product-details-model";
import { ProductsModel } from "../models/products-model";
import { UserModel } from "../models/user-model";
import { InjectionKeys } from "./injection-keys";

rootContainer.register(
  InjectionKeys.DummyJsonApi,
  { useClass: DummyJsonApi },
  { lifecycle: Lifecycle.ContainerScoped },
);

rootContainer.register(
  InjectionKeys.UserModel,
  { useClass: UserModel },
  { lifecycle: Lifecycle.ContainerScoped },
);

rootContainer.register(
  InjectionKeys.ProductsModel,
  { useClass: ProductsModel },
  { lifecycle: Lifecycle.ContainerScoped },
);

rootContainer.register(
  InjectionKeys.ProductDetailsModel,
  { useClass: ProductDetailsModel },
  { lifecycle: Lifecycle.ContainerScoped },
);

export function registerRequestContext(container: DependencyContainer, requestContext: RequestContext) {
  container.registerInstance(InjectionKeys.RequestContext, requestContext);
}
