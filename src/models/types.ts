export type ProductSize = 'S' | 'M' | 'L' | 'XL';

export interface ProductParents {
    subline: string;
    line: string;
    department: string;
}

export interface Product {
    id: string;
    name: string;
    parents: ProductParents;
    size: ProductSize;
}

export interface RouteSchedule {
    scheduleId: string;
    commune: string;
    active: boolean;
    minSize: ProductSize;
    maxSize: ProductSize;
}

export interface Schedule {
    id: string;
    courier: string;
    serviceType: string;
    deliveryMethod: string;
    cutTime: string[];
}

export interface CoverageRequest {
    products: string[];
    commune: string;
}

export interface ProductSchedule {
    product: string;
    schedules: {
        id: string;
        courier: string;
        serviceType: string;
        deliveryMethod: string;
        cutTime: string[];
    }[];
}

export interface ProductError {
    product: string;
    error: string;
}

export interface CoverageResponse {
    products: ProductSchedule[];
    errors: ProductError[];
}