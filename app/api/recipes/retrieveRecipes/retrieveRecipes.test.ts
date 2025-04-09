import { createServer } from "http";
import request from "supertest";

import { GET } from "./route";
import { retrieveAllRecipes } from "@/server/recipes";
import { mockRecipe } from "@/app/__mocks__/recipe.mock";

jest.mock("@/server/recipes", () => ({
  retrieveAllRecipes: jest.fn(),
}));

jest.mock("next/server", () => ({
  NextResponse: {
    json: jest.fn((data, { status = 200 } = {}) => {
      return {
        json: async () => data,
        status,
      };
    }),
  },
}));

describe("DELETE /api/recipes/deleteRecipe", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  let server: ReturnType<typeof createServer>;

  beforeAll(() => {
    server = createServer(async (req, res) => {
      const result = await GET();

      if (!result || typeof result.status !== "number") {
        res.statusCode = 500;
        res.end(JSON.stringify({ error: "Internal Server Error" }));
        return;
      }

      res.statusCode = result.status;
      res.setHeader("Content-Type", "application/json");
      res.end(JSON.stringify(await result.json()));
    });
  });

  afterAll(() => {
    server.close();
  });

  it("should return success and all recipes are returned", async () => {
    (retrieveAllRecipes as jest.Mock).mockResolvedValue([mockRecipe]);

    const response = await request(server).get("/api/recipes/retrieveRecipes");

    expect(retrieveAllRecipes).toHaveBeenCalled();
    expect(response.status).toBe(200);
    expect(response.body).toEqual([mockRecipe]);
  });

  it("should return 400 and error message", async () => {
    (retrieveAllRecipes as jest.Mock).mockResolvedValue(null);
    const response = await request(server).get("/api/recipes/retrieveRecipes");

    expect(retrieveAllRecipes).toHaveBeenCalled();
    expect(response.status).toBe(400);
    expect(response.body).toEqual(null);
  });

  it("should return 500 and error message", async () => {
    (retrieveAllRecipes as jest.Mock).mockRejectedValue([mockRecipe]);

    const response = await request(server).get("/api/recipes/retrieveRecipes");

    expect(retrieveAllRecipes).toHaveBeenCalled();
    expect(response.status).toBe(500);
  });
});
