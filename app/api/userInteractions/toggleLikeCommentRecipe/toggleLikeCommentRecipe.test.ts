import request from "supertest";
import { createServer } from "http";

import { POST } from "./route";
import { toggleLikeCommentRecipe } from "@/server/userInteractions";

jest.mock("@/server/userInteractions", () => ({
  toggleLikeCommentRecipe: jest.fn(),
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

describe("POST /api/userInteractions/toggleLikeCommentRecipe", () => {
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

  it("should return 200 and toggle the comment like", async () => {
    (toggleLikeCommentRecipe as jest.Mock).mockResolvedValue({
      success: true,
    });

    const response = await request(server)
      .post("/api/userInteractions/toggleLikeCommentRecipe")
      .send({ userId: "user123", commentId: "comment123" })
      .set("Content-Type", "application/json");

    expect(toggleLikeCommentRecipe).toHaveBeenCalledWith({
      userId: "user123",
      commentId: "comment123",
    });
    expect(response.status).toBe(200);
    expect(response.body).toEqual({ success: true });
  });

  it("should return 400 when parameters are missing", async () => {
    const response = await request(server)
      .post("/api/userInteractions/toggleLikeCommentRecipe")
      .send({ userId: "user123" })
      .set("Content-Type", "application/json");

    expect(toggleLikeCommentRecipe).not.toHaveBeenCalled();
    expect(response.status).toBe(400);
    expect(response.body).toEqual({
      success: false,
      error: "Missing parameters",
    });
  });

  it("should return 500 when the server function fails", async () => {
    (toggleLikeCommentRecipe as jest.Mock).mockResolvedValue({
      success: false,
      error: "Unknown error",
    });

    const response = await request(server)
      .post("/api/userInteractions/toggleLikeCommentRecipe")
      .send({ userId: "user123", commentId: "comment123" })
      .set("Content-Type", "application/json");

    expect(response.status).toBe(500);
    expect(response.body).toEqual({
      success: false,
      error: "Unknown error",
    });
  });

  it("should return 500 when an unexpected error is thrown", async () => {
    (toggleLikeCommentRecipe as jest.Mock).mockRejectedValue(
      new Error("Something went wrong"),
    );

    const response = await request(server)
      .post("/api/userInteractions/toggleLikeCommentRecipe")
      .send({ userId: "user123", commentId: "comment123" })
      .set("Content-Type", "application/json");

    expect(response.status).toBe(500);
    expect(response.body).toEqual({
      success: false,
      error: "Something went wrong",
    });
  });
});
