import type { ComponentType, PropsWithChildren, ReactNode } from "react";

export function composeProviders(providers: ComponentType<PropsWithChildren>[]) {
  return function ComposedProvider({ children }: PropsWithChildren) {
    return providers.reduceRight<ReactNode>(
      // biome-ignore lint/suspicious/noArrayIndexKey: providers order is static
      (acc, Provider, idx) => <Provider key={idx}>{acc}</Provider>,
      children,
    );
  };
}
