import { makeAutoObservable, runInAction } from "mobx";
import { inject, injectable } from "../di";
import { InjectionKeys } from "../app/injection-keys";
import type { DummyJsonApi } from "../services/DummyJsonApi";
import type { ProductDetails } from "../types/dummyjson";
import { serializableStore, snapshotKeys, type SerializableStore } from "./SerializableStore";

export type ProductDetailsStoreSnapshot = {
  product: ProductDetails | null;
  isLoaded: boolean;
  productId: number | null;
};

const SNAPSHOT_KEYS = snapshotKeys<ProductDetailsStoreSnapshot>({
  product: true,
  isLoaded: true,
  productId: true,
});

@serializableStore<ProductDetailsStoreSnapshot>(SNAPSHOT_KEYS)
@injectable()
export class ProductDetailsStore implements SerializableStore<ProductDetailsStoreSnapshot> {
  product: ProductDetails | null = null;
  isLoading = false;
  isLoaded = false;
  productId: number | null = null;
  error: string | null = null;

  constructor(@inject(InjectionKeys.DummyJsonApi) private readonly api: DummyJsonApi) {
    makeAutoObservable(this, {}, { autoBind: true });
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

  declare serialize: () => ProductDetailsStoreSnapshot;
  declare restore: (snapshot?: ProductDetailsStoreSnapshot) => void;
}
