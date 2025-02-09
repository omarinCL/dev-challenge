import { Schedule } from "../models/schedule.model";

export interface IScheduleRepository {
  getById(id: string): Promise<Schedule | null>;
}
