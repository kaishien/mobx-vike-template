import { useConfig } from "vike-react/useConfig";
import type { PageContextServer } from "vike/types";
import { resolveToken } from "../../lib/di";
import { createSSRPageData, InjectionKeys } from "../../app";
import { serializePostsModel } from "../../app/models/posts-model";

export type Data = Awaited<ReturnType<typeof data>>;

export async function data(pageContext: PageContextServer) {
  const config = useConfig();

  return createSSRPageData(pageContext, async (container) => {
    const postsModel = resolveToken(container, InjectionKeys.PostsModel);
    await postsModel.fetchPosts(12);

    config({ title: "Posts" });

    return { posts: serializePostsModel(postsModel) };
  });
}
