import { Alert, Badge, Button, Card, Group, Image, List, Stack, Text, Title } from "@mantine/core";
import { observer } from "mobx-react-lite";
import { useInjection } from "../../../lib/di";
import { InjectionKeys, useRequestId } from "../../../lib/app";

export default observer(function Page() {
  const store = useInjection(InjectionKeys.ProductDetailsStore);
  const requestId = useRequestId();
  const product = store.product;

  if (store.error) {
    return <Alert color="red">{store.error}</Alert>;
  }

  if (!product) {
    return <Alert color="yellow">Product is not available.</Alert>;
  }

  return (
    <Stack>
      <Group justify="space-between" align="center">
        <Title order={1}>{product.title}</Title>
        <Badge variant="light">request: {requestId.slice(0, 8)}</Badge>
      </Group>

      <Card withBorder>
        <Group align="flex-start" grow>
          <Image src={product.thumbnail} alt={product.title} radius="md" h={280} fit="cover" />
          <Stack>
            <Group>
              <Badge>${product.price}</Badge>
              <Badge variant="outline">{product.category}</Badge>
              {product.brand && <Badge variant="outline">{product.brand}</Badge>}
            </Group>
            <Text>{product.description}</Text>
            <List size="sm" spacing={4}>
              <List.Item>Rating: {product.rating}</List.Item>
              <List.Item>Stock: {product.stock}</List.Item>
            </List>
          </Stack>
        </Group>
      </Card>

      <Button component="a" href="/" variant="default" w="fit-content">
        Back to products
      </Button>
    </Stack>
  );
});
