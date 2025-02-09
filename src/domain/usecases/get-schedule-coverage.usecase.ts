import { IProductRepository } from "../repositories/product.repository.interface";
import { IScheduleRouteRepository } from "../repositories/schedule-route.repository.interface";
import { IScheduleRepository } from "../repositories/schedule.repository.interface";
import {
  GetScheduleCoverageInput,
  ScheduleCoverageOutput,
} from "./get-schedule-coverage.types";
import { Schedule } from "../models/schedule.model";
import { isCutTimeValid } from "../../utils/cut-time";

export class GetScheduleCoverageUseCase {
  constructor(
    private productRepository: IProductRepository,
    private scheduleRouteRepository: IScheduleRouteRepository,
    private scheduleRepository: IScheduleRepository,
    private now: Date = new Date()
  ) {}

  async execute(
    input: GetScheduleCoverageInput
  ): Promise<ScheduleCoverageOutput> {
    const output: ScheduleCoverageOutput = { products: [], errors: [] };

    if (input.products.length > 10) {
      throw new Error("Se permite consultar un máximo de 10 productos.");
    }

    for (const productId of input.products) {
      const product = await this.productRepository.getById(productId);
      if (!product) {
        output.errors.push({
          product: productId,
          error: "El producto no existe",
        });
        continue;
      }

      const routes =
        await this.scheduleRouteRepository.getRoutesByCommuneAndSize(
          input.commune,
          product.size
        );
      const validSchedules: Schedule[] = [];

      for (const route of routes) {
        const schedule = await this.scheduleRepository.getById(
          route.scheduleId
        );
        if (!schedule) continue;

        if (schedule.cutTime && schedule.cutTime.length > 0) {
          if (!isCutTimeValid(schedule.cutTime, this.now)) {
            continue;
          }
        }
        validSchedules.push(schedule);
      }

      if (validSchedules.length === 0) {
        output.errors.push({
          product: productId,
          error: "No hay agendas para el producto",
        });
      } else {
        output.products.push({
          product: productId,
          schedules: validSchedules,
        });
      }
    }

    return output;
  }
}
