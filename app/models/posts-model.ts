import { makeAutoObservable, runInAction } from "mobx";
import { inject, injectable } from "../../lib/di";
import { createProvider } from "../providers/create-provider";
import { InjectionKeys } from "../../config/di/injection-keys";
import type { DummyJsonApi } from "../../lib/services/DummyJsonApi";
import type { Comment, Post } from "../../lib/types/dummyjson";

@injectable()
export class PostsModel {
  posts: Post[] = [];
  commentsByPostId: Record<number, Comment[]> = {};
  commentsLoading: Record<number, boolean> = {};
  likedCommentIds = new Set<number>();
  isLoading = false;
  isLoaded = false;
  error: string | null = null;
  lastLoadedAt: string | null = null;

  constructor(@inject(InjectionKeys.DummyJsonApi) private readonly api: DummyJsonApi) {
    makeAutoObservable(this, {}, { autoBind: true });
  }

  async fetchPosts(limit = 15) {
    this.isLoading = true;
    this.error = null;

    try {
      const posts = await this.api.getPosts(limit);
      runInAction(() => {
        this.posts = posts;
        this.isLoaded = true;
        this.lastLoadedAt = new Date().toISOString();
      });
    } catch (error) {
      runInAction(() => {
        this.error = error instanceof Error ? error.message : "Unexpected error";
      });
    } finally {
      runInAction(() => {
        this.isLoading = false;
      });
    }
  }

  async fetchComments(postId: number) {
    runInAction(() => {
      this.commentsLoading[postId] = true;
    });

    try {
      const comments = await this.api.getCommentsByPost(postId);
      runInAction(() => {
        this.commentsByPostId[postId] = comments;
      });
    } catch (error) {
      runInAction(() => {
        this.error = error instanceof Error ? error.message : "Unexpected error";
      });
    } finally {
      runInAction(() => {
        this.commentsLoading[postId] = false;
      });
    }
  }

  async addComment(postId: number, body: string, userId: number) {
    const text = body.trim();
    if (!text) return;

    try {
      const created = await this.api.addComment({ body: text, postId, userId });
      runInAction(() => {
        const current = this.commentsByPostId[postId] ?? [];
        this.commentsByPostId[postId] = [created, ...current];
      });
    } catch (error) {
      runInAction(() => {
        this.error = error instanceof Error ? error.message : "Unexpected error";
      });
    }
  }

  async toggleCommentLike(postId: number, commentId: number) {
    const comments = this.commentsByPostId[postId] ?? [];
    const target = comments.find((comment) => comment.id === commentId);
    if (!target) return;

    const wasLiked = this.likedCommentIds.has(commentId);
    const nextLikes = Math.max(0, target.likes + (wasLiked ? -1 : 1));

    runInAction(() => {
      this.commentsByPostId[postId] = comments.map((comment) =>
        comment.id === commentId ? { ...comment, likes: nextLikes } : comment,
      );
      if (wasLiked) {
        this.likedCommentIds.delete(commentId);
      } else {
        this.likedCommentIds.add(commentId);
      }
    });

    try {
      const updated = await this.api.updateCommentLikes(commentId, nextLikes);
      runInAction(() => {
        const current = this.commentsByPostId[postId] ?? [];
        this.commentsByPostId[postId] = current.map((comment) =>
          comment.id === commentId ? { ...comment, ...updated, likes: nextLikes } : comment,
        );
      });
    } catch (error) {
      runInAction(() => {
        const rollbackLikes = target.likes;
        const current = this.commentsByPostId[postId] ?? [];
        this.commentsByPostId[postId] = current.map((comment) =>
          comment.id === commentId ? { ...comment, likes: rollbackLikes } : comment,
        );
        if (wasLiked) {
          this.likedCommentIds.add(commentId);
        } else {
          this.likedCommentIds.delete(commentId);
        }
        this.error = error instanceof Error ? error.message : "Unexpected error";
      });
    }
  }

  async deleteComment(postId: number, commentId: number) {
    try {
      await this.api.deleteComment(commentId);
      runInAction(() => {
        const comments = this.commentsByPostId[postId] ?? [];
        this.commentsByPostId[postId] = comments.filter((comment) => comment.id !== commentId);
      });
    } catch (error) {
      runInAction(() => {
        this.error = error instanceof Error ? error.message : "Unexpected error";
      });
    }
  }
}

export const {
  Provider: PostsModelProvider,
  useModel: usePostsModel,
  serialize: serializePostsModel,
} = createProvider({
  token: InjectionKeys.PostsModel,
  snapshotKey: "posts",
  snapshotProperties: ["posts", "isLoaded", "lastLoadedAt"] as const,
});
