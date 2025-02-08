
import { ProductSize } from '../config/constants';

export interface Product {
    id: string;
    name: string;
    parents: {
        subline: string;
        line: string;
        department: string;
    };
    size: ProductSize;
}