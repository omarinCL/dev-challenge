import { Request, Response } from 'express';
import { validationResult } from 'express-validator';
import scheduleService from '../services/scheduleService';
import { CoverageRequest } from '../models/types';

export const getCoverage = async (req: Request, res: Response) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const coverageRequest: CoverageRequest = req.body;
    const coverage = await scheduleService.getCoverage(coverageRequest);
    
    return res.json(coverage);
  } catch (error) {
    if (error instanceof Error) {
      return res.status(400).json({ error: error.message });
    }
    return res.status(500).json({ error: 'Internal server error' });
  }
};