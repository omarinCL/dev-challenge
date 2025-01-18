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
 *       example: ["Available until 14:00 today (Friday)", "Cut-off times by day: Monday: 14:00, Tuesday: 18:00, Wednesday: 11:00, Thursday: 15:00, Friday: 12:00, Saturday: 16:00, Sunday: 08:00"]
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
 *           example: "Product does not exist"
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
 *           description: "Array of product IDs (maximum 10)"
 *         commune:
 *           type: string
 *           example: "San Bernardo"
 *           description: "Delivery commune name"
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
 *   description: Delivery schedule management
 */

/**
 * @swagger
 * /api/schedule/coverage:
 *   post:
 *     summary: Get delivery schedule coverage
 *     description: Returns available delivery schedules for products in a specific commune. Considers product size, cut-off times, and commune availability.
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
 *                           cutTime: ["Schedule is available 24/7 - No time restrictions"]
 *                   errors: []
 *               productNotFound:
 *                 summary: Product not found error
 *                 value:
 *                   products: []
 *                   errors:
 *                     - product: "999999999999"
 *                       error: "Product does not exist"
 *       400:
 *         description: Invalid request
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Maximum 10 products allowed per request"
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Internal server error"
 */
router.post(
  '/schedule/coverage',
  [
    body('products')
      .isArray()
      .withMessage('Products must be an array')
      .custom((value) => value.length <= 10)
      .withMessage('Maximum 10 products allowed'),
    body('products.*').isString().withMessage('Product IDs must be strings'),
    body('commune').isString().notEmpty().withMessage('Commune is required'),
  ],
  getCoverage
);

export default router;