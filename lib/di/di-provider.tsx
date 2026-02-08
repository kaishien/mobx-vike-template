import { createContext, type PropsWithChildren, useContext, useMemo } from "react";
import type { DependencyContainer, InjectionToken } from "./tsyringe";
import type { TypedToken } from "./typed-token";

const ContainerContext = createContext<DependencyContainer | null>(null);

export function DIProvider({ container, children }: PropsWithChildren<{ container: DependencyContainer }>) {
  return <ContainerContext.Provider value={container}>{children}</ContainerContext.Provider>;
}

export function useContainer() {
  const container = useContext(ContainerContext);

  if (!container) {
    throw new Error("DI container is not available in React context");
  }

  return container;
}

/**
 * Type-safe resolve: infers the return type from the branded token.
 * Use in non-React code (e.g. `+data.ts` server hooks).
 */
export function resolveToken<T>(container: DependencyContainer, token: TypedToken<T>): T {
  return container.resolve<T>(token as InjectionToken<T>);
}

/**
 * Resolves a dependency from the request-scoped DI container.
 * The return type is inferred from the token — no manual generic needed.
 */
export function useInjection<T>(token: TypedToken<T>): T {
  const container = useContainer();
  return useMemo(() => resolveToken(container, token), [container, token]);
}
