export interface SerializableStore<TSnapshot> {
  serialize(): TSnapshot;
  restore(snapshot?: TSnapshot): void;
}

export function snapshotKeys<T extends Record<string, unknown>>(
  definition: Record<keyof T, true>,
): (keyof T)[] {
  return Object.keys(definition) as (keyof T)[];
}

// biome-ignore lint/suspicious/noExplicitAny: decorator must accept classes with arbitrary constructor signatures
type Constructor<TInstance = object> = abstract new (...args: any[]) => TInstance;

type SerializableMethods<TSnapshot> = {
  serialize: () => TSnapshot;
  restore: (snapshot?: TSnapshot) => void;
};

export function serializableStore<TSnapshot extends Record<string, unknown>>(keys: readonly (keyof TSnapshot)[]) {
  return <TBase extends Constructor>(Target: TBase) => {
    const prototype = Target.prototype as SerializableMethods<TSnapshot> & Record<keyof TSnapshot, unknown>;

    if (typeof prototype.serialize !== "function") {
      Object.defineProperty(prototype, "serialize", {
        value: function serialize() {
          const snapshot = {} as TSnapshot;

          for (const key of keys) {
            snapshot[key] = this[key] as TSnapshot[typeof key];
          }

          return snapshot;
        },
      });
    }

    if (typeof prototype.restore !== "function") {
      Object.defineProperty(prototype, "restore", {
        value: function restore(snapshot?: TSnapshot) {
          if (!snapshot) return;

          for (const key of keys) {
            if (key in snapshot) {
              this[key] = snapshot[key];
            }
          }
        },
      });
    }
  };
}
