
import { Request, Response, NextFunction } from 'express';
import { ERROR_MESSAGES } from '../config/constants';

/**
 * Middleware para validar la solicitud de cobertura
 */
export const validateCoverageRequest = (
    req: Request,
    res: Response,
    next: NextFunction
): void => {
    const { products, commune } = req.body;

    // Validamos que existan los campos requeridos
    if (!products || !commune) {
        res.status(400).json({
            error: ERROR_MESSAGES.INVALID_REQUEST
        });
        return;
    }

    // Validamos que products sea un array
    if (!Array.isArray(products)) {
        res.status(400).json({
            error: ERROR_MESSAGES.INVALID_REQUEST
        });
        return;
    }

    // Validamos que los productos sean strings
    if (!products.every(product => typeof product === 'string')) {
        res.status(400).json({
            error: ERROR_MESSAGES.INVALID_REQUEST
        });
        return;
    }

    // Validamos que la comuna sea un string
    if (typeof commune !== 'string') {
        res.status(400).json({
            error: ERROR_MESSAGES.INVALID_REQUEST
        });
        return;
    }

    next();
};