
import { JsonRepository } from '../repositories/jsonRepository';
import { Product } from '../interfaces/Product';
import { Schedule } from '../interfaces/Schedule';
import { ScheduleRoute } from '../interfaces/ScheduleRoute';
import { CoverageResponse, ProductSchedule, ProductError } from '../interfaces/RequestTypes';
import { PRODUCT_SIZES, ERROR_MESSAGES } from '../config/constants';
import { isWithinCutTime } from '../utils/dateUtils';

export class ScheduleService {
    private repository: JsonRepository;

    constructor() {
        this.repository = new JsonRepository();
    }

    /**
     * Obtenemos las agendas disponibles para una lista de productos y comuna
     */
    async getCoverageSchedules(productIds: string[], commune: string): Promise<CoverageResponse> {
        const response: CoverageResponse = {
            products: [],
            errors: []
        };

        // Obtenemos todos los datos necesarios
        const [products, schedules, routes] = await Promise.all([
            this.repository.getProducts(),
            this.repository.getSchedules(),
            this.repository.getScheduleRoutes()
        ]);

        // Procesamos cada producto
        for (const productId of productIds) {
            const product = products.find(p => p.id === productId);
            
            if (!product) {
                response.errors.push({
                    product: productId,
                    error: ERROR_MESSAGES.PRODUCT_NOT_FOUND
                });
                continue;
            }

            const availableSchedules = this.findAvailableSchedules(
                product,
                schedules,
                routes,
                commune
            );

            if (availableSchedules.length === 0) {
                response.errors.push({
                    product: productId,
                    error: ERROR_MESSAGES.NO_SCHEDULES_FOUND
                });
                continue;
            }

            response.products.push({
                product: productId,
                schedules: availableSchedules
            });
        }

        return response;
    }

    /**
     * Encuentra las agendas disponibles para un producto en una comuna específica
     */
    private findAvailableSchedules(
        product: Product,
        schedules: Schedule[],
        routes: ScheduleRoute[],
        commune: string
    ): Schedule[] {
        // Obtenemos el índice del tamaño del producto
        const productSizeIndex = PRODUCT_SIZES.indexOf(product.size);

        // Filtramos las rutas que cumplen con los criterios
        const validRoutes = routes.filter(route => {
            // Verificamos comuna y estado
            if (route.commune !== commune || !route.active) {
                return false;
            }

            // Verificamos el rango de tamaños
            const minSizeIndex = PRODUCT_SIZES.indexOf(route.minSize);
            const maxSizeIndex = PRODUCT_SIZES.indexOf(route.maxSize);
            
            return (
                productSizeIndex >= minSizeIndex &&
                productSizeIndex <= maxSizeIndex
            );
        });

        // Obtenemos las agendas correspondientes a las rutas válidas
        const availableSchedules = schedules.filter(schedule => {
            // Verificamos si la agenda tiene una ruta válida
            const hasValidRoute = validRoutes.some(
                route => route.scheduleId === schedule.id
            );

            if (!hasValidRoute) {
                return false;
            }

            // Verificamos el horario de corte
            return isWithinCutTime(schedule.cutTime);
        });

        return availableSchedules;
    }
}