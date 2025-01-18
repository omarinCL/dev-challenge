import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import morgan from 'morgan';
import swaggerUi from 'swagger-ui-express';
import swaggerJsdoc from 'swagger-jsdoc';
import config from './config/config';
import logger from './utils/logger';
import { errorConverter, errorHandler } from './middleware/errorHandler';
import { performanceMonitor } from './middleware/performanceMonitor';
import scheduleRoutes from './routes/scheduleRoutes';
import healthRoutes from './routes/healthRoutes';

const app = express();

app.use(helmet());
app.use(cors({
  origin: config.cors.origin
}));
app.use(rateLimit({
  windowMs: config.rateLimit.windowMs,
  max: config.rateLimit.max
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(morgan('combined', {
  stream: {
    write: (message) => logger.info(message.trim())
  }
}));
app.use(performanceMonitor);

const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Logistics API',
      version: '1.0.0',
      description: 'API for delivery schedule coverage',
      contact: {
        name: 'Israel Vallejos'
      }
    },
    servers: [
      {
        url: `http://localhost:${config.port}`,
        description: process.env.NODE_ENV === 'production' ? 'Production server' : 'Development server',
      },
    ],
  },
  apis: ['./src/routes/*.ts'],
};

const swaggerDocs = swaggerJsdoc(swaggerOptions);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));

app.use('/api', healthRoutes);
app.use('/api', scheduleRoutes);

app.use(errorConverter);
app.use(errorHandler);

app.use((req, res) => {
  res.status(404).json({
    code: 'NOT_FOUND',
    message: 'Resource not found'
  });
});

export const startServer = () => {
  app.listen(config.port, () => {
    logger.info(`Server is running on port ${config.port} in ${config.env} mode`);
    logger.info(`Swagger documentation available at http://localhost:${config.port}/api-docs`);
  });
};

process.on('uncaughtException', (err) => {
  logger.error('Uncaught Exception:', err);
  process.exit(1);
});

process.on('unhandledRejection', (err) => {
  logger.error('Unhandled Rejection:', err);
  process.exit(1);
});

if (require.main === module) {
  startServer();
}

export default app;