import {
  Alert,
  Badge,
  Button,
  Card,
  Divider,
  Group,
  Stack,
  Text,
  TextInput,
  Title,
} from "@mantine/core";
import { observer } from "mobx-react-lite";
import { useRequestId } from "~/application";
import { useUserModel } from "~/entity/user-model";
import type { Comment, Post } from "~/lib/types/dummyjson";
import { PostsModelProvider, usePostsModel } from "./(modules)/posts-model";

function PostsPage() {
  const store = usePostsModel();
  const user = useUserModel();
  const requestId = useRequestId();

  return (
    <Stack>
      <Group justify="space-between" align="center">
        <Title order={1}>Posts</Title>
        <Badge variant="light">request: {requestId.slice(0, 8)}</Badge>
      </Group>

      {store.error && <Alert color="red">{store.error}</Alert>}

      {store.posts.map((post: Post) => {
        const comments = store.commentsByPostId[post.id] ?? [];
        const commentsLoading = !!store.commentsLoading[post.id];

        return (
          <Card key={post.id} withBorder radius="md" shadow="sm">
            <Stack>
              <Group justify="space-between" align="flex-start">
                <Stack gap={4} style={{ flex: 1 }}>
                  <Text fw={700}>{post.title}</Text>
                  <Text size="sm" c="dimmed">
                    {post.body}
                  </Text>
                </Stack>
                <Stack align="flex-end" gap={4}>
                  <Badge variant="light">{post.reactions.likes} likes</Badge>
                  <Badge variant="outline">{post.views} views</Badge>
                </Stack>
              </Group>

              <Group gap="xs">
                {post.tags.map((tag: string) => (
                  <Badge key={tag} size="sm" variant="dot">
                    #{tag}
                  </Badge>
                ))}
              </Group>

              <Group>
                <Button
                  variant="default"
                  size="xs"
                  loading={commentsLoading}
                  onClick={() => store.fetchComments(post.id)}
                >
                  {comments.length ? "Refresh comments" : "Show comments"}
                </Button>
              </Group>

              {comments.length > 0 && (
                <Stack gap="xs">
                  <Divider
                    label={`Comments (${comments.length})`}
                    labelPosition="left"
                  />

                  <form
                    onSubmit={async (event) => {
                      event.preventDefault();
                      const form = event.currentTarget;
                      const formData = new FormData(form);
                      const body = String(formData.get("body") ?? "");
                      if (!user.user?.id) return;
                      await store.addComment(post.id, body, user.user.id);
                      form.reset();
                    }}
                  >
                    <Group align="flex-end">
                      <TextInput
                        name="body"
                        placeholder="Add comment"
                        style={{ flex: 1 }}
                        required
                      />
                      <Button type="submit" size="xs">
                        Add
                      </Button>
                    </Group>
                  </form>

                  {comments.map((comment: Comment) => {
                    const isLiked = store.likedCommentIds.has(comment.id);
                    return (
                      <Card key={comment.id} withBorder>
                        <Stack gap={4}>
                          <Group justify="space-between" align="flex-start">
                            <Stack gap={2} style={{ flex: 1 }}>
                              <Text size="sm" fw={600}>
                                {comment.user.fullName}
                              </Text>
                              <Text size="sm">{comment.body}</Text>
                            </Stack>
                            <Badge variant="light">{comment.likes} likes</Badge>
                          </Group>

                          <Group gap="xs">
                            <Button
                              size="compact-xs"
                              variant={isLiked ? "filled" : "light"}
                              color={isLiked ? "red" : "gray"}
                              onClick={() =>
                                store.toggleCommentLike(post.id, comment.id)
                              }
                            >
                              {isLiked ? "♥ Remove like" : "♡ Like"}
                            </Button>
                            <Button
                              size="compact-xs"
                              color="red"
                              variant="light"
                              onClick={() =>
                                store.deleteComment(post.id, comment.id)
                              }
                            >
                              Delete
                            </Button>
                          </Group>
                        </Stack>
                      </Card>
                    );
                  })}
                </Stack>
              )}
            </Stack>
          </Card>
        );
      })}
    </Stack>
  );
}

const ObserverPage = observer(PostsPage);

export default function Page() {
  return (
    <PostsModelProvider>
      <ObserverPage />
    </PostsModelProvider>
  );
}
