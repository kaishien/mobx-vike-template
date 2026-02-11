interface ViewTransition {
  readonly finished: Promise<void>;
  readonly ready: Promise<void>;
  readonly updateCallbackDone: Promise<void>;
  skipTransition(): void;
}

interface ViewTransitionOptions {
  update?: () => Promise<void> | void;
  types?: string[];
}

declare global {
  interface Document {
    startViewTransition?(
      optionsOrCallback?: ViewTransitionOptions | (() => Promise<void> | void),
    ): ViewTransition;
  }
}

export {};
