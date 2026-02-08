import type { DependencyContainer } from "../../lib/di";
import type { RootStoreSnapshot } from "../ssr/snapshot";
import { loadUserSession } from "./user-model";

type ApplicationDataLoader = (container: DependencyContainer) => Promise<Partial<RootStoreSnapshot>>;

const APPLICATION_DATA_LOADERS: readonly ApplicationDataLoader[] = [loadUserSession];

export async function loadApplicationData(container: DependencyContainer): Promise<Partial<RootStoreSnapshot>> {
  const loaders = await Promise.all(APPLICATION_DATA_LOADERS.map((loader) => loader(container)));
  return Object.assign({}, ...loaders);
}
