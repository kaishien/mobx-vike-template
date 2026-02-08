import { makeAutoObservable, runInAction } from "mobx";
import { inject, injectable } from "../di";
import { InjectionKeys } from "../app/injection-keys";
import type { DummyJsonApi } from "../services/DummyJsonApi";
import type { ProductPreview } from "../types/dummyjson";
import { serializableStore, snapshotKeys, type SerializableStore } from "./SerializableStore";

export type ProductsStoreSnapshot = {
  products: ProductPreview[];
  isLoaded: boolean;
  lastLoadedAt: string | null;
};

const SNAPSHOT_KEYS = snapshotKeys<ProductsStoreSnapshot>({
  products: true,
  isLoaded: true,
  lastLoadedAt: true,
});

@serializableStore<ProductsStoreSnapshot>(SNAPSHOT_KEYS)
@injectable()
export class ProductsStore implements SerializableStore<ProductsStoreSnapshot> {
  products: ProductPreview[] = [];
  isLoading = false;
  isLoaded = false;
  error: string | null = null;
  lastLoadedAt: string | null = null;

  constructor(@inject(InjectionKeys.DummyJsonApi) private readonly api: DummyJsonApi) {
    makeAutoObservable(this, {}, { autoBind: true });
  }

  async fetchProducts(limit = 12) {
    this.isLoading = true;
    this.error = null;

    try {
      const products = await this.api.getProducts(limit);
      runInAction(() => {
        this.products = products.map((item) => ({
          id: item.id,
          title: item.title,
          description: item.description,
          price: item.price,
          thumbnail: item.thumbnail,
          category: item.category,
        }));
        this.isLoaded = true;
        this.lastLoadedAt = new Date().toISOString();
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

  declare serialize: () => ProductsStoreSnapshot;
  declare restore: (snapshot?: ProductsStoreSnapshot) => void;
}
