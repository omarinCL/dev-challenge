import express from "express";
import { ScheduleController } from "./controllers/schedule.controller";
import swaggerUi from "swagger-ui-express";
import YAML from "yamljs";
import { join } from "path";

const app = express();
app.use(express.json());

const swaggerDocument = YAML.load(join(__dirname, "../openapi.yaml"));
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

const scheduleController = new ScheduleController();
app.post("/api/schedule/coverage", (req, res) =>
  scheduleController.getScheduleCoverage(req, res)
);

export default app;
