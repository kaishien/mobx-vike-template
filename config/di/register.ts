import {
  type DependencyContainer,
  Lifecycle,
  type RequestContext,
  rootContainer,
} from "../../lib/di";
import { DummyJsonApi } from "../../lib/services/DummyJsonApi";
import { PostsModel } from "../../app/models/posts-model";
import { UserModel } from "../../app/models/user-model";
import { InjectionKeys } from "./injection-keys";

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
