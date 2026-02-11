import {
  type DependencyContainer,
  Lifecycle,
  type RequestContext,
  rootContainer,
} from "~/lib/di";
import { DummyJsonApi } from "~/lib/services/DummyJsonApi";
import { PostsModel } from "../../../pages/index/(modules)/posts-model";
import { UserModel } from "~/entity/user-model";
import { InjectionKeys } from "~/config/di/injection-keys";

rootContainer.register(
  InjectionKeys.DummyJsonApi,
  { useClass: DummyJsonApi },
  { lifecycle: Lifecycle.ContainerScoped },
);

rootContainer.register(
  InjectionKeys.UserModel,
  { useClass: UserModel },
  { lifecycle: Lifecycle.ContainerScoped },
);

rootContainer.register(
  InjectionKeys.PostsModel,
  { useClass: PostsModel },
  { lifecycle: Lifecycle.ContainerScoped },
);

export function registerRequestContext(container: DependencyContainer, requestContext: RequestContext) {
  container.registerInstance(InjectionKeys.RequestContext, requestContext);
}
