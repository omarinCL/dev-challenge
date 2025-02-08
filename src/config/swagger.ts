
import swaggerJSDoc from 'swagger-jsdoc';

const swaggerDefinition = {
    openapi: '3.0.0',
    info: {
        title: 'API de Agendas de Despacho',
        version: '1.0.0',
        description: 'API para consultar agendas de despacho según cobertura',
    },
    servers: [
        {
            url: 'http://localhost:3000',
            description: 'Servidor de desarrollo',
        },
    ],
};

const options: swaggerJSDoc.Options = {
    swaggerDefinition,
    apis: ['./src/routes/*.ts'], // Rutas donde buscar anotaciones
};

export const swaggerSpec = swaggerJSDoc(options);