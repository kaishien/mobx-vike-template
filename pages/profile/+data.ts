import { useConfig } from "vike-react/useConfig";
import type { PageContextServer } from "vike/types";

export async function data(_pageContext: PageContextServer) {
  const config = useConfig();
  config({ title: "Profile" });
  return {};
}
