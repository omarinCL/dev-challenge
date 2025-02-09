import { Request, Response } from "express";
import { GetScheduleCoverageUseCase } from "../domain/usecases/get-schedule-coverage.usecase";
import { ProductRepository } from "../infrastructure/repositories/product.repository";
import { ScheduleRouteRepository } from "../infrastructure/repositories/schedule-route.repository";
import { ScheduleRepository } from "../infrastructure/repositories/schedule.repository";

export class ScheduleController {
  private useCase: GetScheduleCoverageUseCase;

  constructor() {
    const productRepo = new ProductRepository();
    const scheduleRouteRepo = new ScheduleRouteRepository();
    const scheduleRepo = new ScheduleRepository();
    this.useCase = new GetScheduleCoverageUseCase(
      productRepo,
      scheduleRouteRepo,
      scheduleRepo
    );
  }

  async getScheduleCoverage(req: Request, res: Response): Promise<void> {
    try {
      const { products, commune } = req.body;
      const result = await this.useCase.execute({ products, commune });
      res.json(result);
    } catch (error) {
      res.status(500).json({ error: (error as Error).message });
    }
  }
}
