
import { Schedule } from './Schedule';

export interface CoverageRequest {
    products: string[];
    commune: string;
}

export interface ProductSchedule {
    product: string;
    schedules: Schedule[];
}

export interface ProductError {
    product: string;
    error: string;
}

export interface CoverageResponse {
    products: ProductSchedule[];
    errors: ProductError[];
}