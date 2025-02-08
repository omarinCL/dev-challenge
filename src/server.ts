
import app from './app';
import { API_CONFIG } from './config/constants';

const server = app.listen(API_CONFIG.PORT, () => {
    console.log(`Servidor iniciado en el puerto ${API_CONFIG.PORT}`);
});

// Manejo de señales de terminación
process.on('SIGTERM', () => {
    console.log('Señal SIGTERM recibida. Cerrando servidor...');
    server.close(() => {
        console.log('Servidor cerrado');
        process.exit(0);
    });
});

process.on('SIGINT', () => {
    console.log('Señal SIGINT recibida. Cerrando servidor...');
    server.close(() => {
        console.log('Servidor cerrado');
        process.exit(0);
    });
});