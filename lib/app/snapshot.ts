import type { ProductDetailsStoreSnapshot } from "../stores/ProductDetailsStore";
import type { ProductsStoreSnapshot } from "../stores/ProductsStore";

export type RootStoreSnapshot = {
  products?: ProductsStoreSnapshot;
  productDetails?: ProductDetailsStoreSnapshot;
};
