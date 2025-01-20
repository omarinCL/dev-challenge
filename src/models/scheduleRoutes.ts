import { ProductSize } from "./productSize";
export interface ScheduleRoute{
    scheduleId: string,
    commune: string,
    active: boolean,
    minSize: ProductSize,
    maxSize: ProductSize,
}