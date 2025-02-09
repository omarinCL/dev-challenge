import { promises as fs } from "fs";
import { join } from "path";
import { IScheduleRouteRepository } from "../../domain/repositories/schedule-route.repository.interface";
import { ScheduleRoute } from "../../domain/models/schedule-route.model";
import { isSizeWithinRange } from "../../utils/size-order";
import { Size } from "../../domain/models/product.model";

export class ScheduleRouteRepository implements IScheduleRouteRepository {
  private dataFilePath = join(
    __dirname,
    "../../../resources/database/schedule-routes.json"
  );

  async getRoutesByCommuneAndSize(
    commune: string,
    size: Size
  ): Promise<ScheduleRoute[]> {
    const routes = await this.getAllRoutes();
    return routes.filter(
      (route) =>
        route.commune.toLowerCase() === commune.toLowerCase() &&
        route.active &&
        isSizeWithinRange(size, route.minSize, route.maxSize)
    );
  }

  private async getAllRoutes(): Promise<ScheduleRoute[]> {
    const data = await fs.readFile(this.dataFilePath, "utf-8");
    return JSON.parse(data) as ScheduleRoute[];
  }
}
