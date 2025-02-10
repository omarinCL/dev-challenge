import { ProductParents } from "./ProductParents";
import { ProductSize } from "./ProductSize";

export interface Product {
    id: string;
    name: string;
    parents: ProductParents;
    size: ProductSize;
}