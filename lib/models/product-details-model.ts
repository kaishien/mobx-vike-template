import { makeAutoObservable, runInAction } from "mobx";
import { inject, injectable } from "../di";
import { createProvider } from "../app/create-provider";
import { InjectionKeys } from "../app/injection-keys";
import type { DummyJsonApi } from "../services/DummyJsonApi";
import type { ProductDetails } from "../types/dummyjson";

@injectable()
export class ProductDetailsModel {
  product: ProductDetails | null = null;
  isLoading = false;
  isLoaded = false;
  productId: number | null = null;
  error: string | null = null;

  constructor(@inject(InjectionKeys.DummyJsonApi) private readonly api: DummyJsonApi) {
    makeAutoObservable(this, {}, { autoBind: true });
  }

  get productName() {
    return this.product?.title;
  }

  async fetchProductById(productId: number) {
    this.isLoading = true;
    this.error = null;

    try {
      const product = await this.api.getProductById(productId);
      runInAction(() => {
        this.product = product;
        this.productId = productId;
        this.isLoaded = true;
      });
    } catch (error) {
      runInAction(() => {
        this.error = error instanceof Error ? error.message : "Unexpected error";
      });
    } finally {
      runInAction(() => {
        this.isLoading = false;
      });
    }
  }
}

export const {
  Provider: ProductDetailsModelProvider,
  useModel: useProductDetailsModel,
  serialize: serializeProductDetailsModel,
} = createProvider({
  token: InjectionKeys.ProductDetailsModel,
  snapshotKey: "productDetailsSnapshot",
  snapshotProperties: ["product", "isLoaded", "productId"] as const,
});
