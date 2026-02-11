// https://vike.dev/onPageTransitionStart
// Environment: client — must be a separate file (see https://vike.dev/error/runtime-in-config)

import type { PageContextClient } from "vike/types";
import { setViewTransitionResolve, showTopBar } from "~/lib/view-transition-state";

export async function onPageTransitionStart(_pageContext: Partial<PageContextClient>) {
  showTopBar();

  const startViewTransition = document.startViewTransition?.bind(document);

  if (typeof startViewTransition === "function") {
    startViewTransition(() => {
      return new Promise<void>((resolve) => {
        setViewTransitionResolve(resolve);
      });
    });
  } else {
    document.body.classList.add("page-transition");
  }
}
