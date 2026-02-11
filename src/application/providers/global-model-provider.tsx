import { composeProviders } from "~/lib/di";
import { UserModelProvider } from "~/entity/user-model";

export const GlobalModelProvider = composeProviders([
  UserModelProvider,
]);
