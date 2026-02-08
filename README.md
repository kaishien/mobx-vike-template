# Vike + MobX + tsyringe SSR Template

SSR template with request-scoped DI container and MobX stores.

## Stack

- Vike + Vike React + Fastify
- MobX + mobx-react-lite
- tsyringe for DI
- TypeScript

## Main idea

Each SSR request creates a fresh DI container:

- no shared store instances across users
- data fetching is done inside MobX stores
- stores serialize themselves in `+data.ts`
- client rehydrates stores from snapshots

## DI approach

- `InjectionKeys` as a single source of truth for tokens
- centralized `registerRequestDependencies()` split by layers (infrastructure/stores)
- `@injectable()` + `@inject(...)` for explicit constructor dependencies
- `DIProvider` + `useInjection()` hooks for React components
- request-level child container with explicit `dispose()` on unmount

## Run

```bash
pnpm install
pnpm dev
```

## Example Usage

```ts
// products-model.ts
@injectable()
export class ProductsModel {
  products: ProductPreview[] = [];
  isLoading = false;

  constructor(@inject(InjectionKeys.DummyJsonApi) private api: DummyJsonApi) {
    makeAutoObservable(this, {}, { autoBind: true });
  }

  async fetchProducts(limit = 12) {
    this.isLoading = true;
    const products = await this.api.getProducts(limit);
    runInAction(() => {
      this.products = products;
      this.isLoading = false;
    });
  }
}

export const {
  Provider: ProductsModelProvider,
  useModel: useProductsModel,
  serialize: serializeProducts,
} = createProvider({
  token: InjectionKeys.ProductsModel,
  snapshotKey: "products",
  snapshotProperties: ["products"] as const,
});
```

```ts
// +data.ts
export async function data(pageContext: PageContextServer) {
  return createSSRPageData(pageContext, async (container) => {
    const model = resolveToken(container, InjectionKeys.ProductsModel);
    await model.fetchProducts(12);

    return {
      products: serializeProducts(model),
    };
  });
}
```

```tsx
// pages/index/+Page.tsx
function ProductsPage() {
  const model = useProductsModel();

  return (
    <>
      {model.products.map((p) => (
        <div key={p.id}>{p.title}</div>
      ))}
    </>
  );
}

export default function Page() {
  return (
    <ProductsModelProvider>
      <ProductsPage />
    </ProductsModelProvider>
  );
}
```
