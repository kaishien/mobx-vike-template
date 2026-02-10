import { type RequestContext, token } from "../../lib/di";
import type { DummyJsonApi } from "../../lib/services/DummyJsonApi";
import type { PostsModel } from "../../app/models/posts-model";
import type { UserModel } from "../../app/models/user-model";

export const InjectionKeys = {
  RequestContext: token<RequestContext>("RequestContext"),

  DummyJsonApi: token<DummyJsonApi>("DummyJsonApi"),

  UserModel: token<UserModel>("UserModel"),
  PostsModel: token<PostsModel>("PostsModel"),
} as const;
