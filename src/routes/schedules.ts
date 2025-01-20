const {getScheduleCoverage} = require('../api/schedules'); 

/**
 * @swagger
 * /api/schedule/coverage:
 *   post:
 *     description: Obtener cobertura de horarios
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
 *                 example: ["2000378936145"]
 *               commune:
 *                 type: string
 *                 example: "San Bernardo"
 *     responses:
 *       200:
 *         description: Información sobre la cobertura de horarios
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 coverage:
 *                   type: string
 *                   example: "Full coverage for the given products and commune."
 */
export default (app: any) => {
    app.post('/api/schedule/coverage', getScheduleCoverage);
  };