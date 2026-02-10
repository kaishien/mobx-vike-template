import { makeAutoObservable, runInAction } from "mobx";
import { inject, injectable } from "../../lib/di";
import { createProvider } from "../providers/create-provider";
import { InjectionKeys } from "../../config/di/injection-keys";
import type { DummyJsonApi } from "../../lib/services/DummyJsonApi";
import type { User } from "../../lib/types/dummyjson";

export type { User };

export type UserSnapshot = {
  user: User | null;
  isAuthenticated: boolean;
};

export const ANONYMOUS_USER_SNAPSHOT: UserSnapshot = {
  user: null,
  isAuthenticated: false,
};

@injectable()
export class UserModel {
  user: User | null = null;
  isAuthenticated = false;
  isLoading = false;
  error: string | null = null;

  constructor(@inject(InjectionKeys.DummyJsonApi) private readonly api: DummyJsonApi) {
    makeAutoObservable(this, {}, { autoBind: true });
  }

  async fetchCurrentUser(accessToken: string) {
    this.isLoading = true;
    this.error = null;

    try {
      const data = await this.api.getCurrentUser(accessToken);

      runInAction(() => {
        this.user = data;
        this.isAuthenticated = true;
      });
    } catch (error) {
      runInAction(() => {
        this.error = error instanceof Error ? error.message : "Unexpected error";
        this.user = null;
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
