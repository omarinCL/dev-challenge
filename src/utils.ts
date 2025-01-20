import { CoverageRequest } from "./models/coverageRequest";
import { getSchedulesRoutesByCommune } from "./services/scheduleRoute";

const parseProductIds = (ids: any): string[] => {
  if (
    Array.isArray(ids) &&
    ids.length > 0 &&
    ids.length <= 10 &&
    ids.every((item) => typeof item === "string")
  ) {
    return ids;
  } else {
    throw new Error("Product not an Array of Ids, is Empty or is larger than 10 items");
  }
};

const parseCommune = (commune: any): string => {
  if (typeof commune != "string" || commune == "" || !getSchedulesRoutesByCommune(commune)) {
    throw new Error("Incorrect or missing Commune");
  }
  return commune;
};

const toValidateCoverageSearch = (object: any): CoverageRequest => {
  const coverageRequest: CoverageRequest = {
    products: parseProductIds(object.products),
    commune: parseCommune(object.commune),
  };

  return coverageRequest;
};

export default toValidateCoverageSearch;
