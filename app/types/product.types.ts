export interface Product {
  id: number;
  business_id: number;
  name: string;
  description: string;
  price: number;
  stock: number;
  min_stock?: number;
  image_url: string;
  created_at: string;
}
