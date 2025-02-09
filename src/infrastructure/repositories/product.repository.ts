import { promises as fs } from "fs";
import { join } from "path";
import { IProductRepository } from "../../domain/repositories/product.repository.interface";
import { Product } from "../../domain/models/product.model";

export class ProductRepository implements IProductRepository {
  private dataFilePath = join(
    __dirname,
    "../../../resources/database/products.json"
  );

  async getById(id: string): Promise<Product | null> {
    const products = await this.getAllProducts();
    return products.find((product) => product.id === id) || null;
  }

  async getByIds(ids: string[]): Promise<Product[]> {
    const products = await this.getAllProducts();
    return products.filter((product) => ids.includes(product.id));
  }

  private async getAllProducts(): Promise<Product[]> {
    const data = await fs.readFile(this.dataFilePath, "utf-8");
    return JSON.parse(data) as Product[];
  }
}
