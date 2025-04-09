import request from "supertest";
import { createServer } from "http";

import { DELETE } from "./route";
import { deleteRecipeById } from "@/server/recipes";

jest.mock("@/server/recipes", () => ({
  deleteRecipeById: jest.fn(),
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
      const url = new URL(req.url || "", "http://localhost");
      const id = url.pathname.split("/").pop();

      const request = new Request(url.toString(), {
        method: req.method,
        headers: req.headers as HeadersInit,
      });

      const result = await DELETE(request, { params: { id } });

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

  it("should return success and the recipe is deleted", async () => {
    const mockResponse = { success: true, message: "Recipe deleted" };
    (deleteRecipeById as jest.Mock).mockResolvedValue(mockResponse);

    const response = await request(server).delete(
      "/api/recipes/deleteRecipe/recipe123"
    );

    expect(deleteRecipeById).toHaveBeenCalledWith("recipe123");
    expect(response.body).toEqual(mockResponse);
  });

  it("should return 400 when no exist ID", async () => {
    const response = await request(server).delete("/api/recipes/deleteRecipe/");

    expect(deleteRecipeById).not.toHaveBeenCalled();
    expect(response.status).toBe(400);
    expect(response.body).toEqual({ error: "ID required" });
  });

  it("should return 500 when is Internal server Error", async () => {
    (deleteRecipeById as jest.Mock).mockRejectedValue(
      new Error("Error deleting recipe")
    );

    const response = await request(server).delete(
      "/api/recipes/deleteRecipe/recipe-crash"
    );

    expect(deleteRecipeById).toHaveBeenCalledWith("recipe-crash");
    expect(response.status).toBe(500);
    expect(response.body).toEqual({
      success: false,
      error: "Error deleting recipe",
    });
  });
});
