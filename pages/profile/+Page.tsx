import { Avatar, Card, Group, Stack, Text, Title } from "@mantine/core";
import { observer } from "mobx-react-lite";
import { useUserModel } from "~/entity/user-model";

function ProfilePage() {
  const user = useUserModel();

  if (!user.user) {
    return <Text>User not found.</Text>;
  }

  return (
    <Stack>
      <Title order={1}>Profile</Title>

      <Card withBorder>
        <Group>
          <Avatar src={user.user.image} size={84} radius="xl" />
          <Stack gap={2}>
            <Text fw={700} size="lg">
              {user.user.firstName} {user.user.lastName}
            </Text>
            <Text size="sm" c="dimmed">
              @{user.user.username}
            </Text>
            <Text size="sm">{user.user.email}</Text>
          </Stack>
        </Group>
      </Card>
    </Stack>
  );
}

export default observer(ProfilePage);
