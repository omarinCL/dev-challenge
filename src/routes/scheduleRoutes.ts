
import { Router } from 'express';
import { ScheduleController } from '../controllers/scheduleController';
import { validateCoverageRequest } from '../middlewares/validateRequest';

const router = Router();
const controller = new ScheduleController();

/**
 * @swagger
 * /api/schedule/coverage:
 *   post:
 *     summary: Obtiene las agendas de despacho disponibles
 *     description: Retorna las agendas de despacho que tienen cobertura para los productos y comuna especificados
 *     tags:
 *       - Agendas
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - products
 *               - commune
 *             properties:
 *               products:
 *                 type: array
 *                 items:
 *                   type: string
 *                 description: Lista de IDs de productos (máximo 10)
 *                 example: ["2000378936145"]
 *               commune:
 *                 type: string
 *                 description: Nombre de la comuna
 *                 example: "San Bernardo"
 *     responses:
 *       200:
 *         description: Agendas encontradas exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 products:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       product:
 *                         type: string
 *                         description: ID del producto
 *                       schedules:
 *                         type: array
 *                         items:
 *                           type: object
 *                           properties:
 *                             id:
 *                               type: string
 *                             courier:
 *                               type: string
 *                             serviceType:
 *                               type: string
 *                             deliveryMethod:
 *                               type: string
 *                             cutTime:
 *                               type: array
 *                               items:
 *                                 type: string
 *                 errors:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       product:
 *                         type: string
 *                       error:
 *                         type: string
 *       400:
 *         description: Error en la solicitud
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *       500:
 *         description: Error interno del servidor
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 */
router.post('/coverage', validateCoverageRequest, controller.getCoverage);

export default router;