import express from 'express';
import dotenv from 'dotenv';
import swaggerUi from 'swagger-ui-express';
import swaggerJsdoc from 'swagger-jsdoc';

dotenv.config();

export const app = express();

const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'API de Ejemplo',
      version: '1.0.0',
      description: 'Una API para ilustrar cómo usar Swagger en Node.js',
    },
  },
  apis: ['./src/routes/*.ts']
};

const swaggerSpec = swaggerJsdoc(swaggerOptions);

app.use(express.json());
app.use('/api-ripley', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

import('./routes/schedules').then((module) => {
  module.default(app);
});

app.listen(process.env.PORT || 3000, () => {
  console.log('Starting express on port ' + process.env.PORT || 3000);
});
