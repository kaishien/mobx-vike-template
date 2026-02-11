let resolveViewTransition: (() => void) | null = null;
let topBarElement: HTMLElement | null = null;

export function setViewTransitionResolve(fn: () => void) {
  resolveViewTransition = fn;
}

export function finishViewTransition() {
  if (resolveViewTransition) {
    resolveViewTransition();
    resolveViewTransition = null;
  }
}

export function showTopBar() {
  if (topBarElement?.isConnected) return;
  const bar = document.createElement("div");
  bar.className = "top-loading-bar";
  bar.setAttribute("aria-hidden", "true");
  document.body.appendChild(bar);
  topBarElement = bar;
  requestAnimationFrame(() => bar.classList.add("active"));
}

export function hideTopBar() {
  const bar = topBarElement;
  if (!bar?.isConnected) return;
  topBarElement = null;
  bar.classList.add("done");
  bar.addEventListener(
    "transitionend",
    () => bar.remove(),
    { once: true },
  );
}

let topBarClickInited = false;

export function initTopBarOnLinkClick() {
  if (typeof document === "undefined" || topBarClickInited) return;
  topBarClickInited = true;
  document.addEventListener(
    "click",
    (e) => {
      const a = (e.target as Element).closest("a[href]");
      if (!a) return;
      if ((a as HTMLAnchorElement).target && (a as HTMLAnchorElement).target !== "_self") return;
      const href = a.getAttribute("href");
      if (!href || href.startsWith("#")) return;
      try {
        if (href.startsWith("http") && new URL((a as HTMLAnchorElement).href).origin !== window.location.origin)
          return;
      } catch {
        return;
      }
      if (href.startsWith("/") || !/^https?:\/\//i.test(href)) {
        showTopBar();
      }
    },
    true,
  );
}
