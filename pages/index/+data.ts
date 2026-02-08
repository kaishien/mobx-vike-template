import { useConfig } from "vike-react/useConfig";
import type { PageContextServer } from "vike/types";
import { resolveToken } from "../../lib/di";
import { createSSRPageData, InjectionKeys } from "../../lib/app";

export type Data = Awaited<ReturnType<typeof data>>;

export async function data(pageContext: PageContextServer) {
  const config = useConfig();

  return createSSRPageData(pageContext, async (container) => {
    const store = resolveToken(container, InjectionKeys.ProductsStore);
    await store.fetchProducts(12);

    config({ title: `Products (${store.products.length})` });

    return { products: store.serialize() };
  });
}
