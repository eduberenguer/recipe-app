import request from "supertest";
import { createServer } from "http";

import { DELETE } from "./route";
import { removeFavourite } from "@/server/userInteractions";

jest.mock("@/server/userInteractions", () => ({
  removeFavourite: jest.fn(),
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

describe("DELETE /api/userInteractions/removeFavourite", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  let server: ReturnType<typeof createServer>;

  beforeAll(() => {
    server = createServer(async (req, res) => {
      const url = new URL(req.url || "", "http://localhost");
      const pathSegments = url.pathname.split("/");
      const recipeId = pathSegments.pop();
      const userId = pathSegments.pop();

      const request = new Request(url.toString(), {
        method: req.method,
        headers: req.headers as HeadersInit,
      });

      const result = await DELETE(request, { params: { userId, recipeId } });

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

  it("should remove favourite", async () => {
    const mockResponse = { success: true, message: "Favourite removed" };
    (removeFavourite as jest.Mock).mockResolvedValue(mockResponse);

    const response = await request(server).delete(
      "/api/userInteractions/removeFavourite/user123/recipe123"
    );

    expect(removeFavourite).toHaveBeenCalledWith("user123", "recipe123");
    expect(response.body).toEqual(mockResponse);
  });

  it("should return 400 when no exist ID", async () => {
    const response = await request(server).delete(
      "/api/userInteractions/removeFavourite/"
    );

    expect(removeFavourite).not.toHaveBeenCalled();
    expect(response.status).toBe(400);
    expect(response.body).toEqual({ error: "Missins fields" });
  });

  it("should return 500 when is Internal server Error", async () => {
    (removeFavourite as jest.Mock).mockRejectedValue(
      new Error('Error removing favourite: "recipe-crash"')
    );

    const response = await request(server).delete(
      "/api/userInteractions/removeFavourite/removeFavourite/request-crash"
    );

    expect(removeFavourite).toHaveBeenCalledWith(
      "removeFavourite",
      "request-crash"
    );
    expect(response.status).toBe(500);
    expect(response.body).toEqual({
      success: false,
      error:
        'Error removing favourite: Error: Error removing favourite: "recipe-crash"',
    });
  });
});
