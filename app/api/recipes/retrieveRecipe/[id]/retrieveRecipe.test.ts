import request from "supertest";
import { createServer } from "http";

import { GET } from "./route";
import { retrieveRecipeById } from "@/server/recipes";
import { mockRecipeWithId } from "@/app/__mocks__/recipe.mock";

jest.mock("@/server/recipes", () => ({
  retrieveRecipeById: jest.fn(),
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

describe("GET /api/recipes/retrieveRecipe", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  let server: ReturnType<typeof createServer>;

  beforeAll(() => {
    server = createServer(async (req, res) => {
      const url = new URL(req.url || "", "http://localhost");
      const id = url.pathname.split("/").pop();

      const request = new Request(url.toString(), {
        method: req.method,
        headers: req.headers as HeadersInit,
      });

      const result = await GET(request, { params: { id } });

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

  it("should return 200 and the recipe is found", async () => {
    (retrieveRecipeById as jest.Mock).mockResolvedValue(mockRecipeWithId);

    const response = await request(server).get(
      "/api/recipes/retrieveRecipe/recipe123"
    );

    expect(retrieveRecipeById).toHaveBeenCalledWith("recipe123");
    expect(response.status).toBe(200);
    expect(response.body).toEqual(mockRecipeWithId);
  });

  it("should return 400 when isn´t recipe ID", async () => {
    const response = await request(server).get("/api/recipes/retrieveRecipe/");

    expect(retrieveRecipeById).not.toHaveBeenCalled();
    expect(response.status).toBe(400);
    expect(response.body).toEqual({ error: "ID required" });
  });

  it("should return 404 when is not found recipe", async () => {
    (retrieveRecipeById as jest.Mock).mockResolvedValue(null);
    const response = await request(server).get(
      "/api/recipes/retrieveRecipe/recipe-not-found"
    );

    expect(retrieveRecipeById).toHaveBeenCalledWith("recipe-not-found");
    expect(response.status).toBe(404);
  });

  it("should return 500 when is Internal server Error", async () => {
    (retrieveRecipeById as jest.Mock).mockRejectedValue(
      new Error("Database down")
    );

    const response = await request(server).get(
      "/api/recipes/retrieveRecipe/recipe-crash"
    );

    expect(retrieveRecipeById).toHaveBeenCalledWith("recipe-crash");
    expect(response.status).toBe(500);
    expect(response.body).toEqual({
      success: false,
      error: "Internal Server Error",
    });
  });
});
