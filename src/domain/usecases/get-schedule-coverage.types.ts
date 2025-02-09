import { Schedule } from "../models/schedule.model";

export interface GetScheduleCoverageInput {
  products: string[];
  commune: string;
}

export interface ScheduleCoverageOutput {
  products: {
    product: string;
    schedules: Schedule[];
  }[];
  errors: {
    product: string;
    error: string;
  }[];
}
