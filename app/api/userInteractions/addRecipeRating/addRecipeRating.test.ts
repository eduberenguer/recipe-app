import request from "supertest";
import { createServer } from "http";

import { POST } from "./route";
import { addRecipeRating } from "@/server/userInteractions";
import { mockAddRecipeRating } from "@/app/__mocks__/mockAddRecipeRating";

jest.mock("@/server/userInteractions", () => ({
  addRecipeRating: jest.fn(),
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

describe("POST /api/userInteractions/addRecipeRating", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  let server: ReturnType<typeof createServer>;

  beforeAll(() => {
    server = createServer(async (req, res) => {
      const url = new URL(req.url || "", "http://localhost");

      const chunks: Buffer[] = [];
      for await (const chunk of req) {
        chunks.push(chunk as Buffer);
      }

      const body = Buffer.concat(chunks).toString();
      const request = new Request(url.toString(), {
        method: req.method,
        body,
        headers: req.headers as HeadersInit,
      });

      const result = await POST(request);

      res.statusCode = result.status;
      res.setHeader("Content-Type", "application/json");
      res.end(JSON.stringify(await result.json()));
    });
    server.listen(0);
  });
  afterAll(() => {
    server.close();
  });

  it("should return 200 and recipe rating", async () => {
    const mockResponse = { success: true, message: "Rating added" };
    (addRecipeRating as jest.Mock).mockResolvedValue(mockResponse);

    const response = await request(server)
      .post("/api/recipes/retrieveRecipeRatings/")
      .send(mockAddRecipeRating)
      .set("Content-Type", "application/json");

    expect(addRecipeRating).toHaveBeenCalledWith(mockAddRecipeRating);
    expect(response.status).toBe(200);
    expect(response.body).toEqual(mockResponse);
  });

  it("should return 400 on internal server error", async () => {
    (addRecipeRating as jest.Mock).mockResolvedValue({
      success: false,
      error: "Error add rating",
    });

    const response = await request(server)
      .post("/api/userInteractions/addRecipeRating")
      .send({ userId: "123", recipeId: "" })
      .set("Content-Type", "application/json");

    expect(response.status).toBe(400);
    expect(response.body).toEqual({
      success: false,
      error: "Error add rating",
    });
  });

  it("should return 500", async () => {
    const mockResponse = { success: false, error: "Unknown error" };
    (addRecipeRating as jest.Mock).mockRejectedValue(mockResponse);

    const response = await request(server)
      .post("/api/recipes/retrieveRecipeRatings/")
      .send(mockAddRecipeRating)
      .set("Content-Type", "application/json");

    expect(addRecipeRating).toHaveBeenCalledWith(mockAddRecipeRating);
    expect(response.status).toBe(500);
    expect(response.body).toEqual(mockResponse);
  });
});
