import { CoverageResponse } from "./../models/coverageResponse";
import { Schedule } from "../models/schedule";
import { ScheduleRoute } from "../models/scheduleRoutes";
import { CoverageRequest } from "../models/coverageRequest";
import { existProduct } from "./product";
import {
  getSchedulesRoutesByCommune,
  checkSizeBetweenMinMax,
} from "./scheduleRoute";
import scheduleData from "../../resources/database/schedules.json";
import scheduleRoutesData from "../../resources/database/schedule-routes.json";

const schedules: Schedule[] = scheduleData as Schedule[];

export const getSchedules = (): Schedule[] => schedules;

export const checkCutTime = (
  scheduleId: string,
  currentDate: Date
): Schedule | undefined => {
  const getSchedule = schedules.find((item) => item.id == scheduleId);
  if (getSchedule) {
    if (getSchedule.cutTime.length != 0) {
      const dayOfWeek = currentDate.getDay();
      const hour = currentDate.getHours();
      const minutes = currentDate.getMinutes();
      const getCutTimeToday = getSchedule.cutTime[dayOfWeek];

      if (!getCutTimeToday) {
        return undefined;
      }

      const [scheduleHour, scheduleMinute] = getCutTimeToday
        .split(":")
        .map(Number);

      if (
        hour > scheduleHour ||
        (hour === scheduleHour && minutes > scheduleMinute)
      ) {
        return undefined;
      }
      return getSchedule;
    }
    return getSchedule;
  }
  return undefined;
};

export const searchCoverage = (
  coverageRequest: CoverageRequest
): CoverageResponse | undefined => {
  const productsResponse: any[] = [];
  const errorsResponse: any[] = [];
  const currentDate = new Date();
  const scheduledRoutes = getSchedulesRoutesByCommune(coverageRequest.commune);
  for (const id of coverageRequest.products) {
    const existingProduct = existProduct(id);
    scheduledRoutes;
    if (!existingProduct) {
      errorsResponse.push({
        product: id,
        error: "Producto no existe.",
      });
      continue;
    }

    const validatedRoutes = scheduledRoutes?.filter((routes: ScheduleRoute) => {
      return (
        routes.active && checkSizeBetweenMinMax(existingProduct?.size, routes)
      );
    });

    const schedules = validatedRoutes?.map((item) => item.scheduleId);

    if (schedules?.length == 0) {
      errorsResponse.push({
        product: id,
        error: "Producto no tiene entregas.",
      });
      continue;
    }

    const checkedSchedulesCutTimes = schedules
      ?.map((item) => checkCutTime(item, currentDate))
      .filter((item) => item != undefined);

    productsResponse.push({
      product: id,
      schedules: checkedSchedulesCutTimes,
    });
  }

  const responseCoverage: CoverageResponse = {
    products: productsResponse,
    error: errorsResponse,
  }
  return responseCoverage;
};
