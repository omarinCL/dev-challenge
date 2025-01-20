import { Product } from "./product"
import { Schedule } from "./schedule"

export interface ProductResponse{
    product: Product,
    schedules: Schedule[]
}

export interface Error{
    product: String,
    error: String,
}

export interface CoverageResponse{
    products : ProductResponse[],
	error: Error[]    
}