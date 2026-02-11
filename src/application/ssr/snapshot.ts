export const SnapshotKeys = {
  UserModel: "UserModel",
  PostsViewModel: "PostsViewModel",
} as const;

export type SnapshotKey = (typeof SnapshotKeys)[keyof typeof SnapshotKeys];

export type RootStoreSnapshot = Partial<Record<SnapshotKey, unknown>>;
