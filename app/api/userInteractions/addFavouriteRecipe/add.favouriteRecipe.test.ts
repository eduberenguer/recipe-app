import request from "supertest";
import { createServer } from "http";

import { POST } from "./route";
import { addFavouriteRecipe } from "@/server/userInteractions";

jest.mock("@/server/userInteractions", () => ({
  addFavouriteRecipe: jest.fn(),
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

describe("POST /api/userInteractions/addFavouriteRecipe", () => {
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

  it("should add favourite", async () => {
    const mockBody = {
      userId: "user123",
      recipeId: "recipe123",
    };

    const mockResponse = { success: true, message: "Favourite added" };
    (addFavouriteRecipe as jest.Mock).mockResolvedValue(mockResponse);

    const response = await request(server)
      .post("/api/userInteractions/addFavouriteRecipe")
      .send(mockBody)
      .set("Content-Type", "application/json");

    expect(addFavouriteRecipe).toHaveBeenCalledWith(mockBody);
    expect(response.status).toBe(200);
    expect(response.body).toEqual(mockResponse);
  });

  it("should return 400 on internal server error", async () => {
    (addFavouriteRecipe as jest.Mock).mockResolvedValue({
      success: false,
      error: "Error add favourite",
    });

    const response = await request(server)
      .post("/api/userInteractions/addFavouriteRecipe")
      .send({ userId: "123", recipeId: "" })
      .set("Content-Type", "application/json");

    expect(response.status).toBe(400);
    expect(response.body).toEqual({
      success: false,
      error: "Error add favourite",
    });
  });

  it("should return 500 on internal server error", async () => {
    (addFavouriteRecipe as jest.Mock).mockRejectedValue(
      new Error("Something went wrong")
    );

    const response = await request(server)
      .post("/api/userInteractions/addFavouriteRecipe")
      .send({ userId: "123", recipeId: "456" })
      .set("Content-Type", "application/json");

    expect(response.status).toBe(500);
    expect(response.body).toEqual({
      success: false,
      error: "Something went wrong",
    });
  });
});
