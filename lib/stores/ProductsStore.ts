import { makeAutoObservable, runInAction } from "mobx";
import { inject, injectable } from "../di";
import { createProvider } from "../app/create-provider";
import { InjectionKeys } from "../app/injection-keys";
import type { DummyJsonApi } from "../services/DummyJsonApi";
import type { ProductPreview } from "../types/dummyjson";

@injectable()
export class ProductsStore {
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
}

export const {
  Provider: ProductsProvider,
  useStore: useProductsStore,
  serialize: serializeProducts,
} = createProvider({
  token: InjectionKeys.ProductsStore,
  snapshotKey: "products",
  snapshotProperties: ["products", "isLoaded", "lastLoadedAt"] as const,
});
