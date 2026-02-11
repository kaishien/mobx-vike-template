import "@mantine/core/styles.css";
import "../assets/page-transition.css";
import logoUrl from "../assets/logo.svg";
import type { MantineThemeOverride } from "@mantine/core";
import {
  AppShell,
  Avatar,
  Badge,
  Burger,
  Button,
  Container,
  Group,
  Image,
  MantineProvider,
  Paper,
  Text,
  Title,
  createTheme,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { observer } from "mobx-react-lite";
import { useEffect } from "react";
import { usePageContext } from "vike-react/usePageContext";
import { GlobalModelProvider } from "~/application/providers/global-model-provider";
import { useUserModel } from "~/entity/user-model";
import { initTopBarOnLinkClick } from "~/lib/view-transition-state";
import { Link } from "~/components/Link";

const theme: MantineThemeOverride = createTheme({
  primaryColor: "cyan",
  fontFamily: "Manrope, sans-serif",
});

const APP_NAV_LINKS = [
  { href: "/", label: "Посты" },
  { href: "/profile", label: "Профиль" },
] as const;

const AppHeader = observer(function AppHeader({
  opened,
  toggle,
}: {
  opened: boolean;
  toggle: () => void;
}) {
  const user = useUserModel();

  return (
    <AppShell.Header>
      <Group h="100%" px="md" justify="space-between">
        <Group>
          <Burger opened={opened} onClick={toggle} hiddenFrom="sm" size="sm" />
          <a href="/">
            <Image h={38} fit="contain" src={logoUrl} />
          </a>
          <Badge variant="light" color="cyan">
            Posts MVP
          </Badge>
        </Group>

        <Group gap="sm">
          {user.user && (
            <>
              <Avatar
                src={user.user.image}
                alt={user.user.username}
                radius="xl"
                size="sm"
              />
              <Text size="sm" fw={500} visibleFrom="sm">
                {user.user.firstName} {user.user.lastName}
              </Text>
            </>
          )}

          <form action="/api/auth/logout" method="get">
            <Button type="submit" variant="default" size="xs">
              Выйти
            </Button>
          </form>
        </Group>
      </Group>
    </AppShell.Header>
  );
});

function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <Container size={460} py={60}>
      <Paper withBorder radius="md" p="xl">
        <div className="page-transition-content">{children}</div>
      </Paper>
    </Container>
  );
}

function AppLayout({ children }: { children: React.ReactNode }) {
  const [opened, { toggle }] = useDisclosure();

  return (
    <AppShell
      header={{ height: 60 }}
      navbar={{ width: 280, breakpoint: "sm", collapsed: { mobile: !opened } }}
      padding="md"
    >
      <AppHeader opened={opened} toggle={toggle} />
      <AppShell.Navbar p="md">
        <Title order={6} c="dimmed" mb="sm">
          Разделы
        </Title>
        {APP_NAV_LINKS.map((item) => (
          <Link key={item.href} href={item.href} label={item.label} />
        ))}
      </AppShell.Navbar>
      <AppShell.Main>
        <div className="page-transition-content">{children}</div>
      </AppShell.Main>
    </AppShell>
  );
}

export default function Layout({ children }: { children: React.ReactNode }) {
  const { urlPathname } = usePageContext();
  const isLoginPage = urlPathname === "/login";

  useEffect(() => {
    initTopBarOnLinkClick();
  }, []);

  return (
    <MantineProvider theme={theme}>
      <GlobalModelProvider>
        {isLoginPage ? (
          <AuthLayout>{children}</AuthLayout>
        ) : (
          <AppLayout>{children}</AppLayout>
        )}
      </GlobalModelProvider>
    </MantineProvider>
  );
}
