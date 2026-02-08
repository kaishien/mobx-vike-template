/**
 * Branded symbol that carries the resolved type at compile time.
 * Lets `useInjection(token)` and `resolveToken(container, token)` infer the return type automatically.
 */
export type TypedToken<T> = symbol & { readonly __type?: T };

export function token<T>(name: string): TypedToken<T> {
  return Symbol(name) as TypedToken<T>;
}

export type RequestContext = {
  requestId: string;
  url: string;
};
