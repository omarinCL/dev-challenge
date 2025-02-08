
import { ProductSize } from '../config/constants';

export interface ScheduleRoute {
    scheduleId: string;
    commune: string;
    active: boolean;
    minSize: ProductSize;
    maxSize: ProductSize;
}