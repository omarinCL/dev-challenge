//Swagger
import { OAS3Options } from 'swagger-jsdoc';


export const swaggerOptions: OAS3Options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "API de RipleyTech",
      version: "1.0.0",
      description: "Documentación de la API con Swagger y TypeScript",
    },
    servers: [
      {
        url: "http://localhost:3000/api",
        description: "Servidor local",
      },
    ],
  },
  apis: ["./src/routes/*.ts"], 
};