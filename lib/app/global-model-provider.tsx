import { composeProviders } from "../di";
import { UserModelProvider } from "../models/user-model";

export const GlobalModelProvider = composeProviders([
  UserModelProvider,
]);
