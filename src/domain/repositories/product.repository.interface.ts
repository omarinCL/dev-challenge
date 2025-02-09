import { Product } from "../models/product.model";

export interface IProductRepository {
  getById(id: string): Promise<Product | null>;
  getByIds(ids: string[]): Promise<Product[]>;
}
