import { inject, injectable, type RequestContext } from "../di";
import { InjectionKeys } from "../../config/di/injection-keys";
import type { ProductDetails, ProductsResponse } from "../types/dummyjson";

@injectable()
export class DummyJsonApi {
  constructor(@inject(InjectionKeys.RequestContext) private readonly requestContext: RequestContext) {}

  private readonly baseUrl = "https://dummyjson.com";

  async getProducts(limit = 12): Promise<ProductDetails[]> {
    const response = await fetch(`${this.baseUrl}/products?limit=${limit}`, {
      headers: {
        "x-request-id": this.requestContext.requestId,
      },
    });

    this.assertOk(response, "Failed to fetch products");
    const data = (await response.json()) as ProductsResponse;
    return data.products;
  }

  async getProductById(id: number): Promise<ProductDetails> {
    const response = await fetch(`${this.baseUrl}/products/${id}`, {
      headers: {
        "x-request-id": this.requestContext.requestId,
      },
    });

    this.assertOk(response, `Failed to fetch product #${id}`);
    return (await response.json()) as ProductDetails;
  }

  private assertOk(response: Response, message: string) {
    if (!response.ok) {
      throw new Error(`${message}. Status: ${response.status}. Request: ${this.requestContext.requestId}`);
    }
  }
}
