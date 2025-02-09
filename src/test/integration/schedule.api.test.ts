import request from "supertest";
import app from "../../app";

describe("Schedule Coverage API Integration Tests", () => {
  it("debe retornar la cobertura de agenda para un producto válido", async () => {
    const response = await request(app)
      .post("/api/schedule/coverage")
      .send({
        products: ["2000378936145"],
        commune: "San Bernardo",
      });
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("products");
    expect(response.body).toHaveProperty("errors");
  });

  it("debe retornar error para un producto inexistente", async () => {
    const response = await request(app)
      .post("/api/schedule/coverage")
      .send({
        products: ["nonexistent"],
        commune: "San Bernardo",
      });
    expect(response.status).toBe(200);
    expect(response.body.errors).toContainEqual({
      product: "nonexistent",
      error: "El producto no existe",
    });
  });

  it("debe aplicar la restricción de máximo 10 productos", async () => {
    const products = Array(11).fill("2000378936145");
    const response = await request(app).post("/api/schedule/coverage").send({
      products,
      commune: "San Bernardo",
    });
    expect(response.status).toBe(500);
    expect(response.body).toHaveProperty("error");
  });
});
