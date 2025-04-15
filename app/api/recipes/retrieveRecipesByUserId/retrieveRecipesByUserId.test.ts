import request from "supertest";
import { createServer } from "http";

import { GET } from "./route";
import { retrieveRecipesByUserId } from "@/server/recipes";
import { mockRecipe } from "@/app/__mocks__/recipe.mock";

jest.mock("@/server/recipes", () => ({
  retrieveRecipesByUserId: jest.fn(),
}));

jest.mock("next/server", () => ({
  NextResponse: {
    json: jest.fn((data, options = {}) => {
      const { status = 200 } = options;
      return {
        json: async () => data,
        status,
      };
    }),
  },
}));

describe("GET /api/recipes/retrieveRecipesByUserId", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  let server: ReturnType<typeof createServer>;

  beforeAll(() => {
    server = createServer(async (req, res) => {
      const url = new URL(req.url || "", "http://localhost");

      const request = new Request(url.toString(), {
        method: req.method,
        headers: req.headers as HeadersInit,
      });

      const result = await GET(request);

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

  it("should return 200 and the all users recipes", async () => {
    (retrieveRecipesByUserId as jest.Mock).mockResolvedValue([mockRecipe]);

    const response = await request(server).get(
      "/api/recipes/retrieveRecipeByName?owner=user123"
    );

    expect(retrieveRecipesByUserId).toHaveBeenCalledWith("user123");
    expect(response.status).toBe(200);
    expect(response.body).toEqual([mockRecipe]);
  });

  it("should return 400, User ID is required", async () => {
    (retrieveRecipesByUserId as jest.Mock).mockResolvedValue(null);

    const response = await request(server).get(
      "/api/recipes/retrieveRecipeByName"
    );

    expect(retrieveRecipesByUserId).not.toHaveBeenCalled();
    expect(response.status).toBe(400);
    expect(response.body).toEqual({ error: "User ID is required" });
  });

  it("should return 400 with filter incluided", async () => {
    (retrieveRecipesByUserId as jest.Mock).mockResolvedValue(null);

    const response = await request(server).get(
      "/api/recipes/retrieveRecipeByName?owner=user123"
    );

    expect(retrieveRecipesByUserId).toHaveBeenCalledWith("user123");
    expect(response.status).toBe(400);
    expect(response.body).toEqual(null);
  });

  it("should return 500, filter is requires", async () => {
    (retrieveRecipesByUserId as jest.Mock).mockRejectedValue(
      new Error("Database error")
    );

    const response = await request(server).get(
      "/api/recipes/retrieveRecipeByName?owner=user123"
    );

    expect(retrieveRecipesByUserId).toHaveBeenCalledWith("user123");
    expect(response.status).toBe(500);
    expect(response.body).toEqual({
      success: false,
      error: "Error retrieving recipes by userId: Error: Database error",
    });
  });
});
