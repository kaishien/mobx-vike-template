import type { ComponentType, PropsWithChildren, ReactNode } from "react";

const createKey = (index: number) => `provider-${index}`;

export function composeProviders(providers: ComponentType<PropsWithChildren>[]) {
  return function ComposedProvider({ children }: PropsWithChildren) {
    return providers.reduceRight<ReactNode>(
      (acc, Provider, index) => {
        return <Provider key={createKey(index)}>{acc}</Provider>;
      },
      children,
    );
  };
}
