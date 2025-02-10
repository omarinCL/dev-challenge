import { ProductSize } from "./ProductSize";

export interface RouteSchedule {
    scheduleId: string;
    commune: string;
    active: boolean;
    minSize: ProductSize;
    maxSize: ProductSize;
}