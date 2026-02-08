import { type RequestContext, token } from "../../lib/di";
import type { DummyJsonApi } from "../../lib/services/DummyJsonApi";
import type { ProductDetailsModel } from "../../app/models/product-details-model";
import type { ProductsModel } from "../../app/models/products-model";
import type { UserModel } from "../../app/models/user-model";

export const InjectionKeys = {
  RequestContext: token<RequestContext>("RequestContext"),

  DummyJsonApi: token<DummyJsonApi>("DummyJsonApi"),

  UserModel: token<UserModel>("UserModel"),
  ProductsModel: token<ProductsModel>("ProductsModel"),
  ProductDetailsModel: token<ProductDetailsModel>("ProductDetailsModel"),
} as const;
