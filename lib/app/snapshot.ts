/**
 * SSR snapshot is a simple key-value bag.
 *
 * Each store owns its own key (passed to `createProvider`),
 * so there is nothing to register here manually.
 */
export type RootStoreSnapshot = Record<string, unknown>;
