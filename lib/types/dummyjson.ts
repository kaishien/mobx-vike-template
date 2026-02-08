export type ProductPreview = {
  id: number;
  title: string;
  description: string;
  price: number;
  thumbnail: string;
  category: string;
};

export type ProductDetails = ProductPreview & {
  brand?: string;
  rating: number;
  stock: number;
  images: string[];
};

export type ProductsResponse = {
  products: ProductDetails[];
  total: number;
  skip: number;
  limit: number;
};
