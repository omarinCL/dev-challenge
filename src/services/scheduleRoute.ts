import { ScheduleRoute } from "../models/scheduleRoutes";
import { ProductSize } from "../models/productSize";
import scheduleRoutesData from "../../resources/database/schedule-routes.json";
const schedulesRoutes: ScheduleRoute[] = scheduleRoutesData as ScheduleRoute[];

export const getSchedulesRoutesByCommune = (
  commune: string
): ScheduleRoute[] | undefined => {
  const response = schedulesRoutes.filter((item) =>
    item.commune == commune
  );
  if (response.length == 0) {
    return undefined;
  }
  return response;
};

export const checkSizeBetweenMinMax = (size: ProductSize, route: ScheduleRoute): boolean => {
  const sizes = Object.values(ProductSize);

  const startIndex = sizes.indexOf(route.minSize);
  const endIndex = sizes.indexOf(route.maxSize);
  const sizeIndex = sizes.indexOf(size);

  return sizeIndex >= startIndex && sizeIndex <= endIndex;
};
