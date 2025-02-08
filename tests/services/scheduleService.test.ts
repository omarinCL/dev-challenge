
import { ScheduleService } from '../../src/services/scheduleService';
import { JsonRepository } from '../../src/repositories/jsonRepository';
import { Product } from '../../src/interfaces/Product';
import { Schedule } from '../../src/interfaces/Schedule';
import { ScheduleRoute } from '../../src/interfaces/ScheduleRoute';
import { ERROR_MESSAGES } from '../../src/config/constants';

// Mock del repositorio
jest.mock('../../src/repositories/jsonRepository');

describe('ScheduleService', () => {
    let service: ScheduleService;
    let mockRepository: jest.Mocked<JsonRepository>;

    const mockProducts: Product[] = [
        {
            id: "2000378936145",
            name: "PLANNER PU ESTRELLAS",
            parents: {
                subline: "S528912",
                line: "503657",
                department: "D383"
            },
            size: "S"
        }
    ];

    const mockSchedules: Schedule[] = [
        {
            id: "AZSR-1080-DP",
            courier: "1080",
            serviceType: "S",
            deliveryMethod: "DP",
            cutTime: []
        }
    ];

    const mockRoutes: ScheduleRoute[] = [
        {
            scheduleId: "AZSR-1080-DP",
            commune: "San Bernardo",
            active: true,
            minSize: "S",
            maxSize: "XL"
        }
    ];

    beforeEach(() => {
        mockRepository = {
            getProducts: jest.fn().mockResolvedValue(mockProducts),
            getSchedules: jest.fn().mockResolvedValue(mockSchedules),
            getScheduleRoutes: jest.fn().mockResolvedValue(mockRoutes)
        } as unknown as jest.Mocked<JsonRepository>;

        (JsonRepository as jest.Mock).mockImplementation(() => mockRepository);
        service = new ScheduleService();
    });

    describe('getCoverageSchedules', () => {
        it('debe retornar agendas disponibles para un producto válido', async () => {
            const result = await service.getCoverageSchedules(
                ["2000378936145"],
                "San Bernardo"
            );

            expect(result.products).toHaveLength(1);
            expect(result.products[0].schedules).toHaveLength(1);
            expect(result.products[0].schedules[0].id).toBe("AZSR-1080-DP");
            expect(result.errors).toHaveLength(0);
        });

        it('debe retornar error para un producto que no existe', async () => {
            const result = await service.getCoverageSchedules(
                ["invalid-id"],
                "San Bernardo"
            );

            expect(result.products).toHaveLength(0);
            expect(result.errors).toHaveLength(1);
            expect(result.errors[0].error).toBe(ERROR_MESSAGES.PRODUCT_NOT_FOUND);
        });

        it('debe retornar error cuando no hay agendas disponibles', async () => {
            mockRepository.getScheduleRoutes.mockResolvedValueOnce([
                { ...mockRoutes[0], active: false }
            ]);

            const result = await service.getCoverageSchedules(
                ["2000378936145"],
                "San Bernardo"
            );

            expect(result.products).toHaveLength(0);
            expect(result.errors).toHaveLength(1);
            expect(result.errors[0].error).toBe(ERROR_MESSAGES.NO_SCHEDULES_FOUND);
        });
    });
});