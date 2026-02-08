import { makeAutoObservable, runInAction } from "mobx";
import type { DependencyContainer } from "../../lib/di";
import { injectable, resolveToken } from "../../lib/di";
import { createProvider } from "../providers/create-provider";
import { InjectionKeys } from "../../config/di/injection-keys";

export type User = {
  id: number;
  username: string;
  firstName: string;
  lastName: string;
  email: string;
  image: string;
};

@injectable()
export class UserModel {
  user: User | null = null;
  isAuthenticated = false;
  isLoading = false;
  error: string | null = null;
  
  constructor() {
    makeAutoObservable(this, {}, { autoBind: true });
  }

  async fetchCurrentUser() {
    this.isLoading = true;
    this.error = null;

    try {
      const response = await fetch("https://dummyjson.com/users/1?select=id,username,firstName,lastName,email,image");

      if (!response.ok) {
        throw new Error(`Failed to fetch user. Status: ${response.status}`);
      }

      const data = (await response.json()) as User;

      runInAction(() => {
        this.user = data;
        this.isAuthenticated = true;
      });
    } catch (error) {
      runInAction(() => {
        this.error = error instanceof Error ? error.message : "Unexpected error";
        this.isAuthenticated = false;
      });
    } finally {
      runInAction(() => {
        this.isLoading = false;
      });
    }
  }
}

export const {
  Provider: UserModelProvider,
  useModel: useUserModel,
  serialize: serializeUserModel,
} = createProvider({
  token: InjectionKeys.UserModel,
  snapshotKey: "user",
  snapshotProperties: ["user", "isAuthenticated"] as const,
});

export async function loadUserSession(container: DependencyContainer) {
  const userModel = resolveToken(container, InjectionKeys.UserModel);
  await userModel.fetchCurrentUser();
  return { user: serializeUserModel(userModel) };
}
