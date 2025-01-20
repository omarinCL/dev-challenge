import request from "supertest";
import app from "../index";
import { error } from "console";

describe("POST /schedule/coverage", () => {
  it("should return coverage", async () => {
    const response = await request(app)
      .post("/api/schedule/coverage")
      .send({
        products: ["2000378936145"],
        commune: "San Bernardo",
      });
    expect(response.status).toBe(200);
    expect(response.body).toEqual({
      products: [
        {
          product: "2000378936145",
          schedules: [
            {
              id: "AZSR-1082-DP",
              courier: "1082",
              serviceType: "S",
              deliveryMethod: "DP",
              cutTime: [],
            },
          ],
        },
      ],
      error: [],
    });
  });

  it("should return coverage with error", async () => {
    const response = await request(app)
      .post("/api/schedule/coverage")
      .send({
        products: ["2000378936145", "20"],
        commune: "San Bernardo",
      });
    expect(response.status).toBe(200);
    expect(response.body).toEqual({
        "products": [
            {
                "product": "2000378936145",
                "schedules": [
                    {
                        "id": "AZSR-1082-DP",
                        "courier": "1082",
                        "serviceType": "S",
                        "deliveryMethod": "DP",
                        "cutTime": []
                    }
                ]
            }
        ],
        "error": [
            {
                "product": "20",
                "error": "Producto no existe."
            }
        ]
    });
  });

  it("should return error", async () => {
    const response = await request(app)
      .post("/api/schedule/coverage")
      .send({
        products: ["2000378936145"],
        commune: "Santiago",
      });

    console.log("Response Body:", response.body);
    expect(response.status).toBe(400);
    expect(response.body).toEqual({
      error: "Incorrect or missing Commune",
    });
  });
});
