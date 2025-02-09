import { Size } from "./product.model";

export interface ScheduleRoute {
  scheduleId: string;
  commune: string;
  active: boolean;
  minSize: Size;
  maxSize: Size;
}
