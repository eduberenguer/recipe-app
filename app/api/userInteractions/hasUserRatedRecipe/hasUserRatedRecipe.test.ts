import request from "supertest";
import { createServer } from "http";

import { GET } from "./route";
import { hasUserRatedRecipe } from "@/server/userInteractions";

jest.mock("@/server/userInteractions", () => ({
  hasUserRatedRecipe: jest.fn(),
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

describe("GET /api/userInteractions/hasUserRatedRecipe", () => {
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

  it("should return 200 and return has user rated recipe", async () => {
    (hasUserRatedRecipe as jest.Mock).mockResolvedValue({
      success: true,
      alreadyRated: true,
    });

    const response = await request(server).get(
      "/api/userInteractions/hasUserRatedRecipe?userId=userId&recipeId=recipe123"
    );

    expect(hasUserRatedRecipe).toHaveBeenCalledWith("userId", "recipe123");
    expect(response.status).toBe(200);
    expect(response.body).toEqual({
      success: true,
      alreadyRated: true,
    });
  });

  it("should return 400 and return missing params", async () => {
    (hasUserRatedRecipe as jest.Mock).mockResolvedValue({
      success: false,
      error: "Missing params",
    });

    const response = await request(server).get(
      "/api/userInteractions/hasUserRatedRecipe?userId=userId"
    );

    expect(response.status).toBe(400);
    expect(response.body).toEqual({
      success: false,
      error: "Missing params",
    });
  });

  it("should return 500 and return missing params", async () => {
    (hasUserRatedRecipe as jest.Mock).mockResolvedValue({
      success: false,
      error: "Something went wrong",
    });

    const response = await request(server).get(
      "/api/userInteractions/hasUserRatedRecipe?userId=userId&recipeId=recipe123"
    );

    expect(response.status).toBe(500);
    expect(response.body).toEqual({
      success: false,
      error: "Something went wrong",
    });
  });
});
