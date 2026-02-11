import { createContext, type PropsWithChildren, useContext, useEffect, useMemo, useRef } from "react";
import { resolveToken, useContainer, type TypedToken } from "~/lib/di";
import type { SnapshotKey } from "../ssr/snapshot";
import { useSnapshot } from "../ssr/snapshot-context";

type SSROptions<T, K extends keyof T> = {
  token: TypedToken<T>;
  snapshotKey: SnapshotKey;
  snapshotProperties: readonly K[];
};

type ClientOptions<T> = {
  token: TypedToken<T>;
  snapshotKey?: undefined;
  snapshotProperties?: undefined;
};

type UseModel<T> = (init?: (store: T) => (() => void) | undefined) => T;

export function createProvider<T, K extends keyof T>(
  options: SSROptions<T, K>,
): { Provider: React.FC<PropsWithChildren>; useModel: UseModel<T>; serialize: (store: T) => Pick<T, K> };

export function createProvider<T>(
  options: ClientOptions<T>,
): { Provider: React.FC<PropsWithChildren>; useModel: UseModel<T> };

export function createProvider<T, K extends keyof T>({
  token,
  snapshotKey,
  snapshotProperties,
}: {
  token: TypedToken<T>;
  snapshotKey?: SnapshotKey;
  snapshotProperties?: readonly K[];
  // biome-ignore lint/suspicious/noExplicitAny: overloads provide precise return types
}): any {
  type Snapshot = Pick<T, K>;

  const snapshotKeys = snapshotProperties;
  const StoreContext = createContext<T | null>(null);

  function Provider({ children }: PropsWithChildren) {
    const container = useContainer();
    const store = useMemo(() => resolveToken(container, token), [container]);
    const snapshot = useSnapshot();
    const restoredRef = useRef(false);

    if (snapshotKey && snapshotKeys && !restoredRef.current && snapshot?.[snapshotKey]) {
      const data = snapshot[snapshotKey] as Snapshot;
      for (const key of snapshotKeys) {
        if (key in (data as Record<string, unknown>)) {
          store[key] = data[key];
        }
      }
      restoredRef.current = true;
    }

    return <StoreContext.Provider value={store}>{children}</StoreContext.Provider>;
  }

  /**
   * Returns the store from context.
   *
   * Optionally accepts an `init` callback that runs **once** after mount.
   * The callback receives the store instance and may return a cleanup function.
   */
  function useModel(init?: (store: T) => (() => void) | undefined): T {
    const store = useContext(StoreContext);

    if (!store) {
      throw new Error("Store not found in context. Wrap the component tree with the corresponding Provider.");
    }

    const initRef = useRef(init);
    initRef.current = init;

    useEffect(() => {
      return initRef.current?.(store) ?? undefined;
    }, [store]);

    return store;
  }

    if (snapshotKeys) {
      const keys = snapshotKeys;
      function serialize(store: T): Snapshot {
        const snapshot = {} as Snapshot;
        for (const key of keys) {
          snapshot[key] = store[key];
        }
        return snapshot;
      }
    return { Provider, useModel, serialize };
  }

  return { Provider, useModel };
}
