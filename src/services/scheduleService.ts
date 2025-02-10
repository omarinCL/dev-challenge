import { readFileSync } from 'fs';
import path from 'path';
import { Product } from '../models/Product';
import { RouteSchedule } from '../models/RouteSchedule';
import { Schedule } from '../models/Schedule';
import { ProductSize } from '../models/ProductSize';
import { CoverageRequest } from '../models/CoverageRequest';
import { CoverageResponse } from '../models/CoverageResponse';


class ScheduleService {
    private products: Product[];
    private scheduleRoutes: RouteSchedule[];
    private schedules: Schedule[];
    private readonly sizeOrder: ProductSize[] = ['S', 'M', 'L', 'XL'];

    constructor() {
        this.products = JSON.parse(
            readFileSync(path.join(__dirname, '../resources/database/products.json'), 'utf-8')
        );
        this.scheduleRoutes = JSON.parse(
            readFileSync(path.join(__dirname, '../resources/database/schedule-routes.json'), 'utf-8')
        );
        this.schedules = JSON.parse(
            readFileSync(path.join(__dirname, '../resources/database/schedules.json'), 'utf-8')
        );
    }

    private isWithinSizeRange(productSize: ProductSize, minSize: ProductSize, maxSize: ProductSize): boolean {
        const productIndex = this.sizeOrder.indexOf(productSize);
        const minIndex = this.sizeOrder.indexOf(minSize);
        const maxIndex = this.sizeOrder.indexOf(maxSize);
        return productIndex >= minIndex && productIndex <= maxIndex;
    }

    private isWithinCutoffTime(cutTime: string[]): boolean {
        if (!cutTime.length) return true;
        
        const now = new Date();
        const dayOfWeek = now.getDay();
        const adjustedDay = dayOfWeek === 0 ? 6 : dayOfWeek - 1;
        
        const cutTimeForDay = cutTime[adjustedDay];
        if (!cutTimeForDay) return true;
        
        const [cutHours, cutMinutes] = cutTimeForDay.split(':').map(Number);
        const currentHours = now.getHours();
        const currentMinutes = now.getMinutes();
        
        return currentHours < cutHours || (currentHours === cutHours && currentMinutes <= cutMinutes);
    }

    private formatCutTimeArray(cutTime: string[], scheduleId: string): string[] {
        if (!cutTime || cutTime.length === 0) {
            return ["El horario está disponible 24 horas al día, 7 días a la semana. Sin restricciones de tiempo."];
        }
        
        const now = new Date();
        const dayOfWeek = now.getDay();
        const adjustedDay = dayOfWeek === 0 ? 6 : dayOfWeek - 1;
        const cutTimeForDay = cutTime[adjustedDay];
        const daysOfWeek = ['Lunes', 'Martes', 'Miercoles', 'Jueves', 'Viernes', 'Sabado', 'Domingo'];
        
        if (!this.isWithinCutoffTime(cutTime)) {
            return [
                `Cronograma ${scheduleId} No está disponible - Hora límite (${cutTimeForDay}) ha pasado por ${daysOfWeek[adjustedDay]}`,
                `Horarios de corte por día: ${cutTime.map((time, index) => `${daysOfWeek[index]}: ${time}`).join(', ')}`
            ];
        }
        
        return [
            `Disponible hasta ${cutTimeForDay} hoy (${daysOfWeek[adjustedDay]})`,
            `Horarios de corte por día: ${cutTime.map((time, index) => `${daysOfWeek[index]}: ${time}`).join(', ')}`
        ];
    }

    async getCoverage(request: CoverageRequest): Promise<CoverageResponse> {
        const response: CoverageResponse = {
            products: [],
            errors: []
        };

        if (request.products.length > 10) {
            throw new Error('Se permiten un máximo de 10 productos por solicitud');
        }

        for (const productId of request.products) {
            const product = this.products.find(p => p.id === productId);

            if (!product) {
                response.errors.push({
                    product: productId,
                    error: 'El producto no existe'
                });
                continue;
            }

            const validRoutes = this.scheduleRoutes.filter(route => 
                route.commune === request.commune &&
                route.active &&
                this.isWithinSizeRange(product.size, route.minSize, route.maxSize)
            );

            const schedules = validRoutes
                .map(route => {
                    const schedule = this.schedules.find(s => s.id === route.scheduleId);
                    if (!schedule) return null;
                    return {
                        id: schedule.id,
                        courier: schedule.courier,
                        serviceType: schedule.serviceType,
                        deliveryMethod: schedule.deliveryMethod,
                        cutTime: this.formatCutTimeArray(schedule.cutTime, schedule.id)
                    };
                })
                .filter((schedule): schedule is NonNullable<typeof schedule> => schedule !== null);

            if (schedules.length === 0) {
                response.errors.push({
                    product: productId,
                    error: 'No hay horarios disponibles para este producto'
                });
                continue;
            }

            const uniqueSchedules = Array.from(
                new Map(schedules.map(s => [s.id, s])).values()
            );

            response.products.push({
                product: productId,
                schedules: uniqueSchedules
            });
        }

        return response;
    }
}

export default new ScheduleService();