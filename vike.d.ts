import type { RootStoreSnapshot } from "./src/application/ssr/snapshot";

declare global {
  namespace Vike {
    interface PageContext {
      snapshotOverrides?: RootStoreSnapshot;
    }
  }
}
