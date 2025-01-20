import { Product } from "../models/product";
import productData from "../../resources/database/products.json";
const products: Product[] = productData as Product[];

export const existProduct = (id: string): undefined | Product => {
    const product = products.find(i => i.id == id)
    if(!product){
        return undefined;
    }else{
        return product;
    }
}