import { useConfig } from "vike-react/useConfig";
import type { PageContextServer } from "vike/types";
import { resolveToken } from "../../../lib/di";
import { createSSRPageData, InjectionKeys } from "../../../lib/app";
import { serializeProductDetailsModel } from "../../../lib/models/product-details-model";

export type Data = Awaited<ReturnType<typeof data>>;

export async function data(pageContext: PageContextServer) {
  const config = useConfig();
  const id = Number(pageContext.routeParams.id);

  if (!Number.isFinite(id)) {
    throw new Error(`Invalid product id: ${pageContext.routeParams.id}`);
  }

  return createSSRPageData(pageContext, async (container) => {
    const store = resolveToken(container, InjectionKeys.ProductDetailsModel);
    await store.fetchProductById(id);

    if (!store.product) {
      throw new Error(`Product ${id} not found`);
    }

    config({ title: `${store.product.title} | Product details` });

    return { productDetailsSnapshot: serializeProductDetailsModel(store) };
  });
}
