import { readFileSync } from 'fs';
import path from 'path';
import {
    ProductSize,
    Product,
    Schedule,
    RouteSchedule,
    CoverageRequest,
    CoverageResponse
} from '../models/types';

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
            return ["Schedule is available 24/7 - No time restrictions"];
        }
        
        const now = new Date();
        const dayOfWeek = now.getDay();
        const adjustedDay = dayOfWeek === 0 ? 6 : dayOfWeek - 1;
        const cutTimeForDay = cutTime[adjustedDay];
        const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
        
        if (!this.isWithinCutoffTime(cutTime)) {
            return [
                `Schedule ${scheduleId} is not available - Cut-off time (${cutTimeForDay}) has passed for ${daysOfWeek[adjustedDay]}`,
                `Cut-off times by day: ${cutTime.map((time, index) => `${daysOfWeek[index]}: ${time}`).join(', ')}`
            ];
        }
        
        return [
            `Available until ${cutTimeForDay} today (${daysOfWeek[adjustedDay]})`,
            `Cut-off times by day: ${cutTime.map((time, index) => `${daysOfWeek[index]}: ${time}`).join(', ')}`
        ];
    }

    async getCoverage(request: CoverageRequest): Promise<CoverageResponse> {
        const response: CoverageResponse = {
            products: [],
            errors: []
        };

        if (request.products.length > 10) {
            throw new Error('Maximum 10 products allowed per request');
        }

        for (const productId of request.products) {
            const product = this.products.find(p => p.id === productId);

            if (!product) {
                response.errors.push({
                    product: productId,
                    error: 'Product does not exist'
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
                    error: 'No available schedules for this product'
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