import { getSchedules, searchCoverage } from "./../services/schedule";
import toValidateCoverageSearch from "../utils";
import { Router } from "express";

const scheduleRouter = Router();

scheduleRouter.get("/schedule", (_req, res) => {
  res.send(getSchedules());
});

/**
 * @swagger
 * /schedule/coverage:
 *   post:
 *     summary: Devuelve las agendas para envío de productos
 *     description: Devuelve las agendas especificas para cada producto según su comuna, la talla del producto y la hora de corte según cada día.
 *     tags:
 *       - Schedule Coverage
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               products:
 *                 type: array
 *                 items:
 *                   type: string
 *                 example: ["product1", "product2", "product3"]
 *               commune:
 *                 type: string
 *                 example: "San Bernardo"
 *     responses:
 *       200:
 *         description: Order processed successfully
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
 *                         example: "2000378936145"
 *                       schedules:
 *                         type: array
 *                         items:
 *                           type: object
 *                           properties:
 *                             id:
 *                               type: string
 *                               example: "AZSR-1080-DP"
 *                             courier:
 *                               type: string
 *                               example: "1080"
 *                             serviceType:
 *                               type: string
 *                               example: "S"
 *                             deliveryMethod:
 *                               type: string
 *                               example: "DP"
 *                             cutTime:
 *                               type: array
 *                               items:
 *                                 type: string
 *                               example: []
 *                 errors:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       product:
 *                         type: string
 *                         example: "123"
 *                       error:
 *                         type: string
 *                         example: "El producto no existe"
 *       400:
 *         description: Error en body
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Product not an Array of Ids, is Empty or is larger than 10 items"
 */
scheduleRouter.post("/schedule/coverage", (req, res) => {
  try {
    const coverageSearch = toValidateCoverageSearch(req.body);

    const searchedCoverage = searchCoverage(coverageSearch);

    res.status(200).json(searchedCoverage);
  } catch (e: any) {
    res.status(400).json({error: e.message});
  }
});

export default scheduleRouter;
