
import express from 'express';
import swaggerUi from 'swagger-ui-express';
import { API_CONFIG } from './config/constants';
import { swaggerSpec } from './config/swagger';
import scheduleRoutes from './routes/scheduleRoutes';

const app = express();

// Middleware para parsear JSON
app.use(express.json());

// Ruta base para verificar que el servidor está funcionando
app.get('/', (req, res) => {
    res.json({ message: 'API de Agendas de Despacho' });
});

// Configuración de Swagger
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Endpoint para obtener el spec de Swagger en formato JSON
app.get('/swagger.json', (req, res) => {
    res.setHeader('Content-Type', 'application/json');
    res.send(swaggerSpec);
});

// Configuramos las rutas
app.use(`${API_CONFIG.BASE_PATH}/schedule`, scheduleRoutes);

// Middleware para manejo de errores
app.use((err: Error, req: express.Request, res: express.Response, next: express.NextFunction) => {
    console.error('Error no manejado:', err);
    res.status(500).json({
        error: 'Error interno del servidor'
    });
});

// Middleware para rutas no encontradas
app.use((req: express.Request, res: express.Response) => {
    res.status(404).json({
        error: 'Ruta no encontrada'
    });
});

export default app;