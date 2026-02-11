# Vike + MobX + tsyringe SSR Template

SSR template with a request-scoped DI container and MobX stores.

## Stack

- Vike + Vike React + Fastify (vike-photon)
- MobX + mobx-react-lite
- tsyringe for DI
- TypeScript

## Main idea

Each SSR request gets its own DI container:

- No shared store instances across users
- Data is loaded inside MobX stores
- Stores are serialized in `+data.ts` (and via `snapshotOverrides` for auth)
- The client rehydrates stores from snapshots

## DI and snapshot keys

- **InjectionKeys** (`src/config/di/injection-keys.ts`) — single source of truth for DI tokens
- **SnapshotKeys** (`src/application/ssr/snapshot.ts`) — single source of truth for snapshot keys (avoids collisions and magic strings)
- Models are registered in `src/config/di/register.ts`
- `@injectable()` + `@inject(...)` for constructor dependencies
- **DIProvider** and **useInjection()** (or **useModel()** from `createProvider`) in React

When adding a new store that should be SSR-serialized:

1. Add a key to **SnapshotKeys** in `src/application/ssr/snapshot.ts`
2. Add a token to **InjectionKeys** and register the class in `register.ts`
3. Use **createProvider** with `snapshotKey: SnapshotKeys.YourKey` and the same key when building the snapshot in `+data.ts`

## Run

```bash
pnpm install
pnpm dev
```

## Example: page-level store with SSR

**1. Add snapshot key** in `src/application/ssr/snapshot.ts`:

```ts
// src/application/ssr/snapshot.ts
export const SnapshotKeys = {
  UserModel: "UserModel",
  PostsViewModel: "PostsViewModel",
  Products: "Products", // add this
} as const;
```

**2. Define the model and provider** (e.g. `pages/products/(modules)/products-model.ts`):

```ts
// pages/products/(modules)/products-model.ts
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
  serialize: serializeProductsModel,
} = createProvider({
  token: InjectionKeys.ProductsModel,
  snapshotKey: SnapshotKeys.Products,
  snapshotProperties: ["products"] as const,
});
```

**3. Register** in `injection-keys.ts` and `register.ts`, then use in `+data.ts`:

```ts
// pages/products/+data.ts
export async function data(pageContext: PageContextServer) {
  return createSSRPageData(pageContext, async (container) => {
    const model = resolveToken(container, InjectionKeys.ProductsModel);
    await model.fetchProducts(12);
    return { [SnapshotKeys.Products]: serializeProductsModel(model) };
  });
}
```

**4. Page component** — wrap with the provider and use the model:

```tsx
// pages/products/+Page.tsx
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

## Auth and global snapshot (user)

- User is loaded in `+onCreatePageContext.server.ts` and written to **pageContext.snapshotOverrides** under `SnapshotKeys.UserModel`.
- **passToClient** in `+config.ts` includes `snapshotOverrides` so the client receives it.
- **SSRContainerWrapper** merges `snapshotOverrides` into the page snapshot; no need to put user in every `+data.ts`.
- Guards use **getUserSnapshot(pageContext)** (from `snapshotOverrides`) to check auth.
