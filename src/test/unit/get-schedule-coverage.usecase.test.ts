import { GetScheduleCoverageUseCase } from "../../domain/usecases/get-schedule-coverage.usecase";
import { IProductRepository } from "../../domain/repositories/product.repository.interface";
import { IScheduleRouteRepository } from "../../domain/repositories/schedule-route.repository.interface";
import { IScheduleRepository } from "../../domain/repositories/schedule.repository.interface";
import { Product } from "../../domain/models/product.model";
import { Schedule } from "../../domain/models/schedule.model";
import { ScheduleRoute } from "../../domain/models/schedule-route.model";

describe("GetScheduleCoverageUseCasce", () => {
  let productRepo: IProductRepository;
  let scheduleRouteRepo: IScheduleRouteRepository;
  let scheduleRepo: IScheduleRepository;

  beforeEach(() => {
    productRepo = {
      getById: jest.fn(),
      getByIds: jest.fn(),
    };

    scheduleRouteRepo = {
      getRoutesByCommuneAndSize: jest.fn(),
    };

    scheduleRepo = {
      getById: jest.fn(),
    };
  });

  it("retorna error si el producto no existe", async () => {
    (productRepo.getById as jest.Mock).mockResolvedValue(null);

    const useCase = new GetScheduleCoverageUseCase(
      productRepo,
      scheduleRouteRepo,
      scheduleRepo,
      new Date()
    );
    const input = { products: ["nonexistent"], commune: "San Bernardo" };

    const result = await useCase.execute(input);
    expect(result.errors).toEqual([
      { product: "nonexistent", error: "El producto no existe" },
    ]);
  });

  it("retorna error si no hay agendas para el producto", async () => {
    const product: Product = {
      id: "prod1",
      name: "Test Product",
      parents: { subline: "sub", line: "line", department: "dept" },
      size: "M",
    };
    (productRepo.getById as jest.Mock).mockResolvedValue(product);
    (
      scheduleRouteRepo.getRoutesByCommuneAndSize as jest.Mock
    ).mockResolvedValue([]);

    const useCase = new GetScheduleCoverageUseCase(
      productRepo,
      scheduleRouteRepo,
      scheduleRepo,
      new Date()
    );
    const input = { products: ["prod1"], commune: "San Bernardo" };

    const result = await useCase.execute(input);
    expect(result.errors).toEqual([
      { product: "prod1", error: "No hay agendas para el producto" },
    ]);
  });

  it("retorna agendas válidas para un producto existente", async () => {
    const now = new Date("2025-02-10T10:00:00");
    const product: Product = {
      id: "prod1",
      name: "Test Product",
      parents: { subline: "sub", line: "line", department: "dept" },
      size: "M",
    };
    (productRepo.getById as jest.Mock).mockResolvedValue(product);

    const route: ScheduleRoute = {
      scheduleId: "schedule1",
      commune: "San Bernardo",
      active: true,
      minSize: "S",
      maxSize: "XL",
    };
    (
      scheduleRouteRepo.getRoutesByCommuneAndSize as jest.Mock
    ).mockResolvedValue([route]);

    const schedule: Schedule = {
      id: "schedule1",
      courier: "1234",
      serviceType: "S",
      deliveryMethod: "DP",
      cutTime: ["14:00", "18:00", "11:00", "15:00", "12:00", "16:00", "08:00"],
    };
    (scheduleRepo.getById as jest.Mock).mockResolvedValue(schedule);

    const useCase = new GetScheduleCoverageUseCase(
      productRepo,
      scheduleRouteRepo,
      scheduleRepo,
      now
    );
    const input = { products: ["prod1"], commune: "San Bernardo" };

    const result = await useCase.execute(input);
    expect(result.products.length).toBe(1);
    expect(result.products[0].product).toBe("prod1");
    expect(result.products[0].schedules).toContainEqual(schedule);
  });

  it("filtra agendas cuando la hora actual es posterior al cutTime", async () => {
    const now = new Date("2025-02-10T15:00:00");
    const product: Product = {
      id: "prod1",
      name: "Test Product",
      parents: { subline: "sub", line: "line", department: "dept" },
      size: "M",
    };
    (productRepo.getById as jest.Mock).mockResolvedValue(product);

    const route: ScheduleRoute = {
      scheduleId: "schedule1",
      commune: "San Bernardo",
      active: true,
      minSize: "S",
      maxSize: "XL",
    };
    (
      scheduleRouteRepo.getRoutesByCommuneAndSize as jest.Mock
    ).mockResolvedValue([route]);

    const schedule: Schedule = {
      id: "schedule1",
      courier: "1234",
      serviceType: "S",
      deliveryMethod: "DP",
      cutTime: ["14:00", "18:00", "11:00", "15:00", "12:00", "16:00", "08:00"],
    };
    (scheduleRepo.getById as jest.Mock).mockResolvedValue(schedule);

    const useCase = new GetScheduleCoverageUseCase(
      productRepo,
      scheduleRouteRepo,
      scheduleRepo,
      now
    );
    const input = { products: ["prod1"], commune: "San Bernardo" };

    const result = await useCase.execute(input);
    expect(result.errors).toEqual([
      { product: "prod1", error: "No hay agendas para el producto" },
    ]);
  });

  it("maneja múltiples productos con resultados mixtos", async () => {
    const now = new Date("2025-02-10T10:00:00");
    const product1: Product = {
      id: "prod1",
      name: "Product 1",
      parents: { subline: "sub1", line: "line1", department: "dept1" },
      size: "S",
    };
    const product2: Product = {
      id: "prod2",
      name: "Product 2",
      parents: { subline: "sub2", line: "line2", department: "dept2" },
      size: "L",
    };

    (productRepo.getById as jest.Mock).mockImplementation((id: string) => {
      if (id === "prod1") return Promise.resolve(product1);
      if (id === "prod2") return Promise.resolve(product2);
      return Promise.resolve(null);
    });

    (
      scheduleRouteRepo.getRoutesByCommuneAndSize as jest.Mock
    ).mockImplementation((commune: string, size: string) => {
      if (size === "S")
        return Promise.resolve([
          {
            scheduleId: "schedule1",
            commune: "San Bernardo",
            active: true,
            minSize: "S",
            maxSize: "M",
          },
        ]);
      return Promise.resolve([]);
    });

    const schedule: Schedule = {
      id: "schedule1",
      courier: "1111",
      serviceType: "S",
      deliveryMethod: "DP",
      cutTime: [],
    };
    (scheduleRepo.getById as jest.Mock).mockResolvedValue(schedule);

    const useCase = new GetScheduleCoverageUseCase(
      productRepo,
      scheduleRouteRepo,
      scheduleRepo,
      now
    );
    const input = {
      products: ["prod1", "prod2", "nonexistent"],
      commune: "San Bernardo",
    };

    const result = await useCase.execute(input);
    expect(result.products).toHaveLength(1);
    expect(result.errors).toEqual([
      { product: "prod2", error: "No hay agendas para el producto" },
      { product: "nonexistent", error: "El producto no existe" },
    ]);
  });

  it("lanza error si se envían más de 10 productos", async () => {
    const useCase = new GetScheduleCoverageUseCase(
      productRepo,
      scheduleRouteRepo,
      scheduleRepo,
      new Date()
    );
    const input = {
      products: Array(11).fill("prod1"),
      commune: "San Bernardo",
    };

    await expect(useCase.execute(input)).rejects.toThrow(
      "Se permite consultar un máximo de 10 productos."
    );
  });
});
