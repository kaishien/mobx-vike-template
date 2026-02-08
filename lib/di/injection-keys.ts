import type { DummyJsonApi } from "../services/DummyJsonApi";
import type { ProductDetailsModel } from "../models/product-details-model";
import type { ProductsModel } from "../models/products-model";

export type RequestContext = {
  requestId: string;
  url: string;
};

export type TypedToken<T> = symbol & { readonly __type?: T };

function token<T>(name: string): TypedToken<T> {
  return Symbol(name) as TypedToken<T>;
}

export const InjectionKeys = {
  RequestContext: token<RequestContext>("RequestContext"),
  DummyJsonApi: token<DummyJsonApi>("DummyJsonApi"),
  ProductsModel: token<ProductsModel>("ProductsModel"),
  ProductDetailsModel: token<ProductDetailsModel>("ProductDetailsModel"),
} as const;
