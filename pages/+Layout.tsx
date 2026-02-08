// https://vike.dev/Layout

import "@mantine/core/styles.css";
import logoUrl from "../assets/logo.svg";
import type { MantineThemeOverride } from "@mantine/core";
import { AppShell, Avatar, Burger, createTheme, Group, Image, MantineProvider, Text } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { observer } from "mobx-react-lite";
import { Link } from "../components/Link";
import { GlobalModelProvider } from "../app";
import { useUserModel } from "../app/models/user-model";

const theme: MantineThemeOverride = createTheme({
  /** Put your mantine theme override here */
  primaryColor: "cyan",
});

const AppHeader = observer(function AppHeader({ opened, toggle }: { opened: boolean; toggle: () => void }) {
  const user = useUserModel();

  return (
    <AppShell.Header>
      <Group h="100%" px="md" justify="space-between">
        <Group>
          <Burger opened={opened} onClick={toggle} hiddenFrom="sm" size="sm" />
          <a href="/">
            <Image h={50} fit="contain" src={logoUrl} />
          </a>
        </Group>
        {user.isAuthenticated && user.user && (
          <Group gap="sm">
            <Avatar src={user.user.image} alt={user.user.username} radius="xl" size="sm" />
            <Text size="sm" fw={500}>
              {user.user.firstName} {user.user.lastName}
            </Text>
          </Group>
        )}
      </Group>
    </AppShell.Header>
  );
});

export default function Layout({ children }: { children: React.ReactNode }) {
  const [opened, { toggle }] = useDisclosure();
  return (
    <MantineProvider theme={theme}>
      <GlobalModelProvider>
        <AppShell
          header={{ height: 60 }}
          navbar={{ width: 300, breakpoint: "sm", collapsed: { mobile: !opened } }}
          padding="md"
        >
          <AppHeader opened={opened} toggle={toggle} />
          <AppShell.Navbar p="md">
            <Link href="/" label="Products" />
            <Link href="/products/1" label="Product #1" />
          </AppShell.Navbar>
          <AppShell.Main> {children} </AppShell.Main>
        </AppShell>
      </GlobalModelProvider>
    </MantineProvider>
  );
}
