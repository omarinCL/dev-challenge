import { ProductSize } from "./productSize"
import { ParentProduct } from "./parentProduct"

export interface Product {
    id : string,
    name: string,
    parents: ParentProduct,
    size: ProductSize,
}