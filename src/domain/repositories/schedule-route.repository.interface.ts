import { ScheduleRoute } from "../models/schedule-route.model";
import { Size } from "../models/product.model";

export interface IScheduleRouteRepository {
  getRoutesByCommuneAndSize(
    commune: string,
    size: Size
  ): Promise<ScheduleRoute[]>;
}
