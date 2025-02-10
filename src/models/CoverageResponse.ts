import { ProductError } from "./ProductError";
import { ProductSchedule } from "./ProductSchedule";

export interface CoverageResponse {
    products: ProductSchedule[];
    errors: ProductError[];
}