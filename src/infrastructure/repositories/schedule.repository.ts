import { promises as fs } from "fs";
import { join } from "path";
import { IScheduleRepository } from "../../domain/repositories/schedule.repository.interface";
import { Schedule } from "../../domain/models/schedule.model";

export class ScheduleRepository implements IScheduleRepository {
  private dataFilePath = join(
    __dirname,
    "../../../resources/database/schedules.json"
  );

  async getById(id: string): Promise<Schedule | null> {
    const schedules = await this.getAllSchedules();
    return schedules.find((schedule) => schedule.id === id) || null;
  }

  private async getAllSchedules(): Promise<Schedule[]> {
    const data = await fs.readFile(this.dataFilePath, "utf-8");
    return JSON.parse(data) as Schedule[];
  }
}
