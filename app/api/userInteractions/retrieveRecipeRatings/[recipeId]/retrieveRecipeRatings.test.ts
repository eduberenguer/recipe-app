import request from "supertest";
import { createServer } from "http";

import { GET } from "./route";
import { retrieveRecipeRatings } from "@/server/userInteractions";

jest.mock("@/server/userInteractions", () => ({
  retrieveRecipeRatings: jest.fn(),
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

describe("GET /api/userInteractions/retrieveRecipeRatings", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  let server: ReturnType<typeof createServer>;

  beforeAll(() => {
    server = createServer(async (req, res) => {
      const url = new URL(req.url || "", "http://localhost");
      const recipeId = url.pathname.split("/").pop();

      const request = new Request(url.toString(), {
        method: req.method,
        headers: req.headers as HeadersInit,
      });

      const result = await GET(request, { params: { recipeId } });

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

  it("should return 200 and recipe rating", async () => {
    (retrieveRecipeRatings as jest.Mock).mockResolvedValue({
      average: 4.5,
      count: 4,
    });

    const response = await request(server).get(
      "/api/recipes/retrieveRecipeRatings/recipe123"
    );

    expect(retrieveRecipeRatings).toHaveBeenCalledWith("recipe123");
    expect(response.status).toBe(200);
    expect(response.body).toEqual({
      average: 4.5,
      count: 4,
    });
  });

  it("should return 400, User ID is required", async () => {
    (retrieveRecipeRatings as jest.Mock).mockResolvedValue(null);

    const response = await request(server).get(
      "/api/userInteractions/retrieveRecipeRatings/"
    );

    expect(retrieveRecipeRatings).not.toHaveBeenCalled();
    expect(response.status).toBe(400);
    expect(response.body).toEqual({ error: "RecipeID is required" });
  });

  it("should return 500 when is Internal server Error", async () => {
    (retrieveRecipeRatings as jest.Mock).mockRejectedValue(
      new Error("Database error")
    );

    const response = await request(server).get(
      "/api/userInteractions/retrieveRecipeRatings/request-crash"
    );

    expect(retrieveRecipeRatings).toHaveBeenCalledWith("request-crash");
    expect(response.status).toBe(500);
    expect(response.body).toEqual({
      success: false,
      error: "Internal Server Error",
    });
  });
});
