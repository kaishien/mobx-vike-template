import { Alert, Button, PasswordInput, Stack, TextInput, Title } from "@mantine/core";
import { usePageContext } from "vike-react/usePageContext";

function getSearchParams(urlOriginal: string): URLSearchParams {
  return new URL(urlOriginal, "http://local").searchParams;
}

export default function Page() {
  const pageContext = usePageContext();
  const searchParams = getSearchParams(pageContext.urlOriginal);
  const redirectTo = searchParams.get("redirectTo") ?? "/";
  const error = searchParams.get("error");

  return (
    <Stack>
      <Title order={2}>Login Form</Title>

      {error && (
        <Alert color="red" variant="light">
          Invalid username/password or missing data.
        </Alert>
      )}

      <form action="/api/auth/login" method="get">
        <Stack>
          <input type="hidden" name="redirectTo" value={redirectTo.startsWith("/") ? redirectTo : "/"} />
          <TextInput name="username" label="Username" placeholder="emilys" required defaultValue="emilys" />
          <PasswordInput
            name="password"
            label="Password"
            placeholder="emilyspass"
            required
            defaultValue="emilyspass"
          />
          <Button type="submit">Login</Button>
        </Stack>
      </form>
    </Stack>
  );
}
