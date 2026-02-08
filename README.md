# Vike + MobX + tsyringe SSR Template

SSR template with request-scoped DI container and MobX stores.

## Stack

- Vike + Vike React + Vike Photon (Fastify server)
- MobX + mobx-react-lite
- tsyringe for DI
- TypeScript

## Main idea

Each SSR request creates a fresh DI container:

- no shared store instances across users
- data fetching is done inside MobX stores
- stores serialize themselves in `+data.ts`
- client rehydrates stores from snapshots

## DI approach (inspired by Artivio frontend)

- `InjectionKeys` as a single source of truth for tokens
- centralized `registerRequestDependencies()` split by layers (infrastructure/stores)
- `@injectable()` + `@inject(...)` for explicit constructor dependencies
- `DIProvider` + `useInjection()` hooks for React components
- request-level child container with explicit `dispose()` on unmount

## Routes

- `/` products list (`https://dummyjson.com/products`)
- `/products/:id` product details (`https://dummyjson.com/products/:id`)

## Project structure

- `lib/di/createRequestContainer.ts` request container factory
- `lib/di/dependency-register.ts` centralized dependency registration
- `lib/di/injection-keys.ts` typed DI keys
- `lib/di/di-provider.tsx` React DI provider/hooks
- `lib/services/DummyJsonApi.ts` HTTP client for DummyJSON
- `lib/stores/ProductsStore.ts` list store + serialization
- `lib/stores/ProductDetailsStore.ts` details store + serialization
- `pages/index/+data.ts` SSR fetch through MobX store
- `pages/index/+Page.tsx` hydrate + render list
- `pages/products/@id/+data.ts` SSR fetch by id through MobX store
- `pages/products/@id/+Page.tsx` hydrate + render details

## Run

```bash
pnpm install
pnpm dev
```

Open:

- `http://localhost:3000/`
- `http://localhost:3000/products/1`

## Verification checklist

1. Open the app in two different browsers/incognito windows.
2. Hard refresh both pages.
3. `request` badge should differ per page render, showing request-level scope.
4. Client-side `Refetch on client` works via MobX action.
