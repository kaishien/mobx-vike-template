import { type RequestContext, token } from "../di";
import type { DummyJsonApi } from "../services/DummyJsonApi";
import type { ProductDetailsStore } from "../stores/ProductDetailsStore";
import type { ProductsStore } from "../stores/ProductsStore";

export const InjectionKeys = {
  RequestContext: token<RequestContext>("RequestContext"),

  DummyJsonApi: token<DummyJsonApi>("DummyJsonApi"),

  ProductsStore: token<ProductsStore>("ProductsStore"),
  ProductDetailsStore: token<ProductDetailsStore>("ProductDetailsStore"),
} as const;
