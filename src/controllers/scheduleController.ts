
import { Request, Response } from 'express';
import { ScheduleService } from '../services/scheduleService';
import { CoverageRequest } from '../interfaces/RequestTypes';
import { API_CONFIG, ERROR_MESSAGES } from '../config/constants';

export class ScheduleController {
    private service: ScheduleService;

    constructor() {
        this.service = new ScheduleService();
    }

    public getCoverage = async (req: Request, res: Response): Promise<void> => {
        try {
            const { products, commune } = req.body as CoverageRequest;

            if (products.length > API_CONFIG.MAX_PRODUCTS) {
                res.status(400).json({
                    error: ERROR_MESSAGES.MAX_PRODUCTS_EXCEEDED
                });
                return;
            }

            const coverage = await this.service.getCoverageSchedules(products, commune);
            res.json(coverage);
        } catch (error) {
            console.error('Error en el controlador de cobertura:', error);
            res.status(500).json({
                error: 'Error interno del servidor'
            });
        }
    };
}