import { JsonRepository } from '../../src/repositories/jsonRepository';

describe('JsonRepository', () => {
    let repository: JsonRepository;

    beforeEach(() => {
        repository = new JsonRepository();
    });

    describe('getProducts', () => {
        it('debe obtener la lista de productos', async () => {
            const products = await repository.getProducts();
            expect(Array.isArray(products)).toBe(true);
            expect(products.length).toBeGreaterThan(0);
            expect(products[0]).toHaveProperty('id');
            expect(products[0]).toHaveProperty('size');
        });
    });

    describe('getSchedules', () => {
        it('debe obtener la lista de agendas', async () => {
            const schedules = await repository.getSchedules();
            expect(Array.isArray(schedules)).toBe(true);
            expect(schedules.length).toBeGreaterThan(0);
            expect(schedules[0]).toHaveProperty('id');
            expect(schedules[0]).toHaveProperty('cutTime');
        });
    });

    describe('getScheduleRoutes', () => {
        it('debe obtener la lista de rutas', async () => {
            const routes = await repository.getScheduleRoutes();
            expect(Array.isArray(routes)).toBe(true);
            expect(routes.length).toBeGreaterThan(0);
            expect(routes[0]).toHaveProperty('scheduleId');
            expect(routes[0]).toHaveProperty('commune');
        });
    });
});