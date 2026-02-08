import { makeAutoObservable, runInAction } from "mobx";
import { injectable } from "../di";
import { createProvider } from "../app/create-provider";
import { InjectionKeys } from "../app/injection-keys";

export type User = {
  id: number;
  username: string;
  firstName: string;
  lastName: string;
  email: string;
  image: string;
};

@injectable()
export class UserStore {
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
  Provider: UserProvider,
  useStore: useUser,
  serialize: serializeUser,
} = createProvider({
  token: InjectionKeys.UserStore,
  snapshotKey: "user",
  snapshotProperties: ["user", "isAuthenticated"] as const,
});
