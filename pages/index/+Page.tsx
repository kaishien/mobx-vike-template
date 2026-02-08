import { Alert, Badge, Button, Card, Group, Image, SimpleGrid, Stack, Text, Title } from "@mantine/core";
import { observer } from "mobx-react-lite";
import { InjectionKeys, useRequestId } from "../../lib/app";
import { useInjection } from "../../lib/di";

export default observer(function Page() {
  const store = useInjection(InjectionKeys.ProductsStore);
  const requestId = useRequestId();

  return (
    <Stack>
      <Group justify="space-between" align="center">
        <Title order={1}>SSR Products</Title>
        <Badge variant="light">request: {requestId.slice(0, 8)}</Badge>
      </Group>

      <Text c="dimmed" size="sm">
        Data fetched by MobX store on the server and serialized from store itself.
      </Text>

      {store.error && <Alert color="red">{store.error}</Alert>}

      <Button loading={store.isLoading} onClick={() => store.fetchProducts(12)} variant="default" w="fit-content">
        Refetch on client
      </Button>

      <SimpleGrid cols={{ base: 1, sm: 2, lg: 3 }}>
        {store.products.map((product) => (
          <Card key={product.id} withBorder shadow="sm" radius="md">
            <Card.Section>
              <Image src={product.thumbnail} alt={product.title} h={180} fit="cover" />
            </Card.Section>
            <Stack gap={8} mt="md">
              <Group justify="space-between" align="center">
                <Text fw={600}>{product.title}</Text>
                <Badge>${product.price}</Badge>
              </Group>
              <Text size="sm" lineClamp={2}>
                {product.description}
              </Text>
              <Button component="a" href={`/products/${product.id}`} variant="light">
                Open details
              </Button>
            </Stack>
          </Card>
        ))}
      </SimpleGrid>
    </Stack>
  );
});
