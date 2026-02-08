import { type RequestContext, token } from "../di";
import type { DummyJsonApi } from "../services/DummyJsonApi";
import type { ProductDetailsStore } from "../stores/ProductDetailsStore";
import type { ProductsStore } from "../stores/ProductsStore";
import type { UserStore } from "../stores/UserStore";

export const InjectionKeys = {
  RequestContext: token<RequestContext>("RequestContext"),

  DummyJsonApi: token<DummyJsonApi>("DummyJsonApi"),

  UserStore: token<UserStore>("UserStore"),
  ProductsStore: token<ProductsStore>("ProductsStore"),
  ProductDetailsStore: token<ProductDetailsStore>("ProductDetailsStore"),
} as const;
