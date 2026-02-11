export type User = {
  id: number;
  username: string;
  firstName: string;
  lastName: string;
  email: string;
  image: string;
};

export type AuthLoginResponse = User & {
  accessToken: string;
  refreshToken: string;
};

export type Post = {
  id: number;
  title: string;
  body: string;
  tags: string[];
  reactions: {
    likes: number;
    dislikes: number;
  };
  views: number;
  userId: number;
};

export type PostsResponse = {
  posts: Post[];
  total: number;
  skip: number;
  limit: number;
};

export type Comment = {
  id: number;
  body: string;
  postId: number;
  likes: number;
  user: {
    id: number;
    username: string;
    fullName: string;
  };
};

export type CommentsResponse = {
  comments: Comment[];
  total: number;
  skip: number;
  limit: number;
};

export type DeletedCommentResponse = {
  id: number;
  body: string;
  postId: number;
  likes: number;
  user: {
    id: number;
    username: string;
    fullName: string;
  };
  isDeleted: boolean;
  deletedOn: string;
};
