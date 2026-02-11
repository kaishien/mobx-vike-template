// https://vike.dev/onPageTransitionEnd
// Environment: client — must be a separate file (see https://vike.dev/error/runtime-in-config)

import type { PageContextClient } from "vike/types";
import { finishViewTransition, hideTopBar } from "~/lib/view-transition-state";

export async function onPageTransitionEnd(_pageContext: PageContextClient) {
  hideTopBar();
  finishViewTransition();
  document.body.classList.remove("page-transition");
}
