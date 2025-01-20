import swaggerUi from "swagger-ui-express";
import swaggerJsDoc from "swagger-jsdoc";
import { swaggerOptions } from "./swaggerConfig";
// src/index.ts
import express, { Express, Request, Response } from "express";
import dotenv from "dotenv";
import scheduleRouter from "./routes/schedule";

dotenv.config();

const app: Express = express();
const port = process.env.PORT || 3000;

const swaggerDocs = swaggerJsDoc(swaggerOptions);

app.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerDocs));
app.use(express.json());
app.use("/api", scheduleRouter);

app.listen(port, () => {
  console.log(`[server]: Server is running at http://localhost:${port}`);
});

export default app;