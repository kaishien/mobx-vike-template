import type { UserModel } from "./app/models/user-model";

declare global {
  namespace Vike {
    interface PageContext {
      user?: Pick<UserModel, "user" | "isAuthenticated">;
    }
  }
}
