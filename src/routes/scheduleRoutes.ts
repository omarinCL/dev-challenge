import { Router } from 'express';
import { body } from 'express-validator';
import { getCoverage } from '../controllers/scheduleController';

const router = Router();

/**
 * @swagger
 * components:
 *   schemas:
 *     CutTimeInfo:
 *       type: array
 *       items:
 *         type: string
 *       example: ["Disponible hasta las 14:00 horas de hoy (viernes)", "Horas de corte por día: Lunes: 14:00, Martes: 18:00, Miércoles: 11:00, Jueves: 15:00, Viernes: 12:00, Sábado: 16:00, Domingo: 08:00"]
 *     Schedule:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           example: "AZSR-1034-DP"
 *         courier:
 *           type: string
 *           example: "1034"
 *         serviceType:
 *           type: string
 *           example: "EX"
 *           description: "Service type (S: Standard, EX: Express)"
 *         deliveryMethod:
 *           type: string
 *           example: "DP"
 *           description: "Delivery method type"
 *         cutTime:
 *           $ref: '#/components/schemas/CutTimeInfo'
 *     ProductSchedule:
 *       type: object
 *       properties:
 *         product:
 *           type: string
 *           example: "2000378936145"
 *         schedules:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/Schedule'
 *     ProductError:
 *       type: object
 *       properties:
 *         product:
 *           type: string
 *           example: "999999999999"
 *         error:
 *           type: string
 *           example: "El producto no existe"
 *     CoverageRequest:
 *       type: object
 *       required:
 *         - products
 *         - commune
 *       properties:
 *         products:
 *           type: array
 *           items:
 *             type: string
 *           maxItems: 10
 *           example: ["2000378936145"]
 *           description: "Matriz de identificaciones de productos (máximo 10)"
 *         commune:
 *           type: string
 *           example: "San Bernardo"
 *           description: "Nombre de la comuna de entrega"
 *     CoverageResponse:
 *       type: object
 *       properties:
 *         products:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/ProductSchedule'
 *         errors:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/ProductError'
 */

/**
 * @swagger
 * tags:
 *   name: Schedules
 *   description: Gestión del cronograma de entrega
 */

/**
 * @swagger
 * /api/schedule/coverage:
 *   post:
 *     summary: Get delivery schedule coverage
 *     description: Devuelve los horarios de entrega disponibles para productos en una comuna específica. Considera el tamaño del producto, los horarios de entrega y la disponibilidad de la comuna.
 *     tags: [Schedules]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CoverageRequest'
 *     responses:
 *       200:
 *         description: Successful coverage check
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/CoverageResponse'
 *             examples:
 *               successWithSchedule:
 *                 summary: Successful response with available schedule
 *                 value:
 *                   products:
 *                     - product: "2000378936145"
 *                       schedules:
 *                         - id: "AZSR-1082-DP"
 *                           courier: "1082"
 *                           serviceType: "S"
 *                           deliveryMethod: "DP"
 *                           cutTime: ["El horario está disponible 24 horas al día, 7 días a la semana. Sin restricciones de tiempo."]
 *                   errors: []
 *               productNotFound:
 *                 summary: Product not found error
 *                 value:
 *                   products: []
 *                   errors:
 *                     - product: "999999999999"
 *                       error: "El producto no existe"
 *       400:
 *         description: Invalid request
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Se permiten un máximo de 10 productos por solicitud"
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Error interno en el servidor"
 */
router.post(
  '/schedule/coverage',
  [
    body('products')
      .isArray()
      .withMessage('Los productos deben ser una matriz')
      .custom((value) => value.length <= 10)
      .withMessage('Se permiten máximo 10 productos'),
    body('products.*').isString().withMessage('Los identificadores de productos deben ser cadenas'),
    body('commune').isString().notEmpty().withMessage('Se requiere comuna'),
  ],
  getCoverage
);

export default router;