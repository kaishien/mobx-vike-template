import { inject, injectable, type RequestContext } from "../di";
import { InjectionKeys } from "../../config/di/injection-keys";
import type {
  AuthLoginResponse,
  Comment,
  CommentsResponse,
  DeletedCommentResponse,
  Post,
  PostsResponse,
  User,
} from "../types/dummyjson";

@injectable()
export class DummyJsonApi {
  constructor(@inject(InjectionKeys.RequestContext) private readonly requestContext: RequestContext) {}

  private readonly baseUrl = "https://dummyjson.com";

  async login(username: string, password: string): Promise<AuthLoginResponse> {
    const response = await fetch(`${this.baseUrl}/auth/login`, {
      method: "POST",
      headers: {
        "content-type": "application/json",
        "x-request-id": this.requestContext.requestId,
      },
      body: JSON.stringify({ username, password, expiresInMins: 30 }),
    });

    this.assertOk(response, "Failed to login");
    return (await response.json()) as AuthLoginResponse;
  }

  async getCurrentUser(accessToken: string): Promise<User> {
    const response = await fetch(`${this.baseUrl}/auth/me`, {
      headers: {
        authorization: `Bearer ${accessToken}`,
        "x-request-id": this.requestContext.requestId,
      },
    });

    this.assertOk(response, "Failed to fetch current user");
    return (await response.json()) as User;
  }

  async getPosts(limit = 15, skip = 0): Promise<Post[]> {
    const response = await fetch(`${this.baseUrl}/posts?limit=${limit}&skip=${skip}`, {
      headers: {
        "x-request-id": this.requestContext.requestId,
      },
    });

    this.assertOk(response, "Failed to fetch posts");
    const data = (await response.json()) as PostsResponse;
    return data.posts;
  }

  async getCommentsByPost(postId: number): Promise<Comment[]> {
    const response = await fetch(`${this.baseUrl}/comments/post/${postId}`, {
      headers: {
        "x-request-id": this.requestContext.requestId,
      },
    });

    this.assertOk(response, `Failed to fetch comments for post #${postId}`);
    const data = (await response.json()) as CommentsResponse;
    return data.comments;
  }

  async addComment(params: { body: string; postId: number; userId: number }): Promise<Comment> {
    const response = await fetch(`${this.baseUrl}/comments/add`, {
      method: "POST",
      headers: {
        "content-type": "application/json",
        "x-request-id": this.requestContext.requestId,
      },
      body: JSON.stringify(params),
    });

    this.assertOk(response, "Failed to add comment");
    return (await response.json()) as Comment;
  }

  async updateCommentLikes(commentId: number, likes: number): Promise<Comment> {
    const response = await fetch(`${this.baseUrl}/comments/${commentId}`, {
      method: "PUT",
      headers: {
        "content-type": "application/json",
        "x-request-id": this.requestContext.requestId,
      },
      body: JSON.stringify({ likes }),
    });

    this.assertOk(response, `Failed to like comment #${commentId}`);
    return (await response.json()) as Comment;
  }

  async deleteComment(commentId: number): Promise<DeletedCommentResponse> {
    const response = await fetch(`${this.baseUrl}/comments/${commentId}`, {
      method: "DELETE",
      headers: {
        "x-request-id": this.requestContext.requestId,
      },
    });

    this.assertOk(response, `Failed to delete comment #${commentId}`);
    return (await response.json()) as DeletedCommentResponse;
  }

  private assertOk(response: Response, message: string) {
    if (!response.ok) {
      throw new Error(`${message}. Status: ${response.status}. Request: ${this.requestContext.requestId}`);
    }
  }
}
