import request from "supertest";
import { createServer } from "http";

import { GET } from "./route";
import { retrieveFavourites } from "@/server/userInteractions";
import { mockRecipe } from "@/app/__mocks__/recipe.mock";

jest.mock("@/server/userInteractions", () => ({
  retrieveFavourites: jest.fn(),
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

describe("GET /api/userInteractions/retrieveFavourites", () => {
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

  it("should return 200 and the all users recipes", async () => {
    (retrieveFavourites as jest.Mock).mockResolvedValue([mockRecipe]);

    const response = await request(server).get(
      "/api/recipes/retrieveFavourites/user123"
    );

    expect(retrieveFavourites).toHaveBeenCalledWith("user123");
    expect(response.status).toBe(200);
    expect(response.body).toEqual([mockRecipe]);
  });

  it("should return 400, User ID is required", async () => {
    (retrieveFavourites as jest.Mock).mockResolvedValue(null);

    const response = await request(server).get(
      "/api/userInteractions/retrieveFavourites/"
    );

    expect(retrieveFavourites).not.toHaveBeenCalled();
    expect(response.status).toBe(400);
    expect(response.body).toEqual({ error: "ID required" });
  });

  it("should return 404 when is not found user", async () => {
    (retrieveFavourites as jest.Mock).mockResolvedValue(null);

    const response = await request(server).get(
      "/api/userInteractions/retrieveFavourites/user-not-found"
    );

    expect(retrieveFavourites).toHaveBeenCalledWith("user-not-found");
    expect(response.status).toBe(400);
  });

  it("should return 500 when is Internal server Error", async () => {
    (retrieveFavourites as jest.Mock).mockRejectedValue(
      new Error("Database error")
    );

    const response = await request(server).get(
      "/api/userInteractions/retrieveFavourites/request-crash"
    );

    expect(retrieveFavourites).toHaveBeenCalledWith("request-crash");
    expect(response.status).toBe(500);
    expect(response.body).toEqual({
      success: false,
      error: "Database error",
    });
  });
});
