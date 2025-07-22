import request from "supertest";
import { createServer } from "http";

import { PATCH } from "./route";
import { updateRecipe } from "@/server/recipes";
import { mockRecipeWithIdv1 } from "@/app/__mocks__/recipe.mock";

jest.mock("@/server/recipes", () => ({
  updateRecipe: jest.fn(),
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

describe("PATCH /api/recipes/toggleVisibleRecipe", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  let server: ReturnType<typeof createServer>;

  beforeAll(() => {
    server = createServer(async (req, res) => {
      const url = new URL(req.url || "", "http://localhost");
      const id = url.pathname.split("/").pop() || "test-id";

      const chunks: Uint8Array[] = [];
      for await (const chunk of req) {
        chunks.push(chunk);
      }
      const bodyBuffer = Buffer.concat(chunks);
      const bodyText = bodyBuffer.toString();

      const request = new Request(url.toString(), {
        method: req.method,
        headers: req.headers as HeadersInit,
        body: bodyText,
      });

      const result = await PATCH(request, { params: { id } });

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

  it("should return 200 and change recipe visibility", async () => {
    (updateRecipe as jest.Mock).mockResolvedValue(mockRecipeWithIdv1);

    const response = await request(server)
      .patch("/api/recipes/toggleVisibleRecipe/recipe123")
      .send({ isVisible: true })
      .set("Content-Type", "application/json");

    expect(updateRecipe).toHaveBeenCalledWith("recipe123", { isVisible: true });
    expect(response.status).toBe(200);
    expect(response.body).toEqual({
      success: true,
      recipe: mockRecipeWithIdv1,
    });
  });

  it("should return 500 and error message", async () => {
    (updateRecipe as jest.Mock).mockRejectedValue(
      new Error("Error updating recipe")
    );

    const response = await request(server)
      .patch("/api/recipes/toggleVisibleRecipe/recipe123")
      .send({ isVisible: "testError" })
      .set("Content-Type", "application/json");

    expect(updateRecipe).toHaveBeenCalledWith("recipe123", {
      isVisible: "testError",
    });
    expect(response.status).toBe(500);
    expect(response.body).toEqual({
      success: false,
      error: "Error updating recipe",
    });
  });
});
