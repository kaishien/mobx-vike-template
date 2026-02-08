import { composeProviders } from "../di";
import { UserProvider } from "../stores/UserStore";

export const GlobalModelProvider = composeProviders([
  UserProvider,
]);
