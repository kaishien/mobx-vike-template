import type { UserModel } from "~/entity/user-model";
import type { DummyJsonApi } from "~/lib/services/DummyJsonApi";
import type { PostsModel } from "../../../pages/index/(modules)/posts-model";
import { type RequestContext, token } from "~/lib/di";

export const InjectionKeys = {
  RequestContext: token<RequestContext>("RequestContext"),

  DummyJsonApi: token<DummyJsonApi>("DummyJsonApi"),

  UserModel: token<UserModel>("UserModel"),
  PostsModel: token<PostsModel>("PostsModel"),
} as const;
